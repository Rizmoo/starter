<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_can_access_admin_users_index(): void
    {
        $admin = User::factory()->admin()->create([
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->getJson('/admin/users')
            ->assertOk();
    }

    public function test_user_without_users_view_cannot_access_admin_users_index(): void
    {
        $user = User::factory()->withPermissions(['notifications.view'])->create([
            'status' => 'active',
        ]);

        $this->assertFalse($user->hasFullAccess());
        $this->assertFalse($user->hasPermissionTo('users.view'));

        $this->actingAs($user)
            ->getJson('/admin/users')
            ->assertForbidden();
    }

    public function test_users_manage_permission_grants_users_view(): void
    {
        $user = User::factory()->withPermissions(['users.manage'])->create([
            'status' => 'active',
        ]);

        $this->assertTrue($user->hasPermissionTo('users.view'));

        $this->actingAs($user)
            ->getJson('/admin/users')
            ->assertOk();
    }
}
