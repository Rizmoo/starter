<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApiKeyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Sanctum\PersonalAccessToken;

class ApiKeyController extends Controller
{
    public function index(Request $request): Response
    {
        $tokens = $request->user()
            ->tokens()
            ->latest('id')
            ->get()
            ->map(fn (PersonalAccessToken $token): array => [
                'id' => $token->id,
                'name' => $token->name,
                'abilities' => $token->abilities,
                'last_used_at' => $token->last_used_at?->toIso8601String(),
                'created_at' => $token->created_at?->toIso8601String(),
            ])
            ->all();

        return Inertia::render('Settings/ApiKeys', [
            'tokens' => $tokens,
            'plainTextToken' => $request->session()->get('apiKeyPlainTextToken'),
        ]);
    }

    public function store(StoreApiKeyRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $token = $request->user()->createToken($validated['name']);

        return redirect()
            ->route('settings.api-keys')
            ->with('success', 'API key created successfully. Copy it now because it will not be shown again.')
            ->with('apiKeyPlainTextToken', $token->plainTextToken);
    }

    public function destroy(Request $request, int $tokenId): RedirectResponse
    {
        $token = $request->user()->tokens()->findOrFail($tokenId);

        $token->delete();

        return redirect()
            ->route('settings.api-keys')
            ->with('success', 'API key revoked successfully.');
    }
}
