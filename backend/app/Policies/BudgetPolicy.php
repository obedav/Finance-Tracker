<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\User;

/**
 * Authorization policy for Budget model
 *
 * Ensures users can only access, modify, or delete their own budgets
 */
class BudgetPolicy
{
    /**
     * Determine if the user can view any budgets
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view their own budgets
        return true;
    }

    /**
     * Determine if the user can view the budget
     */
    public function view(User $user, Budget $budget): bool
    {
        // User can only view their own budgets
        return $user->id === $budget->user_id;
    }

    /**
     * Determine if the user can create budgets
     */
    public function create(User $user): bool
    {
        // All authenticated users can create budgets
        return true;
    }

    /**
     * Determine if the user can update the budget
     */
    public function update(User $user, Budget $budget): bool
    {
        // User can only update their own budgets
        return $user->id === $budget->user_id;
    }

    /**
     * Determine if the user can delete the budget
     */
    public function delete(User $user, Budget $budget): bool
    {
        // User can only delete their own budgets
        return $user->id === $budget->user_id;
    }

    /**
     * Determine if the user can restore the budget (soft deletes)
     */
    public function restore(User $user, Budget $budget): bool
    {
        // User can only restore their own budgets
        return $user->id === $budget->user_id;
    }

    /**
     * Determine if the user can permanently delete the budget
     */
    public function forceDelete(User $user, Budget $budget): bool
    {
        // User can only force delete their own budgets
        return $user->id === $budget->user_id;
    }
}
