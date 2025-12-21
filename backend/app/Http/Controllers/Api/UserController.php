<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function preferences(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->preferences,
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'currency' => 'sometimes|string|max:3',
            'date_format' => 'sometimes|string',
            'theme' => 'sometimes|in:light,dark,system',
            'language' => 'sometimes|string|max:5',
            'email_notifications' => 'sometimes|boolean',
            'budget_alerts' => 'sometimes|boolean',
            'monthly_reports' => 'sometimes|boolean',
            'goal_reminders' => 'sometimes|boolean',
            'data_sharing' => 'sometimes|boolean',
            'analytics' => 'sometimes|boolean',
            'marketing_emails' => 'sometimes|boolean',
            'auto_backup' => 'sometimes|boolean',
        ]);

        $preferences = $request->user()->preferences;
        $preferences->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Preferences updated successfully',
            'data' => $preferences,
        ]);
    }

    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'sometimes|boolean',
            'budget_alerts' => 'sometimes|boolean',
            'monthly_reports' => 'sometimes|boolean',
            'goal_reminders' => 'sometimes|boolean',
        ]);

        $request->user()->preferences->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notification settings updated',
        ]);
    }

    public function privacy(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'data_sharing' => $request->user()->preferences->data_sharing,
                'analytics' => $request->user()->preferences->analytics,
                'marketing_emails' => $request->user()->preferences->marketing_emails,
                'auto_backup' => $request->user()->preferences->auto_backup,
            ],
        ]);
    }
}
