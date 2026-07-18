<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MedicalProfile extends Model { protected $guarded=[]; protected $casts=['conditions'=>'array','allergies'=>'array','emergency_contacts'=>'array']; public function user(){return $this->belongsTo(User::class);} }
