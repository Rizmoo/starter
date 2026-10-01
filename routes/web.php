<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Settings\ApiKeyController;
use App\Http\Controllers\Settings\SessionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
Route::get('/auth/google', fn () => redirect()->route('social.redirect', ['provider' => 'google']));

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

    Route::get('/users/{user}', function (User $user) {
        return Inertia::render('Users/Show', [
            'id' => $user->id,
        ]);
    })->name('users.show');

    Route::redirect('/roles', '/users/roles')->name('roles.redirect');
    Route::redirect('/roles/create', '/users/roles/create')->name('roles.create-redirect');

    Route::get('/settings', function () {
        return Inertia::render('Settings', [
            'twoFactorEnabled' => request()->user()->two_factor_secret !== null,
            'qrCode' => null,
            'recoveryCodes' => null,
        ]);
    })->name('settings');

    Route::get('/settings/api-keys', [ApiKeyController::class, 'index'])->name('settings.api-keys');
    Route::post('/settings/api-keys', [ApiKeyController::class, 'store'])->name('settings.api-keys.store');
    Route::delete('/settings/api-keys/{tokenId}', [ApiKeyController::class, 'destroy'])->name('settings.api-keys.destroy');

    // Session Management
    Route::get('/settings/sessions', [SessionController::class, 'index'])->name('settings.sessions');
    Route::delete('/settings/sessions/{sessionId}', [SessionController::class, 'destroy'])->name('settings.sessions.destroy');
    Route::delete('/settings/sessions', [SessionController::class, 'destroyOthers'])->name('settings.sessions.destroy-others');

    // Notifications — specific routes MUST come before wildcard {id} routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::prefix('/admin')->name('admin.')->group(function () {
        Route::middleware('permission:users.view')->group(function () {
            Route::get('/users/{user}/logs', [UserController::class, 'logs'])->name('users.logs');
            Route::get('/users/{user}/logs/export', [UserController::class, 'exportLogs'])->name('users.logs.export');
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        });

        Route::middleware('permission:users.create')->post('/users', [UserController::class, 'store'])->name('users.store');

        Route::middleware('permission:users.update')->group(function () {
            Route::patch('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate');
            Route::patch('/users/{user}/suspend', [UserController::class, 'suspend'])->name('users.suspend');
            Route::put('/users/{user}/roles', [UserController::class, 'syncRoles'])->name('users.sync-roles');
            Route::put('/users/{user}/permissions', [UserController::class, 'syncPermissions'])->name('users.sync-permissions');
            Route::post('/users/bulk/force-password-change', [UserController::class, 'bulkForcePasswordChange'])->name('users.bulk.force-password-change');
            Route::match(['put', 'patch'], '/users/{user}', [UserController::class, 'update'])->name('users.update');
        });

        Route::middleware('permission:users.delete')->delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::middleware('permission:roles.view')->group(function () {
            Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
            Route::get('/roles/{role}', [RoleController::class, 'show'])->name('roles.show');
            Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
            Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->name('permissions.show');
        });

        Route::middleware('permission:roles.create')->post('/roles', [RoleController::class, 'store'])->name('roles.store');

        Route::middleware('permission:roles.update')->group(function () {
            Route::match(['put', 'patch'], '/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
            Route::match(['put', 'patch'], '/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
        });

        Route::middleware('permission:roles.delete')->group(function () {
            Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
            Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
        });
    });
});
