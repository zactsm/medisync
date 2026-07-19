<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicalProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'               => ['required', 'string', 'max:120'],
            'blood_type'         => ['nullable', 'string', 'max:10'],
            'organ_donor'        => ['boolean'],
            'weight_kg'          => ['nullable', 'integer', 'min:1', 'max:500'],
            'height_cm'          => ['nullable', 'integer', 'min:30', 'max:250'],
            'conditions'         => ['nullable', 'array'],
            'allergies'          => ['nullable', 'array'],
            'emergency_contacts' => ['nullable', 'array'],
        ];
    }
}
