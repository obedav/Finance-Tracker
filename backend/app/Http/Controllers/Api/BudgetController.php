<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $budgets = $request->user()
            ->budgets()
            ->with('category')
            ->when($request->has('period'), fn($q) => $q->where('period', $request->period))
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', $request->boolean('is_active')))
            ->get()
            ->map(function($budget) {
                return array_merge($budget->toArray(), [
                    'progress' => $budget->calculateProgress()
                ]);
            });

        return response()->json(['success' => true, 'data' => $budgets]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'period' => 'required|in:weekly,monthly,yearly',
            'category_id' => 'nullable|exists:categories,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'alert_threshold' => 'sometimes|integer|min:1|max:100',
        ]);

        $budget = $request->user()->budgets()->create($validated);
        $budget->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Budget created successfully',
            'data' => array_merge($budget->toArray(), [
                'progress' => $budget->calculateProgress()
            ]),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $budget = $request->user()->budgets()->with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => array_merge($budget->toArray(), [
                'progress' => $budget->calculateProgress()
            ]),
        ]);
    }

    public function update(Request $request, $id)
    {
        $budget = $request->user()->budgets()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0.01',
            'period' => 'sometimes|in:weekly,monthly,yearly',
            'category_id' => 'nullable|exists:categories,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'alert_threshold' => 'sometimes|integer|min:1|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        $budget->update($validated);
        $budget->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Budget updated successfully',
            'data' => array_merge($budget->toArray(), [
                'progress' => $budget->calculateProgress()
            ]),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $budget = $request->user()->budgets()->findOrFail($id);
        $budget->delete();

        return response()->json([
            'success' => true,
            'message' => 'Budget deleted successfully',
        ]);
    }
}
