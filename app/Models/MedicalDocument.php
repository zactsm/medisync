<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalDocument extends Model
{
    protected $table = 'documents';

    protected $fillable = [
        'user_id',
        'title',
        'category',
        'path',
        'mime_type',
        'size',
        'disk',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size'     => 'integer',
    ];

    // -----------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
