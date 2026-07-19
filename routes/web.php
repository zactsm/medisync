<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediSyncController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| MediSync Web Routes
|--------------------------------------------------------------------------
| These routes render Inertia pages. All API endpoints live in routes/api.php
| and are mounted under the /api prefix via bootstrap/app.php.
|--------------------------------------------------------------------------
*/

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::get('/login',        [AuthController::class, 'show'])->name('login');
Route::post('/auth/sync',   [AuthController::class, 'sync'])->name('auth.sync');
Route::post('/auth/bypass', [AuthController::class, 'bypass'])->name('auth.bypass');
Route::post('/logout',      [AuthController::class, 'logout'])->name('logout');

// ── Dashboard (guest-accessible — shows Welcome page when not logged in) ──────
Route::get('/', [MediSyncController::class, 'dashboard'])->name('dashboard');

// ── Authenticated pages ────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/medications',        [MediSyncController::class, 'medications'])->name('medications');
    Route::get('/appointments',       [MediSyncController::class, 'appointments'])->name('appointments');
    Route::get('/documents',          [MediSyncController::class, 'documents'])->name('documents');
    Route::get('/caregiver',          [MediSyncController::class, 'caregiverSync'])->name('caregiverSync');
    Route::get('/symptom-summariser', [MediSyncController::class, 'symptomSummariser'])->name('symptomSummariser');
    Route::get('/emergency-sos',      [MediSyncController::class, 'emergencySOS'])->name('emergencySOS');
    Route::get('/ice',                [MediSyncController::class, 'emergencyICE'])->name('emergencyICE');
});

// ── Public ICE card (no auth) ─────────────────────────────────────────────────
Route::get('/ice/public/{code}', [MediSyncController::class, 'publicICE'])->name('publicICE');
