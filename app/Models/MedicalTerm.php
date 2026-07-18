<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalTerm extends Model
{
    protected $guarded = [];

    protected $casts = [
        'key_takeaways' => 'array',
        'questions_for_doctor' => 'array',
        'featured' => 'boolean',
        'is_symptom' => 'boolean',
    ];
}
