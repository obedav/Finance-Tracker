<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use App\Models\GoalContribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GoalController extends Controller
{
    /**
     * Display a listing of goals with optional filters
     */
    public function index(Request $request)
    {
        $query = $request->user()->goals()->with('contributions');

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $goals = $query->get();

        // Add computed fields to each goal
        $goals->each(function($goal) {
            $goal->progress_percentage = $goal->progress_percentage;
            $goal->remaining_amount = $goal->remaining_amount;
            $goal->is_completed = $goal->is_completed;
        });

        return response()->json([
            'success' => true,
            'data' => $goals,
        ]);
    }

    /**
     * Display the specified goal
     */
    public function show(Request $request, $id)
    {
        $goal = $request->user()
            ->goals()
            ->with('contributions')
            ->findOrFail($id);

        // Add computed fields
        $goal->progress_percentage = $goal->progress_percentage;
        $goal->remaining_amount = $goal->remaining_amount;
        $goal->is_completed = $goal->is_completed;

        return response()->json([
            'success' => true,
            'data' => $goal,
        ]);
    }

    /**
     * Store a newly created goal
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:savings,debt_payoff,investment,emergency_fund,vacation,purchase,other',
            'target_amount' => 'required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'target_date' => 'nullable|date|after:start_date',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:active,completed,abandoned,paused',
            'is_recurring' => 'nullable|boolean',
        ]);

        $goal = $request->user()->goals()->create($validated);
        $goal->load('contributions');

        // Add computed fields
        $goal->progress_percentage = $goal->progress_percentage;
        $goal->remaining_amount = $goal->remaining_amount;
        $goal->is_completed = $goal->is_completed;

        return response()->json([
            'success' => true,
            'message' => 'Goal created successfully',
            'data' => $goal,
        ], 201);
    }

    /**
     * Update the specified goal
     */
    public function update(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:savings,debt_payoff,investment,emergency_fund,vacation,purchase,other',
            'target_amount' => 'sometimes|required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'start_date' => 'sometimes|required|date',
            'target_date' => 'nullable|date|after:start_date',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:active,completed,abandoned,paused',
            'is_recurring' => 'nullable|boolean',
        ]);

        $goal->update($validated);
        $goal->load('contributions');

        // Add computed fields
        $goal->progress_percentage = $goal->progress_percentage;
        $goal->remaining_amount = $goal->remaining_amount;
        $goal->is_completed = $goal->is_completed;

        return response()->json([
            'success' => true,
            'message' => 'Goal updated successfully',
            'data' => $goal,
        ]);
    }

    /**
     * Remove the specified goal
     */
    public function destroy(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $goal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Goal deleted successfully',
        ]);
    }

    /**
     * Get progress for one or all goals
     */
    public function progress(Request $request, $id = null)
    {
        if ($id) {
            // Get progress for a specific goal
            $goal = $request->user()
                ->goals()
                ->with('contributions')
                ->findOrFail($id);

            $progressData = [
                'goal_id' => $goal->id,
                'name' => $goal->name,
                'type' => $goal->type,
                'target_amount' => (float) $goal->target_amount,
                'current_amount' => (float) $goal->current_amount,
                'remaining_amount' => $goal->remaining_amount,
                'progress_percentage' => $goal->progress_percentage,
                'is_completed' => $goal->is_completed,
                'status' => $goal->status,
                'start_date' => $goal->start_date->format('Y-m-d'),
                'target_date' => $goal->target_date ? $goal->target_date->format('Y-m-d') : null,
                'days_remaining' => $goal->target_date ? Carbon::now()->diffInDays($goal->target_date, false) : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $progressData,
            ]);
        } else {
            // Get progress for all goals
            $goals = $request->user()->goals()->with('contributions')->get();

            $progressData = $goals->map(function($goal) {
                return [
                    'goal_id' => $goal->id,
                    'name' => $goal->name,
                    'type' => $goal->type,
                    'target_amount' => (float) $goal->target_amount,
                    'current_amount' => (float) $goal->current_amount,
                    'remaining_amount' => $goal->remaining_amount,
                    'progress_percentage' => $goal->progress_percentage,
                    'is_completed' => $goal->is_completed,
                    'status' => $goal->status,
                    'start_date' => $goal->start_date->format('Y-m-d'),
                    'target_date' => $goal->target_date ? $goal->target_date->format('Y-m-d') : null,
                    'days_remaining' => $goal->target_date ? Carbon::now()->diffInDays($goal->target_date, false) : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $progressData,
            ]);
        }
    }

    /**
     * Get goal statistics for the user
     */
    public function statistics(Request $request)
    {
        $goals = $request->user()->goals();

        // Overall statistics
        $totalGoals = (clone $goals)->count();
        $activeGoals = (clone $goals)->where('status', 'active')->count();
        $completedGoals = (clone $goals)->where('status', 'completed')->count();
        $abandonedGoals = (clone $goals)->where('status', 'abandoned')->count();
        $pausedGoals = (clone $goals)->where('status', 'paused')->count();

        // Financial statistics
        $totalTargetAmount = (clone $goals)->sum('target_amount');
        $totalCurrentAmount = (clone $goals)->sum('current_amount');
        $totalRemainingAmount = $totalTargetAmount - $totalCurrentAmount;
        $overallProgress = $totalTargetAmount > 0
            ? round(($totalCurrentAmount / $totalTargetAmount) * 100, 2)
            : 0;

        // Breakdown by type
        $goalsByType = (clone $goals)
            ->select('type', DB::raw('COUNT(*) as count'), DB::raw('SUM(target_amount) as total_target'), DB::raw('SUM(current_amount) as total_current'))
            ->groupBy('type')
            ->get()
            ->map(function($item) {
                return [
                    'type' => $item->type,
                    'count' => $item->count,
                    'total_target' => (float) $item->total_target,
                    'total_current' => (float) $item->total_current,
                    'progress_percentage' => $item->total_target > 0
                        ? round(($item->total_current / $item->total_target) * 100, 2)
                        : 0,
                ];
            });

        // Breakdown by priority
        $goalsByPriority = (clone $goals)
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->get()
            ->map(function($item) {
                return [
                    'priority' => $item->priority,
                    'count' => $item->count,
                ];
            });

        // Goals near completion (90% or more)
        $goalsNearCompletion = (clone $goals)
            ->where('status', 'active')
            ->get()
            ->filter(function($goal) {
                return $goal->progress_percentage >= 90;
            })
            ->count();

        // Overdue goals
        $overdueGoals = (clone $goals)
            ->where('status', 'active')
            ->where('target_date', '<', Carbon::now())
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_goals' => $totalGoals,
                'active_goals' => $activeGoals,
                'completed_goals' => $completedGoals,
                'abandoned_goals' => $abandonedGoals,
                'paused_goals' => $pausedGoals,
                'total_target_amount' => (float) $totalTargetAmount,
                'total_current_amount' => (float) $totalCurrentAmount,
                'total_remaining_amount' => (float) $totalRemainingAmount,
                'overall_progress' => $overallProgress,
                'goals_by_type' => $goalsByType,
                'goals_by_priority' => $goalsByPriority,
                'goals_near_completion' => $goalsNearCompletion,
                'overdue_goals' => $overdueGoals,
            ],
        ]);
    }

    /**
     * Add a contribution to a goal
     */
    public function addContribution(Request $request)
    {
        $validated = $request->validate([
            'goal_id' => 'required|integer|exists:goals,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'contribution_date' => 'required|date|before_or_equal:today',
        ]);

        // Verify goal ownership
        $goal = $request->user()->goals()->findOrFail($validated['goal_id']);

        // Create the contribution
        $contribution = $goal->contributions()->create($validated);

        // Update goal's current amount
        $goal->current_amount = $goal->current_amount + $validated['amount'];

        // Auto-complete goal if target is reached
        if ($goal->current_amount >= $goal->target_amount && $goal->status === 'active') {
            $goal->status = 'completed';
        }

        $goal->save();
        $goal->load('contributions');

        // Add computed fields
        $goal->progress_percentage = $goal->progress_percentage;
        $goal->remaining_amount = $goal->remaining_amount;
        $goal->is_completed = $goal->is_completed;

        return response()->json([
            'success' => true,
            'message' => 'Contribution added successfully',
            'data' => [
                'contribution' => $contribution,
                'goal' => $goal,
            ],
        ], 201);
    }

    /**
     * Get contributions for a specific goal
     */
    public function getContributions(Request $request, $id)
    {
        // Verify goal ownership
        $goal = $request->user()->goals()->findOrFail($id);

        $contributions = $goal->contributions()
            ->orderBy('contribution_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contributions,
            'total_contributed' => (float) $contributions->sum('amount'),
            'contribution_count' => $contributions->count(),
        ]);
    }
}
