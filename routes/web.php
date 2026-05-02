<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard');
    })->name('dashboard');

    Route::get('/users', function () {
        return Inertia::render('Users/Index');
    })->name('users.page');

    Route::get('/users/roles', function () {
        return Inertia::render('Roles/Index');
    })->name('roles.page');

    Route::get('/users/roles/create', function () {
        return Inertia::render('Roles/Create');
    })->name('roles.create-page');

    Route::redirect('/roles', '/users/roles')->name('roles.redirect');
    Route::redirect('/roles/create', '/users/roles/create')->name('roles.create-redirect');

    Route::get('/settings', function () {
        return Inertia::render('Settings', [
            'twoFactorEnabled' => request()->user()->two_factor_secret !== null,
            'qrCode' => null,
            'recoveryCodes' => null,
        ]);
    })->name('settings');

    // Notifications — specific routes MUST come before wildcard {id} routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::prefix('/admin')->name('admin.')->middleware(['role:Admin'])->group(function () {
        Route::patch('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate');
        Route::patch('/users/{user}/suspend', [UserController::class, 'suspend'])->name('users.suspend');
        Route::put('/users/{user}/roles', [UserController::class, 'syncRoles'])->name('users.sync-roles');
        Route::put('/users/{user}/permissions', [UserController::class, 'syncPermissions'])->name('users.sync-permissions');

        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('permissions', PermissionController::class);
    });
});
