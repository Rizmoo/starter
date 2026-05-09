<?php

namespace App\Providers;

use App\Console\Commands\ModuleInstall;
use App\Console\Commands\ModuleList;
use App\Models\User;
use App\Services\ModuleManager;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ModuleManager::class, fn () => new ModuleManager);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function (User $user, string $ability): ?bool {
            return $user->hasRole('Admin') ? true : null;
        });

        Event::listen(Login::class, function (Login $event) {
            if ($event->user instanceof User) {
                $event->user->update([
                    'last_login_at' => now(),
                ]);
            }
        });

        if ($this->app->runningInConsole()) {
            $this->commands([
                ModuleInstall::class,
                ModuleList::class,
            ]);
        }
    }
}
