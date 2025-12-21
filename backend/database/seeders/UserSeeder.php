<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo user
        $demoUser = User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'demo@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'role' => 'user',
        ]);

        // Create preferences for demo user
        UserPreference::create([
            'user_id' => $demoUser->id,
            'currency' => 'USD',
            'date_format' => 'MM/DD/YYYY',
            'theme' => 'light',
            'language' => 'en',
            'email_notifications' => true,
            'budget_alerts' => true,
            'monthly_reports' => true,
            'goal_reminders' => true,
            'data_sharing' => false,
            'analytics' => true,
            'marketing_emails' => false,
            'auto_backup' => true,
        ]);

        // Create additional sample users
        $users = [
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1234567891',
                'role' => 'user',
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1234567892',
                'role' => 'user',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Create default preferences
            UserPreference::create([
                'user_id' => $user->id,
                'currency' => 'USD',
                'date_format' => 'MM/DD/YYYY',
                'theme' => 'system',
                'language' => 'en',
            ]);
        }
    }
}
