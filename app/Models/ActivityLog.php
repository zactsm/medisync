<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ActivityLog extends Model { protected $guarded=[]; protected $casts=['metadata'=>'array']; public function actor(){return $this->belongsTo(User::class,'actor_id');} }
