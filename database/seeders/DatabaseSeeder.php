<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\GeneralNotification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.assign_roles',
            'users.assign_permissions',
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',
            'permissions.view',
            'permissions.create',
            'permissions.update',
            'permissions.delete',
            'audit_logs.view',
        ];

        foreach ($permissions as $permissionName) {
            Permission::findOrCreate($permissionName, 'web');
        }

        $adminRole = Role::findOrCreate('Admin', 'web');
        $managerRole = Role::findOrCreate('Manager', 'web');
        $viewerRole = Role::findOrCreate('Viewer', 'web');

        $adminRole->syncPermissions(Permission::query()->whereIn('name', $permissions)->where('guard_name', 'web')->get());
        $managerRole->syncPermissions(Permission::query()->whereIn('name', [
            'users.view',
            'users.create',
            'users.update',
            'roles.view',
            'permissions.view',
            'audit_logs.view',
        ])->where('guard_name', 'web')->get());
        $viewerRole->syncPermissions(Permission::query()->whereIn('name', [
            'users.view',
            'roles.view',
            'permissions.view',
            'audit_logs.view',
        ])->where('guard_name', 'web')->get());

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password'), 'status' => 'active']
        );

        $user->syncRoles([$adminRole->id]);

        // Seed sample notifications
        $samples = [
            ['title' => 'Welcome to the platform!', 'message' => 'Your account has been set up successfully. Explore the dashboard to get started.', 'type' => 'success'],
            ['title' => 'New user registered', 'message' => 'John Doe just signed up. Review their account in the users section.', 'type' => 'info'],
            ['title' => 'Server load warning', 'message' => 'CPU usage reached 85% in the last hour. Consider scaling up resources.', 'type' => 'warning'],
            ['title' => 'Payment failed', 'message' => 'A payment of $249.00 from Acme Corp could not be processed. Please review.', 'type' => 'error'],
            ['title' => 'Monthly report ready', 'message' => 'Your April 2026 analytics report is ready for download.', 'type' => 'info', 'action_url' => '/reports', 'action_label' => 'Download report'],
        ];

        foreach ($samples as $sample) {
            $user->notify(new GeneralNotification(
                title: $sample['title'],
                message: $sample['message'],
                type: $sample['type'],
                actionUrl: $sample['action_url'] ?? null,
                actionLabel: $sample['action_label'] ?? null,
            ));
        }

        // Mark the last two as already read
        $user->notifications()->latest()->skip(0)->take(2)->get()->each->markAsRead();
    }
}

