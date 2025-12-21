<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function monthly(Request $request)
    {
        $month = $request->get('month', Carbon::now()->month);
        $year = $request->get('year', Carbon::now()->year);

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        $transactions = $request->user()
            ->transactions()
            ->completed()
            ->whereBetween('date', [$startDate, $endDate]);

        $income = (clone $transactions)->where('type', 'INCOME')->sum('amount');
        $expenses = (clone $transactions)->where('type', 'EXPENSE')->sum('amount');
        $balance = $income - $expenses;

        $categoryBreakdown = (clone $transactions)
            ->select('category_id', 'type', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('category_id', 'type')
            ->with('category')
            ->get();

        $dailyTrends = (clone $transactions)
            ->select(
                DB::raw('DAY(date) as day'),
                'type',
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('day', 'type')
            ->get()
            ->groupBy('day');

        return response()->json([
            'success' => true,
            'data' => [
                'period' => ['month' => $month, 'year' => $year],
                'summary' => [
                    'income' => (float) $income,
                    'expenses' => (float) $expenses,
                    'balance' => (float) $balance,
                    'savings_rate' => $income > 0 ? round((($income - $expenses) / $income) * 100, 2) : 0,
                ],
                'category_breakdown' => $categoryBreakdown,
                'daily_trends' => $dailyTrends,
            ],
        ]);
    }

    public function yearly(Request $request)
    {
        $year = $request->get('year', Carbon::now()->year);

        $startDate = Carbon::create($year, 1, 1)->startOfYear();
        $endDate = Carbon::create($year, 12, 31)->endOfYear();

        $transactions = $request->user()
            ->transactions()
            ->completed()
            ->whereBetween('date', [$startDate, $endDate]);

        $income = (clone $transactions)->where('type', 'INCOME')->sum('amount');
        $expenses = (clone $transactions)->where('type', 'EXPENSE')->sum('amount');

        $monthlyTrends = (clone $transactions)
            ->select(
                DB::raw('MONTH(date) as month'),
                'type',
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month', 'type')
            ->get()
            ->groupBy('month');

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'summary' => [
                    'income' => (float) $income,
                    'expenses' => (float) $expenses,
                    'balance' => (float) ($income - $expenses),
                ],
                'monthly_trends' => $monthlyTrends,
            ],
        ]);
    }

    public function category(Request $request)
    {
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $query = $request->user()->transactions()->completed();

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        $report = $query
            ->select('category_id', 'type', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('category_id', 'type')
            ->with('category')
            ->get()
            ->map(function($item) {
                return [
                    'category' => $item->category->name ?? 'Uncategorized',
                    'type' => $item->type,
                    'total' => (float) $item->total,
                    'count' => $item->count,
                ];
            });

        return response()->json(['success' => true, 'data' => $report]);
    }
}
