<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymptomReport extends Model
{
    protected $fillable = [
        'user_id',
        'inputs',
        'summary',
    ];

    protected $casts = [
        'inputs' => 'array',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
