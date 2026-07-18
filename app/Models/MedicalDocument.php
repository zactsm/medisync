<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MedicalDocument extends Model { protected $table='documents'; protected $guarded=[]; protected $casts=['metadata'=>'array']; }
