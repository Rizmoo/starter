<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\UserOnboardingNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->with(['roles:id,name', 'permissions:id,name'])
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

        [$user, $temporaryPassword] = DB::transaction(function () use ($validated): array {
            $temporaryPassword = blank($validated['password'] ?? null)
                ? Str::password(14)
                : null;

            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'] ?? $temporaryPassword,
                'force_password_change' => true,
                'status' => $validated['status'] ?? 'active',
            ]);

            if (isset($validated['role_ids'])) {
                $user->syncRoles($validated['role_ids']);
            }

            if (isset($validated['permission_ids'])) {
                $user->syncPermissions($validated['permission_ids']);
            }

            return [$user->load(['roles:id,name', 'permissions:id,name']), $temporaryPassword];
        });

        $user->notify(new UserOnboardingNotification($temporaryPassword));

        $this->logAudit($request, 'users.created', $user, null, $user->toArray());

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load(['roles:id,name', 'permissions:id,name']));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();
        $before = $user->load(['roles:id,name', 'permissions:id,name'])->toArray();

        $updatedUser = DB::transaction(function () use ($validated, $user): User {
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

            return $user->load(['roles:id,name', 'permissions:id,name']);
        });

        $this->logAudit($request, 'users.updated', $updatedUser, $before, $updatedUser->toArray());

        return response()->json($updatedUser);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $before = $user->toArray();
        $user->delete();

        $this->logAudit($request, 'users.deleted', $user, $before, null);

        return response()->json(status: 204);
    }

    public function activate(Request $request, User $user): JsonResponse
    {
        $before = $user->toArray();

        $user->forceFill([
            'status' => 'active',
            'suspended_at' => null,
            'suspended_reason' => null,
        ])->save();

        $this->logAudit($request, 'users.activated', $user, $before, $user->toArray());

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name']));
    }

    public function suspend(Request $request, User $user): JsonResponse
    {
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

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name']));
    }

    public function syncRoles(Request $request, User $user): JsonResponse
    {
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

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name']));
    }

    public function syncPermissions(Request $request, User $user): JsonResponse
    {
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

        return response()->json($user->fresh(['roles:id,name', 'permissions:id,name']));
    }

    private function logAudit(Request $request, string $action, User $subject, ?array $before, ?array $after): void
    {
        AuditLog::query()->create([
            'actor_id' => $request->user()?->id,
            'action' => $action,
            'auditable_type' => User::class,
            'auditable_id' => $subject->id,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
