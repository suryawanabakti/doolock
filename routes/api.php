<?php

use App\Http\Controllers\DoorLockController;
use App\Http\Controllers\ReferenceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/v1/get-data-dosen', [ReferenceController::class, 'getDosen']);

Route::get('/v1/ambilpost', [DoorLockController::class, 'index']);
Route::get('/v1/ambilpostpin', [DoorLockController::class, 'index2']);

Route::get('/v1/get-data-mahasiswa-by-scanner', [ReferenceController::class, 'getMahasiswaByScanner']);
Route::get('/v1/get-data-users', [ReferenceController::class, 'getUsers']);
