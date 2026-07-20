<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Notifications\UserOnboardingNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class UserOnboardingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_user_without_password_and_onboarding_notification_is_sent(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'status' => 'active',
            'force_password_change' => false,
            'role' => 'Admin',
        ]);

        $response = $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'Onboarded User',
            'email' => 'onboarded@example.com',
            'status' => 'active',
        ]);

        $response->assertCreated();

        $createdUser = User::query()->where('email', 'onboarded@example.com')->firstOrFail();

        $this->assertTrue($createdUser->force_password_change);
        $this->assertNotEmpty($createdUser->password);
        $this->assertFalse(Hash::check('', $createdUser->password));

        Notification::assertSentTo($createdUser, UserOnboardingNotification::class);
    }

    public function test_user_with_force_password_change_is_redirected_to_settings(): void
    {
        $user = User::factory()->create([
            'status' => 'active',
            'force_password_change' => true,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect('/settings');
    }

    public function test_force_password_change_is_cleared_after_password_update(): void
    {
        $user = User::factory()->create([
            'status' => 'active',
            'force_password_change' => true,
        ]);

        $response = $this->actingAs($user)->put('/user/password', [
            'current_password' => 'password',
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertFalse($user->fresh()->force_password_change);
    }
}
