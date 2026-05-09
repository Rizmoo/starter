<?php

use App\Http\Controllers\Platform\Auth\LoginController;
use App\Http\Controllers\Platform\CompanyController;
use App\Http\Controllers\Platform\DashboardController;
use App\Http\Controllers\Platform\SettingsController;
use App\Http\Controllers\Platform\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('platform')->name('platform.')->group(function () {
    // Guest Routes
    Route::middleware('guest:platform')->group(function () {
        Route::get('login', [LoginController::class, 'create'])->name('login');
        Route::post('login', [LoginController::class, 'store']);
    });

    // Protected Routes
    Route::middleware('platform.admin')->group(function () {
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');

        Route::prefix('companies')->name('companies.')->group(function () {
            Route::get('/', [CompanyController::class, 'index'])->name('index');
            Route::get('/{company}', [CompanyController::class, 'show'])->name('show');
            Route::patch('/{company}/activate', [CompanyController::class, 'activate'])->name('activate');
            Route::patch('/{company}/suspend', [CompanyController::class, 'suspend'])->name('suspend');
            Route::patch('/{company}/block', [CompanyController::class, 'block'])->name('block');
            Route::patch('/{company}/unblock', [CompanyController::class, 'unblock'])->name('unblock');
        });
    });
});
