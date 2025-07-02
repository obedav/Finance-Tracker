// src/services/transactionService.js
import { apiHelpers, mockApiHelpers } from './api.js'
import { API_ENDPOINTS } from '../utils/constants.js'
import { validateTransaction } from '../utils/validators.js'

// Flag to use mock API or real API
const USE_MOCK_API = process.env.VUE_APP_USE_MOCK_API === 'true' || true

class TransactionService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Transaction CRUD Operations
   */

  // Get all transactions with optional filters
  async getTransactions(filters = {}) {
    try {
      const cacheKey = this.generateCacheKey('transactions', filters)
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactions(filters)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = this.buildQueryParams(filters)
      const response = await apiHelpers.get(`${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryParams}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('Get transactions error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to fetch transactions',
        code: error.code || 'FETCH_TRANSACTIONS_ERROR'
      }
    }
  }

  // Get single transaction by ID
  async getTransaction(id) {
    try {
      const cacheKey = this.generateCacheKey('transaction', { id })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransaction(id)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`${API_ENDPOINTS.TRANSACTIONS.LIST}/${id}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('Get transaction error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to fetch transaction',
        code: error.code || 'FETCH_TRANSACTION_ERROR'
      }
    }
  }

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw {
          success: false,
          message: 'Invalid transaction data',
          errors: validation.errors,
          code: 'VALIDATION_ERROR'
        }
      }

      if (USE_MOCK_API) {
        const result = await this.mockCreateTransaction(transactionData)
        this.clearCache() // Clear cache after creation
        return result
      }

      const response = await apiHelpers.post(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData)
      
      this.clearCache() // Clear cache after creation
      return {
        success: true,
        transaction: response.transaction,
        message: response.message || 'Transaction created successfully'
      }
    } catch (error) {
      console.error('Create transaction error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to create transaction',
        code: error.code || 'CREATE_TRANSACTION_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Update existing transaction
  async updateTransaction(id, transactionData) {
    try {
      // Validate transaction data
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        throw {
          success: false,
          message: 'Invalid transaction data',
          errors: validation.errors,
          code: 'VALIDATION_ERROR'
        }
      }

      if (USE_MOCK_API) {
        const result = await this.mockUpdateTransaction(id, transactionData)
        this.clearCache() // Clear cache after update
        return result
      }

      const url = API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id)
      const response = await apiHelpers.put(url, transactionData)
      
      this.clearCache() // Clear cache after update
      return {
        success: true,
        transaction: response.transaction,
        message: response.message || 'Transaction updated successfully'
      }
    } catch (error) {
      console.error('Update transaction error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to update transaction',
        code: error.code || 'UPDATE_TRANSACTION_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Delete transaction
  async deleteTransaction(id) {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockDeleteTransaction(id)
        this.clearCache() // Clear cache after deletion
        return result
      }

      const url = API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', id)
      const response = await apiHelpers.delete(url)
      
      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Transaction deleted successfully'
      }
    } catch (error) {
      console.error('Delete transaction error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to delete transaction',
        code: error.code || 'DELETE_TRANSACTION_ERROR'
      }
    }
  }

  // Bulk delete transactions
  async bulkDeleteTransactions(ids) {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockBulkDeleteTransactions(ids)
        this.clearCache() // Clear cache after deletion
        return result
      }

      const response = await apiHelpers.post(API_ENDPOINTS.TRANSACTIONS.BULK_DELETE, { ids })
      
      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        deletedCount: response.deletedCount,
        message: response.message || `${response.deletedCount} transactions deleted successfully`
      }
    } catch (error) {
      console.error('Bulk delete transactions error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to delete transactions',
        code: error.code || 'BULK_DELETE_ERROR'
      }
    }
  }

  /**
   * Import/Export Operations
   */

  // Import transactions from file
  async importTransactions(file, format = 'csv') {
    try {
      if (USE_MOCK_API) {
        return await this.mockImportTransactions(file, format)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', format)

      const response = await apiHelpers.upload(API_ENDPOINTS.TRANSACTIONS.IMPORT, formData, 
        (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`Upload progress: ${percentCompleted}%`)
        }
      )

      this.clearCache() // Clear cache after import
      return {
        success: true,
        importedCount: response.importedCount,
        skippedCount: response.skippedCount || 0,
        errors: response.errors || [],
        message: response.message || `${response.importedCount} transactions imported successfully`
      }
    } catch (error) {
      console.error('Import transactions error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to import transactions',
        code: error.code || 'IMPORT_ERROR'
      }
    }
  }

  // Export transactions
  async exportTransactions(filters = {}, format = 'csv') {
    try {
      if (USE_MOCK_API) {
        return await this.mockExportTransactions(filters, format)
      }

      const queryParams = this.buildQueryParams({ ...filters, format })
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.${format}`
      
      await apiHelpers.download(`${API_ENDPOINTS.TRANSACTIONS.EXPORT}?${queryParams}`, filename)
      
      return {
        success: true,
        message: 'Transactions exported successfully'
      }
    } catch (error) {
      console.error('Export transactions error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to export transactions',
        code: error.code || 'EXPORT_ERROR'
      }
    }
  }

  /**
   * Analytics and Statistics
   */

  // Get transaction statistics
  async getTransactionStats(period = 'month') {
    try {
      const cacheKey = this.generateCacheKey('stats', { period })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactionStats(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`/transactions/stats?period=${period}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('Get transaction stats error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to fetch transaction statistics',
        code: error.code || 'FETCH_STATS_ERROR'
      }
    }
  }

  // Get transactions by category
  async getTransactionsByCategory(type = null, period = 'month') {
    try {
      const cacheKey = this.generateCacheKey('categoryStats', { type, period })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactionsByCategory(type, period)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = this.buildQueryParams({ type, period })
      const response = await apiHelpers.get(`/transactions/by-category?${queryParams}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('Get transactions by category error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to fetch category statistics',
        code: error.code || 'FETCH_CATEGORY_STATS_ERROR'
      }
    }
  }

  // Get monthly trends
  async getMonthlyTrends(months = 12) {
    try {
      const cacheKey = this.generateCacheKey('trends', { months })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetMonthlyTrends(months)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`/transactions/trends?months=${months}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error('Get monthly trends error:', error)
      throw {
        success: false,
        message: error.message || 'Failed to fetch monthly trends',
        code: error.code || 'FETCH_TRENDS_ERROR'
      }
    }
  }

  /**
   * Utility Methods
   */

  // Build query parameters
  buildQueryParams(filters) {
    const params = new URLSearchParams()
    
    Object.keys(filters).forEach(key => {
      const value = filters[key]
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value)
      }
    })
    
    return params.toString()
  }

  // Generate cache key
  generateCacheKey(operation, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    
    return `${operation}:${paramString}`
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    
    if (!cached) return null
    
    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  clearCache() {
    this.cache.clear()
  }

  /**
   * Mock API Methods (for development)
   */

  async mockGetTransactions(filters = {}) {
    await mockApiHelpers.delay(500)
    
    // Generate mock transactions
    const mockTransactions = this.generateMockTransactions()
    
    // Apply filters
    let filtered = mockTransactions
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate))
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate))
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        t.category.toLowerCase().includes(searchTerm)
      )
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Pagination
    const page = parseInt(filters.page) || 1
    const limit = parseInt(filters.limit) || 50
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      success: true,
      transactions: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: endIndex < filtered.length
    }
  }

  async mockGetTransaction(id) {
    await mockApiHelpers.delay(300)
    
    const mockTransactions = this.generateMockTransactions()
    const transaction = mockTransactions.find(t => t.id === parseInt(id))
    
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    
    return {
      success: true,
      transaction
    }
  }

  async mockCreateTransaction(transactionData) {
    await mockApiHelpers.delay(400)
    
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return {
      success: true,
      transaction: newTransaction,
      message: 'Transaction created successfully'
    }
  }

  async mockUpdateTransaction(id, transactionData) {
    await mockApiHelpers.delay(400)
    
    const updatedTransaction = {
      id: parseInt(id),
      ...transactionData,
      updatedAt: new Date()
    }
    
    return {
      success: true,
      transaction: updatedTransaction,
      message: 'Transaction updated successfully'
    }
  }

  async mockDeleteTransaction(id) {
    await mockApiHelpers.delay(300)
    
    return {
      success: true,
      message: 'Transaction deleted successfully'
    }
  }

  async mockBulkDeleteTransactions(ids) {
    await mockApiHelpers.delay(600)
    
    return {
      success: true,
      deletedCount: ids.length,
      message: `${ids.length} transactions deleted successfully`
    }
  }

  async mockImportTransactions(file, format) {
    await mockApiHelpers.delay(2000)
    
    const importedCount = Math.floor(Math.random() * 50) + 10
    const skippedCount = Math.floor(Math.random() * 5)
    
    return {
      success: true,
      importedCount,
      skippedCount,
      errors: [],
      message: `${importedCount} transactions imported successfully`
    }
  }

  async mockExportTransactions(filters, format) {
    await mockApiHelpers.delay(1000)
    
    // Simulate file download
    const data = this.generateMockTransactions()
    let content = ''
    
    if (format === 'csv') {
      content = this.convertToCSV(data)
    } else {
      content = JSON.stringify(data, null, 2)
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return {
      success: true,
      message: 'Transactions exported successfully'
    }
  }

  async mockGetTransactionStats(period) {
    await mockApiHelpers.delay(400)
    
    return {
      success: true,
      stats: {
        totalTransactions: 156,
        totalIncome: 5420.50,
        totalExpenses: 3890.25,
        netAmount: 1530.25,
        averageTransaction: 34.74,
        period: period
      }
    }
  }

  async mockGetTransactionsByCategory(type, period) {
    await mockApiHelpers.delay(400)
    
    const categories = type === 'income' 
      ? ['Salary', 'Freelance', 'Investment', 'Other']
      : ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment']
    
    const categoryData = categories.map(category => ({
      category,
      amount: Math.random() * 1000 + 100,
      count: Math.floor(Math.random() * 20) + 5,
      percentage: Math.random() * 100
    }))
    
    return {
      success: true,
      categories: categoryData,
      period,
      type
    }
  }

  async mockGetMonthlyTrends(months) {
    await mockApiHelpers.delay(500)
    
    const trends = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      trends.push({
        month: date.toISOString().substr(0, 7),
        income: Math.random() * 2000 + 1000,
        expenses: Math.random() * 1500 + 800,
        transactions: Math.floor(Math.random() * 30) + 10
      })
    }
    
    return {
      success: true,
      trends,
      months
    }
  }

  // Generate mock transaction data
  generateMockTransactions() {
    const categories = {
      income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
      expense: ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare']
    }
    
    const descriptions = {
      'Food & Dining': ['Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Fast food lunch'],
      'Transportation': ['Gas station', 'Bus fare', 'Uber ride', 'Car maintenance'],
      'Shopping': ['Online purchase', 'Clothing store', 'Electronics', 'Home supplies'],
      'Salary': ['Monthly salary', 'Bonus payment', 'Overtime pay'],
      'Freelance': ['Client project', 'Consulting work', 'Design project']
    }
    
    const transactions = []
    
    for (let i = 0; i < 100; i++) {
      const type = Math.random() > 0.3 ? 'expense' : 'income'
      const categoryList = categories[type]
      const category = categoryList[Math.floor(Math.random() * categoryList.length)]
      const descriptionList = descriptions[category] || ['Transaction']
      const description = descriptionList[Math.floor(Math.random() * descriptionList.length)]
      
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))
      
      transactions.push({
        id: i + 1,
        type,
        category,
        description,
        amount: Math.round((Math.random() * (type === 'income' ? 2000 : 500) + 10) * 100) / 100,
        date: date.toISOString().split('T')[0],
        status: 'completed',
        createdAt: date,
        updatedAt: date
      })
    }
    
    return transactions
  }

  // Convert data to CSV format
  convertToCSV(data) {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status']
    const rows = data.map(transaction => [
      transaction.date,
      transaction.type,
      transaction.category,
      `"${transaction.description || ''}"`,
      transaction.amount,
      transaction.status
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}

// Create and export singleton instance
const transactionService = new TransactionService()

export default transactionService