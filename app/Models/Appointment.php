<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Appointment extends Model { protected $guarded=[]; protected $casts=['starts_at'=>'datetime','documents_needed'=>'array','distance_km'=>'float']; public function user(){return $this->belongsTo(User::class);} }
