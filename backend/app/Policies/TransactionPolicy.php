<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

/**
 * Authorization policy for Transaction model
 *
 * Ensures users can only access, modify, or delete their own transactions
 */
class TransactionPolicy
{
    /**
     * Determine if the user can view any transactions
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view their own transactions
        return true;
    }

    /**
     * Determine if the user can view the transaction
     */
    public function view(User $user, Transaction $transaction): bool
    {
        // User can only view their own transactions
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can create transactions
     */
    public function create(User $user): bool
    {
        // All authenticated users can create transactions
        return true;
    }

    /**
     * Determine if the user can update the transaction
     */
    public function update(User $user, Transaction $transaction): bool
    {
        // User can only update their own transactions
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can delete the transaction
     */
    public function delete(User $user, Transaction $transaction): bool
    {
        // User can only delete their own transactions
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can restore the transaction (soft deletes)
     */
    public function restore(User $user, Transaction $transaction): bool
    {
        // User can only restore their own transactions
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can permanently delete the transaction
     */
    public function forceDelete(User $user, Transaction $transaction): bool
    {
        // User can only force delete their own transactions
        return $user->id === $transaction->user_id;
    }
}
