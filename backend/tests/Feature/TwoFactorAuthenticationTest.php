<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserPreference;
use App\Notifications\TwoFactorEnabledNotification;
use App\Notifications\TwoFactorDisabledNotification;
use App\Notifications\TwoFactorRecoveryCodesNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        $this->user = User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Create preferences for the user
        UserPreference::create(['user_id' => $this->user->id]);
    }

    /** @test */
    public function user_can_enable_two_factor_authentication()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/enable');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'secret',
                'qr_code',
                'recovery_codes',
                'message',
            ]);

        $this->user->refresh();
        $this->assertNotNull($this->user->two_factor_secret);
        $this->assertNotNull($this->user->two_factor_recovery_codes);
        $this->assertFalse($this->user->two_factor_enabled);
        $this->assertCount(8, $this->user->two_factor_recovery_codes);
    }

    /** @test */
    public function user_cannot_enable_two_factor_when_already_enabled()
    {
        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/enable');

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Two-factor authentication is already enabled',
            ]);
    }

    /** @test */
    public function user_can_confirm_two_factor_with_valid_code()
    {
        Notification::fake();

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $this->user->update([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => [['code' => 'TEST1234', 'used' => false]],
        ]);

        Sanctum::actingAs($this->user);

        // Generate a valid OTP code
        $validCode = $google2fa->getCurrentOtp($secret);

        $response = $this->postJson('/api/auth/2fa/confirm', [
            'code' => $validCode,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Two-factor authentication enabled successfully',
            ]);

        $this->user->refresh();
        $this->assertTrue($this->user->two_factor_enabled);
        $this->assertNotNull($this->user->two_factor_confirmed_at);

        // Assert notification was sent
        Notification::assertSentTo(
            $this->user,
            TwoFactorEnabledNotification::class
        );
    }

    /** @test */
    public function user_cannot_confirm_two_factor_with_invalid_code()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $this->user->update([
            'two_factor_secret' => encrypt($secret),
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/confirm', [
            'code' => '000000', // Invalid code
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid verification code. Please try again.',
            ]);

        $this->user->refresh();
        $this->assertFalse($this->user->two_factor_enabled);
    }

    /** @test */
    public function user_can_disable_two_factor_with_valid_password()
    {
        Notification::fake();

        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => [['code' => 'TEST1234', 'used' => false]],
            'two_factor_confirmed_at' => now(),
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/disable', [
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Two-factor authentication disabled successfully',
            ]);

        $this->user->refresh();
        $this->assertFalse($this->user->two_factor_enabled);
        $this->assertNull($this->user->two_factor_secret);
        $this->assertNull($this->user->two_factor_recovery_codes);
        $this->assertNull($this->user->two_factor_confirmed_at);

        // Assert notification was sent
        Notification::assertSentTo(
            $this->user,
            TwoFactorDisabledNotification::class
        );
    }

    /** @test */
    public function user_cannot_disable_two_factor_with_invalid_password()
    {
        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/disable', [
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'The provided password is incorrect.',
            ]);

        $this->user->refresh();
        $this->assertTrue($this->user->two_factor_enabled);
    }

    /** @test */
    public function user_can_regenerate_recovery_codes()
    {
        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => [
                ['code' => 'OLD12345', 'used' => false],
            ],
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/recovery-codes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'recovery_codes',
                'message',
            ]);

        $this->user->refresh();
        $newCodes = $this->user->two_factor_recovery_codes;
        $this->assertCount(8, $newCodes);
        $this->assertNotEquals('OLD12345', $newCodes[0]['code']);
    }

    /** @test */
    public function user_can_email_recovery_codes()
    {
        Notification::fake();

        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => [
                ['code' => 'TEST1234', 'used' => false],
            ],
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/2fa/email-recovery-codes');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Recovery codes have been sent to your email',
            ]);

        // Assert notification was sent
        Notification::assertSentTo(
            $this->user,
            TwoFactorRecoveryCodesNotification::class
        );
    }

    /** @test */
    public function user_can_login_with_two_factor_code()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => now(),
        ]);

        // First, attempt login with credentials
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'requires_2fa' => true,
            ]);

        // Now verify 2FA code
        $validCode = $google2fa->getCurrentOtp($secret);

        $verifyResponse = $this->postJson('/api/auth/2fa/verify', [
            'user_id' => $this->user->id,
            'code' => $validCode,
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Two-factor authentication verified',
            ])
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                ],
            ]);
    }

    /** @test */
    public function user_can_login_with_recovery_code()
    {
        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => [
                ['code' => 'RECOVERY1', 'used' => false],
                ['code' => 'RECOVERY2', 'used' => false],
            ],
            'two_factor_confirmed_at' => now(),
        ]);

        // Attempt login with credentials
        $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        // Verify with recovery code
        $verifyResponse = $this->postJson('/api/auth/2fa/verify', [
            'user_id' => $this->user->id,
            'code' => 'RECOVERY1',
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Verify the recovery code was marked as used
        $this->user->refresh();
        $codes = $this->user->two_factor_recovery_codes;
        $this->assertTrue($codes[0]['used']);
        $this->assertFalse($codes[1]['used']);
    }

    /** @test */
    public function recovery_code_cannot_be_reused()
    {
        $this->user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => [
                ['code' => 'RECOVERY1', 'used' => true],
            ],
            'two_factor_confirmed_at' => now(),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $verifyResponse = $this->postJson('/api/auth/2fa/verify', [
            'user_id' => $this->user->id,
            'code' => 'RECOVERY1',
        ]);

        $verifyResponse->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid verification code',
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_two_factor_endpoints()
    {
        $response = $this->postJson('/api/auth/2fa/enable');
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/2fa/confirm', ['code' => '123456']);
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/2fa/disable', ['password' => 'password']);
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/2fa/recovery-codes');
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/2fa/email-recovery-codes');
        $response->assertStatus(401);
    }
}
