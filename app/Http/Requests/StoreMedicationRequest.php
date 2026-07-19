<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Normalize time to H:i before validation runs.
     */
    protected function prepareForValidation(): void
    {
        $raw = $this->input('time');

        if ($raw) {
            try {
                // Accepts "08:00 AM", "08:00", "20:00", "8:00 AM", etc.
                $this->merge(['time' => Carbon::parse($raw)->format('H:i')]);
            } catch (\Throwable) {
                // Leave as-is; the validator will catch it
            }
        }

        // Accept camelCase alias from frontend
        if ($this->has('pillsLeft') && !$this->has('pills_left')) {
            $this->merge(['pills_left' => $this->integer('pillsLeft')]);
        }

        if ($this->has('expiryDate') && !$this->has('expiry_date')) {
            $this->merge(['expiry_date' => $this->input('expiryDate')]);
        }
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:120'],
            'category'     => ['nullable', 'string', 'max:120'],
            'dosage'       => ['required', 'string', 'max:80'],
            'purpose'      => ['nullable', 'string', 'max:200'],
            'instructions' => ['nullable', 'string', 'max:1000'],
            'frequency'    => ['nullable', 'string', 'max:40'],
            'time'         => ['nullable', 'date_format:H:i'],
            'pills_left'   => ['nullable', 'integer', 'min:0'],
            'doctor'       => ['nullable', 'string', 'max:120'],
            'expiry_date'  => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'time.date_format' => 'The time must be in HH:MM format (e.g. 08:00 or 14:30).',
        ];
    }
}
