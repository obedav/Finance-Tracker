<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'currency',
        'date_format',
        'theme',
        'language',
        'email_notifications',
        'budget_alerts',
        'monthly_reports',
        'goal_reminders',
        'data_sharing',
        'analytics',
        'marketing_emails',
        'auto_backup',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_notifications' => 'boolean',
            'budget_alerts' => 'boolean',
            'monthly_reports' => 'boolean',
            'goal_reminders' => 'boolean',
            'data_sharing' => 'boolean',
            'analytics' => 'boolean',
            'marketing_emails' => 'boolean',
            'auto_backup' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the preferences.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
