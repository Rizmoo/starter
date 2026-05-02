<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiKeyManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_api_key_settings_page(): void
    {
        $user = User::factory()->create();
        assert($user instanceof User);

        $response = $this->actingAs($user)->get('/settings/api-keys');

        $response->assertStatus(200);
        $response->assertViewIs('app');
    }

    public function test_authenticated_user_can_create_api_key(): void
    {
        $user = User::factory()->create();
        assert($user instanceof User);

        $response = $this->actingAs($user)->post('/settings/api-keys', [
            'name' => 'Postman Integration',
        ]);

        $response->assertRedirect('/settings/api-keys');
        $response->assertSessionHas('apiKeyPlainTextToken');

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
            'name' => 'Postman Integration',
        ]);
    }

    public function test_authenticated_user_can_revoke_own_api_key(): void
    {
        $user = User::factory()->create();
        assert($user instanceof User);

        $token = $user->createToken('Accounting Connector')->accessToken;

        $response = $this->actingAs($user)->delete("/settings/api-keys/{$token->id}");

        $response->assertRedirect('/settings/api-keys');

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $token->id,
        ]);
    }

    public function test_user_cannot_revoke_another_users_api_key(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        assert($user instanceof User);
        assert($otherUser instanceof User);

        $otherToken = $otherUser->createToken('Private Integration')->accessToken;

        $response = $this->actingAs($user)->delete("/settings/api-keys/{$otherToken->id}");

        $response->assertNotFound();

        $this->assertDatabaseHas('personal_access_tokens', [
            'id' => $otherToken->id,
            'tokenable_id' => $otherUser->id,
        ]);
    }
}
