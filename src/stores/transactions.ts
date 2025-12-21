// src/stores/transactions.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import transactionService from '../services/transactionService.js'
import type { Transaction, TransactionFormData, TransactionFilters } from '@/types'

interface TransactionFiltersState {
  type: string
  category: string
  dateRange: {
    start: string | null
    end: string | null
  }
  search: string
  minAmount: number | null
  maxAmount: number | null
}

interface TransactionGroup {
  category: string
  type: string
  transactions: Transaction[]
  totalAmount: number
  count: number
}

interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  transactions: number
}

interface Statistics {
  totalTransactions: number
  avgTransactionAmount: number
  avgIncomeAmount: number
  avgExpenseAmount: number
  mostUsedCategory: string | null
  largestTransaction: Transaction | null
  savingsRate: number
}

export const useTransactionStore = defineStore('transactions', () => {
  // State
  const transactions: Ref<Transaction[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const filters: Ref<TransactionFiltersState> = ref({
    type: '',
    category: '',
    dateRange: {
      start: null,
      end: null
    },
    search: '',
    minAmount: null,
    maxAmount: null
  })

  // Getters
  const totalIncome: ComputedRef<number> = computed(() =>
    transactions.value
      .filter(t => t.type === 'income' || t.type.toUpperCase() === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
  )

  const totalExpenses: ComputedRef<number> = computed(() =>
    transactions.value
      .filter(t => t.type === 'expense' || t.type.toUpperCase() === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
  )

  const balance: ComputedRef<number> = computed(() => totalIncome.value - totalExpenses.value)

  const monthlyIncome: ComputedRef<number> = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions.value
      .filter(t => {
        const date = new Date(t.transaction_date || t.created_at)
        return (t.type === 'income' || t.type.toUpperCase() === 'INCOME') &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
  })

  const monthlyExpenses: ComputedRef<number> = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions.value
      .filter(t => {
        const date = new Date(t.transaction_date || t.created_at)
        return (t.type === 'expense' || t.type.toUpperCase() === 'EXPENSE') &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
  })

  const monthlyBalance: ComputedRef<number> = computed(() => monthlyIncome.value - monthlyExpenses.value)

  const recentTransactions: ComputedRef<Transaction[]> = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.transaction_date || b.created_at).getTime() - new Date(a.transaction_date || a.created_at).getTime())
      .slice(0, 10)
  )

  const transactionsByCategory: ComputedRef<Record<string, TransactionGroup>> = computed(() => {
    const grouped: Record<string, TransactionGroup> = {}

    transactions.value.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Uncategorized'
      const key = `${transaction.type}-${categoryName}`
      if (!grouped[key]) {
        grouped[key] = {
          category: categoryName,
          type: transaction.type,
          transactions: [],
          totalAmount: 0,
          count: 0
        }
      }

      grouped[key].transactions.push(transaction)
      grouped[key].totalAmount += parseFloat(String(transaction.amount))
      grouped[key].count += 1
    })

    return grouped
  })

  const monthlyTrends: ComputedRef<MonthlyTrend[]> = computed(() => {
    const trends: Record<string, MonthlyTrend> = {}

    transactions.value.forEach(transaction => {
      const date = new Date(transaction.transaction_date || transaction.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!trends[monthKey]) {
        trends[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0,
          transactions: 0
        }
      }

      if (transaction.type === 'income' || transaction.type.toUpperCase() === 'INCOME') {
        trends[monthKey].income += parseFloat(String(transaction.amount))
      } else {
        trends[monthKey].expenses += parseFloat(String(transaction.amount))
      }

      trends[monthKey].transactions += 1
    })

    return Object.values(trends).sort((a, b) => a.month.localeCompare(b.month))
  })

  const filteredTransactions: ComputedRef<Transaction[]> = computed(() => {
    let filtered = [...transactions.value]

    // Filter by type
    if (filters.value.type) {
      filtered = filtered.filter(t =>
        t.type.toUpperCase() === filters.value.type.toUpperCase()
      )
    }

    // Filter by category
    if (filters.value.category) {
      filtered = filtered.filter(t => {
        const categoryName = t.category?.name || ''
        return categoryName === filters.value.category
      })
    }

    // Filter by date range
    if (filters.value.dateRange.start && filters.value.dateRange.end) {
      const start = new Date(filters.value.dateRange.start)
      const end = new Date(filters.value.dateRange.end)
      filtered = filtered.filter(t => {
        const date = new Date(t.transaction_date || t.created_at)
        return date >= start && date <= end
      })
    }

    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t => {
        const categoryName = t.category?.name || ''
        return (t.description && t.description.toLowerCase().includes(searchTerm)) ||
          categoryName.toLowerCase().includes(searchTerm) ||
          String(t.amount).includes(searchTerm)
      })
    }

    // Filter by amount range
    if (filters.value.minAmount !== null) {
      filtered = filtered.filter(t => parseFloat(String(t.amount)) >= filters.value.minAmount!)
    }

    if (filters.value.maxAmount !== null) {
      filtered = filtered.filter(t => parseFloat(String(t.amount)) <= filters.value.maxAmount!)
    }

    return filtered.sort((a, b) =>
      new Date(b.transaction_date || b.created_at).getTime() - new Date(a.transaction_date || a.created_at).getTime()
    )
  })

  const statistics: ComputedRef<Statistics> = computed(() => {
    const stats: Statistics = {
      totalTransactions: transactions.value.length,
      avgTransactionAmount: 0,
      avgIncomeAmount: 0,
      avgExpenseAmount: 0,
      mostUsedCategory: null,
      largestTransaction: null,
      savingsRate: 0
    }

    if (transactions.value.length === 0) return stats

    // Average transaction amount
    const totalAmount = transactions.value.reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
    stats.avgTransactionAmount = totalAmount / transactions.value.length

    // Average income/expense amounts
    const incomeTransactions = transactions.value.filter(t => t.type === 'income' || t.type.toUpperCase() === 'INCOME')
    const expenseTransactions = transactions.value.filter(t => t.type === 'expense' || t.type.toUpperCase() === 'EXPENSE')

    if (incomeTransactions.length > 0) {
      stats.avgIncomeAmount = totalIncome.value / incomeTransactions.length
    }

    if (expenseTransactions.length > 0) {
      stats.avgExpenseAmount = totalExpenses.value / expenseTransactions.length
    }

    // Most used category
    const categoryCount: Record<string, number> = {}
    transactions.value.forEach(t => {
      const categoryName = t.category?.name || 'Uncategorized'
      const key = `${t.type}-${categoryName}`
      categoryCount[key] = (categoryCount[key] || 0) + 1
    })

    const mostUsed = Object.entries(categoryCount).reduce((max, [key, count]) =>
      count > max.count ? { category: key, count } : max, { category: null as string | null, count: 0 }
    )

    stats.mostUsedCategory = mostUsed.category

    // Largest transaction
    stats.largestTransaction = transactions.value.reduce((max: Transaction | null, t) =>
      parseFloat(String(t.amount)) > parseFloat(String(max?.amount || 0)) ? t : max, null
    )

    // Savings rate
    if (totalIncome.value > 0) {
      stats.savingsRate = ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100
    }

    return stats
  })

  // Actions - Fetch from API
  const fetchTransactions = async (filterParams: Record<string, unknown> = {}): Promise<{ success: boolean; data?: Transaction[]; message?: string }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.getTransactions(filterParams)

      if (response.success && response.data) {
        transactions.value = response.data
      } else if (Array.isArray(response)) {
        transactions.value = response
      } else {
        transactions.value = []
      }

      return { success: true, data: transactions.value }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions'
      error.value = errorMessage
      console.error('Fetch transactions error:', err)
      // Don't throw, just set empty array
      transactions.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const initializeTransactions = async (): Promise<void> => {
    await fetchTransactions()
  }

  const initializeStore = async (): Promise<void> => {
    await fetchTransactions()
  }

  const addTransaction = async (transactionData: TransactionFormData): Promise<{ success: boolean; transaction?: Transaction }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.createTransaction(transactionData)

      if (response.success && response.data) {
        // Add to local state
        transactions.value.unshift(response.data)
        return { success: true, transaction: response.data }
      }

      throw new Error(response.message || 'Failed to create transaction')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction'
      error.value = errorMessage
      console.error('Add transaction error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id: number, updateData: Partial<TransactionFormData>): Promise<{ success: boolean; transaction?: Transaction }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.updateTransaction(id, updateData)

      if (response.success && response.data) {
        // Update in local state
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transactions.value[index] = response.data
        }
        return { success: true, transaction: response.data }
      }

      throw new Error(response.message || 'Failed to update transaction')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction'
      error.value = errorMessage
      console.error('Update transaction error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id: number): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.deleteTransaction(id)

      if (response.success) {
        // Remove from local state
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transactions.value.splice(index, 1)
        }
        return { success: true, message: 'Transaction deleted successfully' }
      }

      throw new Error(response.message || 'Failed to delete transaction')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction'
      error.value = errorMessage
      console.error('Delete transaction error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteTransactions = async (ids: number[]): Promise<{ success: boolean; deleted: number }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.bulkDeleteTransactions(ids)

      if (response.success) {
        // Remove from local state
        transactions.value = transactions.value.filter(t => !ids.includes(t.id))
        return { success: true, deleted: ids.length }
      }

      throw new Error(response.message || 'Failed to delete transactions')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transactions'
      error.value = errorMessage
      console.error('Bulk delete error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const importTransactions = async (file: File): Promise<{ success: boolean; imported: number }> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.importTransactions(file)

      if (response.success) {
        // Refresh transactions from server
        await fetchTransactions()
        return { success: true, imported: response.imported || 0 }
      }

      throw new Error(response.message || 'Failed to import transactions')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import transactions'
      error.value = errorMessage
      console.error('Import error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportTransactions = async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    try {
      return await transactionService.exportTransactions(format, filters.value)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export transactions'
      error.value = errorMessage
      console.error('Export error:', err)
      throw err
    }
  }

  const clearAllTransactions = async (): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      // This would need a backend endpoint to clear all transactions
      // For now, just clear local state
      transactions.value = []
      return { success: true, message: 'All transactions cleared' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear transactions'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return transactions.value.filter(t => {
      const date = new Date(t.transaction_date || t.created_at)
      return date >= start && date <= end
    })
  }

  const getTransactionsByCategory = (category: string, type: string | null = null): Transaction[] => {
    return transactions.value.filter(t => {
      const categoryName = t.category?.name || ''
      return categoryName === category && (type ? t.type.toUpperCase() === type.toUpperCase() : true)
    })
  }

  const searchTransactions = (query: string): Transaction[] => {
    const searchTerm = query.toLowerCase()
    return transactions.value.filter(t => {
      const categoryName = t.category?.name || ''
      return (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        categoryName.toLowerCase().includes(searchTerm) ||
        t.type.toLowerCase().includes(searchTerm)
    })
  }

  const updateFilters = (newFilters: Partial<TransactionFiltersState>): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = (): void => {
    filters.value = {
      type: '',
      category: '',
      dateRange: {
        start: null,
        end: null
      },
      search: '',
      minAmount: null,
      maxAmount: null
    }
  }

  return {
    // State
    transactions,
    loading,
    error,
    filters,

    // Getters
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    recentTransactions,
    transactionsByCategory,
    monthlyTrends,
    filteredTransactions,
    statistics,

    // Actions
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    importTransactions,
    exportTransactions,
    clearAllTransactions,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    searchTransactions,
    updateFilters,
    clearFilters,
    initializeTransactions,
    initializeStore
  }
})
