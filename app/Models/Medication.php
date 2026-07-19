<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medication extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'category',
        'dosage',
        'purpose',
        'instructions',
        'frequency',
        'time',
        'pills_left',
        'refill_threshold',
        'doctor',
        'active',
        'expiry_date',
    ];

    protected $casts = [
        'active'           => 'boolean',
        'refill_threshold' => 'integer',
        'pills_left'       => 'integer',
        'expiry_date'      => 'date:Y-m-d',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(MedicationLog::class);
    }

    // -----------------------------------------------------------------
    // Scopes
    // -----------------------------------------------------------------

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
