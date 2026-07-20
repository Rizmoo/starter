<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * @var list<string>
     */
    private array $protectedRoles;

    public function __construct()
    {
        $this->protectedRoles = config('roles.protected_roles', ['Admin']);
    }

    public function index(Request $request): JsonResponse
    {
        $roles = collect(config('roles.roles', []))
            ->map(function ($roleData, $roleName) {
                $usersCount = User::query()
                    ->where('role', $roleName)
                    ->count();

                return [
                    'id' => $roleName,
                    'name' => $roleName,
                    'label' => $roleData['label'] ?? $roleName,
                    'description' => $roleData['description'] ?? null,
                    'permissions' => collect($roleData['permissions'] ?? [])->map(fn ($permission) => [
                        'id' => $permission,
                        'name' => $permission,
                    ])->values(),
                    'users_count' => $usersCount,
                    'permissions_count' => count($roleData['permissions'] ?? []),
                ];
            })
            ->when($request->filled('search'), function ($collection) use ($request) {
                $search = strtolower((string) $request->string('search'));

                return $collection->filter(fn ($role) => str_contains(strtolower($role['name']), $search) ||
                    str_contains(strtolower($role['label']), $search));
            })
            ->sortBy('name')
            ->values();

        return response()->json([
            'data' => $roles,
            'current_page' => 1,
            'per_page' => $roles->count(),
            'total' => $roles->count(),
        ]);
    }

    public function show(string $role): JsonResponse
    {
        $roles = config('roles.roles', []);

        if (! isset($roles[$role])) {
            abort(404, 'Role not found');
        }

        $roleData = $roles[$role];
        $usersCount = User::query()->where('role', $role)->count();

        return response()->json([
            'id' => $role,
            'name' => $role,
            'label' => $roleData['label'] ?? $role,
            'description' => $roleData['description'] ?? null,
            'permissions' => collect($roleData['permissions'] ?? [])->map(fn ($permission) => [
                'id' => $permission,
                'name' => $permission,
            ])->values(),
            'users_count' => $usersCount,
            'permissions_count' => count($roleData['permissions'] ?? []),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Roles are now file-based. Please edit config/roles.php to add new roles.',
        ], 422);
    }

    public function update(Request $request, string $role): JsonResponse
    {
        return response()->json([
            'message' => 'Roles are now file-based. Please edit config/roles.php to modify roles.',
        ], 422);
    }

    public function destroy(Request $request, string $role): JsonResponse
    {
        return response()->json([
            'message' => 'Roles are now file-based. Please edit config/roles.php to remove roles.',
        ], 422);
    }
}
