<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request)
    {
        $query = Category::where(function($q) use ($request) {
            $q->where('user_id', $request->user()->id)
              ->orWhere('is_default', true);
        });

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $categories = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:INCOME,EXPENSE',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        $category = $request->user()->categories()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified category
     */
    public function show(Request $request, $id)
    {
        $category = Category::where(function($q) use ($request, $id) {
            $q->where('user_id', $request->user()->id)
              ->orWhere('is_default', true);
        })->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, $id)
    {
        $category = $request->user()->categories()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'is_active' => 'sometimes|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Remove the specified category
     */
    public function destroy(Request $request, $id)
    {
        $category = $request->user()->categories()->findOrFail($id);

        // Don't allow deleting categories with transactions
        if ($category->transactions()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with existing transactions',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    /**
     * Restore soft-deleted category
     */
    public function restore(Request $request, $id)
    {
        $category = $request->user()
            ->categories()
            ->onlyTrashed()
            ->findOrFail($id);

        $category->restore();

        return response()->json([
            'success' => true,
            'message' => 'Category restored successfully',
            'data' => $category,
        ]);
    }

    /**
     * Get category statistics
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $stats = Category::where(function($q) use ($request) {
            $q->where('user_id', $request->user()->id)
              ->orWhere('is_default', true);
        })
        ->with(['transactions' => function($query) use ($startDate, $endDate, $request) {
            $query->where('user_id', $request->user()->id)
                  ->where('status', 'completed');
            if ($startDate && $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }
        }])
        ->get()
        ->map(function($category) {
            $transactions = $category->transactions;
            $total = $transactions->sum('amount');
            $count = $transactions->count();

            return [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'total' => (float) $total,
                'count' => $count,
                'average' => $count > 0 ? (float) ($total / $count) : 0,
            ];
        })
        ->filter(fn($stat) => $stat['count'] > 0)
        ->values();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get default categories
     */
    public function defaults()
    {
        $defaults = [
            'INCOME' => [
                ['name' => 'Salary', 'icon' => '💰', 'color' => '#10B981'],
                ['name' => 'Freelance', 'icon' => '💼', 'color' => '#10B981'],
                ['name' => 'Business', 'icon' => '🏢', 'color' => '#10B981'],
                ['name' => 'Investment', 'icon' => '📈', 'color' => '#10B981'],
                ['name' => 'Gift', 'icon' => '🎁', 'color' => '#10B981'],
                ['name' => 'Other', 'icon' => '💵', 'color' => '#10B981'],
            ],
            'EXPENSE' => [
                ['name' => 'Food & Dining', 'icon' => '🍽️', 'color' => '#F59E0B'],
                ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#F59E0B'],
                ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#F59E0B'],
                ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#F59E0B'],
                ['name' => 'Bills & Utilities', 'icon' => '📄', 'color' => '#F59E0B'],
                ['name' => 'Healthcare', 'icon' => '🏥', 'color' => '#F59E0B'],
                ['name' => 'Education', 'icon' => '📚', 'color' => '#F59E0B'],
                ['name' => 'Other', 'icon' => '💸', 'color' => '#F59E0B'],
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $defaults,
        ]);
    }
}
