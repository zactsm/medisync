<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationLog extends Model
{
    protected $fillable = [
        'medication_id',
        'taken_on',
        'taken_at',
        'recorded_by',
    ];

    protected $casts = [
        'taken_on' => 'date',
        'taken_at' => 'datetime',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
