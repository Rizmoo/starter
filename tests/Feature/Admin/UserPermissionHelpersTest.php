<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPermissionHelpersTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalize_permissions_accepts_arrays_and_json_strings(): void
    {
        $this->assertSame(['users.view'], User::normalizePermissions(['users.view', 'users.view', '']));
        $this->assertSame(['users.view'], User::normalizePermissions('["users.view"]'));
        $this->assertSame([], User::normalizePermissions('not-json'));
        $this->assertSame([], User::normalizePermissions(null));
    }

    public function test_wildcard_on_the_user_or_role_grants_full_access(): void
    {
        $fromUser = User::factory()->extraPermissions(['*'])->create();
        $fromRole = User::factory()->admin()->create();

        $this->assertTrue($fromUser->hasWildcardPermission());
        $this->assertTrue($fromUser->isAdmin());
        $this->assertTrue($fromUser->hasFullAccess());

        $this->assertTrue($fromRole->hasWildcardPermission());
        $this->assertTrue($fromRole->isAdmin());
        $this->assertContains('*', $fromRole->getAllPermissions());
    }

    public function test_named_admin_role_is_admin_without_wildcard(): void
    {
        $role = Role::factory()->create([
            'name' => 'Administrator',
            'permissions' => ['users.view'],
        ]);

        $user = User::factory()->create([
            'role_id' => $role->id,
        ]);

        $this->assertTrue($user->isAdmin());
        $this->assertTrue($user->is_admin);
        $this->assertFalse($user->hasWildcardPermission());
        $this->assertFalse($user->hasPermissionTo('roles.view'));
    }

    public function test_get_all_permissions_merges_role_and_user_grants(): void
    {
        $user = User::factory()
            ->withPermissions(['notifications.view'])
            ->extraPermissions(['users.view'])
            ->create([
                'status' => 'active',
            ]);

        $this->assertEqualsCanonicalizing(
            ['notifications.view', 'users.view'],
            $user->getAllPermissions(),
        );
        $this->assertTrue($user->hasPermissionTo('users.view'));
        $this->assertFalse($user->hasWildcardPermission());

        $this->actingAs($user)
            ->getJson('/admin/users')
            ->assertOk();
    }

    public function test_user_level_wildcard_can_access_admin_endpoints(): void
    {
        $user = User::factory()->extraPermissions(['*'])->create([
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->getJson('/admin/users')
            ->assertOk();
    }

    public function test_admin_can_sync_extra_user_permissions(): void
    {
        $admin = User::factory()->admin()->create([
            'status' => 'active',
        ]);
        $user = User::factory()->create([
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->putJson("/admin/users/{$user->id}/permissions", [
                'permissions' => ['users.view', 'notifications.view'],
            ])
            ->assertOk()
            ->assertJsonPath('permissions.0', 'users.view');

        $user->refresh();

        $this->assertEqualsCanonicalizing(
            ['users.view', 'notifications.view'],
            $user->permissions,
        );
        $this->assertTrue($user->hasPermissionTo('users.view'));
    }
}
