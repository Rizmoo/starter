<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class BranchManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_branches_for_own_company_only(): void
    {
        $admin = $this->makeAdminUser();

        $visibleBranch = Branch::query()->create([
            'company_id' => $admin->company_id,
            'name' => 'North Hub',
            'slug' => 'north-hub',
            'code' => 'NH',
            'status' => 'active',
        ]);

        $otherCompany = Company::query()->create([
            'name' => 'Other Company',
            'slug' => 'other-company',
        ]);

        Branch::query()->create([
            'company_id' => $otherCompany->id,
            'name' => 'Hidden Branch',
            'slug' => 'hidden-branch',
            'code' => 'HID',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->getJson('/admin/branches');

        $response->assertOk();
        $response->assertJsonPath('data.0.company_id', $admin->company_id);
        $response->assertJsonFragment(['id' => $visibleBranch->id]);
        $response->assertJsonMissing(['name' => 'Hidden Branch']);
    }

    public function test_admin_can_create_branch(): void
    {
        $admin = $this->makeAdminUser();

        $response = $this->actingAs($admin)->postJson('/admin/branches', [
            'name' => 'West Office',
            'slug' => 'west-office',
            'code' => 'WEST',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('branches', [
            'company_id' => $admin->company_id,
            'name' => 'West Office',
            'slug' => 'west-office',
            'code' => 'WEST',
            'status' => 'active',
        ]);
    }

    private function makeAdminUser(): User
    {
        $user = User::factory()->create();
        assert($user instanceof User);

        $adminRole = Role::query()->firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        $user->assignRole($adminRole);

        return $user;
    }
}
