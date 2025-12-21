<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
    {
        $query = $request->user()->transactions()->with('category');

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('description', 'like', "%{$request->search}%")
                  ->orWhere('notes', 'like', "%{$request->search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $transactions = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:INCOME,EXPENSE',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date',
            'status' => 'sometimes|in:pending,completed,cancelled,failed',
            'notes' => 'nullable|string',
        ]);

        $transaction = $request->user()->transactions()->create($validated);
        $transaction->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data' => $transaction,
        ], 201);
    }

    /**
     * Display the specified transaction
     */
    public function show(Request $request, $id)
    {
        $transaction = $request->user()
            ->transactions()
            ->with('category')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $transaction,
        ]);
    }

    /**
     * Update the specified transaction
     */
    public function update(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|in:INCOME,EXPENSE',
            'amount' => 'sometimes|numeric|min:0.01',
            'description' => 'sometimes|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,completed,cancelled,failed',
            'notes' => 'nullable|string',
        ]);

        $transaction->update($validated);
        $transaction->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
            'data' => $transaction,
        ]);
    }

    /**
     * Remove the specified transaction
     */
    public function destroy(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }

    /**
     * Bulk delete transactions
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:transactions,id',
        ]);

        $count = $request->user()
            ->transactions()
            ->whereIn('id', $validated['ids'])
            ->delete();

        return response()->json([
            'success' => true,
            'message' => "{$count} transactions deleted successfully",
            'count' => $count,
        ]);
    }

    /**
     * Get transaction statistics
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $transactions = $request->user()
            ->transactions()
            ->completed()
            ->whereBetween('date', [$startDate, $endDate]);

        $totalIncome = (clone $transactions)->where('type', 'INCOME')->sum('amount');
        $totalExpenses = (clone $transactions)->where('type', 'EXPENSE')->sum('amount');
        $balance = $totalIncome - $totalExpenses;

        $incomeCount = (clone $transactions)->where('type', 'INCOME')->count();
        $expenseCount = (clone $transactions)->where('type', 'EXPENSE')->count();

        // Category breakdown
        $categoryBreakdown = (clone $transactions)
            ->select('category_id', 'type', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id', 'type')
            ->with('category:id,name,type')
            ->get()
            ->map(function($item) {
                return [
                    'category' => $item->category->name ?? 'Uncategorized',
                    'type' => $item->type,
                    'total' => (float) $item->total,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_income' => (float) $totalIncome,
                'total_expenses' => (float) $totalExpenses,
                'balance' => (float) $balance,
                'income_count' => $incomeCount,
                'expense_count' => $expenseCount,
                'total_transactions' => $incomeCount + $expenseCount,
                'category_breakdown' => $categoryBreakdown,
            ],
        ]);
    }

    /**
     * Get transaction trends
     */
    public function trends(Request $request)
    {
        $period = $request->get('period', 'monthly'); // daily, weekly, monthly, yearly
        $startDate = $request->get('start_date', Carbon::now()->subMonths(6));
        $endDate = $request->get('end_date', Carbon::now());

        $groupFormat = match($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            'yearly' => '%Y',
            default => '%Y-%m',
        };

        $trends = $request->user()
            ->transactions()
            ->completed()
            ->whereBetween('date', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(date, '{$groupFormat}') as period"),
                'type',
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('period', 'type')
            ->orderBy('period')
            ->get()
            ->groupBy('period')
            ->map(function($periodData) {
                $income = $periodData->where('type', 'INCOME')->sum('total');
                $expenses = $periodData->where('type', 'EXPENSE')->sum('total');

                return [
                    'income' => (float) $income,
                    'expenses' => (float) $expenses,
                    'balance' => (float) ($income - $expenses),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $trends,
        ]);
    }

    /**
     * Export transactions
     */
    public function export(Request $request)
    {
        $format = $request->get('format', 'json'); // json, csv

        $transactions = $request->user()
            ->transactions()
            ->with('category')
            ->when($request->has('start_date') && $request->has('end_date'), function($query) use ($request) {
                $query->whereBetween('date', [$request->start_date, $request->end_date]);
            })
            ->get();

        if ($format === 'csv') {
            // Return CSV format
            $csv = "ID,Type,Amount,Description,Category,Date,Status,Notes\n";
            foreach ($transactions as $transaction) {
                $csv .= implode(',', [
                    $transaction->id,
                    $transaction->type,
                    $transaction->amount,
                    '"' . $transaction->description . '"',
                    '"' . ($transaction->category->name ?? 'Uncategorized') . '"',
                    $transaction->date->format('Y-m-d'),
                    $transaction->status,
                    '"' . ($transaction->notes ?? '') . '"',
                ]) . "\n";
            }

            return response($csv, 200)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="transactions.csv"');
        }

        // Return JSON format
        return response()->json([
            'success' => true,
            'data' => $transactions,
            'count' => $transactions->count(),
        ]);
    }

    /**
     * Import transactions
     */
    public function import(Request $request)
    {
        $validated = $request->validate([
            'transactions' => 'required|array',
            'transactions.*.type' => 'required|in:INCOME,EXPENSE',
            'transactions.*.amount' => 'required|numeric|min:0.01',
            'transactions.*.description' => 'required|string',
            'transactions.*.date' => 'required|date',
            'transactions.*.category_id' => 'nullable|exists:categories,id',
        ]);

        $imported = [];
        foreach ($validated['transactions'] as $transactionData) {
            $transaction = $request->user()->transactions()->create($transactionData);
            $imported[] = $transaction;
        }

        return response()->json([
            'success' => true,
            'message' => count($imported) . ' transactions imported successfully',
            'count' => count($imported),
            'data' => $imported,
        ], 201);
    }
}
