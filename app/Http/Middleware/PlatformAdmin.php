<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restrict access to platform-admin routes.
 *
 * A "platform admin" is a superuser stored in the `platform_admins` table.
 * Access is controlled via the isolated `platform` authentication guard.
 */
class PlatformAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::guard('platform')->check()) {
            return redirect()->route('platform.login');
        }

        if (! Auth::guard('platform')->user()->is_active) {
            Auth::guard('platform')->logout();

            return redirect()->route('platform.login')->with('error', 'Your platform admin account is inactive.');
        }

        return $next($request);
    }
}
