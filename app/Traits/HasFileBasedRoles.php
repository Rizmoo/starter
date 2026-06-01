<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

/**
 * @property string|null $role
 */
trait HasFileBasedRoles
{
    /**
     * Get all available roles from the config file.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getAllRoles(): array
    {
        return config('roles.roles', []);
    }

    /**
     * Get all available permissions from the config file.
     *
     * @return array<int, string>
     */
    public static function getAllPermissions(): array
    {
        $allPermissions = [];
        foreach (config('roles.roles', []) as $role => $data) {
            $allPermissions = array_merge($allPermissions, $data['permissions'] ?? []);
        }

        return array_values(array_unique($allPermissions));
    }

    /**
     * Check if user has a specific role.
     *
     * @param  string|array<int, string>  $roles
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            return $this->role === $roles;
        }

        return in_array($this->role, $roles, true);
    }

    /**
     * Check if user has any of the given roles.
     *
     * @param  array<int, string>  $roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->hasRole($roles);
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string $role): void
    {
        if ($this->isValidRole($role)) {
            $this->update(['role' => $role]);
        }
    }

    /**
     * Remove role from the user.
     */
    public function removeRole(): void
    {
        $this->update(['role' => null]);
    }

    /**
     * Sync the user's role (replaces the current role).
     */
    public function syncRoles(string|array $roles): void
    {
        $role = is_array($roles) ? ($roles[0] ?? null) : $roles;

        if ($role && $this->isValidRole($role)) {
            $this->update(['role' => $role]);
        }
    }

    /**
     * Get user's permissions based on their role.
     *
     * @return array<int, string>
     */
    public function getPermissions(): array
    {
        if (! $this->role) {
            return [];
        }

        $roles = config('roles.roles', []);

        return $roles[$this->role]['permissions'] ?? [];
    }

    /**
     * Check if user has a specific permission.
     *
     * @param  string|array<int, string>  $permissions
     */
    public function hasPermissionTo(string|array $permissions): bool
    {
        $userPermissions = $this->getPermissions();

        // Check for wildcard permission
        if (in_array('*', $userPermissions, true)) {
            return true;
        }

        if (is_string($permissions)) {
            return in_array($permissions, $userPermissions, true);
        }

        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has all given permissions.
     *
     * @param  array<int, string>  $permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        $userPermissions = $this->getPermissions();

        // Check for wildcard permission
        if (in_array('*', $userPermissions, true)) {
            return true;
        }

        foreach ($permissions as $permission) {
            if (! in_array($permission, $userPermissions, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the user's role relationship (for compatibility with Spatie).
     *
     * @return BelongsToMany
     */
    public function roles()
    {
        // Return a fake relationship for compatibility
        // Since we're using a single role column, we'll return empty collection
        return $this->belongsToMany(self::class, 'user_roles', 'user_id', 'role_id')->whereRaw('1 = 0');
    }

    /**
     * Get permissions relationship (for compatibility with Spatie).
     *
     * @return BelongsToMany
     */
    public function permissions()
    {
        // Return a fake relationship for compatibility
        return $this->belongsToMany(self::class, 'user_permissions', 'user_id', 'permission_id')->whereRaw('1 = 0');
    }

    /**
     * Check if a role exists in the config.
     */
    protected function isValidRole(string $role): bool
    {
        return array_key_exists($role, config('roles.roles', []));
    }

    /**
     * Get role name for API resources and display.
     */
    public function getRoleNameAttribute(): ?string
    {
        return $this->role;
    }

    /**
     * Get role label for display.
     */
    public function getRoleLabelAttribute(): ?string
    {
        if (! $this->role) {
            return null;
        }

        $roles = config('roles.roles', []);

        return $roles[$this->role]['label'] ?? $this->role;
    }

    /**
     * Get formatted roles for compatibility with Spatie's API.
     *
     * @return Collection
     */
    public function getRolesAttribute()
    {
        if (! $this->role) {
            return collect([]);
        }

        return collect([
            (object) [
                'id' => $this->role,
                'name' => $this->role,
            ],
        ]);
    }
}
