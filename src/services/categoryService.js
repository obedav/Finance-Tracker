// src/services/categoryService.js
import { apiHelpers, mockApiHelpers } from './api.js'
import { API_ENDPOINTS } from '../utils/constants.js'
import { validateCategory } from '../utils/validators.js'

// Flag to use mock API or real API
const USE_MOCK_API = false  // Changed to use real Laravel API

class CategoryService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 10 * 60 * 1000 // 10 minutes (categories change less frequently)
  }

  /**
   * Category CRUD Operations
   */

  // Get all categories
  async getCategories(type = null) {
    try {
      const cacheKey = this.generateCacheKey('categories', { type })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCategories(type)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = type ? `?type=${type}` : ''
      const response = await apiHelpers.get(`${API_ENDPOINTS.CATEGORIES.LIST}${queryParams}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch categories',
        code: error.code || 'FETCH_CATEGORIES_ERROR'
      }
    }
  }

  // Get single category by ID
  async getCategory(id) {
    try {
      const cacheKey = this.generateCacheKey('category', { id })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCategory(id)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`${API_ENDPOINTS.CATEGORIES.LIST}/${id}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch category',
        code: error.code || 'FETCH_CATEGORY_ERROR'
      }
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      // Get existing categories for validation
      const existingCategories = await this.getCategories(categoryData.type)
      
      // Validate category data
      const validation = validateCategory(categoryData, existingCategories.categories || [])
      if (!validation.isValid) {
        throw {
          success: false,
          message: 'Invalid category data',
          errors: validation.errors,
          code: 'VALIDATION_ERROR'
        }
      }

      if (USE_MOCK_API) {
        const result = await this.mockCreateCategory(categoryData)
        this.clearCache() // Clear cache after creation
        return result
      }

      const response = await apiHelpers.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData)

      this.clearCache() // Clear cache after creation

      // Backend returns { success, message, data }
      // apiHelpers.post already extracts response.data, so response IS the backend JSON
      return {
        success: response.success ?? true,
        data: response.data,  // This is the category object from backend
        message: response.message || 'Category created successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to create category',
        code: error.code || 'CREATE_CATEGORY_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Update existing category
  async updateCategory(id, categoryData) {
    try {
      // Get existing categories for validation (excluding current category)
      const existingCategories = await this.getCategories(categoryData.type)
      const filteredCategories = existingCategories.categories?.filter(cat => cat.id !== id) || []
      
      // Validate category data
      const validation = validateCategory(categoryData, filteredCategories)
      if (!validation.isValid) {
        throw {
          success: false,
          message: 'Invalid category data',
          errors: validation.errors,
          code: 'VALIDATION_ERROR'
        }
      }

      if (USE_MOCK_API) {
        const result = await this.mockUpdateCategory(id, categoryData)
        this.clearCache() // Clear cache after update
        return result
      }

      const url = API_ENDPOINTS.CATEGORIES.UPDATE.replace(':id', id)
      const response = await apiHelpers.put(url, categoryData)

      this.clearCache() // Clear cache after update

      // Backend returns { success, message, data }
      // apiHelpers.put already extracts response.data, so response IS the backend JSON
      return {
        success: response.success ?? true,
        data: response.data,  // This is the category object from backend
        message: response.message || 'Category updated successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to update category',
        code: error.code || 'UPDATE_CATEGORY_ERROR',
        errors: error.errors || {}
      }
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockDeleteCategory(id)
        this.clearCache() // Clear cache after deletion
        return result
      }

      const url = API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', id)
      const response = await apiHelpers.delete(url)
      
      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Category deleted successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to delete category',
        code: error.code || 'DELETE_CATEGORY_ERROR'
      }
    }
  }

  /**
   * Category Analytics
   */

  // Get category usage statistics
  async getCategoryStats(id, period = 'month') {
    try {
      const cacheKey = this.generateCacheKey('categoryStats', { id, period })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCategoryStats(id, period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`/categories/${id}/stats?period=${period}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch category statistics',
        code: error.code || 'FETCH_CATEGORY_STATS_ERROR'
      }
    }
  }

  // Get most used categories
  async getMostUsedCategories(type = null, limit = 10) {
    try {
      const cacheKey = this.generateCacheKey('mostUsed', { type, limit })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetMostUsedCategories(type, limit)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = new URLSearchParams()
      if (type) queryParams.append('type', type)
      queryParams.append('limit', limit)

      const response = await apiHelpers.get(`/categories/most-used?${queryParams.toString()}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch most used categories',
        code: error.code || 'FETCH_MOST_USED_ERROR'
      }
    }
  }

  // Get category spending trends
  async getCategoryTrends(id, months = 6) {
    try {
      const cacheKey = this.generateCacheKey('categoryTrends', { id, months })
      const cached = this.getFromCache(cacheKey)
      
      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCategoryTrends(id, months)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get(`/categories/${id}/trends?months=${months}`)
      
      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch category trends',
        code: error.code || 'FETCH_CATEGORY_TRENDS_ERROR'
      }
    }
  }

  /**
   * Category Management
   */

  // Get default categories for initialization
  async getDefaultCategories() {
    try {
      if (USE_MOCK_API) {
        return await this.mockGetDefaultCategories()
      }

      const response = await apiHelpers.get('/categories/defaults')
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch default categories',
        code: error.code || 'FETCH_DEFAULT_CATEGORIES_ERROR'
      }
    }
  }

  // Reset categories to defaults
  async resetToDefaults() {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockResetToDefaults()
        this.clearCache() // Clear cache after reset
        return result
      }

      const response = await apiHelpers.post('/categories/reset-defaults')
      
      this.clearCache() // Clear cache after reset
      return {
        success: true,
        message: response.message || 'Categories reset to defaults successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to reset categories',
        code: error.code || 'RESET_CATEGORIES_ERROR'
      }
    }
  }

  // Import categories from file
  async importCategories(file) {
    try {
      if (USE_MOCK_API) {
        const result = await this.mockImportCategories(file)
        this.clearCache() // Clear cache after import
        return result
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await apiHelpers.upload('/categories/import', formData)
      
      this.clearCache() // Clear cache after import
      return {
        success: true,
        importedCount: response.importedCount,
        skippedCount: response.skippedCount || 0,
        message: response.message || `${response.importedCount} categories imported successfully`
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to import categories',
        code: error.code || 'IMPORT_CATEGORIES_ERROR'
      }
    }
  }

  // Export categories
  async exportCategories(format = 'json') {
    try {
      if (USE_MOCK_API) {
        return await this.mockExportCategories(format)
      }

      const filename = `categories_${new Date().toISOString().split('T')[0]}.${format}`
      await apiHelpers.download(`/categories/export?format=${format}`, filename)
      
      return {
        success: true,
        message: 'Categories exported successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to export categories',
        code: error.code || 'EXPORT_CATEGORIES_ERROR'
      }
    }
  }

  /**
   * Utility Methods
   */

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

  async mockGetCategories(type = null) {
    await mockApiHelpers.delay(300)
    
    const mockCategories = this.generateMockCategories()
    
    let filtered = mockCategories
    if (type) {
      filtered = mockCategories.filter(cat => cat.type === type)
    }
    
    return {
      success: true,
      categories: filtered,
      total: filtered.length
    }
  }

  async mockGetCategory(id) {
    await mockApiHelpers.delay(200)
    
    const mockCategories = this.generateMockCategories()
    const category = mockCategories.find(cat => cat.id === parseInt(id))
    
    if (!category) {
      throw new Error('Category not found')
    }
    
    return {
      success: true,
      category
    }
  }

  async mockCreateCategory(categoryData) {
    await mockApiHelpers.delay(400)
    
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return {
      success: true,
      category: newCategory,
      message: 'Category created successfully'
    }
  }

  async mockUpdateCategory(id, categoryData) {
    await mockApiHelpers.delay(400)
    
    const updatedCategory = {
      id: parseInt(id),
      ...categoryData,
      updatedAt: new Date()
    }
    
    return {
      success: true,
      category: updatedCategory,
      message: 'Category updated successfully'
    }
  }

  async mockDeleteCategory(id) {
    await mockApiHelpers.delay(300)
    
    // Simulate checking if category is in use
    const hasTransactions = Math.random() > 0.7
    
    if (hasTransactions) {
      throw new Error('Cannot delete category that has associated transactions')
    }
    
    return {
      success: true,
      message: 'Category deleted successfully'
    }
  }

  async mockGetCategoryStats(id, period) {
    await mockApiHelpers.delay(400)
    
    return {
      success: true,
      stats: {
        categoryId: parseInt(id),
        period,
        totalAmount: Math.random() * 1000 + 100,
        transactionCount: Math.floor(Math.random() * 20) + 5,
        averageAmount: Math.random() * 100 + 20,
        percentageOfTotal: Math.random() * 30 + 5,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        trendPercentage: Math.random() * 20
      }
    }
  }

  async mockGetMostUsedCategories(type, limit) {
    await mockApiHelpers.delay(300)
    
    const mockCategories = this.generateMockCategories()
    let filtered = type ? mockCategories.filter(cat => cat.type === type) : mockCategories
    
    // Add usage stats
    filtered = filtered.map(cat => ({
      ...cat,
      usageCount: Math.floor(Math.random() * 50) + 5,
      totalAmount: Math.random() * 2000 + 100
    }))
    
    // Sort by usage count and limit
    filtered.sort((a, b) => b.usageCount - a.usageCount)
    filtered = filtered.slice(0, limit)
    
    return {
      success: true,
      categories: filtered,
      type,
      limit
    }
  }

  async mockGetCategoryTrends(id, months) {
    await mockApiHelpers.delay(400)
    
    const trends = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      trends.push({
        month: date.toISOString().substr(0, 7),
        amount: Math.random() * 500 + 50,
        transactionCount: Math.floor(Math.random() * 10) + 2
      })
    }
    
    return {
      success: true,
      categoryId: parseInt(id),
      trends,
      months
    }
  }

  async mockGetDefaultCategories() {
    await mockApiHelpers.delay(200)
    
    return {
      success: true,
      categories: this.generateDefaultCategories()
    }
  }

  async mockResetToDefaults() {
    await mockApiHelpers.delay(600)
    
    return {
      success: true,
      message: 'Categories reset to defaults successfully',
      categoriesCount: this.generateDefaultCategories().length
    }
  }

  async mockImportCategories(file) {
    await mockApiHelpers.delay(1500)
    
    const importedCount = Math.floor(Math.random() * 10) + 5
    const skippedCount = Math.floor(Math.random() * 3)
    
    return {
      success: true,
      importedCount,
      skippedCount,
      message: `${importedCount} categories imported successfully`
    }
  }

  async mockExportCategories(format) {
    await mockApiHelpers.delay(800)
    
    const categories = this.generateMockCategories()
    let content = ''
    
    if (format === 'json') {
      content = JSON.stringify(categories, null, 2)
    } else if (format === 'csv') {
      const headers = ['Name', 'Type', 'Description', 'Icon', 'Color']
      const rows = categories.map(cat => [
        cat.name,
        cat.type,
        `"${cat.description || ''}"`,
        cat.icon,
        cat.color
      ])
      content = [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    // Simulate file download
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `categories_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return {
      success: true,
      message: 'Categories exported successfully'
    }
  }

  // Generate mock category data
  generateMockCategories() {
    return [
      ...this.generateDefaultCategories(),
      // Add some custom categories
      {
        id: 100,
        name: 'Pet Care',
        type: 'expense',
        description: 'Pet food, vet bills, grooming',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        color: '#F59E0B',
        isDefault: false,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: 101,
        name: 'Side Business',
        type: 'income',
        description: 'Income from side business',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        color: '#10B981',
        isDefault: false,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ]
  }

  // Generate default categories
  generateDefaultCategories() {
    return [
      // Income Categories
      {
        id: 1,
        name: 'Salary',
        type: 'income',
        description: 'Regular employment income',
        icon: 'M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z',
        color: '#10B981',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Freelance',
        type: 'income',
        description: 'Freelance and contract work',
        icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
        color: '#10B981',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 3,
        name: 'Investment',
        type: 'income',
        description: 'Investment returns and dividends',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        color: '#10B981',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 4,
        name: 'Gift',
        type: 'income',
        description: 'Gifts and monetary presents',
        icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
        color: '#10B981',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      
      // Expense Categories
      {
        id: 5,
        name: 'Food & Dining',
        type: 'expense',
        description: 'Restaurants, groceries, meals',
        icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 6,
        name: 'Transportation',
        type: 'expense',
        description: 'Gas, public transport, car expenses',
        icon: 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h3m10 0h3m-17 3h18',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 7,
        name: 'Shopping',
        type: 'expense',
        description: 'Clothing, electronics, personal items',
        icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 8,
        name: 'Entertainment',
        type: 'expense',
        description: 'Movies, games, hobbies',
        icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 9,
        name: 'Bills & Utilities',
        type: 'expense',
        description: 'Rent, electricity, internet, phone',
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 10,
        name: 'Healthcare',
        type: 'expense',
        description: 'Medical expenses, insurance, pharmacy',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        color: '#F59E0B',
        isDefault: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]
  }
}

// Create and export singleton instance
const categoryService = new CategoryService()

export default categoryService