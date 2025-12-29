// src/services/budgetService.ts
import { apiHelpers } from './api'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Type Definitions for Budget Service
 */

export interface Budget {
  id: number
  user_id: number
  category_id: number
  amount: number
  period: 'monthly' | 'weekly' | 'yearly'
  start_date?: string
  end_date?: string
  alert_threshold?: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
    type: string
  }
  spent?: number
  remaining?: number
  percentage?: number
}

export interface BudgetData {
  category_id: number
  amount: number
  period: 'monthly' | 'weekly' | 'yearly'
  start_date?: string
  end_date?: string
  alert_threshold?: number
  is_active?: boolean
}

export interface BudgetFilters {
  category_id?: number
  period?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface BudgetResponse {
  success: boolean
  data?: Budget | Budget[]
  budget?: Budget
  message?: string
  code?: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const USE_MOCK_API = false  // Use real Laravel API

class BudgetService {
  private cache: Map<string, CacheEntry<any>>
  private cacheTimeout: number

  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Budget CRUD Operations
   */

  // Get all budgets
  async getBudgets(filters: BudgetFilters = {}): Promise<BudgetResponse> {
    try {
      const cacheKey = this.generateCacheKey('budgets', filters)
      const cached = this.getFromCache<BudgetResponse>(cacheKey)

      if (cached) {
        return cached
      }

      const queryParams = this.buildQueryParams(filters)
      const url = queryParams ? `${API_ENDPOINTS.BUDGETS.LIST}?${queryParams}` : API_ENDPOINTS.BUDGETS.LIST
      const response = await apiHelpers.get<BudgetResponse>(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch budgets',
        code: error.code || 'FETCH_BUDGETS_ERROR'
      }
    }
  }

  // Get single budget by ID
  async getBudget(id: number): Promise<BudgetResponse> {
    try {
      const cacheKey = this.generateCacheKey('budget', { id })
      const cached = this.getFromCache<BudgetResponse>(cacheKey)

      if (cached) {
        return cached
      }

      const url = API_ENDPOINTS.BUDGETS.GET.replace(':id', String(id))
      const response = await apiHelpers.get<BudgetResponse>(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch budget',
        code: error.code || 'FETCH_BUDGET_ERROR'
      }
    }
  }

  // Create new budget
  async createBudget(budgetData: BudgetData): Promise<BudgetResponse> {
    try {
      // Validate required fields
      if (!budgetData.category_id || !budgetData.amount || !budgetData.period) {
        throw {
          success: false,
          message: 'Missing required fields: category_id, amount, and period are required',
          code: 'VALIDATION_ERROR'
        }
      }

      const response = await apiHelpers.post<BudgetResponse>(API_ENDPOINTS.BUDGETS.CREATE, budgetData)

      this.clearCache() // Clear cache after creation
      return {
        success: true,
        data: response.data || response.budget,
        message: response.message || 'Budget created successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to create budget',
        code: error.code || 'CREATE_BUDGET_ERROR'
      }
    }
  }

  // Update existing budget
  async updateBudget(id: number, budgetData: Partial<BudgetData>): Promise<BudgetResponse> {
    try {
      const url = API_ENDPOINTS.BUDGETS.UPDATE.replace(':id', String(id))
      const response = await apiHelpers.put<BudgetResponse>(url, budgetData)

      this.clearCache() // Clear cache after update
      return {
        success: true,
        data: response.data || response.budget,
        message: response.message || 'Budget updated successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to update budget',
        code: error.code || 'UPDATE_BUDGET_ERROR'
      }
    }
  }

  // Delete budget
  async deleteBudget(id: number): Promise<BudgetResponse> {
    try {
      const url = API_ENDPOINTS.BUDGETS.DELETE.replace(':id', String(id))
      const response = await apiHelpers.delete<BudgetResponse>(url)

      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Budget deleted successfully'
      }
    } catch (error: any) {
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
  private buildQueryParams(params: Record<string, any>): string {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, String(params[key]))
      }
    })

    return queryParams.toString()
  }

  // Generate cache key
  private generateCacheKey(prefix: string, params: Record<string, any>): string {
    return `${prefix}_${JSON.stringify(params)}`
  }

  // Get from cache
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T
    }

    return null
  }

  // Set cache
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }
}

// Create and export singleton instance
const budgetService = new BudgetService()

export default budgetService
