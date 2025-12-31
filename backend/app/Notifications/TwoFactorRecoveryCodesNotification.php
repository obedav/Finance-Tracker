<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorRecoveryCodesNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private array $recoveryCodes;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $recoveryCodes)
    {
        $this->recoveryCodes = $recoveryCodes;
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
        $message = (new MailMessage)
                    ->subject('Two-Factor Authentication Recovery Codes')
                    ->greeting('Hello ' . $notifiable->first_name . '!')
                    ->line('Here are your two-factor authentication recovery codes.')
                    ->line('Please store these codes in a safe place. Each code can only be used once.')
                    ->line('**Your Recovery Codes:**');

        // Add each recovery code
        foreach ($this->recoveryCodes as $code) {
            if (!$code['used']) {
                $message->line('• `' . $code['code'] . '`');
            }
        }

        return $message
                    ->line('**Important Security Tips:**')
                    ->line('• Keep these codes in a secure location')
                    ->line('• Do not share these codes with anyone')
                    ->line('• Each code can only be used once')
                    ->line('• You can regenerate new codes at any time from your security settings')
                    ->action('Go to Security Settings', url('/settings'))
                    ->line('If you did not request recovery codes, please contact support immediately.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'action' => 'recovery_codes_sent',
            'codes_count' => count(array_filter($this->recoveryCodes, fn($code) => !$code['used'])),
            'timestamp' => now()->toISOString(),
        ];
    }
}
