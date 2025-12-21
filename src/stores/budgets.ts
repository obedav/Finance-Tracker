// src/stores/budgets.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import budgetService from '../services/budgetService.js'
import type { Budget, BudgetFormData, BudgetPeriod } from '@/types'

interface BudgetStats {
  total: number
  active: number
  expired: number
}

interface BudgetSummary {
  total: number
  totalAmount: number
  byPeriod: Record<string, number>
  lastUpdated: string | null
}

interface PeriodDates {
  startDate: string
  endDate: string
}

export const useBudgetStore = defineStore('budgets', () => {
  // State
  const budgets: Ref<Budget[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const lastFetched: Ref<string | null> = ref(null)

  // Getters
  const getBudgetById = computed(() => (id: number): Budget | undefined => {
    return budgets.value.find(budget => budget.id === id)
  })

  const getBudgetsByCategory = computed(() => (categoryId: number): Budget[] => {
    return budgets.value.filter(budget => budget.category_id === categoryId)
  })

  const getBudgetsByPeriod = computed(() => (period: BudgetPeriod): Budget[] => {
    return budgets.value.filter(budget => budget.period === period)
  })

  const totalBudgetAmount: ComputedRef<number> = computed(() => {
    return budgets.value.reduce((total, budget) => total + parseFloat(String(budget.amount || 0)), 0)
  })

  const activeBudgets: ComputedRef<Budget[]> = computed(() => {
    const now = new Date()
    return budgets.value.filter(budget => {
      const endDate = new Date(budget.end_date || '')
      return endDate >= now
    })
  })

  const budgetStats: ComputedRef<BudgetStats> = computed(() => {
    const now = new Date()
    return {
      total: budgets.value.length,
      active: budgets.value.filter(b => new Date(b.end_date || '') >= now).length,
      expired: budgets.value.filter(b => new Date(b.end_date || '') < now).length
    }
  })

  const isDataStale: ComputedRef<boolean> = computed(() => {
    if (!lastFetched.value) return true
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return new Date(lastFetched.value) < fiveMinutesAgo
  })

  // Actions
  const fetchBudgets = async (force = false): Promise<Budget[]> => {
    // Skip if data is fresh and not forced
    if (!force && !isDataStale.value) {
      console.log('Using cached budget data')
      return budgets.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await budgetService.getBudgets()

      if (response.success && response.data) {
        budgets.value = response.data
      } else if (Array.isArray(response)) {
        budgets.value = response
      } else {
        budgets.value = []
      }

      lastFetched.value = new Date().toISOString()
      console.log('Budgets loaded:', budgets.value.length)

      return budgets.value
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budgets'
      error.value = errorMessage
      console.error('Error fetching budgets:', err)
      budgets.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createBudget = async (budgetData: BudgetFormData): Promise<Budget> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await budgetService.createBudget(budgetData)

      if (response.success && response.data) {
        budgets.value.push(response.data)
        console.log('Budget created:', response.data)
        return response.data
      }

      throw new Error(response.message || 'Failed to create budget')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget'
      error.value = errorMessage
      console.error('Error creating budget:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateBudget = async (id: number, budgetData: Partial<BudgetFormData>): Promise<Budget> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await budgetService.updateBudget(id, budgetData)

      if (response.success && response.data) {
        const index = budgets.value.findIndex(budget => budget.id === id)
        if (index !== -1) {
          budgets.value[index] = response.data
        }
        console.log('Budget updated:', response.data)
        return response.data
      }

      throw new Error(response.message || 'Failed to update budget')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update budget'
      error.value = errorMessage
      console.error('Error updating budget:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteBudget = async (id: number): Promise<{ success: boolean; message: string }> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await budgetService.deleteBudget(id)

      if (response.success) {
        const index = budgets.value.findIndex(budget => budget.id === id)
        if (index !== -1) {
          budgets.value.splice(index, 1)
          console.log('Budget deleted')
        }
        return { success: true, message: 'Budget deleted successfully' }
      }

      throw new Error(response.message || 'Failed to delete budget')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget'
      error.value = errorMessage
      console.error('Error deleting budget:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const refreshBudgets = async (): Promise<Budget[]> => {
    return await fetchBudgets(true)
  }

  const resetStore = (): void => {
    budgets.value = []
    isLoading.value = false
    error.value = null
    lastFetched.value = null
  }

  const getBudgetSummary = (): BudgetSummary => {
    const total = budgets.value.length
    const totalAmount = totalBudgetAmount.value
    const byPeriod = budgets.value.reduce((acc: Record<string, number>, budget) => {
      acc[budget.period] = (acc[budget.period] || 0) + 1
      return acc
    }, {})

    return {
      total,
      totalAmount,
      byPeriod,
      lastUpdated: lastFetched.value
    }
  }

  const generatePeriodDates = (period: BudgetPeriod): PeriodDates => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        break
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  }

  return {
    // State
    budgets,
    isLoading,
    error,
    lastFetched,

    // Getters
    getBudgetById,
    getBudgetsByCategory,
    getBudgetsByPeriod,
    totalBudgetAmount,
    activeBudgets,
    budgetStats,
    isDataStale,

    // Actions
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    clearError,
    refreshBudgets,
    resetStore,
    getBudgetSummary,
    generatePeriodDates
  }
})
