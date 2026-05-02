<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RbacAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensure admins can reach protected user-management endpoints.
     */
    public function test_admin_user_can_access_admin_users_index(): void
    {
        Role::findOrCreate('Admin', 'web');
        $admin = User::factory()->create(['status' => 'active']);
        $admin->assignRole('Admin');

        $response = $this->actingAs($admin)->getJson('/admin/users');

        $response->assertOk();
    }

    /**
     * Ensure non-admin users are blocked from protected endpoints.
     */
    public function test_non_admin_user_cannot_access_admin_users_index(): void
    {
        $user = User::factory()->create(['status' => 'active']);

        $response = $this->actingAs($user)->getJson('/admin/users');

        $response->assertForbidden();
    }
}
