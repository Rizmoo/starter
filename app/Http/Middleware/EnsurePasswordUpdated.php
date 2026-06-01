<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordUpdated
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->force_password_change) {
            return $next($request);
        }

        $allowedPrefixes = [
            'settings',
            'logout',
            'user/password',
            'user/confirm-password',
            'user/confirmed-two-factor-authentication',
            'user/two-factor-authentication',
            'user/two-factor-qr-code',
            'user/two-factor-recovery-codes',
        ];

        foreach ($allowedPrefixes as $prefix) {
            if ($request->is($prefix) || $request->is($prefix.'/*')) {
                return $next($request);
            }
        }

        if ($request->expectsJson()) {
            return new JsonResponse([
                'message' => 'Password update required before continuing.',
            ], 423);
        }

        return redirect('/settings')->with('message', 'Please update your password before continuing.');
    }
}
