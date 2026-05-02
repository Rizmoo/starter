<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * @var list<string>
     */
    private array $protectedRoles = ['Admin'];

    public function index(Request $request): JsonResponse
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->withCount(['users', 'permissions'])
            ->when($request->filled('search'), fn ($builder) => $builder->where('name', 'like', '%'.$request->string('search').'%'))
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->paginate((int) $request->integer('per_page', 20));

        return response()->json($roles);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $role = DB::transaction(function () use ($validated): Role {
            $role = Role::query()->create([
                'name' => $validated['name'],
                'guard_name' => 'web',
            ]);

            if (isset($validated['permission_ids'])) {
                $role->syncPermissions($validated['permission_ids']);
            }

            return $role->load('permissions:id,name');
        });

        $this->logAudit($request, 'roles.created', $role, null, $role->toArray());

        return response()->json($role, 201);
    }

    public function show(Role $role): JsonResponse
    {
        return response()->json(
            $role->load('permissions:id,name')->loadCount(['users', 'permissions'])
        );
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $validated = $request->validated();
        $before = $role->load('permissions:id,name')->toArray();

        $updatedRole = DB::transaction(function () use ($validated, $role): Role {
            if (isset($validated['name'])) {
                $role->name = $validated['name'];
                $role->save();
            }

            if (isset($validated['permission_ids'])) {
                $role->syncPermissions($validated['permission_ids']);
            }

            return $role->load('permissions:id,name');
        });

        $this->logAudit($request, 'roles.updated', $updatedRole, $before, $updatedRole->toArray());

        return response()->json($updatedRole);
    }

    public function destroy(Request $request, Role $role): JsonResponse
    {
        if (in_array($role->name, $this->protectedRoles, true)) {
            return response()->json([
                'message' => 'This role is protected and cannot be deleted.',
            ], 422);
        }

        $before = $role->toArray();
        $role->delete();

        $this->logAudit($request, 'roles.deleted', $role, $before, null);

        return response()->json(status: 204);
    }

    private function logAudit(Request $request, string $action, Role $subject, ?array $before, ?array $after): void
    {
        AuditLog::query()->create([
            'actor_id' => $request->user()?->id,
            'action' => $action,
            'auditable_type' => Role::class,
            'auditable_id' => $subject->id,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
