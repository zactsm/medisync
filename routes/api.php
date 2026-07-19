<?php

use App\Http\Controllers\Api\MediSyncApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| MediSync API Routes
|--------------------------------------------------------------------------
| All routes here use the "web" middleware stack (session + CSRF) because
| the frontend is a same-origin Inertia SPA using cookie-based auth.
| OTP endpoints are excluded from CSRF via bootstrap/app.php.
|--------------------------------------------------------------------------
*/

// ── Auth (public) ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/request-otp', [MediSyncApiController::class, 'requestOtp']);
    Route::post('/verify-otp', [MediSyncApiController::class, 'verifyOtp']);
});

// ── Public ICE card ──────────────────────────────────────────────────────────
Route::get('/ice/{code}', [MediSyncApiController::class, 'publicIce'])->name('api.publicIce');

// ── Authenticated endpoints ───────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Medications
    Route::get('/medications',                    [MediSyncApiController::class, 'medications']);
    Route::post('/medications',                   [MediSyncApiController::class, 'storeMedication']);
    Route::post('/medications/{medication}/log',  [MediSyncApiController::class, 'logMedication']);
    Route::delete('/medications/{medication}',    [MediSyncApiController::class, 'destroyMedication']);

    // Appointments
    Route::get('/appointments',                   [MediSyncApiController::class, 'appointments']);
    Route::post('/appointments',                  [MediSyncApiController::class, 'storeAppointment']);
    Route::delete('/appointments/{appointment}',  [MediSyncApiController::class, 'destroyAppointment']);

    // Medical Profile
    Route::get('/medical-profile',                [MediSyncApiController::class, 'profile']);
    Route::put('/medical-profile',                [MediSyncApiController::class, 'updateProfile']);

    // Symptoms
    Route::post('/symptoms',                      [MediSyncApiController::class, 'storeSymptom']);

    // Caregivers
    Route::post('/caregivers/invite',             [MediSyncApiController::class, 'inviteCaregiver']);
    Route::patch('/caregivers/{link}',            [MediSyncApiController::class, 'respondCaregiver']);

    // Documents
    Route::get('/documents',                      [MediSyncApiController::class, 'documents']);
    Route::post('/documents',                     [MediSyncApiController::class, 'uploadDocument']);
});
