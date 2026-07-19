<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title'    => ['required', 'string', 'max:160'],
            'category' => ['required', 'string', 'max:60'],
            'file'     => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'Only PDF, JPG, PNG, and WebP files are accepted.',
            'file.max'   => 'File size must not exceed 10 MB.',
        ];
    }
}
