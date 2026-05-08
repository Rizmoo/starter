<?php

use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\BranchContextController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Settings\ApiKeyController;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
Route::get('/auth/google', fn () => redirect()->route('social.redirect', ['provider' => 'google']));

Route::middleware(['auth'])->group(function () {
    Route::post('/branches/switch', [BranchContextController::class, 'update'])->name('branches.switch');

    Route::middleware(['branch.context'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard/Dashboard');
        })->name('dashboard');

        Route::get('/users', function () {
            return Inertia::render('Users/Index');
        })->name('users.page');

        Route::get('/users/{user}', function (User $user) {
            return Inertia::render('Users/Show', [
                'id' => $user->id,
            ]);
        })->name('users.show');

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

        Route::get('/settings/company', function () {
            $company = request()->user()?->company;

            abort_unless($company !== null, 404);

            return Inertia::render('Settings/Company', [
                'company' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'address' => $company->address,
                    'logo_path' => $company->logo_path,
                ],
            ]);
        })->middleware(['role:Admin'])->name('settings.company');

        Route::put('/settings/company', function () {
            $user = request()->user();
            $companyId = $user?->company_id;

            abort_unless($companyId !== null, 404);

            $validated = request()->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'address' => ['nullable', 'string', 'max:1000'],
            ]);

            Company::query()->whereKey($companyId)->update($validated);

            return back()->with('success', 'Company settings updated successfully.');
        })->middleware(['role:Admin'])->name('settings.company.update');

        Route::get('/settings/api-keys', [ApiKeyController::class, 'index'])->name('settings.api-keys');
        Route::post('/settings/api-keys', [ApiKeyController::class, 'store'])->name('settings.api-keys.store');
        Route::delete('/settings/api-keys/{tokenId}', [ApiKeyController::class, 'destroy'])->name('settings.api-keys.destroy');
        Route::get('/settings/branches', function () {
            return Inertia::render('Settings/Branches');
        })->middleware(['role:Admin'])->name('settings.branches');

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
            Route::patch('/branches/{branch}/activate', [BranchController::class, 'activate'])->name('branches.activate');
            Route::patch('/branches/{branch}/archive', [BranchController::class, 'archive'])->name('branches.archive');

            Route::post('/users/bulk/force-password-change', [UserController::class, 'bulkForcePasswordChange'])->name('users.bulk.force-password-change');
            Route::apiResource('users', UserController::class);
            Route::apiResource('branches', BranchController::class);
            Route::apiResource('roles', RoleController::class);
            Route::apiResource('permissions', PermissionController::class);
        });
    });
});
