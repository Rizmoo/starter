<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserOnboardingNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly ?string $temporaryPassword = null) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $token = app('auth.password.broker')->createToken($notifiable);
        $resetUrl = route('password.reset', [
            'token' => $token,
            'email' => $notifiable->email,
        ]);

        return (new MailMessage)
            ->subject('Welcome to BizLav - Complete Your Account Setup')
            ->greeting('Welcome, '.$notifiable->name.'!')
            ->line('An administrator created your account. To activate it securely, you must set a new password before using the system.')
            ->line('Email: '.$notifiable->email)
            ->when(
                $this->temporaryPassword !== null,
                fn (MailMessage $message) => $message->line('Temporary password: '.$this->temporaryPassword)
            )
            ->action('Set Your Password', $resetUrl)
            ->line('For security, this password change is required on first login.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
