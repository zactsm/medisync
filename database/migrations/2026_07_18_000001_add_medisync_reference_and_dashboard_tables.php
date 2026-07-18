<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable();
            }
            if (!Schema::hasColumn('users', 'caregiver_sync_code')) {
                $table->string('caregiver_sync_code')->nullable()->unique();
            }
        });

        Schema::table('medications', function (Blueprint $table) {
            if (!Schema::hasColumn('medications', 'refill_threshold')) {
                $table->unsignedInteger('refill_threshold')->default(7);
            }
        });

        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'distance_km')) {
                $table->decimal('distance_km', 6, 2)->nullable();
            }
        });

        Schema::table('caregiver_links', function (Blueprint $table) {
            if (!Schema::hasColumn('caregiver_links', 'relationship')) {
                $table->string('relationship')->nullable();
            }
            if (!Schema::hasColumn('caregiver_links', 'is_primary')) {
                $table->boolean('is_primary')->default(false);
            }
        });

        Schema::table('medical_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('medical_profiles', 'ic_number')) {
                $table->string('ic_number')->nullable();
            }
        });

        Schema::create('medical_terms', function (Blueprint $table) {
            $table->id();
            $table->string('term')->unique();
            $table->string('category')->nullable();
            $table->text('simple_explanation')->nullable();
            $table->text('analogy')->nullable();
            $table->json('key_takeaways')->nullable();
            $table->json('questions_for_doctor')->nullable();
            $table->string('malay')->nullable();
            $table->text('description')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('is_symptom')->default(false);
            $table->timestamps();
        });

        Schema::create('emergency_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->nullable();
            $table->string('address')->nullable();
            $table->decimal('distance_km', 6, 2)->nullable();
            $table->string('drive_time')->nullable();
            $table->string('er_phone')->nullable();
            $table->boolean('has_emergency_24h')->default(false);
            $table->string('google_map_url')->nullable();
            $table->timestamps();
        });

        Schema::create('dashboard_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('item_key');
            $table->string('title');
            $table->string('malay_title')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'item_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_checklist_items');
        Schema::dropIfExists('emergency_facilities');
        Schema::dropIfExists('medical_terms');

        Schema::table('medical_profiles', function (Blueprint $table) {
            $table->dropColumn('ic_number');
        });

        Schema::table('caregiver_links', function (Blueprint $table) {
            $table->dropColumn(['relationship', 'is_primary']);
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('distance_km');
        });

        Schema::table('medications', function (Blueprint $table) {
            $table->dropColumn('refill_threshold');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['caregiver_sync_code']);
            $table->dropColumn(['date_of_birth', 'caregiver_sync_code']);
        });
    }
};
