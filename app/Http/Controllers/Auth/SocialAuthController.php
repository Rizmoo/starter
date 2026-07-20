<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the provider authentication page.
     */
    public function redirect(string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Obtain the user information from the provider.
     */
    public function callback(string $provider): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (Exception $e) {
            return redirect('/login')->with('error', 'Authentication failed or was cancelled.');
        }

        $user = User::query()
            ->where('social_id', '=', $socialUser->getId())
            ->where('social_provider', '=', $provider)
            ->first();

        if (! $user) {
            // Check if user exists with the same email
            $user = User::query()
                ->where('email', '=', $socialUser->getEmail())
                ->first();

            if ($user) {
                // Link account
                $user->update([
                    'social_id' => $socialUser->getId(),
                    'social_provider' => $provider,
                    'social_avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                $isFirstUser = User::query()->count() === 0;

                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Social User',
                    'email' => $socialUser->getEmail(),
                    'social_id' => $socialUser->getId(),
                    'social_provider' => $provider,
                    'social_avatar' => $socialUser->getAvatar(),
                    'status' => 'active',
                    'role' => $isFirstUser ? 'Admin' : config('roles.default_role', 'Viewer'),
                ]);
            }
        }

        Auth::login($user);

        return redirect()->intended('/dashboard');
    }
}
