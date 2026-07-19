<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\StoreMedicationRequest;
use App\Http\Requests\UpdateMedicalProfileRequest;
use App\Http\Requests\UploadDocumentRequest;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\CaregiverLink;
use App\Models\MedicalDocument;
use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\Notification;
use App\Models\SymptomReport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MediSyncApiController extends Controller
{
    // =========================================================================
    // Private helpers
    // =========================================================================

    /**
     * Resolve the authenticated user or abort with 401.
     */
    private function resolveUser(Request $request): User
    {
        /** @var User|null $user */
        $user = $request->user();
        abort_unless($user instanceof User, 401, 'Unauthenticated.');
        return $user;
    }

    /**
     * Resolve the patient being acted on.
     * Admins and linked caregivers may pass `patient_id` to act on behalf of a patient.
     */
    private function resolvePatient(Request $request): User
    {
        $actor     = $this->resolveUser($request);
        $patientId = $request->integer('patient_id');

        if ($patientId && $patientId !== $actor->id) {
            $isAdmin    = $actor->role === 'admin';
            $isCaregiver = $actor->patients()->whereKey($patientId)->exists();
            abort_unless($isAdmin || $isCaregiver, 403, 'Not authorised to act on behalf of this patient.');
            return User::findOrFail($patientId);
        }

        return $actor;
    }

    /**
     * Write an activity log entry.
     */
    private function record(User $patient, string $action, $subject, ?User $actor = null): void
    {
        ActivityLog::create([
            'user_id'      => $patient->id,
            'actor_id'     => ($actor ?? $patient)->id,
            'action'       => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id'   => $subject?->id,
        ]);
    }

    /**
     * Shape a Medication model into the payload the frontend expects.
     * Mirrors MediSyncController::medicationPayload() exactly.
     */
    private function shapeMedication(Medication $medication): array
    {
        $time = $medication->time;

        // Parse time label (12-hour format, e.g. "08:00 AM")
        $timeLabel = 'Not scheduled';
        $timeOfDay = 'Any time';

        if ($time) {
            try {
                $carbon    = Carbon::createFromFormat(strlen($time) === 5 ? 'H:i' : 'H:i:s', $time);
                $timeLabel = $carbon->format('h:i A');
                $hour      = (int) $carbon->format('G');
                $timeOfDay = $hour < 12 ? 'Morning' : ($hour < 18 ? 'Afternoon' : 'Night');
            } catch (\Throwable) {
                $timeLabel = $time;
            }
        }

        // Load today's logs if not already loaded
        if (!$medication->relationLoaded('logs')) {
            $medication->load(['logs' => fn ($q) => $q->whereDate('taken_on', Carbon::today())]);
        }

        $takenToday = $medication->logs->contains(fn (MedicationLog $log) => $log->taken_on?->isToday());

        return [
            'id'             => $medication->id,
            'name'           => $medication->name,
            'category'       => $medication->category,
            'dosage'         => $medication->dosage,
            'purpose'        => $medication->purpose,
            'instructions'   => $medication->instructions,
            'frequency'      => $medication->frequency,
            'timeOfDay'      => $timeOfDay,
            'time'           => $timeLabel,
            'timing'         => $timeOfDay . ' (' . $timeLabel . ')',
            'pillsLeft'      => $medication->pills_left,
            'refillThreshold' => $medication->refill_threshold ?? 7,
            'takenToday'     => $takenToday,
            'taken'          => $takenToday,
            'doctor'         => $medication->doctor,
        ];
    }

    /**
     * Shape an Appointment model into the payload the frontend expects.
     * Mirrors MediSyncController::appointmentPayload() exactly.
     */
    private function shapeAppointment(Appointment $appointment): array
    {
        $startsAt = $appointment->starts_at;

        return [
            'id'              => $appointment->id,
            'title'           => $appointment->title,
            'doctor'          => $appointment->doctor,
            'hospital'        => $appointment->hospital,
            'address'         => $appointment->address,
            'department'      => $appointment->department,
            'date'            => $startsAt?->format('Y-m-d'),
            'time'            => $startsAt?->format('h:i A'),
            'daysLeft'        => $startsAt
                ? max(0, Carbon::today()->diffInDays($startsAt->copy()->startOfDay(), false))
                : null,
            'notes'           => $appointment->notes,
            'documentsNeeded' => $appointment->documents_needed ?? [],
            'status'          => $appointment->status ?? 'Confirmed',
            'distanceKm'      => $appointment->distance_km,
        ];
    }

    // =========================================================================
    // OTP Auth
    // =========================================================================

    public function requestOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'regex:/^\+?[0-9]{8,15}$/'],
        ]);

        $code = (string) random_int(100000, 999999);

        DB::table('otp_codes')->where('phone', $data['phone'])->delete();
        DB::table('otp_codes')->insert([
            'phone'      => $data['phone'],
            'code_hash'  => Hash::make($code),
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Log::info('MediSync OTP issued', ['phone' => $data['phone'], 'code' => $code]);

        return response()->json(['message' => 'OTP sent']);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string'],
            'code'  => ['required', 'digits:6'],
            'name'  => ['nullable', 'string', 'max:120'],
        ]);

        $otp = DB::table('otp_codes')
            ->where('phone', $data['phone'])
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        abort_unless($otp && Hash::check($data['code'], $otp->code_hash), 422, 'Invalid or expired OTP.');

        DB::table('otp_codes')->where('id', $otp->id)->update(['used_at' => now()]);

        $user = User::firstOrCreate(
            ['phone' => $data['phone']],
            [
                'name'                => $data['name'] ?? 'MediSync User',
                'email'               => null,
                'password'            => Hash::make(Str::random(40)),
                'role'                => 'patient',
                'ice_code'            => 'ICE-' . strtoupper(Str::random(8)),
                'caregiver_sync_code' => 'MS-' . strtoupper(Str::random(8)),
            ]
        );

        $request->session()->regenerate();
        auth()->login($user);

        return response()->json(['user' => $user]);
    }

    // =========================================================================
    // Medications
    // =========================================================================

    public function medications(Request $request): JsonResponse
    {
        $patient     = $this->resolvePatient($request);
        $medications = $patient->medications()->active()->with([
            'logs' => fn ($q) => $q->whereDate('taken_on', Carbon::today()),
        ])->orderBy('time')->get();

        return response()->json($medications->map(fn ($med) => $this->shapeMedication($med))->values());
    }

    public function storeMedication(StoreMedicationRequest $request): JsonResponse
    {
        $patient  = $this->resolvePatient($request);
        $data     = $request->validated();
        $actor    = $this->resolveUser($request);

        $medication = $patient->medications()->create($data);

        // Load today's logs relationship (empty on creation)
        $medication->setRelation('logs', collect());

        $this->record($patient, 'Medication added: ' . $medication->name, $medication, $actor);

        Notification::create([
            'id'              => (string) Str::uuid(),
            'type'            => 'medication',
            'notifiable_type' => User::class,
            'notifiable_id'   => $patient->id,
            'data'            => [
                'title' => 'Medication added',
                'body'  => $medication->name . ' was added to your medication list.',
            ],
        ]);

        return response()->json($this->shapeMedication($medication), 201);
    }

    public function logMedication(Request $request, Medication $medication): JsonResponse
    {
        $patient = $this->resolvePatient($request);
        abort_unless($medication->user_id === $patient->id, 404);

        $data = $request->validate([
            'taken_on' => ['nullable', 'date'],
        ]);

        $log = $medication->logs()->updateOrCreate(
            ['taken_on' => $data['taken_on'] ?? today()],
            ['taken_at' => now(), 'recorded_by' => $this->resolveUser($request)->id]
        );

        return response()->json($log);
    }

    public function destroyMedication(Request $request, Medication $medication): JsonResponse
    {
        $patient = $this->resolvePatient($request);
        abort_unless($medication->user_id === $patient->id, 404);

        $medication->delete();

        return response()->json(['success' => true]);
    }

    // =========================================================================
    // Appointments
    // =========================================================================

    public function appointments(Request $request): JsonResponse
    {
        $patient      = $this->resolvePatient($request);
        $appointments = $patient->appointments()->orderBy('starts_at')->get();

        return response()->json($appointments->map(fn ($appt) => $this->shapeAppointment($appt))->values());
    }

    public function storeAppointment(StoreAppointmentRequest $request): JsonResponse
    {
        $patient = $this->resolvePatient($request);
        $data    = $request->validated();
        $actor   = $this->resolveUser($request);

        $appointment = $patient->appointments()->create($data);

        $this->record($patient, 'Appointment added: ' . $appointment->title, $appointment, $actor);

        Notification::create([
            'id'              => (string) Str::uuid(),
            'type'            => 'appointment',
            'notifiable_type' => User::class,
            'notifiable_id'   => $patient->id,
            'data'            => [
                'title' => 'Appointment added',
                'body'  => $appointment->title . ' has been saved.',
            ],
        ]);

        return response()->json($this->shapeAppointment($appointment), 201);
    }

    public function destroyAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        $patient = $this->resolvePatient($request);
        abort_unless($appointment->user_id === $patient->id, 404);

        $appointment->delete();

        return response()->json(['success' => true]);
    }

    // =========================================================================
    // Medical Profile
    // =========================================================================

    public function profile(Request $request): JsonResponse
    {
        $patient = $this->resolvePatient($request);

        return response()->json($patient->medicalProfile()->firstOrCreate([]));
    }

    public function updateProfile(UpdateMedicalProfileRequest $request): JsonResponse
    {
        $data    = $request->validated();
        $patient = $this->resolvePatient($request);

        // blood_type and organ_donor live on the User, not MedicalProfile
        $userFields    = array_intersect_key($data, array_flip(['blood_type', 'organ_donor']));
        $profileFields = array_diff_key($data, array_flip(['blood_type', 'organ_donor']));

        if (!empty($userFields)) {
            $patient->update($userFields);
        }

        $profile = $patient->medicalProfile()->updateOrCreate([], $profileFields);

        return response()->json($profile);
    }

    // =========================================================================
    // Symptoms
    // =========================================================================

    public function storeSymptom(Request $request): JsonResponse
    {
        $data = $request->validate([
            'symptoms' => ['required', 'string', 'max:1000'],
            'onset'    => ['nullable', 'string', 'max:200'],
            'duration' => ['nullable', 'string', 'max:200'],
            'severity' => ['nullable', 'string', 'max:40'],
            'triggers' => ['nullable', 'string', 'max:500'],
            'other'    => ['nullable', 'string', 'max:1000'],
        ]);

        $summary = collect($data)
            ->filter()
            ->map(fn ($v, $k) => ucfirst(str_replace('_', ' ', $k)) . ': ' . $v)
            ->implode('. ') . '.';

        $report = $this->resolvePatient($request)->symptomReports()->create([
            'inputs'  => $data,
            'summary' => $summary,
        ]);

        return response()->json($report, 201);
    }

    // =========================================================================
    // Caregivers
    // =========================================================================

    public function inviteCaregiver(Request $request): JsonResponse
    {
        $data    = $request->validate([
            'phone'      => ['required', 'string'],
            'patient_id' => ['nullable', 'integer'],
        ]);

        $patient   = $this->resolvePatient($request);
        $caregiver = User::where('phone', $data['phone'])->firstOrFail();

        abort_if($caregiver->id === $patient->id, 422, 'Cannot link the same account.');

        $link = CaregiverLink::updateOrCreate(
            ['patient_id' => $patient->id, 'caregiver_id' => $caregiver->id],
            ['status'     => 'pending']
        );

        return response()->json($link);
    }

    public function respondCaregiver(Request $request, CaregiverLink $link): JsonResponse
    {
        $actor = $this->resolveUser($request);
        abort_unless($link->caregiver_id === $actor->id, 403);

        $data = $request->validate([
            'status' => [Rule::in(['accepted', 'rejected'])],
        ]);

        $link->update(['status' => $data['status']]);

        return response()->json($link);
    }

    // =========================================================================
    // Documents
    // =========================================================================

    public function documents(Request $request): JsonResponse
    {
        $patient = $this->resolvePatient($request);

        return response()->json($patient->documents()->latest()->get());
    }

    public function uploadDocument(UploadDocumentRequest $request): JsonResponse
    {
        $patient = $this->resolvePatient($request);
        $data    = $request->validated();
        $file    = $data['file'];
        $disk    = 'local';

        try {
            if (config('filesystems.disks.supabase.key') && config('filesystems.disks.supabase.bucket')) {
                $path = $file->store('medical-documents/' . $patient->id, 'supabase');
                $disk = 'supabase';
            } else {
                $path = $file->store('medical-documents/' . $patient->id, 'local');
            }
        } catch (\Throwable $e) {
            Log::warning('Supabase upload failed, falling back to local storage.', [
                'error' => $e->getMessage(),
            ]);
            $path = $file->store('medical-documents/' . $patient->id, 'local');
            $disk = 'local';
        }

        $document = $patient->documents()->create([
            'title'     => $data['title'],
            'category'  => $data['category'],
            'path'      => $path,
            'mime_type' => $file->getMimeType(),
            'size'      => $file->getSize(),
            'disk'      => $disk,
        ]);

        return response()->json($document, 201);
    }

    // =========================================================================
    // Public ICE (no auth required)
    // =========================================================================

    public function publicIce(string $code): JsonResponse
    {
        $user    = User::where('ice_code', $code)->firstOrFail();
        $profile = $user->medicalProfile;

        return response()->json([
            'name'               => $user->name,
            'blood_type'         => $user->blood_type,
            'organ_donor'        => $user->organ_donor,
            'conditions'         => $profile?->conditions,
            'allergies'          => $profile?->allergies,
            'emergency_contacts' => $profile?->emergency_contacts,
            'medications'        => $user->medications()
                ->where('active', true)
                ->get(['name', 'dosage', 'purpose']),
        ]);
    }
}
