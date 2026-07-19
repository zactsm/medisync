<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediSyncController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| MediSync Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/login', [AuthController::class, 'show'])->name('login');
Route::post('/auth/sync', [AuthController::class, 'sync'])->name('auth.sync');
Route::post('/auth/bypass', function (Illuminate\Http\Request $request) {
    $email = $request->input('email');
    abort_unless($email, 400, 'Email is required');
    $user = App\Models\User::where('email', $email)->firstOrFail();

    auth()->login($user);
    $request->session()->regenerate();

    return response()->json(['user' => $user]);
})->name('auth.bypass');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/', [MediSyncController::class, 'dashboard'])->name('dashboard');
Route::middleware('auth')->group(function () {
Route::get('/medications', [MediSyncController::class, 'medications'])->name('medications');
Route::get('/appointments', [MediSyncController::class, 'appointments'])->name('appointments');
Route::get('/term-simplifier', [MediSyncController::class, 'termSimplifier'])->name('termSimplifier');
Route::get('/documents', [MediSyncController::class, 'documents'])->name('documents');
Route::get('/caregiver', [MediSyncController::class, 'caregiverSync'])->name('caregiverSync');
Route::get('/symptom-summariser', [MediSyncController::class, 'symptomSummariser'])->name('symptomSummariser');
Route::get('/emergency-sos', [MediSyncController::class, 'emergencySOS'])->name('emergencySOS');
Route::get('/ice', [MediSyncController::class, 'emergencyICE'])->name('emergencyICE');
});
Route::get('/ice/public/{code}', [MediSyncController::class, 'publicICE'])->name('publicICE');

use App\Http\Controllers\Api\MediSyncApiController;
Route::prefix('api')->group(function () {
    Route::post('/auth/request-otp', [MediSyncApiController::class, 'requestOtp']);
    Route::post('/auth/verify-otp', [MediSyncApiController::class, 'verifyOtp']);
    Route::middleware('web')->group(function () {
        Route::get('/medications', [MediSyncApiController::class, 'medications']);
        Route::post('/medications', [MediSyncApiController::class, 'storeMedication']);
        Route::post('/medications/{medication}/log', [MediSyncApiController::class, 'logMedication']);
        Route::delete('/medications/{medication}', [MediSyncApiController::class, 'destroyMedication']);
        Route::get('/appointments', [MediSyncApiController::class, 'appointments']);
        Route::post('/appointments', [MediSyncApiController::class, 'storeAppointment']);
        Route::delete('/appointments/{appointment}', [MediSyncApiController::class, 'destroyAppointment']);
        Route::get('/medical-profile', [MediSyncApiController::class, 'profile']);
        Route::put('/medical-profile', [MediSyncApiController::class, 'updateProfile']);
        Route::post('/symptoms', [MediSyncApiController::class, 'storeSymptom']);
        Route::post('/caregivers/invite', [MediSyncApiController::class, 'inviteCaregiver']);
        Route::patch('/caregivers/{link}', [MediSyncApiController::class, 'respondCaregiver']);
        Route::get('/documents', [MediSyncApiController::class, 'documents']);
        Route::post('/documents', [MediSyncApiController::class, 'uploadDocument']);
    });
});
Route::get('/api/ice/{code}', [MediSyncApiController::class, 'publicIce'])->name('api.publicIce');
