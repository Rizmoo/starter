<?php

namespace App\Support;

final class PermissionCatalog
{
    /**
     * @return array<string, string>
     */
    public static function all(): array
    {
        /** @var array<string, string> $permissions */
        $permissions = config('permissions', []);

        return $permissions;
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_keys(self::all());
    }

    public static function exists(string $permission): bool
    {
        return array_key_exists($permission, self::all());
    }

    public static function label(string $permission): string
    {
        return self::all()[$permission] ?? $permission;
    }

    /**
     * @return list<string>
     */
    public static function normalize(mixed $permissions): array
    {
        if (is_string($permissions)) {
            $decoded = json_decode($permissions, true);
            $permissions = is_array($decoded) ? $decoded : [];
        }

        if (! is_array($permissions)) {
            return [];
        }

        return array_values(array_unique(array_filter(
            $permissions,
            fn (mixed $permission): bool => is_string($permission) && $permission !== '',
        )));
    }

    /**
     * @param  list<string>  $granted
     */
    public static function allows(array $granted, string $permission): bool
    {
        if (in_array('*', $granted, true) || in_array($permission, $granted, true)) {
            return true;
        }

        $segments = explode('.', $permission);
        array_pop($segments);

        $prefix = [];

        foreach ($segments as $segment) {
            $prefix[] = $segment;

            if (in_array(implode('.', $prefix).'.manage', $granted, true)) {
                return true;
            }
        }

        return false;
    }
}
