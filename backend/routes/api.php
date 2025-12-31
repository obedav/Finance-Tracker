<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GoalController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TransactionExportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes with rate limiting
Route::prefix('auth')->middleware('rate.limit:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/request-reset', [AuthController::class, 'requestReset']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/2fa/verify', [AuthController::class, 'verify2FA']);
});

// Protected routes with rate limiting
Route::middleware(['auth:sanctum', 'rate.limit:api'])->group(function () {

    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);

        // Strict rate limiting for password changes
        Route::post('/change-password', [AuthController::class, 'changePassword'])
            ->middleware('rate.limit:strict');

        // Email verification routes
        Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
            ->middleware('rate.limit:auth');
        Route::post('/email/verify', [AuthController::class, 'verifyEmail']);
        Route::get('/email/verification-status', [AuthController::class, 'checkVerificationStatus']);

        // Two-factor authentication routes
        Route::post('/2fa/enable', [AuthController::class, 'enable2FA']);
        Route::post('/2fa/confirm', [AuthController::class, 'confirm2FA']);
        Route::post('/2fa/disable', [AuthController::class, 'disable2FA']);
        Route::post('/2fa/recovery-codes', [AuthController::class, 'regenerateRecoveryCodes']);
        Route::post('/2fa/email-recovery-codes', [AuthController::class, 'emailRecoveryCodes']);
    });

    // Transaction routes
    Route::prefix('transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::post('/', [TransactionController::class, 'store']);
        Route::get('/statistics', [TransactionController::class, 'statistics']);
        Route::get('/trends', [TransactionController::class, 'trends']);

        // CSV Export/Import routes
        Route::get('/export/csv', [TransactionExportController::class, 'exportCsv']);
        Route::post('/import/csv', [TransactionExportController::class, 'importCsv']);
        Route::get('/import/template', [TransactionExportController::class, 'downloadTemplate']);

        // Legacy routes (if they exist in TransactionController)
        Route::post('/import', [TransactionController::class, 'import']);
        Route::get('/export', [TransactionController::class, 'export']);

        Route::delete('/bulk', [TransactionController::class, 'bulkDelete']);
        Route::get('/{id}', [TransactionController::class, 'show']);
        Route::put('/{id}', [TransactionController::class, 'update']);
        Route::delete('/{id}', [TransactionController::class, 'destroy']);
    });

    // Category routes
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/statistics', [CategoryController::class, 'statistics']);
        Route::get('/defaults', [CategoryController::class, 'defaults']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::post('/{id}/restore', [CategoryController::class, 'restore']);
    });

    // Budget routes
    Route::prefix('budgets')->group(function () {
        Route::get('/', [BudgetController::class, 'index']);
        Route::post('/', [BudgetController::class, 'store']);
        Route::get('/{id}', [BudgetController::class, 'show']);
        Route::put('/{id}', [BudgetController::class, 'update']);
        Route::delete('/{id}', [BudgetController::class, 'destroy']);
    });

    // Goal routes
    Route::prefix('goals')->group(function () {
        Route::get('/', [GoalController::class, 'index']);
        Route::post('/', [GoalController::class, 'store']);
        Route::get('/progress', [GoalController::class, 'progress']);
        Route::get('/statistics', [GoalController::class, 'statistics']);
        Route::post('/contributions', [GoalController::class, 'addContribution']);
        Route::get('/{id}', [GoalController::class, 'show']);
        Route::put('/{id}', [GoalController::class, 'update']);
        Route::delete('/{id}', [GoalController::class, 'destroy']);
        Route::get('/{id}/progress', [GoalController::class, 'progress']);
        Route::get('/{id}/contributions', [GoalController::class, 'getContributions']);
    });

    // Report routes
    Route::prefix('reports')->group(function () {
        Route::get('/monthly', [ReportController::class, 'monthly']);
        Route::get('/yearly', [ReportController::class, 'yearly']);
        Route::get('/category', [ReportController::class, 'category']);
    });

    // User preferences routes
    Route::prefix('user')->group(function () {
        Route::get('/preferences', [UserController::class, 'preferences']);
        Route::put('/preferences', [UserController::class, 'updatePreferences']);
        Route::put('/notifications', [UserController::class, 'updateNotifications']);
        Route::get('/privacy', [UserController::class, 'privacy']);
    });
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Finance Tracker API is running',
        'timestamp' => now()->toISOString(),
    ]);
});
