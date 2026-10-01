<?php

namespace App\Traits;

use App\Models\Role;
use App\Support\PermissionCatalog;

/**
 * @property-read Role|null $role
 *
 * @method list<string> getAllPermissions()
 * @method bool hasWildcardPermission()
 */
trait HasRoles
{
    /**
     * @return list<string>
     */
    public function getPermissions(): array
    {
        return $this->getAllPermissions();
    }

    public function hasFullAccess(): bool
    {
        return $this->hasWildcardPermission();
    }

    /**
     * @param  string|array<int, string>  $permissions
     */
    public function hasPermissionTo(string|array $permissions): bool
    {
        $granted = $this->getPermissions();

        if (is_string($permissions)) {
            return PermissionCatalog::allows($granted, $permissions);
        }

        foreach ($permissions as $permission) {
            if (PermissionCatalog::allows($granted, $permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<int, string>  $permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (! $this->hasPermissionTo($permission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  string|array<int, string>  $roles
     */
    public function hasRole(string|array $roles): bool
    {
        $name = $this->role?->name;

        if ($name === null) {
            return false;
        }

        if (is_string($roles)) {
            return $name === $roles;
        }

        return in_array($name, $roles, true);
    }

    /**
     * @param  array<int, string>  $roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->hasRole($roles);
    }

    public function assignRole(Role|string|int $role): void
    {
        $this->forceFill([
            'role_id' => $this->resolveRoleId($role),
        ])->save();
    }

    public function removeRole(): void
    {
        $this->forceFill(['role_id' => null])->save();
    }

    /**
     * @param  Role|string|int|array<int, Role|string|int>  $roles
     */
    public function syncRoles(Role|string|int|array $roles): void
    {
        $role = is_array($roles) ? ($roles[0] ?? null) : $roles;

        if ($role === null) {
            $this->removeRole();

            return;
        }

        $this->assignRole($role);
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public function getRolesAttribute(): array
    {
        if (! $this->role) {
            return [];
        }

        return [
            [
                'id' => $this->role->id,
                'name' => $this->role->name,
            ],
        ];
    }

    private function resolveRoleId(Role|string|int $role): int
    {
        if ($role instanceof Role) {
            return $role->id;
        }

        if (is_int($role) || ctype_digit((string) $role)) {
            return (int) $role;
        }

        return Role::query()->where('name', $role)->firstOrFail()->id;
    }
}
