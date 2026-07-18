<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CaregiverLink extends Model { protected $guarded=[]; public function patient(){return $this->belongsTo(User::class,'patient_id');} public function caregiver(){return $this->belongsTo(User::class,'caregiver_id');} }
