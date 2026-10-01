<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_role_with_json_permissions(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/admin/roles', [
            'name' => 'Supervisor',
            'description' => 'Can view users',
            'permission_ids' => ['users.view', 'users.update'],
        ]);

        $response->assertCreated()
            ->assertJsonPath('name', 'Supervisor')
            ->assertJsonPath('permissions.0.id', 'users.view');

        $role = Role::query()->where('name', 'Supervisor')->firstOrFail();

        $this->assertSame(['users.view', 'users.update'], $role->permissionKeys());
    }

    public function test_selecting_wildcard_stores_full_access_only(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->postJson('/admin/roles', [
            'name' => 'Owner',
            'permission_ids' => ['users.view', '*'],
        ])->assertCreated();

        $this->assertSame(['*'], Role::query()->where('name', 'Owner')->firstOrFail()->permissionKeys());
    }

    public function test_admin_can_update_role_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $role = Role::factory()->create([
            'name' => 'Staff',
            'permissions' => ['users.view'],
        ]);

        $this->actingAs($admin)->patchJson('/admin/roles/'.$role->id, [
            'permission_ids' => ['users.view', 'notifications.view'],
        ])->assertOk();

        $this->assertSame(
            ['users.view', 'notifications.view'],
            $role->fresh()->permissionKeys(),
        );
    }

    public function test_role_with_assigned_users_cannot_be_deleted(): void
    {
        $admin = User::factory()->admin()->create();
        $role = Role::factory()->create();
        User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($admin)
            ->deleteJson('/admin/roles/'.$role->id)
            ->assertUnprocessable();

        $this->assertModelExists($role);
    }

    public function test_unused_role_can_be_deleted(): void
    {
        $admin = User::factory()->admin()->create();
        $role = Role::factory()->create();

        $this->actingAs($admin)
            ->deleteJson('/admin/roles/'.$role->id)
            ->assertNoContent();

        $this->assertModelMissing($role);
    }

    public function test_permissions_are_read_from_config(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->getJson('/admin/permissions')
            ->assertOk()
            ->assertJsonFragment(['id' => 'users.view', 'label' => 'View users']);
    }

    public function test_permissions_cannot_be_mutated_via_the_api(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->postJson('/admin/permissions', ['name' => 'custom.permission'])
            ->assertUnprocessable();
    }
}
