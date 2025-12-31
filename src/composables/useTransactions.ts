// src/composables/useTransactions.ts
import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue'
import transactionService from '../services/transactionService'
import { useLocalStorage } from './useLocalStorage'
import { validateTransaction } from '../utils/validators'
import { formatCurrency, formatDate } from '../utils/formatters'
import { groupBy, sortBy } from '../utils/helpers'
import type { Transaction, TransactionType } from '../types'
import type {
  TransactionResponse,
  BulkDeleteResponse,
  ImportResponse,
  ExportResponse
} from '../services/transactionService'

/**
 * Composable for managing transactions
 * Provides comprehensive transaction CRUD operations, filtering, pagination, and analytics
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface TransactionFilters {
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

export interface TransactionStatistics {
  totalTransactions: number
  avgTransactionAmount: number
  avgIncomeAmount: number
  avgExpenseAmount: number
  mostUsedCategory: string | null
  largestTransaction: Transaction | null
  savingsRate: number
}

export interface ImportResult {
  imported: number
  skipped: number
  errors?: any[]
}

export interface UseTransactionsReturn {
  // State
  transactions: Ref<Transaction[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  filters: Ref<TransactionFilters>
  currentPage: Ref<number>
  itemsPerPage: Ref<number>
  totalItems: Ref<number>

  // Computed
  filteredTransactions: ComputedRef<Transaction[]>
  paginatedTransactions: ComputedRef<Transaction[]>
  totalPages: ComputedRef<number>
  hasNextPage: ComputedRef<boolean>
  hasPreviousPage: ComputedRef<boolean>
  totalIncome: ComputedRef<number>
  totalExpenses: ComputedRef<number>
  balance: ComputedRef<number>
  monthlyIncome: ComputedRef<number>
  monthlyExpenses: ComputedRef<number>
  monthlyBalance: ComputedRef<number>
  recentTransactions: ComputedRef<Transaction[]>
  transactionsByCategory: ComputedRef<Record<string, Transaction[]>>
  statistics: ComputedRef<TransactionStatistics>

  // Methods
  fetchTransactions: (options?: Record<string, any>) => Promise<TransactionResponse>
  getTransaction: (id: number) => Promise<Transaction | undefined>
  createTransaction: (transactionData: Partial<Transaction>) => Promise<Transaction | undefined>
  updateTransaction: (id: number, transactionData: Partial<Transaction>) => Promise<Transaction | undefined>
  deleteTransaction: (id: number) => Promise<boolean>
  bulkDeleteTransactions: (ids: number[]) => Promise<number | undefined>
  importTransactions: (file: File, format?: 'csv' | 'json') => Promise<ImportResult>
  exportTransactions: (format?: 'csv' | 'json', filters?: Record<string, any>) => Promise<boolean>

  // Filter methods
  setFilter: (key: keyof TransactionFilters, value: any) => void
  setFilters: (newFilters: Partial<TransactionFilters>) => void
  clearFilters: () => void
  setDateRange: (start: string | null, end: string | null) => void

  // Pagination
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setItemsPerPage: (items: number) => void

  // Utilities
  clearError: () => void
  refreshTransactions: () => Promise<void>
  getTransactionsByCategory: (category: string, type?: TransactionType | null) => Transaction[]
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[]
  searchTransactions: (query: string) => Transaction[]
  formatTransactionAmount: (amount: number, type: TransactionType, currency?: string) => string
  formatTransactionDate: (date: string, format?: string) => string
}

// ============================================================================
// Main Composable
// ============================================================================

export function useTransactions(): UseTransactionsReturn {
  const { getItem, setItem } = useLocalStorage('transaction_filters', null)

  // State
  const transactions = ref<Transaction[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const filters = ref<TransactionFilters>({
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

  // Pagination
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(15)
  const totalItems = ref<number>(0)

  // Computed properties
  const filteredTransactions = computed<Transaction[]>(() => {
    let filtered = [...transactions.value]

    // Apply filters
    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }

    if (filters.value.category) {
      filtered = filtered.filter(t => t.category?.name === filters.value.category)
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        (t.category?.name && t.category.name.toLowerCase().includes(searchTerm)) ||
        t.amount.toString().includes(searchTerm)
      )
    }

    if (filters.value.dateRange.start) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.created_at || t.date)
        return transactionDate >= new Date(filters.value.dateRange.start!)
      })
    }

    if (filters.value.dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.created_at || t.date)
        return transactionDate <= new Date(filters.value.dateRange.end!)
      })
    }

    if (filters.value.minAmount !== null) {
      filtered = filtered.filter(t => t.amount >= filters.value.minAmount!)
    }

    if (filters.value.maxAmount !== null) {
      filtered = filtered.filter(t => t.amount <= filters.value.maxAmount!)
    }

    // Sort by date (newest first)
    return sortBy(filtered, '-created_at', '-date')
  })

  const paginatedTransactions = computed<Transaction[]>(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTransactions.value.slice(start, end)
  })

  const totalPages = computed<number>(() => {
    return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
  })

  const hasNextPage = computed<boolean>(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed<boolean>(() => {
    return currentPage.value > 1
  })

  // Financial calculations
  const totalIncome = computed<number>(() => {
    return transactions.value
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpenses = computed<number>(() => {
    return transactions.value
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed<number>(() => {
    return totalIncome.value - totalExpenses.value
  })

  const monthlyIncome = computed<number>(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions.value
      .filter(t => {
        const date = new Date(t.created_at || t.date)
        return t.type === 'INCOME' &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyExpenses = computed<number>(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions.value
      .filter(t => {
        const date = new Date(t.created_at || t.date)
        return t.type === 'EXPENSE' &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyBalance = computed<number>(() => {
    return monthlyIncome.value - monthlyExpenses.value
  })

  const recentTransactions = computed<Transaction[]>(() => {
    return sortBy(transactions.value, '-created_at', '-date').slice(0, 10)
  })

  const transactionsByCategory = computed<Record<string, Transaction[]>>(() => {
    return groupBy(transactions.value, 'category.name')
  })

  const statistics = computed<TransactionStatistics>(() => {
    const stats: TransactionStatistics = {
      totalTransactions: transactions.value.length,
      avgTransactionAmount: 0,
      avgIncomeAmount: 0,
      avgExpenseAmount: 0,
      mostUsedCategory: null,
      largestTransaction: null,
      savingsRate: 0
    }

    if (transactions.value.length === 0) return stats

    // Average amounts
    const totalAmount = transactions.value.reduce((sum, t) => sum + t.amount, 0)
    stats.avgTransactionAmount = totalAmount / transactions.value.length

    const incomeTransactions = transactions.value.filter(t => t.type === 'INCOME')
    const expenseTransactions = transactions.value.filter(t => t.type === 'EXPENSE')

    if (incomeTransactions.length > 0) {
      stats.avgIncomeAmount = totalIncome.value / incomeTransactions.length
    }

    if (expenseTransactions.length > 0) {
      stats.avgExpenseAmount = totalExpenses.value / expenseTransactions.length
    }

    // Most used category
    const categoryCount: Record<string, number> = {}
    transactions.value.forEach(t => {
      if (t.category?.name) {
        categoryCount[t.category.name] = (categoryCount[t.category.name] || 0) + 1
      }
    })

    const mostUsed = Object.entries(categoryCount).reduce(
      (max, [category, count]) => count > max.count ? { category, count } : max,
      { category: null as string | null, count: 0 }
    )

    stats.mostUsedCategory = mostUsed.category

    // Largest transaction
    stats.largestTransaction = transactions.value.reduce(
      (max, t) => t.amount > (max?.amount || 0) ? t : max,
      null as Transaction | null
    )

    // Savings rate
    if (totalIncome.value > 0) {
      stats.savingsRate = ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100
    }

    return stats
  })

  // Methods
  const fetchTransactions = async (options: Record<string, any> = {}): Promise<TransactionResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.getTransactions(options)

      if (response.success) {
        transactions.value = response.transactions || []
        totalItems.value = response.total || transactions.value.length
        return response
      }

      throw new Error(response.message || 'Failed to fetch transactions')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransaction = async (id: number): Promise<Transaction | undefined> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.getTransaction(id)

      if (response.success) {
        return response.transaction
      }

      throw new Error(response.message || 'Failed to fetch transaction')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction | undefined> => {
    loading.value = true
    error.value = null

    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw new Error('Invalid transaction data')
      }

      const response = await transactionService.createTransaction(transactionData)

      if (response.success && response.data) {
        // Add to local state
        const newTransaction = response.data as Transaction
        transactions.value.unshift(newTransaction)
        return newTransaction
      }

      throw new Error(response.message || 'Failed to create transaction')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> => {
    loading.value = true
    error.value = null

    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw new Error('Invalid transaction data')
      }

      const response = await transactionService.updateTransaction(id, transactionData)

      if (response.success && response.data) {
        // Update local state
        const updatedTransaction = response.data as Transaction
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transactions.value[index] = updatedTransaction
        }
        return updatedTransaction
      }

      throw new Error(response.message || 'Failed to update transaction')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.deleteTransaction(id)

      if (response.success) {
        // Remove from local state
        transactions.value = transactions.value.filter(t => t.id !== id)
        return true
      }

      throw new Error(response.message || 'Failed to delete transaction')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteTransactions = async (ids: number[]): Promise<number | undefined> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.bulkDeleteTransactions(ids)

      if (response.success) {
        // Remove from local state
        transactions.value = transactions.value.filter(t => !ids.includes(t.id))
        return response.deletedCount
      }

      throw new Error(response.message || 'Failed to delete transactions')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const importTransactions = async (file: File, format: 'csv' | 'json' = 'csv'): Promise<ImportResult> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.importTransactions(file, format)

      if (response.success) {
        // Refresh transactions after import
        await fetchTransactions()
        return {
          imported: response.importedCount || 0,
          skipped: response.skippedCount || 0,
          errors: response.errors
        }
      }

      throw new Error(response.message || 'Failed to import transactions')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportTransactions = async (format: 'csv' | 'json' = 'csv', filters: Record<string, any> = {}): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.exportTransactions(filters, format)

      if (response.success) {
        return true
      }

      throw new Error(response.message || 'Failed to export transactions')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter methods
  const setFilter = (key: keyof TransactionFilters, value: any): void => {
    (filters.value[key] as any) = value
    currentPage.value = 1 // Reset to first page when filtering
  }

  const setFilters = (newFilters: Partial<TransactionFilters>): void => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
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
    currentPage.value = 1
  }

  const setDateRange = (start: string | null, end: string | null): void => {
    filters.value.dateRange = { start, end }
    currentPage.value = 1
  }

  // Pagination methods
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = (): void => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = (): void => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const setItemsPerPage = (items: number): void => {
    itemsPerPage.value = items
    currentPage.value = 1
  }

  // Utility methods
  const clearError = (): void => {
    error.value = null
  }

  const refreshTransactions = async (): Promise<void> => {
    await fetchTransactions()
  }

  const getTransactionsByCategory = (category: string, type: TransactionType | null = null): Transaction[] => {
    return transactions.value.filter(t =>
      t.category?.name === category && (type ? t.type === type : true)
    )
  }

  const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return transactions.value.filter(t => {
      const date = new Date(t.created_at || t.date)
      return date >= start && date <= end
    })
  }

  const searchTransactions = (query: string): Transaction[] => {
    const searchTerm = query.toLowerCase()
    return transactions.value.filter(t =>
      (t.description && t.description.toLowerCase().includes(searchTerm)) ||
      (t.category?.name && t.category.name.toLowerCase().includes(searchTerm)) ||
      t.type.toLowerCase().includes(searchTerm)
    )
  }

  // Formatting helpers
  const formatTransactionAmount = (amount: number, type: TransactionType, currency: string = 'USD'): string => {
    const sign = type === 'INCOME' ? '+' : '-'
    const formatted = formatCurrency(Math.abs(amount), currency)
    return `${sign}${formatted}`
  }

  const formatTransactionDate = (date: string, format: string = 'MM/DD/YYYY'): string => {
    return formatDate(date, format)
  }

  // Watch for filter changes and persist to localStorage
  watch(
    filters,
    (newFilters) => {
      setItem('transaction_filters', newFilters)
    },
    { deep: true }
  )

  // Initialize filters from localStorage
  const initializeFilters = (): void => {
    const savedFilters = getItem('transaction_filters')
    if (savedFilters) {
      filters.value = { ...filters.value, ...savedFilters.value }
    }
  }

  // Auto-initialize
  nextTick(() => {
    initializeFilters()
  })

  return {
    // State
    transactions,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    totalItems,

    // Computed
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    recentTransactions,
    transactionsByCategory,
    statistics,

    // Methods
    fetchTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    importTransactions,
    exportTransactions,

    // Filter methods
    setFilter,
    setFilters,
    clearFilters,
    setDateRange,

    // Pagination
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,

    // Utilities
    clearError,
    refreshTransactions,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    searchTransactions,
    formatTransactionAmount,
    formatTransactionDate
  }
}
