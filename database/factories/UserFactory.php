<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Company;
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

    public function configure(): static
    {
        return $this->afterCreating(function (User $user): void {
            $company = Company::query()->firstOrCreate(
                ['slug' => 'default-company'],
                ['name' => 'Default Company', 'settings' => ['currency' => 'USD']]
            );

            $branch = Branch::query()->firstOrCreate(
                ['company_id' => $company->id, 'slug' => 'main-branch'],
                ['name' => 'Main Branch', 'code' => 'MAIN', 'status' => 'active', 'settings' => []]
            );

            if ($user->company_id !== $company->id || $user->preferred_branch_id !== $branch->id) {
                $user->forceFill([
                    'company_id' => $company->id,
                    'preferred_branch_id' => $branch->id,
                ])->save();
            }

            $user->syncBranches([
                $branch->id => ['is_primary' => true],
            ]);
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => null,
            'preferred_branch_id' => null,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
