<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MedicationLog extends Model { protected $guarded=[]; protected $casts=['taken_on'=>'date','taken_at'=>'datetime']; public function medication(){return $this->belongsTo(Medication::class);} public function recordedBy(){return $this->belongsTo(User::class,'recorded_by');} }
