<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\UserOnboardingNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
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

        [$user, $temporaryPassword] = DB::transaction(function () use ($validated, $request): array {
            $temporaryPassword = blank($validated['password'] ?? null)
                ? Str::password(14)
                : null;

            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'] ?? null,
                'password' => $validated['password'] ?? $temporaryPassword,
                'force_password_change' => true,
                'status' => $validated['status'] ?? 'active',
                'role' => $validated['role'] ?? config('roles.default_role', 'Viewer'),
            ]);

            if ($request->hasFile('profile_picture')) {
                $user->profile_picture_path = $request->file('profile_picture')->store('profiles', 'public');
                $user->save();
            }

            return [$user, $temporaryPassword];
        });

        $user->notify(new UserOnboardingNotification($temporaryPassword));

        $this->logAudit($request, 'users.created', $user, null, $user->toArray());

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    public function logs(Request $request, User $user): JsonResponse
    {
        $logs = AuditLog::query()
            ->with(['actor:id,name'])
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

    public function exportLogs(Request $request, User $user): StreamedResponse
    {
        $logs = AuditLog::query()
            ->with(['actor:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('actor_id', $user->id)
                    ->orWhere(function ($nested) use ($user) {
                        $nested->where('auditable_id', $user->id)
                            ->where('auditable_type', User::class);
                    });
            })
            ->orderByDesc('created_at')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"user-{$user->id}-activity-log.csv\"",
        ];

        return response()->stream(function () use ($logs) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Timestamp (UTC)', 'Action', 'Actor', 'IP Address', 'User Agent']);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->created_at->toDateTimeString(),
                    $log->action,
                    $log->actor->name ?? 'System',
                    $log->ip_address,
                    $log->user_agent,
                ]);
            }

            fclose($file);
        }, 200, $headers);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();
        $before = $user->toArray();

        $updatedUser = DB::transaction(function () use ($validated, $user, $request): User {
            $user->fill(Arr::only($validated, ['name', 'email', 'password', 'phone_number', 'role']));

            if ($request->hasFile('profile_picture')) {
                if ($user->profile_picture_path) {
                    Storage::disk('public')->delete($user->profile_picture_path);
                }
                $user->profile_picture_path = $request->file('profile_picture')->store('profiles', 'public');
            }

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

            return $user;
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
        User::query()->whereKey($user->id)->delete();

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

        return response()->json($user->fresh());
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

        return response()->json($user->fresh());
    }

    public function syncRoles(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(array_keys(config('roles.roles', [])))],
        ]);

        $before = ['role' => $user->role];
        $user->syncRoles($validated['role']);

        $this->logAudit(
            $request,
            'users.roles_synced',
            $user,
            $before,
            ['role' => $user->role]
        );

        return response()->json($user->fresh());
    }

    public function syncPermissions(Request $request, User $user): JsonResponse
    {
        return response()->json([
            'message' => 'Permissions are role-based. Assign a role instead.',
        ], 422);
    }

    public function bulkForcePasswordChange(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['required', 'exists:users,id'],
        ]);

        $users = User::query()
            ->whereIn('id', $validated['user_ids'])
            ->get();

        foreach ($users as $user) {
            $user->forceFill(['force_password_change' => true])->save();
            $this->logAudit($request, 'users.bulk_force_password_change', $user, null, ['force_password_change' => true]);
        }

        return response()->json(['message' => sprintf('Successfully forced password change for %d users.', $users->count())]);
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
