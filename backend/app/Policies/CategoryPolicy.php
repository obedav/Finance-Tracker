<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

/**
 * Authorization policy for Category model
 *
 * Ensures users can only access, modify, or delete their own categories
 */
class CategoryPolicy
{
    /**
     * Determine if the user can view any categories
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view their own categories
        return true;
    }

    /**
     * Determine if the user can view the category
     */
    public function view(User $user, Category $category): bool
    {
        // User can only view their own categories
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can create categories
     */
    public function create(User $user): bool
    {
        // All authenticated users can create categories
        return true;
    }

    /**
     * Determine if the user can update the category
     */
    public function update(User $user, Category $category): bool
    {
        // User can only update their own categories
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can delete the category
     */
    public function delete(User $user, Category $category): bool
    {
        // User can only delete their own categories
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can restore the category (soft deletes)
     */
    public function restore(User $user, Category $category): bool
    {
        // User can only restore their own categories
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can permanently delete the category
     */
    public function forceDelete(User $user, Category $category): bool
    {
        // User can only force delete their own categories
        return $user->id === $category->user_id;
    }
}
