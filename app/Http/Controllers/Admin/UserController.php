<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Branch\ResolveBranchContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\AuditLog;
use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use App\Notifications\UserOnboardingNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct(private readonly ResolveBranchContext $resolveBranchContext) {}

    public function index(Request $request): JsonResponse
    {
        $context = $this->resolveBranchContext->resolve($request);

        $query = User::query()
            ->with(['roles:id,name', 'permissions:id,name', 'branches:id,name'])
            ->where('company_id', $request->user()?->company_id)
            ->whereHas('branches', fn ($builder) => $builder->whereIn('branches.id', $context['visible_branch_ids']))
            ->when($request->filled('search'), function ($builder) use ($request) {
                $search = (string) $request->string('search');

                $builder->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', (string) $request->string('status')))
            ->orderByDesc('id');

        $users = $query->paginate((int) $request->integer('per_page', 15));

        return response()->json($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $context = $this->resolveBranchContext->resolve($request);
        $companyId = $request->user()?->company_id ?? Company::query()->value('id');
        $branchIds = $this->normalizeBranchIds($request, $validated['branch_ids'] ?? null, $context);

        [$user, $temporaryPassword] = DB::transaction(function () use ($validated, $companyId, $branchIds): array {
            $temporaryPassword = blank($validated['password'] ?? null)
                ? Str::password(14)
                : null;

            $user = User::query()->create([
                'company_id' => $companyId,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'] ?? $temporaryPassword,
                'force_password_change' => true,
                'status' => $validated['status'] ?? 'active',
            ]);

            $user->syncBranches($branchIds);

            $primaryBranchId = array_key_first($branchIds);
            if ($primaryBranchId !== null) {
                $user->forceFill([
                    'preferred_branch_id' => $primaryBranchId,
                ])->save();
            }

            if (isset($validated['role_ids'])) {
                $user->syncRoles($validated['role_ids']);
            }

            if (isset($validated['permission_ids'])) {
                $user->syncPermissions($validated['permission_ids']);
            }

            return [$user->load(['roles:id,name', 'permissions:id,name', 'branches:id,name']), $temporaryPassword];
        });

        $user->notify(new UserOnboardingNotification($temporaryPassword));

        $this->logAudit($request, 'users.created', $user, null, $user->toArray());

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope(request(), $user);

        return response()->json($user->load(['roles:id,name', 'permissions:id,name', 'branches:id,name']));
    }

    public function logs(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $logs = AuditLog::query()
            ->with(['actor:id,name', 'branch:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('actor_id', $user->id)
                    ->orWhere(function ($nested) use ($user) {
                        $nested->where('auditable_id', $user->id)
                            ->where('auditable_type', User::class);
                    });
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('action', 'like', "%{$request->string('search')}%");
            })
            ->when($request->filled('action'), function ($query) use ($request) {
                $query->where('action', (string) $request->string('action'));
            })
            ->orderByDesc('created_at')
            ->paginate((int) $request->integer('per_page', 15));

        return response()->json($logs);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $validated = $request->validated();
        $context = $this->resolveBranchContext->resolve($request);
        $before = $user->load(['roles:id,name', 'permissions:id,name', 'branches:id,name'])->toArray();

        $updatedUser = DB::transaction(function () use ($validated, $user, $context, $request): User {
            $user->fill(Arr::only($validated, ['name', 'email', 'password']));

            if (! empty($validated['password'])) {
                $user->force_password_change = true;
            }

            if (array_key_exists('status', $validated)) {
                $user->status = $validated['status'];

                if ($validated['status'] !== 'suspended') {
                    $user->suspended_at = null;
                    $user->suspended_reason = null;
                } else {
                    $user->suspended_at = Carbon::now();
                    $user->suspended_reason = $validated['suspended_reason'] ?? 'Suspended by administrator';
                }
            }

            $user->save();

            if (isset($validated['role_ids'])) {
                $user->syncRoles($validated['role_ids']);
            }

            if (isset($validated['permission_ids'])) {
                $user->syncPermissions($validated['permission_ids']);
            }

            if (array_key_exists('branch_ids', $validated)) {
                $branchIds = $this->normalizeBranchIds($request, $validated['branch_ids'], $context);
                $user->syncBranches($branchIds);

                $primaryBranchId = array_key_first($branchIds);
                if ($primaryBranchId !== null) {
                    $user->forceFill([
                        'preferred_branch_id' => $primaryBranchId,
                    ])->save();
                }
            }

            return $user->load(['roles:id,name', 'permissions:id,name', 'branches:id,name']);
        });

        $this->logAudit($request, 'users.updated', $updatedUser, $before, $updatedUser->toArray());

        return response()->json($updatedUser);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $before = $user->toArray();
        User::query()->whereKey($user->id)->delete();

        $this->logAudit($request, 'users.deleted', $user, $before, null);

        return response()->json(status: 204);
    }

    public function activate(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $before = $user->toArray();

        $user->forceFill([
            'status' => 'active',
            'suspended_at' => null,
            'suspended_reason' => null,
        ])->save();

        $this->logAudit($request, 'users.activated', $user, $before, $user->toArray());

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name', 'branches:id,name']));
    }

    public function suspend(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        $before = $user->toArray();

        $user->forceFill([
            'status' => 'suspended',
            'suspended_at' => Carbon::now(),
            'suspended_reason' => $validated['reason'] ?? 'Suspended by administrator',
        ])->save();

        $this->logAudit($request, 'users.suspended', $user, $before, $user->toArray());

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name', 'branches:id,name']));
    }

    public function syncRoles(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $validated = $request->validate([
            'role_ids' => ['required', 'array'],
            'role_ids.*' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $before = $user->roles()->pluck('id')->all();
        $user->syncRoles($validated['role_ids']);

        $this->logAudit(
            $request,
            'users.roles_synced',
            $user,
            ['role_ids' => $before],
            ['role_ids' => $user->roles()->pluck('id')->all()]
        );

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name', 'branches:id,name']));
    }

    public function syncPermissions(Request $request, User $user): JsonResponse
    {
        $this->ensureUserIsVisibleInScope($request, $user);

        $validated = $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['required', 'integer', 'exists:permissions,id'],
        ]);

        $before = $user->permissions()->pluck('id')->all();
        $user->syncPermissions($validated['permission_ids']);

        $this->logAudit(
            $request,
            'users.permissions_synced',
            $user,
            ['permission_ids' => $before],
            ['permission_ids' => $user->permissions()->pluck('id')->all()]
        );

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name', 'branches:id,name']));
    }

    public function bulkForcePasswordChange(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['required', 'exists:users,id'],
        ]);

        $context = $this->resolveBranchContext->resolve($request);
        $currentCompanyId = $request->user()?->company_id;

        $users = User::query()
            ->whereIn('id', $validated['user_ids'])
            ->where('company_id', $currentCompanyId)
            ->whereHas('branches', fn ($builder) => $builder->whereIn('branches.id', $context['visible_branch_ids']))
            ->get();

        foreach ($users as $user) {
            $user->forceFill(['force_password_change' => true])->save();
            $this->logAudit($request, 'users.bulk_force_password_change', $user, null, ['force_password_change' => true]);
        }

        return response()->json(['message' => sprintf('Successfully forced password change for %d users.', $users->count())]);
    }

    private function logAudit(Request $request, string $action, User $subject, ?array $before, ?array $after): void
    {
        $context = $this->resolveBranchContext->resolve($request);

        AuditLog::query()->create([
            'actor_id' => $request->user()?->id,
            'branch_id' => $context['current_branch_id'],
            'action' => $action,
            'auditable_type' => User::class,
            'auditable_id' => $subject->id,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    /**
     * @param  array<int, int>|null  $requestedBranchIds
     * @param  array{allowed_branch_ids: array<int, int>, current_branch_id: int|null}  $context
     * @return array<int, array{is_primary: bool}>
     */
    private function normalizeBranchIds(Request $request, ?array $requestedBranchIds, array $context): array
    {
        $companyBranchIds = Branch::query()
            ->where('company_id', $request->user()?->company_id)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $requested = $requestedBranchIds === null || $requestedBranchIds === []
            ? ($context['current_branch_id'] ? [$context['current_branch_id']] : $companyBranchIds)
            : array_map('intval', $requestedBranchIds);

        $requested = array_values(array_unique($requested));
        $filtered = array_values(array_filter($requested, fn ($branchId) => in_array($branchId, $companyBranchIds, true)));

        if ($filtered === []) {
            $fallbackId = $context['current_branch_id'] ?? ($companyBranchIds[0] ?? Branch::query()->value('id'));
            $filtered = $fallbackId ? [(int) $fallbackId] : [];
        }

        return collect($filtered)
            ->values()
            ->mapWithKeys(fn ($branchId, $index) => [
                $branchId => ['is_primary' => $index === 0],
            ])
            ->all();
    }

    private function ensureUserIsVisibleInScope(Request $request, User $user): void
    {
        $context = $this->resolveBranchContext->resolve($request);
        $currentCompanyId = $request->user()?->company_id;

        $isVisible = $user->company_id === $currentCompanyId
            && $user->branches()
                ->whereIn('branches.id', $context['visible_branch_ids'])
                ->exists();

        abort_unless($isVisible, 404);
    }
}
