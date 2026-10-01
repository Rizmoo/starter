<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $roles = Role::query()->withCount('users')->get();

        $permissions = collect(PermissionCatalog::all())
            ->map(function (string $label, string $key) use ($roles): array {
                $matchingRoles = $roles->filter(fn (Role $role): bool => $role->hasPermission($key));

                return [
                    'id' => $key,
                    'name' => $key,
                    'label' => $label,
                    'roles_count' => $matchingRoles->count(),
                    'users_count' => $matchingRoles->sum('users_count'),
                ];
            })
            ->when($request->filled('search'), function ($collection) use ($request) {
                $search = strtolower((string) $request->string('search'));

                return $collection->filter(fn (array $permission): bool => str_contains(strtolower($permission['name']), $search)
                    || str_contains(strtolower($permission['label']), $search));
            })
            ->sortBy('name')
            ->values();

        return response()->json([
            'data' => $permissions,
            'current_page' => 1,
            'per_page' => $permissions->count(),
            'total' => $permissions->count(),
        ]);
    }

    public function show(string $permission): JsonResponse
    {
        if (! PermissionCatalog::exists($permission)) {
            abort(404, 'Permission not found');
        }

        return response()->json([
            'id' => $permission,
            'name' => $permission,
            'label' => PermissionCatalog::label($permission),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are defined in config/permissions.php.',
        ], 422);
    }

    public function update(Request $request, string $permission): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are defined in config/permissions.php.',
        ], 422);
    }

    public function destroy(Request $request, string $permission): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are defined in config/permissions.php.',
        ], 422);
    }
}
