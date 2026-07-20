<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\GeneralNotification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'force_password_change' => false,
                'status' => 'active',
                'role' => 'Admin',
            ]
        );

        if ($user->force_password_change || ! $user->role) {
            $user->forceFill([
                'force_password_change' => false,
                'role' => 'Admin',
            ])->save();
        }

        // Seed sample notifications
        $samples = [
            ['title' => 'Welcome!', 'message' => 'Your account has been set up successfully. Explore the dashboard to get started.', 'type' => 'success'],
            ['title' => 'New user registered', 'message' => 'John Doe just signed up. Review their account in the users section.', 'type' => 'info'],
            ['title' => 'Server load warning', 'message' => 'CPU usage reached 85% in the last hour. Consider scaling up resources.', 'type' => 'warning'],
            ['title' => 'Payment failed', 'message' => 'A payment of $249.00 from Acme Corp could not be processed. Please review.', 'type' => 'error'],
            ['title' => 'Monthly report ready', 'message' => 'Your April 2026 analytics report is ready for download.', 'type' => 'info', 'action_url' => '/reports', 'action_label' => 'Download report'],
        ];

        foreach ($samples as $sample) {
            $user->notify(new GeneralNotification(
                title: $sample['title'],
                message: $sample['message'],
                type: $sample['type'],
                actionUrl: $sample['action_url'] ?? null,
                actionLabel: $sample['action_label'] ?? null,
            ));
        }

        // Mark the last two as already read
        $user->notifications()->latest()->skip(0)->take(2)->get()->each->markAsRead();
    }
}
