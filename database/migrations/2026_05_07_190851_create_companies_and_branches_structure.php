<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_path')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('address')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('code', 50)->nullable();
            $table->string('status')->default('active');
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'slug']);
            $table->index(['company_id', 'status']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('preferred_branch_id')->nullable()->after('company_id')->constrained('branches')->nullOnDelete();

            $table->index('company_id');
            $table->index('preferred_branch_id');
        });

        Schema::create('branch_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['branch_id', 'user_id']);
            $table->index(['user_id', 'branch_id']);
        });

        $timestamp = now();

        $companyId = DB::table('companies')->insertGetId([
            'name' => 'Default Company',
            'slug' => 'default-company',
            'settings' => json_encode(['currency' => 'USD']),
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);

        $branchId = DB::table('branches')->insertGetId([
            'company_id' => $companyId,
            'name' => 'Main Branch',
            'slug' => 'main-branch',
            'code' => 'MAIN',
            'status' => 'active',
            'settings' => json_encode([]),
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ]);

        DB::table('users')
            ->whereNull('company_id')
            ->update([
                'company_id' => $companyId,
                'preferred_branch_id' => $branchId,
            ]);

        $userIds = DB::table('users')->pluck('id');

        if ($userIds->isNotEmpty()) {
            $pivotRows = $userIds->map(fn ($userId) => [
                'branch_id' => $branchId,
                'user_id' => $userId,
                'is_primary' => true,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ])->all();

            DB::table('branch_user')->insert($pivotRows);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_user');

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('preferred_branch_id');
            $table->dropConstrainedForeignId('company_id');
        });

        Schema::dropIfExists('branches');
        Schema::dropIfExists('companies');
    }
};
