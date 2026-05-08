<?php

namespace App\Actions\Fortify;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        $company = Company::query()->firstOrCreate(
            ['slug' => 'default-company'],
            ['name' => 'Default Company', 'settings' => ['currency' => 'USD']]
        );

        $defaultBranch = Branch::query()->firstOrCreate(
            ['company_id' => $company->id, 'slug' => 'main-branch'],
            ['name' => 'Main Branch', 'code' => 'MAIN', 'status' => 'active', 'settings' => []]
        );

        $user = User::create([
            'company_id' => $company->id,
            'preferred_branch_id' => $defaultBranch->id,
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        $user->branches()->syncWithoutDetaching([
            $defaultBranch->id => ['is_primary' => true],
        ]);

        return $user;
    }
}
