<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DashboardChecklistItem;
use App\Models\EmergencyFacility;
use App\Models\MedicalDocument;
use App\Models\MedicalProfile;
use App\Models\MedicalTerm;
use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class MediSyncController extends Controller
{
    private function currentUser(): User
    {
        $user = auth()->user();
        abort_unless($user instanceof User, 401);
        return $user;
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => ucfirst((string) ($user->role ?: 'patient')),
            'age' => $user->date_of_birth?->age,
            'blood_type' => $user->blood_type,
            'ice_code' => $user->ice_code,
        ];
    }

    private function timeLabel(?string $time): string
    {
        if (!$time) {
            return 'Not scheduled';
        }

        try {
            return Carbon::createFromFormat(strlen($time) === 5 ? 'H:i' : 'H:i:s', $time)->format('h:i A');
        } catch (\Throwable) {
            return $time;
        }
    }

    private function timeOfDay(?string $time): string
    {
        if (!$time) {
            return 'Any time';
        }

        try {
            $hour = (int) Carbon::createFromFormat(strlen($time) === 5 ? 'H:i' : 'H:i:s', $time)->format('G');
            return $hour < 12 ? 'Morning' : ($hour < 18 ? 'Afternoon' : 'Night');
        } catch (\Throwable) {
            return 'Scheduled';
        }
    }

    private function medicationPayload(Medication $medication): array
    {
        return [
            'id' => $medication->id,
            'name' => $medication->name,
            'category' => $medication->category,
            'dosage' => $medication->dosage,
            'purpose' => $medication->purpose,
            'instructions' => $medication->instructions,
            'frequency' => $medication->frequency,
            'timeOfDay' => $this->timeOfDay($medication->time),
            'time' => $this->timeLabel($medication->time),
            'timing' => $this->timeOfDay($medication->time).' ('.$this->timeLabel($medication->time).')',
            'pillsLeft' => $medication->pills_left,
            'refillThreshold' => $medication->refill_threshold ?? 7,
            'takenToday' => $medication->logs->contains(fn (MedicationLog $log) => $log->taken_on?->isToday()),
            'taken' => $medication->logs->contains(fn (MedicationLog $log) => $log->taken_on?->isToday()),
            'doctor' => $medication->doctor,
        ];
    }

    private function appointmentPayload(Appointment $appointment): array
    {
        $startsAt = $appointment->starts_at;

        return [
            'id' => $appointment->id,
            'title' => $appointment->title,
            'doctor' => $appointment->doctor,
            'hospital' => $appointment->hospital,
            'address' => $appointment->address,
            'department' => $appointment->department,
            'date' => $startsAt?->format('Y-m-d'),
            'time' => $startsAt?->format('h:i A'),
            'daysLeft' => $startsAt ? max(0, Carbon::today()->diffInDays($startsAt->copy()->startOfDay(), false)) : null,
            'notes' => $appointment->notes,
            'documentsNeeded' => $appointment->documents_needed ?? [],
            'status' => $appointment->status,
            'distanceKm' => $appointment->distance_km,
        ];
    }

    private function documentPayload(MedicalDocument $document): array
    {
        $metadata = $document->metadata ?? [];

        return [
            'id' => $document->id,
            'title' => $document->title,
            'category' => $document->category,
            'type' => $metadata['type'] ?? $document->mime_type ?? 'Medical document',
            'policyNo' => $metadata['policyNo'] ?? null,
            'coverageAmount' => $metadata['coverageAmount'] ?? null,
            'uploadedDate' => $document->created_at?->format('d M Y'),
            'size' => $this->humanFileSize($document->size),
            'tags' => $metadata['tags'] ?? [],
            'notes' => $metadata['notes'] ?? null,
            'path' => $document->path,
            'disk' => $document->disk,
        ];
    }

    private function humanFileSize(?int $bytes): string
    {
        if (!$bytes) {
            return '—';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $power = min((int) floor(log($bytes, 1024)), count($units) - 1);

        return round($bytes / (1024 ** $power), 1).' '.$units[$power];
    }

    private function activeMedications(User $user): Collection
    {
        $today = Carbon::today();

        return $user->medications()
            ->where('active', true)
            ->with(['logs' => fn ($query) => $query->whereDate('taken_on', $today)])
            ->orderBy('time')
            ->get();
    }

    private function adherenceRate(User $user, ?Collection $activeMeds = null): int
    {
        if ($activeMeds === null) {
            $activeMeds = $user->medications()->where('active', true)->get();
        }
        $activeCount = $activeMeds->count();
        if ($activeCount === 0) {
            return 0;
        }

        $medicationIds = $activeMeds->pluck('id')->all();

        $logs = MedicationLog::query()
            ->whereIn('medication_id', $medicationIds)
            ->whereBetween('taken_on', [Carbon::today()->subDays(29), Carbon::today()])
            ->count();

        return min(100, (int) round(($logs / ($activeCount * 30)) * 100));
    }

    private function streakDays(User $user, ?Collection $activeMeds = null): int
    {
        if ($activeMeds === null) {
            $activeMeds = $user->medications()->where('active', true)->get();
        }

        $medicationIds = $activeMeds->pluck('id')->all();
        if (empty($medicationIds)) {
            return 0;
        }

        $dates = MedicationLog::query()
            ->whereIn('medication_id', $medicationIds)
            ->select('taken_on')
            ->distinct()
            ->orderByDesc('taken_on')
            ->pluck('taken_on')
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->values();

        $streak = 0;
        $expected = Carbon::today();
        foreach ($dates as $date) {
            if ($date !== $expected->toDateString()) {
                break;
            }
            $streak++;
            $expected->subDay();
        }

        return $streak;
    }

    private function emergencyContacts(User $user): array
    {
        return $user->medicalProfile?->emergency_contacts ?? [];
    }

    public function dashboard()
    {
        if (!auth()->check()) {
            return Inertia::render('Welcome');
        }

        $user = $this->currentUser();
        $medications = $this->activeMedications($user);
        $appointments = $user->appointments()->where('starts_at', '>=', now())->orderBy('starts_at')->get();
        $profile = $user->medicalProfile;
        $adherence = $this->adherenceRate($user, $medications);
        $caregivers = $user->caregivers()->get();

        $sevenDaysAgo = Carbon::today()->subDays(6);
        $medicationIds = $medications->pluck('id')->all();
        $logsLastSevenDays = empty($medicationIds) ? collect() : MedicationLog::query()
            ->whereIn('medication_id', $medicationIds)
            ->where('taken_on', '>=', $sevenDaysAgo)
            ->get();

        $logsByDate = $logsLastSevenDays->groupBy(function ($log) {
            return Carbon::parse($log->taken_on)->toDateString();
        })->map(fn ($group) => $group->count());

        $weeklyActivity = collect(range(6, 0))->map(function (int $daysAgo) use ($medications, $logsByDate) {
            $date = Carbon::today()->subDays($daysAgo);
            $dateStr = $date->toDateString();
            $count = $logsByDate->get($dateStr, 0);
            $max = max(1, $medications->count());

            return [
                'day' => $date->format('D'),
                'value' => min(100, (int) round(($count / $max) * 100)),
                'label' => $count.' log'.($count === 1 ? '' : 's')
            ];
        })->values()->all();

        $calendar = $appointments->map(function (Appointment $appointment, int $index) {
            $mapped = $this->appointmentPayload($appointment);
            return [
                'id' => 'appointment-'.$mapped['id'],
                'date' => $mapped['date'],
                'time' => $mapped['time'],
                'title' => $mapped['title'],
                'malayTitle' => 'Temujanji penjagaan',
                'detail' => $mapped['hospital'],
                'tone' => $index % 2 === 0 ? 'charcoal' : 'saffron',
            ];
        })->all();

        $checklist = $user->checklistItems()->orderBy('position')->get()->map(fn (DashboardChecklistItem $item) => [
            'id' => $item->item_key,
            'title' => $item->title,
            'malayTitle' => $item->malay_title,
            'completed' => (bool) $item->completed_at,
        ])->all();

        $contacts = $this->emergencyContacts($user);
        $readiness = ($user->ice_code ? 50 : 0) + ($profile ? 25 : 0) + (count($contacts) > 0 ? 25 : 0);
        $primaryContact = $contacts[0] ?? null;

        return Inertia::render('Dashboard', [
            'user' => $this->userPayload($user),
            'upcomingMeds' => $medications->take(3)->map(fn (Medication $medication) => [
                'id' => $medication->id,
                'name' => $medication->name.' ('.$medication->category.')',
                'dosage' => $medication->dosage,
                'timing' => $this->timeOfDay($medication->time).' ('.$this->timeLabel($medication->time).')',
                'taken' => $medication->logs->isNotEmpty(),
                'icon' => 'Pill',
                'color' => 'teal',
            ])->values()->all(),
            'upcomingAppointments' => $appointments->take(2)->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'doctor' => $appointment->doctor.' ('.$appointment->department.')',
                'hospital' => $appointment->hospital,
                'department' => $appointment->department,
                'date' => $appointment->starts_at?->format('Y-m-d'),
                'time' => $appointment->starts_at?->format('h:i A'),
                'daysLeft' => $appointment->starts_at ? max(0, Carbon::today()->diffInDays($appointment->starts_at->copy()->startOfDay(), false)) : null,
                'status' => $appointment->status,
            ])->values()->all(),
            'caregiverSync' => [
                'status' => $caregivers->isNotEmpty() ? 'Active Sync' : 'Not connected',
                'familyCount' => $caregivers->count(),
                'members' => $caregivers->map(fn (User $caregiver) => [
                    'name' => $caregiver->name,
                    'relation' => $caregiver->pivot?->relationship ?? 'Family caregiver',
                    'phone' => $caregiver->phone,
                    'lastSeen' => $caregiver->updated_at?->diffForHumans(),
                    'status' => 'Synced',
                ])->values()->all(),
            ],
            'emergencySummary' => [
                'allergies' => collect($profile?->allergies ?? [])->map(fn ($allergy) => is_array($allergy) ? ($allergy['allergen'] ?? 'Unknown') : $allergy)->values()->all(),
                'conditions' => $profile?->conditions ?? [],
                'primaryICE' => $primaryContact ? $primaryContact['name'].' ('.$primaryContact['phone'].')' : 'Not set',
            ],
            'dashboardSummary' => [
                'metrics' => [
                    ['key' => 'medicationAdherence', 'label' => 'Medication adherence', 'malayLabel' => 'Pematuhan ubat', 'value' => $adherence, 'suffix' => '%', 'tone' => 'charcoal'],
                    ['key' => 'appointments', 'label' => 'Upcoming appointments', 'malayLabel' => 'Temujanji akan datang', 'value' => $appointments->count(), 'suffix' => '', 'tone' => 'saffron'],
                    ['key' => 'caregiverSync', 'label' => 'Caregiver sync', 'malayLabel' => 'Sync penjaga', 'value' => $caregivers->isNotEmpty() ? 100 : 0, 'suffix' => '%', 'tone' => 'striped'],
                    ['key' => 'emergencyReadiness', 'label' => 'Emergency readiness', 'malayLabel' => 'Kesediaan kecemasan', 'value' => $readiness, 'suffix' => '%', 'tone' => 'outline'],
                ],
                'weeklyActivity' => $weeklyActivity,
                'calendar' => $calendar,
                'checklist' => $checklist,
            ],
        ]);
    }

    public function medications()
    {
        $user = $this->currentUser();
        $medications = $this->activeMedications($user);

        return Inertia::render('Medications', [
            'user' => $this->userPayload($user),
            'medications' => $medications->map(fn (Medication $medication) => $this->medicationPayload($medication))->values()->all(),
            'adherenceRate' => $this->adherenceRate($user, $medications),
            'streakDays' => $this->streakDays($user, $medications),
        ]);
    }

    public function appointments()
    {
        $user = $this->currentUser();

        return Inertia::render('Appointments', [
            'user' => $this->userPayload($user),
            'appointments' => $user->appointments()->orderBy('starts_at')->get()->map(fn (Appointment $appointment) => $this->appointmentPayload($appointment))->values()->all(),
        ]);
    }


    public function documents()
    {
        $user = $this->currentUser();

        return Inertia::render('DocumentVault', [
            'user' => $this->userPayload($user),
            'documents' => $user->documents()->latest()->get()->map(fn (MedicalDocument $document) => $this->documentPayload($document))->values()->all(),
        ]);
    }

    public function caregiverSync()
    {
        $user = $this->currentUser();
        $patient = $user->load('medicalProfile')->fresh();
        $caregivers = $user->caregivers()->get();
        $latestActivity = ActivityLog::where('user_id', $user->id)->latest()->first();
        $sharedLog = ActivityLog::where('user_id', $user->id)->with('actor')->latest()->limit(10)->get()->map(fn (ActivityLog $log) => [
            'id' => $log->id, 'time' => $log->created_at?->format('d M Y, h:i A'), 'actor' => $log->actor?->name ?? 'MediSync', 'action' => $log->action, 'type' => $log->subject_type ? class_basename($log->subject_type) : 'Activity', 'status' => 'Recorded',
        ])->values()->all();

        return Inertia::render('CaregiverSync', [
            'user' => $this->userPayload($user),
            'patient' => [
                'name' => $patient->name,
                'age' => $patient->date_of_birth?->age,
                'syncCode' => $patient->caregiver_sync_code,
                'overallStatus' => $caregivers->isNotEmpty() ? 'Stable & Synced' : 'Awaiting connection',
                'lastActivity' => $latestActivity?->action ?? 'No recent activity recorded',
            ],
            'connectedCaregivers' => $caregivers->map(fn (User $caregiver) => [
                'id' => $caregiver->id,
                'name' => $caregiver->name,
                'relation' => $caregiver->pivot?->relationship ?? 'Family caregiver',
                'phone' => $caregiver->phone,
                'accessLevel' => 'Medication & appointment access',
                'joinedDate' => $caregiver->pivot?->created_at?->format('M Y') ?? $caregiver->created_at?->format('M Y'),
                'avatar' => collect(explode(' ', $caregiver->name))->filter()->take(2)->map(fn ($part) => strtoupper($part[0]))->implode(''),
                'isPrimary' => $caregiver->pivot?->is_primary ?? false,
            ])->values()->all(),
            'sharedLog' => $sharedLog,
        ]);
    }

    public function symptomSummariser()
    {
        $user = $this->currentUser();

        return Inertia::render('SymptomSummariser', [
            'user' => $this->userPayload($user),
            'commonSymptoms' => MedicalTerm::query()->where('is_symptom', true)->orderBy('term')->pluck('term')->values()->all(),
        ]);
    }

    public function emergencySOS()
    {
        $user = $this->currentUser();
        $contacts = $this->emergencyContacts($user);

        return Inertia::render('EmergencySOS', [
            'user' => $this->userPayload($user),
            'emergencyContacts' => $contacts,
            'nearbyHospitals' => EmergencyFacility::query()->orderBy('distance_km')->get()->map(fn (EmergencyFacility $facility) => [
                'id' => $facility->id,
                'name' => $facility->name,
                'type' => $facility->type,
                'address' => $facility->address,
                'distanceKm' => $facility->distance_km,
                'driveTime' => $facility->drive_time,
                'erPhone' => $facility->er_phone,
                'hasEmergency24h' => $facility->has_emergency_24h,
                'googleMapUrl' => $facility->google_map_url,
            ])->values()->all(),
        ]);
    }

    public function emergencyICE()
    {
        $user = $this->currentUser();
        $profile = $user->medicalProfile;
        $contacts = $this->emergencyContacts($user);

        return Inertia::render('EmergencyICE', [
            'user' => $this->userPayload($user),
            'patientICE' => [
                'name' => $user->name,
                'ic_number' => $profile?->ic_number,
                'blood_type' => $user->blood_type,
                'organ_donor' => $user->organ_donor,
                'weight_kg' => $profile?->weight_kg,
                'height_cm' => $profile?->height_cm,
                'chronic_conditions' => $profile?->conditions ?? [],
                'allergies' => $profile?->allergies ?? [],
                'vitalMedications' => $this->activeMedications($user)->map(fn (Medication $medication) => ['name' => $medication->name, 'dose' => $medication->dosage.' '.$medication->frequency, 'purpose' => $medication->purpose])->values()->all(),
                'iceContacts' => collect($contacts)->map(fn ($contact) => ['name' => $contact['name'], 'relation' => $contact['relation'], 'phone' => $contact['phone']])->values()->all(),
                'publicAccessCode' => $user->ice_code,
                'publicUrl' => url('/ice/public/'.$user->ice_code),
            ],
        ]);
    }

    public function publicICE(string $code)
    {
        $user = User::query()->where('ice_code', $code)->with('medicalProfile')->firstOrFail();
        $profile = $user->medicalProfile;
        $contacts = $this->emergencyContacts($user);
        $activeMedications = $user->medications()->where('active', true)->get();

        return Inertia::render('PublicICE', [
            'code' => $code,
            'emergencyData' => [
                'name' => $user->name,
                'age' => $user->date_of_birth?->age,
                'blood_type' => $user->blood_type,
                'organ_donor' => $user->organ_donor,
                'criticalConditions' => collect($profile?->conditions ?? [])->map(fn ($condition) => is_array($condition) ? ($condition['name'] ?? '') : $condition)->values()->all(),
                'severeAllergies' => collect($profile?->allergies ?? [])->map(fn ($allergy) => is_array($allergy) ? strtoupper(($allergy['allergen'] ?? 'Unknown').' ('.($allergy['severity'] ?? 'Warning').')') : strtoupper((string) $allergy))->values()->all(),
                'activeMedications' => $activeMedications->map(fn (Medication $medication) => $medication->name.' '.$medication->dosage.' ('.$medication->purpose.')')->values()->all(),
                'emergencyContactPhone' => $contacts[0]['phone'] ?? null,
                'emergencyContactName' => $contacts[0]['name'] ?? null,
                'secondaryContactPhone' => $contacts[1]['phone'] ?? null,
                'secondaryContactName' => $contacts[1]['name'] ?? null,
            ],
        ]);
    }
}
