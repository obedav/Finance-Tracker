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
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Str;
use App\Notifications\TwoFactorEnabledNotification;
use App\Notifications\TwoFactorDisabledNotification;
use App\Notifications\TwoFactorRecoveryCodesNotification;

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
                'two_factor_enabled' => $user->two_factor_enabled,
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

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            return response()->json([
                'success' => true,
                'requires_2fa' => true,
                'user_id' => $user->id,
                'message' => 'Please enter your two-factor authentication code',
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
                'two_factor_enabled' => $user->two_factor_enabled,
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
                'two_factor_enabled' => $user->two_factor_enabled,
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
                'two_factor_enabled' => $user->two_factor_enabled,
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

    /**
     * Enable two-factor authentication
     */
    public function enable2FA(Request $request)
    {
        try {
            $user = $request->user();

            // Check if 2FA is already enabled
            if ($user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication is already enabled',
                ], 400);
            }

            $google2fa = new Google2FA();

            // Generate a secret key
            $secret = $google2fa->generateSecretKey();

            // Store the secret temporarily (not confirmed yet)
            $user->two_factor_secret = encrypt($secret);
            $user->save();

            // Generate QR code URL
            $qrCodeUrl = $google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email,
                $secret
            );

            // Generate QR code as SVG
            $renderer = new ImageRenderer(
                new RendererStyle(250),
                new SvgImageBackEnd()
            );
            $writer = new Writer($renderer);
            $qrCodeSvg = $writer->writeString($qrCodeUrl);

            // Generate recovery codes
            $recoveryCodes = $this->generateRecoveryCodes();
            $user->two_factor_recovery_codes = $recoveryCodes;
            $user->save();

            return response()->json([
                'success' => true,
                'secret' => $secret,
                'qr_code' => 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg),
                'recovery_codes' => $recoveryCodes,
                'message' => 'Please verify the code from your authenticator app to complete setup',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error enabling 2FA: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while setting up two-factor authentication',
            ], 500);
        }
    }

    /**
     * Confirm and enable two-factor authentication
     */
    public function confirm2FA(Request $request)
    {
        try {
            $validated = $request->validate([
                'code' => 'required|string|size:6',
            ]);

            $user = $request->user();

            if (!$user->two_factor_secret) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication setup not started',
                ], 400);
            }

            if ($user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication is already enabled',
                ], 400);
            }

            $google2fa = new Google2FA();
            $secret = decrypt($user->two_factor_secret);

            // Verify the code with 1 window tolerance
            $valid = $google2fa->verifyKey($secret, $validated['code'], 1);

            if (!$valid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code. Please try again.',
                ], 400);
            }

            // Enable 2FA
            $user->two_factor_enabled = true;
            $user->two_factor_confirmed_at = now();
            $user->save();

            // Send email notification
            try {
                $user->notify(new TwoFactorEnabledNotification(
                    $request->ip(),
                    $request->userAgent() ?? 'Unknown'
                ));
            } catch (\Exception $e) {
                \Log::warning('Failed to send 2FA enabled notification: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Two-factor authentication enabled successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error confirming 2FA: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while confirming two-factor authentication',
            ], 500);
        }
    }

    /**
     * Disable two-factor authentication
     */
    public function disable2FA(Request $request)
    {
        try {
            $validated = $request->validate([
                'password' => 'required|string',
            ]);

            $user = $request->user();

            if (!$user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication is not enabled',
                ], 400);
            }

            // Verify password
            if (!Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'The provided password is incorrect.',
                ], 400);
            }

            // Disable 2FA
            $user->two_factor_secret = null;
            $user->two_factor_recovery_codes = null;
            $user->two_factor_enabled = false;
            $user->two_factor_confirmed_at = null;
            $user->save();

            // Send email notification
            try {
                $user->notify(new TwoFactorDisabledNotification(
                    $request->ip(),
                    $request->userAgent() ?? 'Unknown'
                ));
            } catch (\Exception $e) {
                \Log::warning('Failed to send 2FA disabled notification: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Two-factor authentication disabled successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error disabling 2FA: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while disabling two-factor authentication',
            ], 500);
        }
    }

    /**
     * Verify two-factor authentication code during login
     */
    public function verify2FA(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'code' => 'required|string',
        ]);

        $user = User::findOrFail($validated['user_id']);

        if (!$user->two_factor_enabled) {
            return response()->json([
                'success' => false,
                'message' => 'Two-factor authentication is not enabled',
            ], 400);
        }

        $google2fa = new Google2FA();
        $secret = decrypt($user->two_factor_secret);

        // Check if it's a TOTP code or recovery code
        if (strlen($validated['code']) === 6 && ctype_digit($validated['code'])) {
            // Verify TOTP code
            $valid = $google2fa->verifyKey($secret, $validated['code'], 1);
        } else {
            // Check recovery code
            $valid = $this->verifyRecoveryCode($user, $validated['code']);
        }

        if (!$valid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code',
            ], 400);
        }

        // Create token for authenticated user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Set token in httpOnly cookie
        $cookie = cookie(
            'auth_token',
            $token,
            60 * 24 * 7, // 7 days
            '/',
            config('session.domain'),
            config('session.secure', false),
            true,
            false,
            config('session.same_site', 'lax')
        );

        return response()->json([
            'success' => true,
            'message' => 'Two-factor authentication verified',
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
                'two_factor_enabled' => $user->two_factor_enabled,
            ],
        ])->cookie($cookie);
    }

    /**
     * Regenerate recovery codes
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication is not enabled',
                ], 400);
            }

            // Generate new recovery codes
            $recoveryCodes = $this->generateRecoveryCodes();
            $user->two_factor_recovery_codes = $recoveryCodes;
            $user->save();

            return response()->json([
                'success' => true,
                'recovery_codes' => $recoveryCodes,
                'message' => 'Recovery codes regenerated successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error regenerating recovery codes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while regenerating recovery codes',
            ], 500);
        }
    }

    /**
     * Email recovery codes to user
     */
    public function emailRecoveryCodes(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->two_factor_enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication is not enabled',
                ], 400);
            }

            if (!$user->two_factor_recovery_codes) {
                return response()->json([
                    'success' => false,
                    'message' => 'No recovery codes found',
                ], 400);
            }

            // Send recovery codes via email
            try {
                $user->notify(new TwoFactorRecoveryCodesNotification(
                    $user->two_factor_recovery_codes
                ));
            } catch (\Exception $e) {
                \Log::error('Failed to send recovery codes email: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send recovery codes email',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Recovery codes have been sent to your email',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error emailing recovery codes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while sending recovery codes',
            ], 500);
        }
    }

    /**
     * Generate recovery codes
     */
    private function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = [
                'code' => Str::upper(Str::random(8)),
                'used' => false,
            ];
        }
        return $codes;
    }

    /**
     * Verify recovery code
     */
    private function verifyRecoveryCode(User $user, string $code): bool
    {
        $recoveryCodes = $user->two_factor_recovery_codes;

        if (!$recoveryCodes) {
            return false;
        }

        foreach ($recoveryCodes as $index => $recoveryCode) {
            if (hash_equals($recoveryCode['code'], strtoupper($code)) && !$recoveryCode['used']) {
                // Mark code as used
                $recoveryCodes[$index]['used'] = true;
                $user->two_factor_recovery_codes = $recoveryCodes;
                $user->save();
                return true;
            }
        }

        return false;
    }
}
