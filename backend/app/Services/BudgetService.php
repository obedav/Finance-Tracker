<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class BudgetService
{
    /**
     * Get all budgets for a user with spending progress
     *
     * @param User $user
     * @return Collection
     */
    public function getUserBudgets(User $user): Collection
    {
        $budgets = Budget::query()
            ->where('user_id', $user->id)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate spending for each budget
        return $budgets->map(function ($budget) {
            $spent = $this->calculateBudgetSpending($budget);
            $budget->spent = $spent;
            $budget->remaining = max(0, $budget->amount - $spent);
            $budget->percentage = $budget->amount > 0 ? min(100, ($spent / $budget->amount) * 100) : 0;
            $budget->is_exceeded = $spent > $budget->amount;

            return $budget;
        });
    }

    /**
     * Create a new budget
     *
     * @param User $user
     * @param array $data
     * @return Budget
     * @throws ValidationException
     */
    public function createBudget(User $user, array $data): Budget
    {
        // Validate data
        $validator = Validator::make($data, [
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Calculate end date if not provided
        if (empty($data['end_date'])) {
            $data['end_date'] = $this->calculateEndDate($data['start_date'], $data['period']);
        }

        // Create budget
        return DB::transaction(function () use ($user, $data) {
            $budget = new Budget();
            $budget->user_id = $user->id;
            $budget->category_id = $data['category_id'];
            $budget->amount = $data['amount'];
            $budget->period = $data['period'];
            $budget->start_date = $data['start_date'];
            $budget->end_date = $data['end_date'];
            $budget->save();

            $budget->load('category');

            return $budget;
        });
    }

    /**
     * Update an existing budget
     *
     * @param Budget $budget
     * @param array $data
     * @return Budget
     * @throws ValidationException
     */
    public function updateBudget(Budget $budget, array $data): Budget
    {
        // Validate data
        $validator = Validator::make($data, [
            'category_id' => 'sometimes|exists:categories,id',
            'amount' => 'sometimes|numeric|min:0.01',
            'period' => 'sometimes|in:daily,weekly,monthly,yearly',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Update budget
        return DB::transaction(function () use ($budget, $data) {
            $budget->fill($data);
            $budget->save();
            $budget->load('category');

            return $budget;
        });
    }

    /**
     * Delete a budget
     *
     * @param Budget $budget
     * @return bool
     */
    public function deleteBudget(Budget $budget): bool
    {
        return DB::transaction(function () use ($budget) {
            return $budget->delete();
        });
    }

    /**
     * Get budget by ID for a specific user
     *
     * @param User $user
     * @param int $budgetId
     * @return Budget|null
     */
    public function getUserBudget(User $user, int $budgetId): ?Budget
    {
        $budget = Budget::query()
            ->where('user_id', $user->id)
            ->where('id', $budgetId)
            ->with('category')
            ->first();

        if ($budget) {
            $spent = $this->calculateBudgetSpending($budget);
            $budget->spent = $spent;
            $budget->remaining = max(0, $budget->amount - $spent);
            $budget->percentage = $budget->amount > 0 ? min(100, ($spent / $budget->amount) * 100) : 0;
            $budget->is_exceeded = $spent > $budget->amount;
        }

        return $budget;
    }

    /**
     * Calculate spending for a budget
     *
     * @param Budget $budget
     * @return float
     */
    public function calculateBudgetSpending(Budget $budget): float
    {
        return Transaction::query()
            ->where('user_id', $budget->user_id)
            ->where('category_id', $budget->category_id)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$budget->start_date, $budget->end_date])
            ->sum('amount');
    }

    /**
     * Get budget progress summary
     *
     * @param User $user
     * @return array
     */
    public function getBudgetSummary(User $user): array
    {
        $budgets = $this->getUserBudgets($user);

        $totalBudget = $budgets->sum('amount');
        $totalSpent = $budgets->sum('spent');
        $exceeded = $budgets->filter(fn($b) => $b->is_exceeded)->count();
        $onTrack = $budgets->filter(fn($b) => !$b->is_exceeded && $b->percentage >= 50)->count();
        $good = $budgets->filter(fn($b) => !$b->is_exceeded && $b->percentage < 50)->count();

        return [
            'total_budgets' => $budgets->count(),
            'total_budget_amount' => $totalBudget,
            'total_spent' => $totalSpent,
            'total_remaining' => max(0, $totalBudget - $totalSpent),
            'overall_percentage' => $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0,
            'exceeded_count' => $exceeded,
            'on_track_count' => $onTrack,
            'good_count' => $good,
        ];
    }

    /**
     * Get budgets that are about to exceed (>80% spent)
     *
     * @param User $user
     * @return Collection
     */
    public function getBudgetsNearingLimit(User $user): Collection
    {
        return $this->getUserBudgets($user)->filter(function ($budget) {
            return $budget->percentage >= 80 && !$budget->is_exceeded;
        });
    }

    /**
     * Get exceeded budgets
     *
     * @param User $user
     * @return Collection
     */
    public function getExceededBudgets(User $user): Collection
    {
        return $this->getUserBudgets($user)->filter(function ($budget) {
            return $budget->is_exceeded;
        });
    }

    /**
     * Calculate end date based on period
     *
     * @param string $startDate
     * @param string $period
     * @return string
     */
    private function calculateEndDate(string $startDate, string $period): string
    {
        $start = Carbon::parse($startDate);

        return match ($period) {
            'daily' => $start->copy()->endOfDay()->format('Y-m-d'),
            'weekly' => $start->copy()->addWeek()->subDay()->format('Y-m-d'),
            'monthly' => $start->copy()->addMonth()->subDay()->format('Y-m-d'),
            'yearly' => $start->copy()->addYear()->subDay()->format('Y-m-d'),
            default => $start->copy()->addMonth()->subDay()->format('Y-m-d'),
        };
    }

    /**
     * Check if user owns budget
     *
     * @param User $user
     * @param Budget $budget
     * @return bool
     */
    public function userOwnsBudget(User $user, Budget $budget): bool
    {
        return $budget->user_id === $user->id;
    }

    /**
     * Get active budgets (not expired)
     *
     * @param User $user
     * @return Collection
     */
    public function getActiveBudgets(User $user): Collection
    {
        return $this->getUserBudgets($user)->filter(function ($budget) {
            return Carbon::parse($budget->end_date)->isFuture() ||
                   Carbon::parse($budget->end_date)->isToday();
        });
    }

    /**
     * Renew budget for next period
     *
     * @param Budget $budget
     * @return Budget
     */
    public function renewBudget(Budget $budget): Budget
    {
        $newStartDate = Carbon::parse($budget->end_date)->addDay();
        $newEndDate = $this->calculateEndDate($newStartDate->format('Y-m-d'), $budget->period);

        return $this->createBudget($budget->user, [
            'category_id' => $budget->category_id,
            'amount' => $budget->amount,
            'period' => $budget->period,
            'start_date' => $newStartDate->format('Y-m-d'),
            'end_date' => $newEndDate,
        ]);
    }
}
