<?php

namespace App\Models;

use App\Support\PermissionCatalog;
use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'permissions'])]
class Role extends Model
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return list<string>
     */
    public function permissionKeys(): array
    {
        return PermissionCatalog::normalize($this->permissions);
    }

    public function hasFullAccess(): bool
    {
        return in_array('*', $this->permissionKeys(), true);
    }

    public function hasPermission(string $permission): bool
    {
        return PermissionCatalog::allows($this->permissionKeys(), $permission);
    }

    public static function firstOrCreateAdmin(): self
    {
        return static::query()->firstOrCreate(
            ['name' => 'Admin'],
            [
                'description' => 'Full access to all features',
                'permissions' => ['*'],
            ],
        );
    }
}
