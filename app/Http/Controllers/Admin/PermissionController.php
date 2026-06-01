<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $permissions = collect(User::getAllPermissions())
            ->map(function ($permission) {
                return [
                    'id' => $permission,
                    'name' => $permission,
                ];
            })
            ->when($request->filled('search'), function ($collection) use ($request) {
                $search = strtolower((string) $request->string('search'));

                return $collection->filter(fn ($perm) => str_contains(strtolower($perm['name']), $search));
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
        $allPermissions = User::getAllPermissions();

        if (! in_array($permission, $allPermissions, true)) {
            abort(404, 'Permission not found');
        }

        return response()->json([
            'id' => $permission,
            'name' => $permission,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are now file-based. Please edit config/roles.php to add new permissions.',
        ], 422);
    }

    public function update(Request $request, string $permission): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are now file-based. Please edit config/roles.php to modify permissions.',
        ], 422);
    }

    public function destroy(Request $request, string $permission): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are now file-based. Please edit config/roles.php to remove permissions.',
        ], 422);
    }
}
