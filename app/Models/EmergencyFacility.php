<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyFacility extends Model
{
    protected $guarded = [];

    protected $casts = [
        'distance_km' => 'float',
        'has_emergency_24h' => 'boolean',
    ];
}
