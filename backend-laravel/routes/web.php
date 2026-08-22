<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::post("/register", [AuthController::class, "register"]);

Route::post("/login", [AuthController::class, "login"]);
Route::get('/hello', function () {
    return 'Hello World';
});

require __DIR__.'/settings.php';
