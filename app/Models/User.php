<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'phone', 'role', 'blood_type', 'organ_donor', 'ice_code'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function medications() { return $this->hasMany(Medication::class); }
    public function appointments() { return $this->hasMany(Appointment::class); }
    public function documents() { return $this->hasMany(MedicalDocument::class); }
    public function medicalProfile() { return $this->hasOne(MedicalProfile::class); }
    public function symptomReports() { return $this->hasMany(SymptomReport::class); }
    public function caregivers() { return $this->belongsToMany(self::class, 'caregiver_links', 'patient_id', 'caregiver_id')->wherePivot('status', 'accepted'); }
    public function patients() { return $this->belongsToMany(self::class, 'caregiver_links', 'caregiver_id', 'patient_id')->wherePivot('status', 'accepted'); }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
