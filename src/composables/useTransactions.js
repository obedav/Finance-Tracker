// src/composables/useTransactions.js
import { ref, computed, watch, nextTick } from 'vue'
import transactionService from '../services/transactionService.js'
import { useLocalStorage } from './useLocalStorage.js'
import { validateTransaction } from '../utils/validators.js'
import { formatCurrency, formatDate } from '../utils/formatters.js'
import { groupBy, sortBy } from '../utils/helpers.js'

export function useTransactions() {
  const { getItem, setItem } = useLocalStorage()

  // State
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
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
  const currentPage = ref(1)
  const itemsPerPage = ref(15)
  const totalItems = ref(0)

  // Computed properties
  const filteredTransactions = computed(() => {
    let filtered = [...transactions.value]

    // Apply filters
    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }

    if (filters.value.category) {
      filtered = filtered.filter(t => t.category === filters.value.category)
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        t.category.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm)
      )
    }

    if (filters.value.dateRange.start) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt || t.date)
        return transactionDate >= new Date(filters.value.dateRange.start)
      })
    }

    if (filters.value.dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt || t.date)
        return transactionDate <= new Date(filters.value.dateRange.end)
      })
    }

    if (filters.value.minAmount !== null) {
      filtered = filtered.filter(t => t.amount >= filters.value.minAmount)
    }

    if (filters.value.maxAmount !== null) {
      filtered = filtered.filter(t => t.amount <= filters.value.maxAmount)
    }

    // Sort by date (newest first)
    return sortBy(filtered, '-createdAt', '-date')
  })

  const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTransactions.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  // Financial calculations
  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed(() => {
    return totalIncome.value - totalExpenses.value
  })

  const monthlyIncome = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return transactions.value
      .filter(t => {
        const date = new Date(t.createdAt || t.date)
        return t.type === 'income' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyExpenses = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return transactions.value
      .filter(t => {
        const date = new Date(t.createdAt || t.date)
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyBalance = computed(() => {
    return monthlyIncome.value - monthlyExpenses.value
  })

  const recentTransactions = computed(() => {
    return sortBy(transactions.value, '-createdAt', '-date').slice(0, 10)
  })

  const transactionsByCategory = computed(() => {
    return groupBy(transactions.value, 'category')
  })

  const statistics = computed(() => {
    const stats = {
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

    const incomeTransactions = transactions.value.filter(t => t.type === 'income')
    const expenseTransactions = transactions.value.filter(t => t.type === 'expense')

    if (incomeTransactions.length > 0) {
      stats.avgIncomeAmount = totalIncome.value / incomeTransactions.length
    }

    if (expenseTransactions.length > 0) {
      stats.avgExpenseAmount = totalExpenses.value / expenseTransactions.length
    }

    // Most used category
    const categoryCount = {}
    transactions.value.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
    })

    const mostUsed = Object.entries(categoryCount).reduce(
      (max, [category, count]) => count > max.count ? { category, count } : max,
      { category: null, count: 0 }
    )

    stats.mostUsedCategory = mostUsed.category

    // Largest transaction
    stats.largestTransaction = transactions.value.reduce(
      (max, t) => t.amount > (max?.amount || 0) ? t : max,
      null
    )

    // Savings rate
    if (totalIncome.value > 0) {
      stats.savingsRate = ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100
    }

    return stats
  })

  // Methods
  const fetchTransactions = async (options = {}) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransaction = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.getTransaction(id)
      
      if (response.success) {
        return response.transaction
      }
      
      throw new Error(response.message || 'Failed to fetch transaction')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (transactionData) => {
    loading.value = true
    error.value = null

    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw new Error('Invalid transaction data')
      }

      const response = await transactionService.createTransaction(transactionData)
      
      if (response.success) {
        // Add to local state
        transactions.value.unshift(response.transaction)
        return response.transaction
      }
      
      throw new Error(response.message || 'Failed to create transaction')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, transactionData) => {
    loading.value = true
    error.value = null

    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw new Error('Invalid transaction data')
      }

      const response = await transactionService.updateTransaction(id, transactionData)
      
      if (response.success) {
        // Update local state
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transactions.value[index] = response.transaction
        }
        return response.transaction
      }
      
      throw new Error(response.message || 'Failed to update transaction')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteTransactions = async (ids) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const importTransactions = async (file, format = 'csv') => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.importTransactions(file, format)
      
      if (response.success) {
        // Refresh transactions after import
        await fetchTransactions()
        return {
          imported: response.importedCount,
          skipped: response.skippedCount,
          errors: response.errors
        }
      }
      
      throw new Error(response.message || 'Failed to import transactions')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportTransactions = async (format = 'csv', filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.exportTransactions(filters, format)
      
      if (response.success) {
        return true
      }
      
      throw new Error(response.message || 'Failed to export transactions')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter methods
  const setFilter = (key, value) => {
    filters.value[key] = value
    currentPage.value = 1 // Reset to first page when filtering
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
  }

  const clearFilters = () => {
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

  const setDateRange = (start, end) => {
    filters.value.dateRange = { start, end }
    currentPage.value = 1
  }

  // Pagination methods
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const setItemsPerPage = (items) => {
    itemsPerPage.value = items
    currentPage.value = 1
  }

  // Utility methods
  const clearError = () => {
    error.value = null
  }

  const refreshTransactions = async () => {
    await fetchTransactions()
  }

  const getTransactionsByCategory = (category, type = null) => {
    return transactions.value.filter(t => 
      t.category === category && (type ? t.type === type : true)
    )
  }

  const getTransactionsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return transactions.value.filter(t => {
      const date = new Date(t.createdAt || t.date)
      return date >= start && date <= end
    })
  }

  const searchTransactions = (query) => {
    const searchTerm = query.toLowerCase()
    return transactions.value.filter(t => 
      (t.description && t.description.toLowerCase().includes(searchTerm)) ||
      t.category.toLowerCase().includes(searchTerm) ||
      t.type.toLowerCase().includes(searchTerm)
    )
  }

  // Formatting helpers
  const formatTransactionAmount = (amount, type, currency = 'USD') => {
    const sign = type === 'income' ? '+' : '-'
    const formatted = formatCurrency(Math.abs(amount), currency)
    return `${sign}${formatted}`
  }

  const formatTransactionDate = (date, format = 'MM/DD/YYYY') => {
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
  const initializeFilters = () => {
    const savedFilters = getItem('transaction_filters')
    if (savedFilters) {
      filters.value = { ...filters.value, ...savedFilters }
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