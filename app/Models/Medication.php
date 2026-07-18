<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Medication extends Model { protected $guarded=[]; protected $casts=['active'=>'boolean']; public function user(){return $this->belongsTo(User::class);} public function logs(){return $this->hasMany(MedicationLog::class);} }
