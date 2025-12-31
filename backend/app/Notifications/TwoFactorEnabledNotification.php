<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorEnabledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private string $ipAddress;
    private string $userAgent;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $ipAddress, string $userAgent)
    {
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
    }

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
        return (new MailMessage)
                    ->subject('Two-Factor Authentication Enabled')
                    ->greeting('Hello ' . $notifiable->first_name . '!')
                    ->line('Two-factor authentication has been successfully enabled on your account.')
                    ->line('This adds an extra layer of security to protect your financial data.')
                    ->line('**Account Details:**')
                    ->line('Email: ' . $notifiable->email)
                    ->line('IP Address: ' . $this->ipAddress)
                    ->line('Time: ' . now()->format('Y-m-d H:i:s'))
                    ->line('If you did not enable two-factor authentication, please contact support immediately and change your password.')
                    ->action('Go to Settings', url('/settings'))
                    ->line('Thank you for keeping your account secure!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'action' => 'two_factor_enabled',
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
            'timestamp' => now()->toISOString(),
        ];
    }
}
