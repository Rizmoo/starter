<?php

namespace App\Http\Controllers\Platform;

use App\Models\Company;
use App\Models\User;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_companies' => Company::count(),
            'active_companies' => Company::where('status', 'active')->count(),
            'suspended_companies' => Company::where('status', 'suspended')->count(),
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
        ];

        $recentCompanies = Company::latest()
            ->take(5)
            ->get()
            ->map(fn (Company $company) => [
                'id' => $company->id,
                'name' => $company->name,
                'status' => $company->status,
                'created_at' => $company->created_at->diffForHumans(),
            ]);

        return Inertia::render('Platform/Dashboard', [
            'stats' => $stats,
            'recent_companies' => $recentCompanies,
        ]);
    }
}
