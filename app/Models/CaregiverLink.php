<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaregiverLink extends Model
{
    protected $fillable = [
        'patient_id',
        'caregiver_id',
        'relationship',
        'is_primary',
        'status',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function caregiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caregiver_id');
    }
}
