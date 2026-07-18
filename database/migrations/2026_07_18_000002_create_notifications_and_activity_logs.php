<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary(); $table->string('type'); $table->string('notifiable_type'); $table->unsignedBigInteger('notifiable_id'); $table->text('data'); $table->timestamp('read_at')->nullable(); $table->timestamps(); $table->index(['notifiable_type','notifiable_id']);
        });
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete(); $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete(); $table->string('action'); $table->string('subject_type')->nullable(); $table->unsignedBigInteger('subject_id')->nullable(); $table->json('metadata')->nullable(); $table->timestamps(); $table->index(['subject_type','subject_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('activity_logs'); Schema::dropIfExists('notifications'); }
};
