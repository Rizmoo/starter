<?php

namespace App\Http\Middleware;

use App\Actions\Branch\ResolveBranchContext;
use App\Models\PlatformAdmin;
use App\Models\User;
use App\Services\ModuleManager;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user('platform') ?: $request->user();
        $branchContext = app(ResolveBranchContext::class)->resolve($request);

        $notifications = [];
        $unreadCount = 0;
        $userBranches = [];
        $currentBranch = null;
        $company = null;

        if ($user && $user instanceof User) {
            $unreadCount = $user->unreadNotifications()->count();
            $notifications = $user->notifications()
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($n) => [
                    'id' => $n->id,
                    'data' => $n->data,
                    'read_at' => $n->read_at,
                    'created_at' => $n->created_at->diffForHumans(),
                ]);

            $companyModel = $user->company;
            $company = $companyModel ? [
                'id' => $companyModel->id,
                'name' => $companyModel->name,
                'slug' => $companyModel->slug,
                'logo_path' => $companyModel->logo_path,
                'logo_url' => $companyModel->logo_url,
                'email' => $companyModel->email,
                'phone' => $companyModel->phone,
                'address' => $companyModel->address,
                'settings' => $companyModel->settings,
            ] : null;

            $userBranches = $user->branches()
                ->select(['branches.id', 'branches.name', 'branches.slug', 'branches.code', 'branches.status'])
                ->orderBy('branches.name')
                ->get()
                ->map(fn ($branch) => [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'slug' => $branch->slug,
                    'code' => $branch->code,
                    'status' => $branch->status,
                    'is_primary' => (bool) $branch->pivot?->is_primary,
                ])
                ->values();

            $currentBranch = $userBranches->firstWhere('id', $branchContext['current_branch_id']);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_picture_url' => $user instanceof User ? $user->profile_picture_url : null,
                    'company_id' => $user instanceof User ? $user->company_id : null,
                    'preferred_branch_id' => $user instanceof User ? $user->preferred_branch_id : null,
                    'status' => $user instanceof User ? $user->status : 'active',
                    'roles' => $user instanceof User ? ($user->role ? [$user->role] : []) : ['Platform Admin'],
                    'permissions' => $user instanceof User ? $user->getPermissions() : [],
                ] : null,
                'is_platform_admin' => $user instanceof PlatformAdmin,
            ],
            'company' => $company,
            'branch_context' => [
                'mode' => $branchContext['mode'],
                'current_branch_id' => $branchContext['current_branch_id'],
                'current_branch' => $currentBranch,
                'branches' => $userBranches,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'message' => $request->session()->get('message'),
            ],
            'notifications' => [
                'items' => $notifications,
                'unread_count' => $unreadCount,
            ],
            'modules' => [
                'enabled' => app(ModuleManager::class)->enabled(),
                'nav' => app(ModuleManager::class)->enabledNavItems(),
            ],
        ];
    }
}
