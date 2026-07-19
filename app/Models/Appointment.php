<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'doctor',
        'hospital',
        'address',
        'department',
        'starts_at',
        'notes',
        'documents_needed',
        'status',
        'distance_km',
    ];

    protected $casts = [
        'starts_at'        => 'datetime',
        'documents_needed' => 'array',
        'distance_km'      => 'float',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // -----------------------------------------------------------------
    // Scopes
    // -----------------------------------------------------------------

    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>=', now())->orderBy('starts_at');
    }
}
