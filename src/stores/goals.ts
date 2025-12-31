// src/stores/goals.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import goalsService from '../services/goalsService'
import type {
  Goal,
  GoalFormData,
  GoalProgress,
  GoalStats,
  GoalContribution
} from '@/types/models'
import type { GoalContributionData } from '../services/goalsService'

interface GoalsByType {
  [key: string]: Goal[]
}

interface GoalsByStatus {
  active: Goal[]
  completed: Goal[]
  abandoned: Goal[]
  paused: Goal[]
}

export const useGoalsStore = defineStore('goals', () => {
  // State
  const goals: Ref<Goal[]> = ref([])
  const progress: Ref<GoalProgress[]> = ref([])
  const stats: Ref<GoalStats | null> = ref(null)
  const contributions: Ref<Record<number, GoalContribution[]>> = ref({})
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const lastFetched: Ref<string | null> = ref(null)

  // Getters
  const getGoalById = computed(() => (id: number): Goal | undefined => {
    return goals.value.find(goal => goal.id === id)
  })

  const getGoalsByType = computed((): GoalsByType => {
    return goals.value.reduce((acc: GoalsByType, goal) => {
      if (!acc[goal.type]) {
        acc[goal.type] = []
      }
      acc[goal.type].push(goal)
      return acc
    }, {})
  })

  const getGoalsByStatus = computed((): GoalsByStatus => {
    return {
      active: goals.value.filter(g => g.status === 'active'),
      completed: goals.value.filter(g => g.status === 'completed'),
      abandoned: goals.value.filter(g => g.status === 'abandoned'),
      paused: goals.value.filter(g => g.status === 'paused')
    }
  })

  const activeGoals: ComputedRef<Goal[]> = computed(() => {
    return goals.value.filter(goal => goal.status === 'active')
  })

  const completedGoals: ComputedRef<Goal[]> = computed(() => {
    return goals.value.filter(goal => goal.status === 'completed')
  })

  const highPriorityGoals: ComputedRef<Goal[]> = computed(() => {
    return goals.value.filter(goal => goal.priority === 'high' && goal.status === 'active')
  })

  const totalTargetAmount: ComputedRef<number> = computed(() => {
    return goals.value.reduce((total, goal) => total + goal.target_amount, 0)
  })

  const totalCurrentAmount: ComputedRef<number> = computed(() => {
    return goals.value.reduce((total, goal) => total + goal.current_amount, 0)
  })

  const overallProgress: ComputedRef<number> = computed(() => {
    if (totalTargetAmount.value === 0) return 0
    return Math.round((totalCurrentAmount.value / totalTargetAmount.value) * 100)
  })

  const getProgressByGoalId = computed(() => (goalId: number): GoalProgress | undefined => {
    return progress.value.find(p => p.goal_id === goalId)
  })

  const goalsNearingTarget: ComputedRef<Goal[]> = computed(() => {
    return goals.value.filter(goal => {
      const percentage = (goal.current_amount / goal.target_amount) * 100
      return percentage >= 80 && percentage < 100 && goal.status === 'active'
    })
  })

  const goalsOverdue: ComputedRef<Goal[]> = computed(() => {
    const now = new Date()
    return goals.value.filter(goal => {
      if (!goal.target_date || goal.status !== 'active') return false
      const targetDate = new Date(goal.target_date)
      const isOverdue = targetDate < now
      const isNotComplete = goal.current_amount < goal.target_amount
      return isOverdue && isNotComplete
    })
  })

  const isDataStale: ComputedRef<boolean> = computed(() => {
    if (!lastFetched.value) return true
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return new Date(lastFetched.value) < fiveMinutesAgo
  })

  // Actions
  const fetchGoals = async (force = false): Promise<Goal[]> => {
    // Skip if data is fresh and not forced
    if (!force && !isDataStale.value) {
      return goals.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.getGoals()

      if (response.success && response.data) {
        goals.value = Array.isArray(response.data) ? response.data : [response.data]
      } else {
        goals.value = []
      }

      lastFetched.value = new Date().toISOString()
      return goals.value
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goals'
      error.value = errorMessage
      goals.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchGoalById = async (id: number): Promise<Goal> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.getGoal(id)

      if (response.success && response.data) {
        const goal = response.data as Goal

        // Update goal in store if it exists, otherwise add it
        const index = goals.value.findIndex(g => g.id === id)
        if (index !== -1) {
          goals.value[index] = goal
        } else {
          goals.value.push(goal)
        }

        return goal
      }

      throw new Error('Goal not found')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goal'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createGoal = async (goalData: GoalFormData): Promise<Goal> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.createGoal(goalData)

      if (response.success && response.data) {
        const newGoal = response.data as Goal
        goals.value.push(newGoal)
        return newGoal
      }

      throw new Error(response.message || 'Failed to create goal')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateGoal = async (id: number, goalData: Partial<GoalFormData>): Promise<Goal> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.updateGoal(id, goalData)

      if (response.success && response.data) {
        const updatedGoal = response.data as Goal
        const index = goals.value.findIndex(goal => goal.id === id)
        if (index !== -1) {
          goals.value[index] = updatedGoal
        }
        return updatedGoal
      }

      throw new Error(response.message || 'Failed to update goal')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteGoal = async (id: number): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.deleteGoal(id)

      if (response.success) {
        goals.value = goals.value.filter(goal => goal.id !== id)

        // Also remove progress and contributions for this goal
        progress.value = progress.value.filter(p => p.goal_id !== id)
        delete contributions.value[id]
      } else {
        throw new Error(response.message || 'Failed to delete goal')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchGoalProgress = async (goalId?: number): Promise<GoalProgress[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.getGoalProgress(goalId)

      if (response.success && response.data) {
        const progressData = Array.isArray(response.data) ? response.data : [response.data]

        if (goalId) {
          // Update specific goal progress
          const index = progress.value.findIndex(p => p.goal_id === goalId)
          if (index !== -1) {
            progress.value[index] = progressData[0]
          } else {
            progress.value.push(progressData[0])
          }
        } else {
          // Update all progress
          progress.value = progressData
        }

        return progressData
      }

      throw new Error('Failed to fetch goal progress')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goal progress'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchGoalStats = async (): Promise<GoalStats> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.getGoalStats()

      if (response.success && response.data) {
        stats.value = response.data
        return response.data
      }

      throw new Error('Failed to fetch goal statistics')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goal statistics'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addContribution = async (contributionData: GoalContributionData): Promise<GoalContribution> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.addContribution(contributionData)

      if (response.success && response.data) {
        const contribution = response.data as GoalContribution

        // Add to contributions cache
        if (!contributions.value[contributionData.goal_id]) {
          contributions.value[contributionData.goal_id] = []
        }
        contributions.value[contributionData.goal_id].push(contribution)

        // Update goal's current amount
        const goal = goals.value.find(g => g.id === contributionData.goal_id)
        if (goal) {
          goal.current_amount += contributionData.amount
        }

        // Refresh progress for this goal
        await fetchGoalProgress(contributionData.goal_id)

        return contribution
      }

      throw new Error(response.message || 'Failed to add contribution')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contribution'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchGoalContributions = async (goalId: number): Promise<GoalContribution[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await goalsService.getGoalContributions(goalId)

      if (response.success && response.data) {
        const contributionsList = Array.isArray(response.data) ? response.data : [response.data]
        contributions.value[goalId] = contributionsList
        return contributionsList
      }

      throw new Error('Failed to fetch contributions')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contributions'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const completeGoal = async (goalId: number): Promise<Goal> => {
    return updateGoal(goalId, { status: 'completed' } as Partial<GoalFormData>)
  }

  const pauseGoal = async (goalId: number): Promise<Goal> => {
    return updateGoal(goalId, { status: 'paused' } as Partial<GoalFormData>)
  }

  const resumeGoal = async (goalId: number): Promise<Goal> => {
    return updateGoal(goalId, { status: 'active' } as Partial<GoalFormData>)
  }

  const abandonGoal = async (goalId: number): Promise<Goal> => {
    return updateGoal(goalId, { status: 'abandoned' } as Partial<GoalFormData>)
  }

  const clearError = (): void => {
    error.value = null
  }

  const refreshAll = async (): Promise<void> => {
    await Promise.all([
      fetchGoals(true),
      fetchGoalProgress(),
      fetchGoalStats()
    ])
  }

  return {
    // State
    goals,
    progress,
    stats,
    contributions,
    isLoading,
    error,
    lastFetched,

    // Getters
    getGoalById,
    getGoalsByType,
    getGoalsByStatus,
    activeGoals,
    completedGoals,
    highPriorityGoals,
    totalTargetAmount,
    totalCurrentAmount,
    overallProgress,
    getProgressByGoalId,
    goalsNearingTarget,
    goalsOverdue,
    isDataStale,

    // Actions
    fetchGoals,
    fetchGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    fetchGoalProgress,
    fetchGoalStats,
    addContribution,
    fetchGoalContributions,
    completeGoal,
    pauseGoal,
    resumeGoal,
    abandonGoal,
    clearError,
    refreshAll
  }
})
