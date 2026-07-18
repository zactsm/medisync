<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediSyncController;

/*
|--------------------------------------------------------------------------
| MediSync Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [MediSyncController::class, 'dashboard'])->name('dashboard');
Route::get('/medications', [MediSyncController::class, 'medications'])->name('medications');
Route::get('/appointments', [MediSyncController::class, 'appointments'])->name('appointments');
Route::get('/term-simplifier', [MediSyncController::class, 'termSimplifier'])->name('termSimplifier');
Route::get('/documents', [MediSyncController::class, 'documents'])->name('documents');
Route::get('/caregiver', [MediSyncController::class, 'caregiverSync'])->name('caregiverSync');
Route::get('/symptom-summariser', [MediSyncController::class, 'symptomSummariser'])->name('symptomSummariser');
Route::get('/emergency-sos', [MediSyncController::class, 'emergencySOS'])->name('emergencySOS');
Route::get('/ice', [MediSyncController::class, 'emergencyICE'])->name('emergencyICE');
Route::get('/ice/public/{code}', [MediSyncController::class, 'publicICE'])->name('publicICE');
