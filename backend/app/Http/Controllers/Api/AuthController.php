<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        // Create default preferences
        UserPreference::create([
            'user_id' => $user->id,
        ]);

        // Send email verification notification
        try {
            $user->sendEmailVerificationNotification();
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Log::warning('Failed to send verification email: ' . $e->getMessage());
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Set token in httpOnly cookie for security
        $cookie = cookie(
            'auth_token',                                           // name
            $token,                                                 // value
            60 * 24 * 7,                                           // minutes (7 days)
            '/',                                                    // path
            config('session.domain'),                               // domain
            config('session.secure', false),                        // secure (false in dev, true in prod)
            true,                                                   // httpOnly (prevents JavaScript access)
            false,                                                  // raw
            config('session.same_site', 'lax')                      // sameSite
        );

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'preferences' => $user->preferences,
            ],
        ], 201)->cookie($cookie);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Delete old tokens if remember is false
        if (!($validated['remember'] ?? false)) {
            $user->tokens()->delete();
        }

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Determine cookie expiration based on remember me
        $cookieMinutes = ($validated['remember'] ?? false) ? 60 * 24 * 30 : 60 * 24 * 7; // 30 days or 7 days

        // Set token in httpOnly cookie for security
        $cookie = cookie(
            'auth_token',
            $token,
            $cookieMinutes,
            '/',                                                    // path
            config('session.domain'),                               // domain
            config('session.secure', false),                        // secure (false in dev, true in prod)
            true,                                                   // httpOnly
            false,                                                  // raw
            config('session.same_site', 'lax')                      // sameSite
        );

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'preferences' => $user->preferences,
            ],
        ])->cookie($cookie);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        // Clear the auth cookie
        $cookie = cookie()->forget('auth_token');

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ])->cookie($cookie);
    }

    /**
     * Get authenticated user
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load('preferences');

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'preferences' => $user->preferences,
            ],
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'preferences' => $user->preferences,
            ],
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Delete all tokens to force re-login
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully. Please login again.',
        ]);
    }

    /**
     * Request password reset
     */
    public function requestReset(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to send reset link',
        ], 500);
    }

    /**
     * Reset password
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $validated = $request->validated();

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to reset password',
        ], 500);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Delete current token
        $request->user()->currentAccessToken()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'expiresIn' => 3600,
        ]);
    }

    /**
     * Send email verification notification
     */
    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent successfully',
        ]);
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'hash' => 'required|string',
        ]);

        $user = User::findOrFail($request->id);

        // Check if hash matches
        if (!hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified',
            ]);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully',
        ]);
    }

    /**
     * Check email verification status
     */
    public function checkVerificationStatus(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'is_verified' => $user->hasVerifiedEmail(),
            'email' => $user->email,
        ]);
    }
}
