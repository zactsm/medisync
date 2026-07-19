<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Build starts_at from separate date + time fields (avoids AM/PM parsing issues).
     * Also accepts a pre-combined starts_at string as fallback.
     */
    protected function prepareForValidation(): void
    {
        $date     = $this->input('date');
        $time     = $this->input('time');
        $startsAt = $this->input('starts_at');

        // Prefer explicit date + time fields sent by the form
        if ($date) {
            try {
                $timeStr  = $time ? Carbon::parse($time)->format('H:i:s') : '00:00:00';
                $combined = Carbon::parse("$date $timeStr")->toDateTimeString();
                $this->merge(['starts_at' => $combined]);
            } catch (\Throwable) {
                // Fall through to starts_at as-is
            }
        } elseif ($startsAt) {
            // Try to parse the combined value (may already be correct)
            try {
                $this->merge([
                    'starts_at' => Carbon::parse($startsAt)->toDateTimeString(),
                ]);
            } catch (\Throwable) {
                // Leave as-is
            }
        }
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:160'],
            'doctor'           => ['nullable', 'string', 'max:120'],
            'hospital'         => ['required', 'string', 'max:160'],
            'address'          => ['nullable', 'string', 'max:500'],
            'department'       => ['nullable', 'string', 'max:160'],
            'starts_at'        => ['required', 'date'],
            'notes'            => ['nullable', 'string', 'max:2000'],
            'documents_needed' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'starts_at.required' => 'A valid appointment date is required.',
            'starts_at.date'     => 'The appointment date/time could not be parsed.',
        ];
    }
}
