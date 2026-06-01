<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SessionController extends Controller
{
    /**
     * Get all active sessions for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($session) use ($request) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $this->parseUserAgent($session->user_agent),
                    'last_activity' => Carbon::createFromTimestamp($session->last_activity)->toDateTimeString(),
                    'is_current' => $session->id === $request->session()->getId(),
                ];
            });

        return response()->json([
            'data' => $sessions,
            'current_session_id' => $request->session()->getId(),
        ]);
    }

    /**
     * Delete a specific session.
     */
    public function destroy(Request $request, string $sessionId): JsonResponse
    {
        // Prevent user from deleting their current session via this endpoint
        if ($sessionId === $request->session()->getId()) {
            return response()->json([
                'message' => 'You cannot delete your current session. Please use the logout functionality instead.',
            ], 422);
        }

        // Verify the session belongs to the authenticated user
        $session = DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            return response()->json([
                'message' => 'Session not found or does not belong to you.',
            ], 404);
        }

        // Delete the session
        DB::table('sessions')
            ->where('id', $sessionId)
            ->delete();

        return response()->json([
            'message' => 'Session has been terminated successfully.',
        ]);
    }

    /**
     * Delete all other sessions except the current one.
     */
    public function destroyOthers(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        // Verify the user's password
        if (! Hash::check($request->password, $request->user()->password)) {
            return response()->json([
                'message' => 'The provided password is incorrect.',
                'errors' => [
                    'password' => ['The provided password is incorrect.'],
                ],
            ], 422);
        }

        // Delete all sessions except the current one
        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return response()->json([
            'message' => 'All other sessions have been terminated successfully.',
        ]);
    }

    /**
     * Parse the user agent string to extract browser and platform information.
     */
    private function parseUserAgent(?string $userAgent): array
    {
        if (! $userAgent) {
            return [
                'browser' => 'Unknown',
                'platform' => 'Unknown',
                'device' => 'Unknown',
            ];
        }

        // Simple browser detection
        $browser = 'Unknown';
        if (str_contains($userAgent, 'Firefox')) {
            $browser = 'Firefox';
        } elseif (str_contains($userAgent, 'Edg')) {
            $browser = 'Edge';
        } elseif (str_contains($userAgent, 'Chrome')) {
            $browser = 'Chrome';
        } elseif (str_contains($userAgent, 'Safari')) {
            $browser = 'Safari';
        } elseif (str_contains($userAgent, 'Opera') || str_contains($userAgent, 'OPR')) {
            $browser = 'Opera';
        }

        // Platform detection
        $platform = 'Unknown';
        if (str_contains($userAgent, 'Windows')) {
            $platform = 'Windows';
        } elseif (str_contains($userAgent, 'Macintosh') || str_contains($userAgent, 'Mac OS')) {
            $platform = 'macOS';
        } elseif (str_contains($userAgent, 'Linux')) {
            $platform = 'Linux';
        } elseif (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) {
            $platform = 'iOS';
        } elseif (str_contains($userAgent, 'Android')) {
            $platform = 'Android';
        }

        // Device type
        $device = 'Desktop';
        if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'Android')) {
            $device = 'Mobile';
        } elseif (str_contains($userAgent, 'Tablet') || str_contains($userAgent, 'iPad')) {
            $device = 'Tablet';
        }

        return [
            'browser' => $browser,
            'platform' => $platform,
            'device' => $device,
            'full' => $userAgent,
        ];
    }
}
