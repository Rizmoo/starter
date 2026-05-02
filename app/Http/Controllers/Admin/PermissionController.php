<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StorePermissionRequest;
use App\Http\Requests\Admin\UpdatePermissionRequest;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * @var list<string>
     */
    private array $protectedPermissions = ['users.view'];

    public function index(Request $request): JsonResponse
    {
        $permissions = Permission::query()
            ->withCount(['roles', 'users'])
            ->when($request->filled('search'), fn ($builder) => $builder->where('name', 'like', '%'.$request->string('search').'%'))
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->paginate((int) $request->integer('per_page', 30));

        return response()->json($permissions);
    }

    public function store(StorePermissionRequest $request): JsonResponse
    {
        $permission = Permission::query()->create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        $this->logAudit($request, 'permissions.created', $permission, null, $permission->toArray());

        return response()->json($permission, 201);
    }

    public function show(Permission $permission): JsonResponse
    {
        return response()->json(
            $permission->loadCount(['roles', 'users'])
        );
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): JsonResponse
    {
        $before = $permission->toArray();

        $permission->fill([
            'name' => $request->validated('name', $permission->name),
        ])->save();

        $this->logAudit($request, 'permissions.updated', $permission, $before, $permission->toArray());

        return response()->json($permission);
    }

    public function destroy(Request $request, Permission $permission): JsonResponse
    {
        if (in_array($permission->name, $this->protectedPermissions, true)) {
            return response()->json([
                'message' => 'This permission is protected and cannot be deleted.',
            ], 422);
        }

        $before = $permission->toArray();
        $permission->delete();

        $this->logAudit($request, 'permissions.deleted', $permission, $before, null);

        return response()->json(status: 204);
    }

    private function logAudit(Request $request, string $action, Permission $subject, ?array $before, ?array $after): void
    {
        AuditLog::query()->create([
            'actor_id' => $request->user()?->id,
            'action' => $action,
            'auditable_type' => Permission::class,
            'auditable_id' => $subject->id,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
