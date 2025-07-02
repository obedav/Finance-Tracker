// src/stores/transactions.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTransactionStore = defineStore('transactions', () => {
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

  // Sample data for demo purposes
  const sampleTransactions = [
    {
      id: 1,
      type: 'income',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary payment',
      date: new Date('2024-06-01'),
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01'),
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      amount: 1200,
      category: 'Food & Dining',
      description: 'Grocery shopping',
      date: new Date('2024-06-02'),
      createdAt: new Date('2024-06-02'),
      updatedAt: new Date('2024-06-02'),
      status: 'completed'
    },
    {
      id: 3,
      type: 'expense',
      amount: 800,
      category: 'Transportation',
      description: 'Gas and car maintenance',
      date: new Date('2024-06-03'),
      createdAt: new Date('2024-06-03'),
      updatedAt: new Date('2024-06-03'),
      status: 'completed'
    },
    {
      id: 4,
      type: 'income',
      amount: 500,
      category: 'Freelance',
      description: 'Web development project',
      date: new Date('2024-06-04'),
      createdAt: new Date('2024-06-04'),
      updatedAt: new Date('2024-06-04'),
      status: 'completed'
    },
    {
      id: 5,
      type: 'expense',
      amount: 150,
      category: 'Entertainment',
      description: 'Movie tickets and dinner',
      date: new Date('2024-06-05'),
      createdAt: new Date('2024-06-05'),
      updatedAt: new Date('2024-06-05'),
      status: 'completed'
    }
  ]

  // Getters
  const totalIncome = computed(() => 
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpenses = computed(() => 
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const balance = computed(() => totalIncome.value - totalExpenses.value)

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

  const monthlyBalance = computed(() => monthlyIncome.value - monthlyExpenses.value)

  const recentTransactions = computed(() => 
    transactions.value
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 10)
  )

  const transactionsByCategory = computed(() => {
    const grouped = {}
    
    transactions.value.forEach(transaction => {
      const key = `${transaction.type}-${transaction.category}`
      if (!grouped[key]) {
        grouped[key] = {
          category: transaction.category,
          type: transaction.type,
          transactions: [],
          totalAmount: 0,
          count: 0
        }
      }
      
      grouped[key].transactions.push(transaction)
      grouped[key].totalAmount += transaction.amount
      grouped[key].count += 1
    })
    
    return grouped
  })

  const monthlyTrends = computed(() => {
    const trends = {}
    
    transactions.value.forEach(transaction => {
      const date = new Date(transaction.createdAt || transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!trends[monthKey]) {
        trends[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0,
          transactions: 0
        }
      }
      
      if (transaction.type === 'income') {
        trends[monthKey].income += transaction.amount
      } else {
        trends[monthKey].expenses += transaction.amount
      }
      
      trends[monthKey].transactions += 1
    })
    
    return Object.values(trends).sort((a, b) => a.month.localeCompare(b.month))
  })

  const filteredTransactions = computed(() => {
    let filtered = [...transactions.value]
    
    // Filter by type
    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }
    
    // Filter by category
    if (filters.value.category) {
      filtered = filtered.filter(t => t.category === filters.value.category)
    }
    
    // Filter by date range
    if (filters.value.dateRange.start && filters.value.dateRange.end) {
      const start = new Date(filters.value.dateRange.start)
      const end = new Date(filters.value.dateRange.end)
      filtered = filtered.filter(t => {
        const date = new Date(t.createdAt || t.date)
        return date >= start && date <= end
      })
    }
    
    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t => 
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        t.category.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm)
      )
    }
    
    // Filter by amount range
    if (filters.value.minAmount !== null) {
      filtered = filtered.filter(t => t.amount >= filters.value.minAmount)
    }
    
    if (filters.value.maxAmount !== null) {
      filtered = filtered.filter(t => t.amount <= filters.value.maxAmount)
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    )
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

    // Average transaction amount
    const totalAmount = transactions.value.reduce((sum, t) => sum + t.amount, 0)
    stats.avgTransactionAmount = totalAmount / transactions.value.length

    // Average income/expense amounts
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
      const key = `${t.type}-${t.category}`
      categoryCount[key] = (categoryCount[key] || 0) + 1
    })

    const mostUsed = Object.entries(categoryCount).reduce((max, [key, count]) => 
      count > max.count ? { category: key, count } : max, { category: null, count: 0 }
    )

    stats.mostUsedCategory = mostUsed.category

    // Largest transaction
    stats.largestTransaction = transactions.value.reduce((max, t) => 
      t.amount > (max?.amount || 0) ? t : max, null
    )

    // Savings rate
    if (totalIncome.value > 0) {
      stats.savingsRate = ((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100
    }

    return stats
  })

  // Actions
  const initializeTransactions = () => {
    const storedTransactions = localStorage.getItem('finance_transactions')
    
    if (storedTransactions) {
      try {
        transactions.value = JSON.parse(storedTransactions)
      } catch (err) {
        console.error('Failed to parse stored transactions:', err)
        // If stored data is corrupted, use sample data
        transactions.value = [...sampleTransactions]
        saveToStorage()
      }
    } else {
      // No stored data, use sample data for demo
      transactions.value = [...sampleTransactions]
      saveToStorage()
    }
  }

  // This is the method that was missing - alias for initializeTransactions
  const initializeStore = () => {
    initializeTransactions()
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem('finance_transactions', JSON.stringify(transactions.value))
    } catch (err) {
      console.error('Failed to save transactions to localStorage:', err)
    }
  }

  const addTransaction = async (transactionData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const newTransaction = {
        id: Date.now() + Math.random(), // Ensure unique ID
        ...transactionData,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      transactions.value.unshift(newTransaction)
      saveToStorage()

      return { success: true, transaction: newTransaction }
    } catch (err) {
      error.value = err.message || 'Failed to add transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, updateData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 400))

      const index = transactions.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction not found')
      }

      transactions.value[index] = {
        ...transactions.value[index],
        ...updateData,
        updatedAt: new Date()
      }

      saveToStorage()

      return { success: true, transaction: transactions.value[index] }
    } catch (err) {
      error.value = err.message || 'Failed to update transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200))

      const index = transactions.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction not found')
      }

      transactions.value.splice(index, 1)
      saveToStorage()

      return { success: true, message: 'Transaction deleted successfully' }
    } catch (err) {
      error.value = err.message || 'Failed to delete transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteTransactions = async (ids) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600))

      transactions.value = transactions.value.filter(t => !ids.includes(t.id))
      saveToStorage()

      return { success: true, deleted: ids.length }
    } catch (err) {
      error.value = err.message || 'Failed to delete transactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const importTransactions = async (transactionsData) => {
    loading.value = true
    error.value = null

    try {
      // Validate transactions data
      if (!Array.isArray(transactionsData)) {
        throw new Error('Invalid transactions data format')
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newTransactions = transactionsData.map(t => ({
        ...t,
        id: Date.now() + Math.random(),
        status: 'completed',
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: new Date()
      }))

      transactions.value = [...transactions.value, ...newTransactions]
      saveToStorage()

      return { success: true, imported: newTransactions.length }
    } catch (err) {
      error.value = err.message || 'Failed to import transactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportTransactions = (format = 'json') => {
    const exportData = transactions.value.map(t => ({
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: t.date || t.createdAt,
      status: t.status
    }))

    if (format === 'csv') {
      const headers = ['Type', 'Amount', 'Category', 'Description', 'Date', 'Status']
      const csvContent = [
        headers.join(','),
        ...exportData.map(t => [
          t.type,
          t.amount,
          t.category,
          `"${t.description || ''}"`,
          new Date(t.date).toISOString().split('T')[0],
          t.status
        ].join(','))
      ].join('\n')

      return csvContent
    }

    return {
      transactions: exportData,
      summary: {
        totalTransactions: transactions.value.length,
        totalIncome: totalIncome.value,
        totalExpenses: totalExpenses.value,
        balance: balance.value
      },
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }

  const clearAllTransactions = async () => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      transactions.value = []
      saveToStorage()

      return { success: true, message: 'All transactions cleared' }
    } catch (err) {
      error.value = err.message || 'Failed to clear transactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return transactions.value.filter(t => {
      const date = new Date(t.createdAt || t.date)
      return date >= start && date <= end
    })
  }

  const getTransactionsByCategory = (category, type = null) => {
    return transactions.value.filter(t => 
      t.category === category && (type ? t.type === type : true)
    )
  }

  const searchTransactions = (query) => {
    const searchTerm = query.toLowerCase()
    return transactions.value.filter(t => 
      (t.description && t.description.toLowerCase().includes(searchTerm)) ||
      t.category.toLowerCase().includes(searchTerm) ||
      t.type.toLowerCase().includes(searchTerm)
    )
  }

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
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
  }

  // Watch transactions and save to localStorage (with error handling)
  watch(
    transactions,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Initialize transactions on store creation
  initializeTransactions()

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
    initializeStore, // Added this missing method
    saveToStorage
  }
})