// src/services/budgetService.js
import { apiHelpers } from './api.js'
import { API_ENDPOINTS } from '../utils/constants.js'

const USE_MOCK_API = false  // Use real Laravel API

class BudgetService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Budget CRUD Operations
   */

  // Get all budgets
  async getBudgets(filters = {}) {
    try {
      const cacheKey = this.generateCacheKey('budgets', filters)
      const cached = this.getFromCache(cacheKey)

      if (cached) {
        return cached
      }

      const queryParams = this.buildQueryParams(filters)
      const url = queryParams ? `${API_ENDPOINTS.BUDGETS.LIST}?${queryParams}` : API_ENDPOINTS.BUDGETS.LIST
      const response = await apiHelpers.get(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch budgets',
        code: error.code || 'FETCH_BUDGETS_ERROR'
      }
    }
  }

  // Get single budget by ID
  async getBudget(id) {
    try {
      const cacheKey = this.generateCacheKey('budget', { id })
      const cached = this.getFromCache(cacheKey)

      if (cached) {
        return cached
      }

      const url = API_ENDPOINTS.BUDGETS.GET.replace(':id', id)
      const response = await apiHelpers.get(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch budget',
        code: error.code || 'FETCH_BUDGET_ERROR'
      }
    }
  }

  // Create new budget
  async createBudget(budgetData) {
    try {
      // Validate required fields
      if (!budgetData.category_id || !budgetData.amount || !budgetData.period) {
        throw {
          success: false,
          message: 'Missing required fields: category_id, amount, and period are required',
          code: 'VALIDATION_ERROR'
        }
      }

      const response = await apiHelpers.post(API_ENDPOINTS.BUDGETS.CREATE, budgetData)

      this.clearCache() // Clear cache after creation
      return {
        success: true,
        data: response.data || response.budget,
        message: response.message || 'Budget created successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to create budget',
        code: error.code || 'CREATE_BUDGET_ERROR'
      }
    }
  }

  // Update existing budget
  async updateBudget(id, budgetData) {
    try {
      const url = API_ENDPOINTS.BUDGETS.UPDATE.replace(':id', id)
      const response = await apiHelpers.put(url, budgetData)

      this.clearCache() // Clear cache after update
      return {
        success: true,
        data: response.data || response.budget,
        message: response.message || 'Budget updated successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to update budget',
        code: error.code || 'UPDATE_BUDGET_ERROR'
      }
    }
  }

  // Delete budget
  async deleteBudget(id) {
    try {
      const url = API_ENDPOINTS.BUDGETS.DELETE.replace(':id', id)
      const response = await apiHelpers.delete(url)

      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Budget deleted successfully'
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to delete budget',
        code: error.code || 'DELETE_BUDGET_ERROR'
      }
    }
  }

  /**
   * Helper Methods
   */

  // Build query parameters string
  buildQueryParams(params) {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })

    return queryParams.toString()
  }

  // Generate cache key
  generateCacheKey(prefix, params) {
    return `${prefix}_${JSON.stringify(params)}`
  }

  // Get from cache
  getFromCache(key) {
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    return null
  }

  // Set cache
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Create and export singleton instance
const budgetService = new BudgetService()

export default budgetService
