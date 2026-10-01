<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Role::query()
            ->withCount('users')
            ->when($request->filled('search'), function ($builder) use ($request): void {
                $search = (string) $request->string('search');

                $builder->where(function ($nested) use ($search): void {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('name');

        $roles = $query->paginate((int) $request->integer('per_page', 15));

        $roles->getCollection()->transform(fn (Role $role): array => $this->present($role));

        return response()->json($roles);
    }

    public function show(Role $role): JsonResponse
    {
        $role->loadCount('users');

        return response()->json($this->present($role));
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = Role::query()->create([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
            'permissions' => $this->permissionsFrom($request),
        ]);

        $role->loadCount('users');

        return response()->json($this->present($role), 201);
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $validated = $request->validated();

        $role->fill([
            'name' => $validated['name'] ?? $role->name,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $role->description,
        ]);

        if ($request->exists('permission_ids') || $request->exists('permissions')) {
            $role->permissions = $this->permissionsFrom($request);
        }

        $role->save();
        $role->loadCount('users');

        return response()->json($this->present($role));
    }

    public function destroy(Role $role): JsonResponse
    {
        if ($role->users()->exists()) {
            return response()->json([
                'message' => 'Reassign users before deleting this role.',
            ], 422);
        }

        $role->delete();

        return response()->json(status: 204);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(Role $role): array
    {
        $keys = $role->permissionKeys();

        return [
            'id' => $role->id,
            'name' => $role->name,
            'label' => $role->name,
            'description' => $role->description,
            'permissions' => collect($keys)->map(fn (string $permission): array => [
                'id' => $permission,
                'name' => $permission,
                'label' => PermissionCatalog::label($permission),
            ])->values(),
            'users_count' => $role->users_count ?? $role->users()->count(),
            'permissions_count' => $role->hasFullAccess()
                ? count(PermissionCatalog::keys())
                : count($keys),
        ];
    }

    /**
     * @return list<string>
     */
    private function permissionsFrom(Request $request): array
    {
        /** @var array<int, string> $permissions */
        $permissions = $request->input('permission_ids', $request->input('permissions', []));
        $permissions = array_values(array_unique(array_filter($permissions)));

        if (in_array('*', $permissions, true)) {
            return ['*'];
        }

        return $permissions;
    }
}
