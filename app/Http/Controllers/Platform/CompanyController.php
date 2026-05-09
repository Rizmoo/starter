<?php

namespace App\Http\Controllers\Platform;

use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $companies = Company::query()
            ->when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->withCount('users')
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Company $company) => [
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'email' => $company->email,
                'status' => $company->status,
                'users_count' => $company->users_count,
                'logo_url' => $company->logo_url,
                'created_at' => $company->created_at->toDateString(),
            ]);

        return Inertia::render('Platform/Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Company $company): Response
    {
        $company->load('users');

        return Inertia::render('Platform/Companies/Show', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $company->address,
                'status' => $company->status,
                'logo_url' => $company->logo_url,
                'created_at' => $company->created_at->toDateString(),
                'users_count' => $company->users->count(),
            ],
        ]);
    }

    public function activate(Company $company): RedirectResponse
    {
        $company->update(['status' => 'active']);

        return back()->with('success', "{$company->name} has been activated.");
    }

    public function suspend(Company $company): RedirectResponse
    {
        $company->update(['status' => 'suspended']);

        return back()->with('success', "{$company->name} has been suspended.");
    }

    public function block(Company $company): RedirectResponse
    {
        $company->update(['status' => 'blocked']);

        return back()->with('success', "{$company->name} has been blocked.");
    }

    public function unblock(Company $company): RedirectResponse
    {
        $company->update(['status' => 'active']);

        return back()->with('success', "{$company->name} has been unblocked.");
    }
}
