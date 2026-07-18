<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MedicationLog extends Model { protected $guarded=[]; protected $casts=['taken_on'=>'date','taken_at'=>'datetime']; }
