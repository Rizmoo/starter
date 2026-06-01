<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\EnsureBranchContext;
use App\Http\Middleware\EnsurePasswordUpdated;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PlatformAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => CheckRole::class,
            'branch.context' => EnsureBranchContext::class,
            'platform.admin' => PlatformAdmin::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            EnsurePasswordUpdated::class,
        ]);

        $middleware->redirectTo(
            guests: function ($request) {
                if ($request->is('platform', 'platform/*')) {
                    return route('platform.login');
                }

                return route('login');
            }
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
