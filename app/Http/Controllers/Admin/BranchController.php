<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBranchRequest;
use App\Http\Requests\Admin\UpdateBranchRequest;
use App\Models\AuditLog;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BranchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $branches = Branch::query()
            ->where('company_id', $request->user()?->company_id)
            ->withCount('users')
            ->when($request->filled('search'), function ($builder) use ($request): void {
                $search = (string) $request->string('search');

                $builder->where(function ($nested) use ($search): void {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', (string) $request->string('status')))
            ->orderBy('name')
            ->paginate((int) $request->integer('per_page', 15));

        return response()->json($branches);
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $branch = DB::transaction(function () use ($request, $validated): Branch {
            return Branch::query()->create([
                'company_id' => $request->user()?->company_id,
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? Str::slug($validated['name']),
                'code' => $validated['code'] ?? null,
                'status' => $validated['status'] ?? 'active',
                'settings' => $validated['settings'] ?? [],
            ]);
        });

        $this->logAudit($request, 'branches.created', $branch, null, $branch->toArray());

        return response()->json($branch->loadCount('users'), 201);
    }

    public function show(Request $request, Branch $branch): JsonResponse
    {
        $this->ensureCompanyBranch($request, $branch);

        return response()->json($branch->loadCount('users'));
    }

    public function update(UpdateBranchRequest $request, Branch $branch): JsonResponse
    {
        $this->ensureCompanyBranch($request, $branch);
        $validated = $request->validated();
        $before = $branch->toArray();

        $updatedBranch = DB::transaction(function () use ($validated, $branch): Branch {
            if (isset($validated['name'])) {
                $branch->name = $validated['name'];
            }

            if (array_key_exists('slug', $validated)) {
                $branch->slug = $validated['slug'] ?: Str::slug($branch->name);
            }

            if (array_key_exists('code', $validated)) {
                $branch->code = $validated['code'];
            }

            if (isset($validated['status'])) {
                $branch->status = $validated['status'];
            }

            if (isset($validated['settings'])) {
                $branch->settings = $validated['settings'];
            }

            $branch->save();

            return $branch;
        });

        $this->logAudit($request, 'branches.updated', $updatedBranch, $before, $updatedBranch->toArray());

        return response()->json($updatedBranch->loadCount('users'));
    }

    public function destroy(Request $request, Branch $branch): JsonResponse
    {
        $this->ensureCompanyBranch($request, $branch);

        if ($branch->users()->exists()) {
            return response()->json([
                'message' => 'This branch still has assigned users and cannot be deleted.',
            ], 422);
        }

        $before = $branch->toArray();
        Branch::query()->whereKey($branch->id)->delete();

        $this->logAudit($request, 'branches.deleted', $branch, $before, null);

        return response()->json(status: 204);
    }

    public function activate(Request $request, Branch $branch): JsonResponse
    {
        $this->ensureCompanyBranch($request, $branch);
        $before = $branch->toArray();

        $branch->forceFill([
            'status' => 'active',
        ])->save();

        $this->logAudit($request, 'branches.activated', $branch, $before, $branch->toArray());

        return response()->json($branch->fresh()->loadCount('users'));
    }

    public function archive(Request $request, Branch $branch): JsonResponse
    {
        $this->ensureCompanyBranch($request, $branch);
        $before = $branch->toArray();

        $branch->forceFill([
            'status' => 'inactive',
        ])->save();

        $this->logAudit($request, 'branches.archived', $branch, $before, $branch->toArray());

        return response()->json($branch->fresh()->loadCount('users'));
    }

    private function ensureCompanyBranch(Request $request, Branch $branch): void
    {
        abort_unless($branch->company_id === $request->user()?->company_id, 404);
    }

    private function logAudit(Request $request, string $action, Branch $subject, ?array $before, ?array $after): void
    {
        AuditLog::query()->create([
            'actor_id' => $request->user()?->id,
            'branch_id' => $subject->id,
            'action' => $action,
            'auditable_type' => Branch::class,
            'auditable_id' => $subject->id,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
