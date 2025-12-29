<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
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

    public function store(StoreBudgetRequest $request)
    {
        $validated = $request->validated();

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

        $this->authorize('view', $budget);

        return response()->json([
            'success' => true,
            'data' => array_merge($budget->toArray(), [
                'progress' => $budget->calculateProgress()
            ]),
        ]);
    }

    public function update(UpdateBudgetRequest $request, $id)
    {
        $budget = $request->user()->budgets()->findOrFail($id);

        $this->authorize('update', $budget);

        $validated = $request->validated();

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

        $this->authorize('delete', $budget);

        $budget->delete();

        return response()->json([
            'success' => true,
            'message' => 'Budget deleted successfully',
        ]);
    }
}
