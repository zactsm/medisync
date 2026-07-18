<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique();
            $table->string('role')->default('patient')->index();
            $table->string('blood_type')->nullable();
            $table->boolean('organ_donor')->default(false);
            $table->string('ice_code', 32)->nullable()->unique();
        });

        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id(); $table->string('phone')->index(); $table->string('code_hash');
            $table->timestamp('expires_at'); $table->timestamp('used_at')->nullable(); $table->timestamps();
        });
        Schema::create('medications', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name'); $table->string('category')->nullable(); $table->string('dosage'); $table->string('purpose')->nullable();
            $table->text('instructions')->nullable(); $table->string('frequency')->default('Daily');
            $table->string('time')->nullable(); $table->unsignedInteger('pills_left')->nullable();
            $table->string('doctor')->nullable(); $table->boolean('active')->default(true); $table->timestamps();
        });
        Schema::create('medication_logs', function (Blueprint $table) {
            $table->id(); $table->foreignId('medication_id')->constrained()->cascadeOnDelete();
            $table->date('taken_on'); $table->time('taken_at')->nullable(); $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps(); $table->unique(['medication_id','taken_on']);
        });
        Schema::create('appointments', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title'); $table->string('doctor')->nullable(); $table->string('hospital'); $table->text('address')->nullable();
            $table->string('department')->nullable(); $table->dateTime('starts_at'); $table->text('notes')->nullable();
            $table->json('documents_needed')->nullable(); $table->string('status')->default('Scheduled'); $table->timestamps();
        });
        Schema::create('documents', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title'); $table->string('category'); $table->string('path'); $table->string('disk')->default('supabase');
            $table->string('mime_type'); $table->unsignedBigInteger('size'); $table->json('metadata')->nullable(); $table->timestamps();
        });
        Schema::create('caregiver_links', function (Blueprint $table) {
            $table->id(); $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('caregiver_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending'); $table->timestamps(); $table->unique(['patient_id','caregiver_id']);
        });
        Schema::create('medical_profiles', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('weight_kg')->nullable(); $table->unsignedSmallInteger('height_cm')->nullable();
            $table->json('conditions')->nullable(); $table->json('allergies')->nullable(); $table->json('emergency_contacts')->nullable(); $table->timestamps();
        });
        Schema::create('symptom_reports', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->json('inputs'); $table->text('summary'); $table->timestamps();
        });
        Schema::create('reminders', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); $table->string('title'); $table->text('body')->nullable(); $table->timestamp('remind_at'); $table->boolean('read')->default(false); $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['reminders','symptom_reports','medical_profiles','caregiver_links','documents','appointments','medication_logs','medications','otp_codes'] as $table) Schema::dropIfExists($table);
        Schema::table('users', function (Blueprint $table) { $table->dropColumn(['phone','role','blood_type','organ_donor','ice_code']); });
    }
};
