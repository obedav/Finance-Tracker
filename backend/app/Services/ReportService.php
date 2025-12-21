<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportService
{
    /**
     * Get monthly financial report
     *
     * @param User $user
     * @param int $months Number of months to include
     * @return array
     */
    public function getMonthlyReport(User $user, int $months = 12): array
    {
        $startDate = Carbon::now()->subMonths($months)->startOfMonth();

        $data = Transaction::query()
            ->select(
                DB::raw('DATE_FORMAT(transaction_date, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expenses')
            )
            ->where('user_id', $user->id)
            ->where('transaction_date', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'income' => (float) $item->income,
                    'expenses' => (float) $item->expenses,
                    'net' => (float) ($item->income - $item->expenses),
                    'savings_rate' => $item->income > 0 ? (($item->income - $item->expenses) / $item->income) * 100 : 0,
                ];
            });

        return $data->toArray();
    }

    /**
     * Get category breakdown report
     *
     * @param User $user
     * @param string|null $type
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getCategoryReport(
        User $user,
        ?string $type = null,
        ?string $startDate = null,
        ?string $endDate = null
    ): array {
        $query = Transaction::query()
            ->select(
                'category_id',
                'categories.name as category_name',
                'transactions.type',
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(amount) as average')
            )
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->where('transactions.user_id', $user->id)
            ->groupBy('category_id', 'categories.name', 'transactions.type');

        if ($type) {
            $query->where('transactions.type', strtolower($type));
        }

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        $data = $query->get();

        // Calculate percentages
        $totals = $data->groupBy('type')->map(fn($items) => $items->sum('total'));

        return $data->map(function ($item) use ($totals) {
            $typeTotal = $totals->get($item->type, 1);
            return [
                'category_id' => $item->category_id,
                'category_name' => $item->category_name,
                'type' => $item->type,
                'total' => (float) $item->total,
                'count' => $item->count,
                'average' => (float) $item->average,
                'percentage' => $typeTotal > 0 ? ($item->total / $typeTotal) * 100 : 0,
            ];
        })->toArray();
    }

    /**
     * Get financial summary
     *
     * @param User $user
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getFinancialSummary(User $user, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = Transaction::query()->where('user_id', $user->id);

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        $income = (clone $query)->where('type', 'income')->sum('amount');
        $expenses = (clone $query)->where('type', 'expense')->sum('amount');
        $transactionCount = $query->count();

        // Get largest transactions
        $largestIncome = (clone $query)->where('type', 'income')->orderBy('amount', 'desc')->first();
        $largestExpense = (clone $query)->where('type', 'expense')->orderBy('amount', 'desc')->first();

        // Get most used category
        $mostUsedCategory = Transaction::query()
            ->select('category_id', 'categories.name', DB::raw('COUNT(*) as count'))
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->where('transactions.user_id', $user->id)
            ->groupBy('category_id', 'categories.name')
            ->orderBy('count', 'desc')
            ->first();

        return [
            'total_income' => (float) $income,
            'total_expenses' => (float) $expenses,
            'net_balance' => (float) ($income - $expenses),
            'transaction_count' => $transactionCount,
            'average_transaction' => $transactionCount > 0 ? ($income + $expenses) / $transactionCount : 0,
            'largest_income' => $largestIncome ? [
                'amount' => (float) $largestIncome->amount,
                'description' => $largestIncome->description,
                'date' => $largestIncome->transaction_date,
            ] : null,
            'largest_expense' => $largestExpense ? [
                'amount' => (float) $largestExpense->amount,
                'description' => $largestExpense->description,
                'date' => $largestExpense->transaction_date,
            ] : null,
            'most_used_category' => $mostUsedCategory ? [
                'name' => $mostUsedCategory->name,
                'count' => $mostUsedCategory->count,
            ] : null,
            'savings_rate' => $income > 0 ? (($income - $expenses) / $income) * 100 : 0,
        ];
    }

    /**
     * Get daily spending trend
     *
     * @param User $user
     * @param int $days
     * @return array
     */
    public function getDailyTrend(User $user, int $days = 30): array
    {
        $startDate = Carbon::now()->subDays($days);

        return Transaction::query()
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expenses')
            )
            ->where('user_id', $user->id)
            ->where('transaction_date', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'income' => (float) $item->income,
                    'expenses' => (float) $item->expenses,
                    'net' => (float) ($item->income - $item->expenses),
                ];
            })
            ->toArray();
    }

    /**
     * Get income vs expenses comparison
     *
     * @param User $user
     * @param string $period (daily|weekly|monthly|yearly)
     * @param int $limit
     * @return array
     */
    public function getIncomeVsExpenses(User $user, string $period = 'monthly', int $limit = 12): array
    {
        $dateFormat = match ($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-W%u',
            'monthly' => '%Y-%m',
            'yearly' => '%Y',
            default => '%Y-%m',
        };

        $startDate = match ($period) {
            'daily' => Carbon::now()->subDays($limit),
            'weekly' => Carbon::now()->subWeeks($limit),
            'monthly' => Carbon::now()->subMonths($limit),
            'yearly' => Carbon::now()->subYears($limit),
            default => Carbon::now()->subMonths($limit),
        };

        return Transaction::query()
            ->select(
                DB::raw("DATE_FORMAT(transaction_date, '$dateFormat') as period"),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expenses')
            )
            ->where('user_id', $user->id)
            ->where('transaction_date', '>=', $startDate)
            ->groupBy('period')
            ->orderBy('period', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->period,
                    'income' => (float) $item->income,
                    'expenses' => (float) $item->expenses,
                    'difference' => (float) ($item->income - $item->expenses),
                ];
            })
            ->toArray();
    }

    /**
     * Get spending by day of week
     *
     * @param User $user
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getSpendingByDayOfWeek(User $user, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = Transaction::query()
            ->select(
                DB::raw('DAYNAME(transaction_date) as day_name'),
                DB::raw('DAYOFWEEK(transaction_date) as day_number'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as total_expenses'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->where('user_id', $user->id);

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        return $query->groupBy('day_name', 'day_number')
            ->orderBy('day_number', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'day' => $item->day_name,
                    'total_expenses' => (float) $item->total_expenses,
                    'transaction_count' => $item->transaction_count,
                ];
            })
            ->toArray();
    }

    /**
     * Get year-over-year comparison
     *
     * @param User $user
     * @param int $currentYear
     * @param int $previousYear
     * @return array
     */
    public function getYearOverYearComparison(User $user, ?int $currentYear = null, ?int $previousYear = null): array
    {
        $currentYear = $currentYear ?? Carbon::now()->year;
        $previousYear = $previousYear ?? $currentYear - 1;

        $currentData = $this->getYearData($user, $currentYear);
        $previousData = $this->getYearData($user, $previousYear);

        return [
            'current_year' => $currentYear,
            'previous_year' => $previousYear,
            'current' => $currentData,
            'previous' => $previousData,
            'growth' => [
                'income' => $previousData['income'] > 0 ? (($currentData['income'] - $previousData['income']) / $previousData['income']) * 100 : 0,
                'expenses' => $previousData['expenses'] > 0 ? (($currentData['expenses'] - $previousData['expenses']) / $previousData['expenses']) * 100 : 0,
            ],
        ];
    }

    /**
     * Get yearly data helper
     *
     * @param User $user
     * @param int $year
     * @return array
     */
    private function getYearData(User $user, int $year): array
    {
        $query = Transaction::query()
            ->where('user_id', $user->id)
            ->whereYear('transaction_date', $year);

        $income = (clone $query)->where('type', 'income')->sum('amount');
        $expenses = (clone $query)->where('type', 'expense')->sum('amount');

        return [
            'income' => (float) $income,
            'expenses' => (float) $expenses,
            'net' => (float) ($income - $expenses),
        ];
    }
}
