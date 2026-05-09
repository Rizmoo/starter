<?php

namespace App\Http\Controllers\Platform;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Platform/Settings', [
            'settings' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'enabled_modules' => config('modules.enabled', ''),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
        ]);

        // Update the app name in .env
        $envPath = base_path('.env');
        $content = file_get_contents($envPath);
        $content = preg_replace('/^APP_NAME=.*/m', 'APP_NAME='.$request->app_name, $content);
        file_put_contents($envPath, $content);

        return back()->with('success', 'Platform settings updated.');
    }
}
