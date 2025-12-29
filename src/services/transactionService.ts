// src/services/transactionService.ts
import { apiHelpers, mockApiHelpers } from './api'
import { API_ENDPOINTS } from '../utils/constants'
import { validateTransaction } from '../utils/validators'
import type { Transaction } from '../types'

/**
 * Type Definitions for Transaction Service
 */

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | string
  category?: string
  category_id?: number
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
  status?: string
}

export interface TransactionResponse {
  success: boolean
  data?: Transaction | Transaction[]
  transaction?: Transaction
  transactions?: Transaction[]
  total?: number
  page?: number
  totalPages?: number
  hasMore?: boolean
  message?: string
  code?: string
  errors?: Record<string, string>
}

export interface BulkDeleteResponse {
  success: boolean
  deletedCount?: number
  message?: string
  code?: string
}

export interface ImportResponse {
  success: boolean
  importedCount?: number
  skippedCount?: number
  errors?: any[]
  message?: string
  code?: string
}

export interface ExportResponse {
  success: boolean
  message?: string
  code?: string
}

export interface TransactionStats {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  netAmount: number
  averageTransaction: number
  period: string
}

export interface CategoryStat {
  category: string
  amount: number
  count: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  transactions: number
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const USE_MOCK_API = false  // Changed to use real Laravel API

class TransactionService {
  private cache: Map<string, CacheEntry<any>>
  private cacheTimeout: number

  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Transaction CRUD Operations
   */

  // Get all transactions with optional filters
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionResponse> {
    try {
      const cacheKey = this.generateCacheKey('transactions', filters)
      const cached = this.getFromCache<TransactionResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactions(filters)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = this.buildQueryParams(filters)
      const response = await apiHelpers.get<TransactionResponse>(`${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryParams}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch transactions',
        code: error.code || 'FETCH_TRANSACTIONS_ERROR'
      }
    }
  }

  // Get single transaction by ID
  async getTransaction(id: number): Promise<TransactionResponse> {
    try {
      const cacheKey = this.generateCacheKey('transaction', { id })
      const cached = this.getFromCache<TransactionResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransaction(id)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<TransactionResponse>(`${API_ENDPOINTS.TRANSACTIONS.LIST}/${id}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch transaction',
        code: error.code || 'FETCH_TRANSACTION_ERROR'
      }
    }
  }

  // Create new transaction
  async createTransaction(transactionData: Partial<Transaction>): Promise<TransactionResponse> {
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

      const response = await apiHelpers.post<TransactionResponse>(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData)

      this.clearCache() // Clear cache after creation

      // Backend returns { success, message, data }
      // apiHelpers.post already extracts response.data, so response IS the backend JSON
      return {
        success: response.success ?? true,
        data: response.data,  // This is the transaction object from backend
        message: response.message || 'Transaction created successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to create transaction',
        code: error.code || 'CREATE_TRANSACTION_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Update existing transaction
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<TransactionResponse> {
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

      const url = API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', String(id))
      const response = await apiHelpers.put<TransactionResponse>(url, transactionData)

      this.clearCache() // Clear cache after update

      // Backend returns { success, message, data }
      // apiHelpers.put already extracts response.data, so response IS the backend JSON
      return {
        success: response.success ?? true,
        data: response.data,  // This is the transaction object from backend
        message: response.message || 'Transaction updated successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to update transaction',
        code: error.code || 'UPDATE_TRANSACTION_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Delete transaction
  async deleteTransaction(id: number): Promise<TransactionResponse> {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockDeleteTransaction(id)
        this.clearCache() // Clear cache after deletion
        return result
      }

      const url = API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', String(id))
      const response = await apiHelpers.delete<TransactionResponse>(url)

      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Transaction deleted successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to delete transaction',
        code: error.code || 'DELETE_TRANSACTION_ERROR'
      }
    }
  }

  // Bulk delete transactions
  async bulkDeleteTransactions(ids: number[]): Promise<BulkDeleteResponse> {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockBulkDeleteTransactions(ids)
        this.clearCache() // Clear cache after deletion
        return result
      }

      const response = await apiHelpers.post<BulkDeleteResponse>(API_ENDPOINTS.TRANSACTIONS.BULK_DELETE, { ids })

      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        deletedCount: response.deletedCount,
        message: response.message || `${response.deletedCount} transactions deleted successfully`
      }
    } catch (error: any) {
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
  async importTransactions(file: File, format: 'csv' | 'json' = 'csv'): Promise<ImportResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockImportTransactions(file, format)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', format)

      const response = await apiHelpers.upload<ImportResponse>(
        API_ENDPOINTS.TRANSACTIONS.IMPORT,
        formData,
        (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
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
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to import transactions',
        code: error.code || 'IMPORT_ERROR'
      }
    }
  }

  // Export transactions
  async exportTransactions(filters: TransactionFilters = {}, format: 'csv' | 'json' = 'csv'): Promise<ExportResponse> {
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
    } catch (error: any) {
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
  async getTransactionStats(period: string = 'month'): Promise<{ success: boolean; stats: TransactionStats }> {
    try {
      const cacheKey = this.generateCacheKey('stats', { period })
      const cached = this.getFromCache<{ success: boolean; stats: TransactionStats }>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactionStats(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<{ success: boolean; stats: TransactionStats }>(`/transactions/stats?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch transaction statistics',
        code: error.code || 'FETCH_STATS_ERROR'
      }
    }
  }

  // Get transactions by category
  async getTransactionsByCategory(type: string | null = null, period: string = 'month'): Promise<{
    success: boolean
    categories: CategoryStat[]
    period: string
    type: string | null
  }> {
    try {
      const cacheKey = this.generateCacheKey('categoryStats', { type, period })
      const cached = this.getFromCache<any>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTransactionsByCategory(type, period)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = this.buildQueryParams({ type, period })
      const response = await apiHelpers.get<any>(`/transactions/by-category?${queryParams}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch category statistics',
        code: error.code || 'FETCH_CATEGORY_STATS_ERROR'
      }
    }
  }

  // Get monthly trends
  async getMonthlyTrends(months: number = 12): Promise<{
    success: boolean
    trends: MonthlyTrend[]
    months: number
  }> {
    try {
      const cacheKey = this.generateCacheKey('trends', { months })
      const cached = this.getFromCache<any>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetMonthlyTrends(months)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<any>(`/transactions/trends?months=${months}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
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
  private buildQueryParams(filters: Record<string, any>): string {
    const params = new URLSearchParams()

    Object.keys(filters).forEach(key => {
      const value = filters[key]
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, String(value))
      }
    })

    return params.toString()
  }

  // Generate cache key
  private generateCacheKey(operation: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')

    return `${operation}:${paramString}`
  }

  // Cache management
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)

    if (!cached) return null

    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Mock API Methods (for development)
   */

  private async mockGetTransactions(filters: TransactionFilters = {}): Promise<TransactionResponse> {
    await mockApiHelpers.delay(500)

    // Generate mock transactions
    const mockTransactions = this.generateMockTransactions()

    // Apply filters
    let filtered = mockTransactions

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category?.name === filters.category)
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate!))
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate!))
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        (t.category?.name && t.category.name.toLowerCase().includes(searchTerm))
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Pagination
    const page = parseInt(String(filters.page)) || 1
    const limit = parseInt(String(filters.limit)) || 50
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

  private async mockGetTransaction(id: number): Promise<TransactionResponse> {
    await mockApiHelpers.delay(300)

    const mockTransactions = this.generateMockTransactions()
    const transaction = mockTransactions.find(t => t.id === id)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return {
      success: true,
      transaction
    }
  }

  private async mockCreateTransaction(transactionData: Partial<Transaction>): Promise<TransactionResponse> {
    await mockApiHelpers.delay(400)

    const newTransaction: Transaction = {
      id: Date.now(),
      user_id: 1,
      category_id: 1,
      type: transactionData.type || 'EXPENSE',
      amount: transactionData.amount || 0,
      description: transactionData.description || '',
      date: transactionData.date || new Date().toISOString(),
      notes: transactionData.notes || null,
      status: 'completed',
      receipt_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    return {
      success: true,
      transaction: newTransaction,
      message: 'Transaction created successfully'
    }
  }

  private async mockUpdateTransaction(id: number, transactionData: Partial<Transaction>): Promise<TransactionResponse> {
    await mockApiHelpers.delay(400)

    const updatedTransaction: Partial<Transaction> = {
      id,
      ...transactionData,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      transaction: updatedTransaction as Transaction,
      message: 'Transaction updated successfully'
    }
  }

  private async mockDeleteTransaction(id: number): Promise<TransactionResponse> {
    await mockApiHelpers.delay(300)

    return {
      success: true,
      message: 'Transaction deleted successfully'
    }
  }

  private async mockBulkDeleteTransactions(ids: number[]): Promise<BulkDeleteResponse> {
    await mockApiHelpers.delay(600)

    return {
      success: true,
      deletedCount: ids.length,
      message: `${ids.length} transactions deleted successfully`
    }
  }

  private async mockImportTransactions(file: File, format: string): Promise<ImportResponse> {
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

  private async mockExportTransactions(filters: TransactionFilters, format: string): Promise<ExportResponse> {
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

  private async mockGetTransactionStats(period: string): Promise<{ success: boolean; stats: TransactionStats }> {
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

  private async mockGetTransactionsByCategory(type: string | null, period: string): Promise<{
    success: boolean
    categories: CategoryStat[]
    period: string
    type: string | null
  }> {
    await mockApiHelpers.delay(400)

    const categories = type === 'income'
      ? ['Salary', 'Freelance', 'Investment', 'Other']
      : ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment']

    const categoryData: CategoryStat[] = categories.map(category => ({
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

  private async mockGetMonthlyTrends(months: number): Promise<{
    success: boolean
    trends: MonthlyTrend[]
    months: number
  }> {
    await mockApiHelpers.delay(500)

    const trends: MonthlyTrend[] = []
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
  private generateMockTransactions(): Transaction[] {
    const categories = {
      income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
      expense: ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare']
    }

    const descriptions: Record<string, string[]> = {
      'Food & Dining': ['Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Fast food lunch'],
      'Transportation': ['Gas station', 'Bus fare', 'Uber ride', 'Car maintenance'],
      'Shopping': ['Online purchase', 'Clothing store', 'Electronics', 'Home supplies'],
      'Salary': ['Monthly salary', 'Bonus payment', 'Overtime pay'],
      'Freelance': ['Client project', 'Consulting work', 'Design project']
    }

    const transactions: Transaction[] = []

    for (let i = 0; i < 100; i++) {
      const type = Math.random() > 0.3 ? 'EXPENSE' : 'INCOME'
      const categoryList = categories[type.toLowerCase() as 'income' | 'expense']
      const categoryName = categoryList[Math.floor(Math.random() * categoryList.length)]
      const descriptionList = descriptions[categoryName] || ['Transaction']
      const description = descriptionList[Math.floor(Math.random() * descriptionList.length)]

      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))

      transactions.push({
        id: i + 1,
        user_id: 1,
        category_id: i + 1,
        type,
        category: {
          id: i + 1,
          name: categoryName,
          type,
          icon: '',
          color: '',
          is_default: false,
          is_active: true,
          user_id: 1,
          created_at: date.toISOString(),
          updated_at: date.toISOString(),
          deleted_at: null
        },
        description,
        amount: Math.round((Math.random() * (type === 'INCOME' ? 2000 : 500) + 10) * 100) / 100,
        date: date.toISOString().split('T')[0],
        notes: null,
        status: 'completed',
        receipt_path: null,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        deleted_at: null
      })
    }

    return transactions
  }

  // Convert data to CSV format
  private convertToCSV(data: Transaction[]): string {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status']
    const rows = data.map(transaction => [
      transaction.date,
      transaction.type,
      transaction.category?.name || '',
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
