<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationCreatesAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_self_registration_assigns_admin_role_with_wildcard_permission(): void
    {
        $response = $this->post('/register', [
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect('/dashboard');

        $user = User::query()->where('email', 'owner@example.com')->firstOrFail();

        $this->assertSame('Admin', $user->role?->name);
        $this->assertTrue($user->hasFullAccess());
        $this->assertTrue($user->hasPermissionTo('users.view'));
        $this->assertContains('*', $user->getPermissions());
        $this->assertTrue(Role::query()->where('name', 'Admin')->whereJsonContains('permissions', '*')->exists());
    }

    public function test_self_registration_assigns_admin_even_when_other_users_exist(): void
    {
        User::factory()->create();

        $this->post('/register', [
            'name' => 'Second Owner',
            'email' => 'second@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertRedirect('/dashboard');

        $user = User::query()->where('email', 'second@example.com')->firstOrFail();

        $this->assertSame('Admin', $user->role?->name);
        $this->assertTrue($user->hasFullAccess());
    }

    public function test_user_with_wildcard_permission_can_access_admin_endpoints(): void
    {
        $user = User::factory()->admin()->create([
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->getJson('/admin/users')
            ->assertOk();
    }

    public function test_admin_created_users_do_not_receive_wildcard_access(): void
    {
        Notification::fake();

        $admin = User::factory()->admin()->create([
            'status' => 'active',
        ]);

        $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'Invited User',
            'email' => 'invited@example.com',
            'status' => 'active',
        ])->assertCreated();

        $createdUser = User::query()->where('email', 'invited@example.com')->firstOrFail();

        $this->assertNull($createdUser->role_id);
        $this->assertFalse($createdUser->hasFullAccess());
    }
}
