<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role_id' => null,
            'permissions' => null,
            'status' => 'active',
            'force_password_change' => false,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes): array => [
            'role_id' => Role::firstOrCreateAdmin()->id,
        ]);
    }

    /**
     * @param  list<string>  $permissions
     */
    public function withPermissions(array $permissions): static
    {
        return $this->state(fn (array $attributes): array => [
            'role_id' => Role::factory()->create([
                'permissions' => $permissions,
            ])->id,
        ]);
    }

    /**
     * Extra grants stored on the user, merged with the role.
     *
     * @param  list<string>  $permissions
     */
    public function extraPermissions(array $permissions): static
    {
        return $this->state(fn (array $attributes): array => [
            'permissions' => $permissions,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }
}
