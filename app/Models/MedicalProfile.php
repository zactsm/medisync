<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalProfile extends Model
{
    protected $fillable = [
        'user_id',
        'ic_number',
        'weight_kg',
        'height_cm',
        'conditions',
        'allergies',
        'emergency_contacts',
    ];

    protected $casts = [
        'conditions'         => 'array',
        'allergies'          => 'array',
        'emergency_contacts' => 'array',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
