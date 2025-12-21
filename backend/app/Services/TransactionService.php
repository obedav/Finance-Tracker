<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    /**
     * Get paginated transactions for a user with filters
     *
     * @param User $user
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUserTransactions(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Transaction::query()
            ->where('user_id', $user->id)
            ->with('category');

        // Apply filters
        if (!empty($filters['type'])) {
            $query->where('type', strtolower($filters['type']));
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('transaction_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('transaction_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['min_amount'])) {
            $query->where('amount', '>=', $filters['min_amount']);
        }

        if (!empty($filters['max_amount'])) {
            $query->where('amount', '<=', $filters['max_amount']);
        }

        if (!empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }

        // Order by transaction date descending
        $query->orderBy('transaction_date', 'desc')
              ->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    /**
     * Create a new transaction
     *
     * @param User $user
     * @param array $data
     * @return Transaction
     * @throws ValidationException
     */
    public function createTransaction(User $user, array $data): Transaction
    {
        // Validate data
        $validator = Validator::make($data, [
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Create transaction
        return DB::transaction(function () use ($user, $data) {
            $transaction = new Transaction();
            $transaction->user_id = $user->id;
            $transaction->category_id = $data['category_id'];
            $transaction->type = strtolower($data['type']);
            $transaction->amount = $data['amount'];
            $transaction->description = $data['description'];
            $transaction->transaction_date = $data['transaction_date'];
            $transaction->save();

            // Load category relationship
            $transaction->load('category');

            return $transaction;
        });
    }

    /**
     * Update an existing transaction
     *
     * @param Transaction $transaction
     * @param array $data
     * @return Transaction
     * @throws ValidationException
     */
    public function updateTransaction(Transaction $transaction, array $data): Transaction
    {
        // Validate data
        $validator = Validator::make($data, [
            'category_id' => 'sometimes|exists:categories,id',
            'type' => 'sometimes|in:income,expense',
            'amount' => 'sometimes|numeric|min:0.01',
            'description' => 'sometimes|string|max:255',
            'transaction_date' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Update transaction
        return DB::transaction(function () use ($transaction, $data) {
            $transaction->fill([
                'category_id' => $data['category_id'] ?? $transaction->category_id,
                'type' => isset($data['type']) ? strtolower($data['type']) : $transaction->type,
                'amount' => $data['amount'] ?? $transaction->amount,
                'description' => $data['description'] ?? $transaction->description,
                'transaction_date' => $data['transaction_date'] ?? $transaction->transaction_date,
            ]);

            $transaction->save();
            $transaction->load('category');

            return $transaction;
        });
    }

    /**
     * Delete a transaction
     *
     * @param Transaction $transaction
     * @return bool
     */
    public function deleteTransaction(Transaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            return $transaction->delete();
        });
    }

    /**
     * Bulk delete transactions
     *
     * @param User $user
     * @param array $transactionIds
     * @return int Number of deleted transactions
     */
    public function bulkDeleteTransactions(User $user, array $transactionIds): int
    {
        return DB::transaction(function () use ($user, $transactionIds) {
            return Transaction::query()
                ->where('user_id', $user->id)
                ->whereIn('id', $transactionIds)
                ->delete();
        });
    }

    /**
     * Get transaction statistics for a user
     *
     * @param User $user
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getTransactionStatistics(User $user, ?string $startDate = null, ?string $endDate = null): array
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

        return [
            'total_income' => (float) $income,
            'total_expenses' => (float) $expenses,
            'net_balance' => (float) ($income - $expenses),
            'transaction_count' => $transactionCount,
            'average_transaction' => $transactionCount > 0 ? ($income + $expenses) / $transactionCount : 0,
        ];
    }

    /**
     * Get transactions grouped by category
     *
     * @param User $user
     * @param string|null $startDate
     * @param string|null $endDate
     * @param string|null $type
     * @return Collection
     */
    public function getTransactionsByCategory(
        User $user,
        ?string $startDate = null,
        ?string $endDate = null,
        ?string $type = null
    ): Collection {
        $query = Transaction::query()
            ->select('category_id', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->where('user_id', $user->id)
            ->with('category')
            ->groupBy('category_id');

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        if ($type) {
            $query->where('type', strtolower($type));
        }

        return $query->get();
    }

    /**
     * Get monthly transaction trends
     *
     * @param User $user
     * @param int $months Number of months to retrieve
     * @return Collection
     */
    public function getMonthlyTrends(User $user, int $months = 12): Collection
    {
        $startDate = now()->subMonths($months)->startOfMonth();

        return Transaction::query()
            ->select(
                DB::raw('DATE_FORMAT(transaction_date, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expenses'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->where('user_id', $user->id)
            ->where('transaction_date', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
    }

    /**
     * Import transactions from array
     *
     * @param User $user
     * @param array $transactions
     * @return array
     */
    public function importTransactions(User $user, array $transactions): array
    {
        $imported = 0;
        $failed = 0;
        $errors = [];

        DB::transaction(function () use ($user, $transactions, &$imported, &$failed, &$errors) {
            foreach ($transactions as $index => $data) {
                try {
                    $this->createTransaction($user, $data);
                    $imported++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = [
                        'row' => $index + 1,
                        'error' => $e->getMessage()
                    ];
                }
            }
        });

        return [
            'imported' => $imported,
            'failed' => $failed,
            'errors' => $errors
        ];
    }

    /**
     * Get transaction by ID for a specific user
     *
     * @param User $user
     * @param int $transactionId
     * @return Transaction|null
     */
    public function getUserTransaction(User $user, int $transactionId): ?Transaction
    {
        return Transaction::query()
            ->where('user_id', $user->id)
            ->where('id', $transactionId)
            ->with('category')
            ->first();
    }

    /**
     * Check if user owns transaction
     *
     * @param User $user
     * @param Transaction $transaction
     * @return bool
     */
    public function userOwnsTransaction(User $user, Transaction $transaction): bool
    {
        return $transaction->user_id === $user->id;
    }
}
