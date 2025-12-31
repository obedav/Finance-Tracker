// src/services/goalsService.ts
import { apiHelpers } from './api'
import { API_ENDPOINTS } from '../utils/constants'
import type { Goal, GoalFormData, GoalProgress, GoalContribution, GoalStats } from '@/types/models'

/**
 * Type Definitions for Goals Service
 */

export interface GoalFilters {
  type?: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'vacation' | 'purchase' | 'other'
  status?: 'active' | 'completed' | 'abandoned' | 'paused'
  priority?: 'low' | 'medium' | 'high'
  page?: number
  per_page?: number
}

export interface GoalResponse {
  success: boolean
  data?: Goal | Goal[]
  goal?: Goal
  message?: string
  code?: string
}

export interface GoalProgressResponse {
  success: boolean
  data?: GoalProgress | GoalProgress[]
  message?: string
}

export interface GoalStatsResponse {
  success: boolean
  data?: GoalStats
  message?: string
}

export interface GoalContributionData {
  goal_id: number
  amount: number
  description?: string | null
  contribution_date: string
}

export interface GoalContributionResponse {
  success: boolean
  data?: GoalContribution | GoalContribution[]
  contribution?: GoalContribution
  message?: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const USE_MOCK_API = false  // Using real Laravel API

class GoalsService {
  private cache: Map<string, CacheEntry<any>>
  private cacheTimeout: number

  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Goal CRUD Operations
   */

  // Get all goals
  async getGoals(filters: GoalFilters = {}): Promise<GoalResponse> {
    try {
      if (USE_MOCK_API) {
        return this.getMockGoals(filters)
      }

      const cacheKey = this.generateCacheKey('goals', filters)
      const cached = this.getFromCache<GoalResponse>(cacheKey)

      if (cached) {
        return cached
      }

      const queryParams = this.buildQueryParams(filters)
      const url = queryParams ? `${API_ENDPOINTS.GOALS.LIST}?${queryParams}` : API_ENDPOINTS.GOALS.LIST
      const response = await apiHelpers.get<GoalResponse>(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch goals',
        code: error.code || 'FETCH_GOALS_ERROR'
      }
    }
  }

  // Get single goal by ID
  async getGoal(id: number): Promise<GoalResponse> {
    try {
      if (USE_MOCK_API) {
        return this.getMockGoal(id)
      }

      const cacheKey = this.generateCacheKey('goal', { id })
      const cached = this.getFromCache<GoalResponse>(cacheKey)

      if (cached) {
        return cached
      }

      const url = API_ENDPOINTS.GOALS.GET.replace(':id', String(id))
      const response = await apiHelpers.get<GoalResponse>(url)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch goal',
        code: error.code || 'FETCH_GOAL_ERROR'
      }
    }
  }

  // Create new goal
  async createGoal(goalData: GoalFormData): Promise<GoalResponse> {
    try {
      // Validate required fields
      if (!goalData.name || !goalData.type || !goalData.target_amount) {
        throw {
          success: false,
          message: 'Missing required fields: name, type, and target_amount are required',
          code: 'VALIDATION_ERROR'
        }
      }

      if (USE_MOCK_API) {
        return this.createMockGoal(goalData)
      }

      const response = await apiHelpers.post<GoalResponse>(API_ENDPOINTS.GOALS.CREATE, goalData)

      this.clearCache() // Clear cache after creation
      return {
        success: true,
        data: response.data || response.goal,
        message: response.message || 'Goal created successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to create goal',
        code: error.code || 'CREATE_GOAL_ERROR'
      }
    }
  }

  // Update existing goal
  async updateGoal(id: number, goalData: Partial<GoalFormData>): Promise<GoalResponse> {
    try {
      if (USE_MOCK_API) {
        return this.updateMockGoal(id, goalData)
      }

      const url = API_ENDPOINTS.GOALS.UPDATE.replace(':id', String(id))
      const response = await apiHelpers.put<GoalResponse>(url, goalData)

      this.clearCache() // Clear cache after update
      return {
        success: true,
        data: response.data || response.goal,
        message: response.message || 'Goal updated successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to update goal',
        code: error.code || 'UPDATE_GOAL_ERROR'
      }
    }
  }

  // Delete goal
  async deleteGoal(id: number): Promise<GoalResponse> {
    try {
      if (USE_MOCK_API) {
        return this.deleteMockGoal(id)
      }

      const url = API_ENDPOINTS.GOALS.DELETE.replace(':id', String(id))
      const response = await apiHelpers.delete<GoalResponse>(url)

      this.clearCache() // Clear cache after deletion
      return {
        success: true,
        message: response.message || 'Goal deleted successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to delete goal',
        code: error.code || 'DELETE_GOAL_ERROR'
      }
    }
  }

  /**
   * Goal Progress Operations
   */

  // Get goal progress
  async getGoalProgress(goalId?: number): Promise<GoalProgressResponse> {
    try {
      if (USE_MOCK_API) {
        return this.getMockGoalProgress(goalId)
      }

      const url = goalId
        ? API_ENDPOINTS.GOALS.PROGRESS.replace(':id', String(goalId))
        : API_ENDPOINTS.GOALS.PROGRESS_ALL
      const response = await apiHelpers.get<GoalProgressResponse>(url)

      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch goal progress',
        code: error.code || 'FETCH_GOAL_PROGRESS_ERROR'
      }
    }
  }

  // Get goal statistics
  async getGoalStats(): Promise<GoalStatsResponse> {
    try {
      if (USE_MOCK_API) {
        return this.getMockGoalStats()
      }

      const response = await apiHelpers.get<GoalStatsResponse>(API_ENDPOINTS.GOALS.STATS)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch goal statistics',
        code: error.code || 'FETCH_GOAL_STATS_ERROR'
      }
    }
  }

  /**
   * Goal Contribution Operations
   */

  // Add contribution to goal
  async addContribution(contributionData: GoalContributionData): Promise<GoalContributionResponse> {
    try {
      if (USE_MOCK_API) {
        return this.addMockContribution(contributionData)
      }

      const response = await apiHelpers.post<GoalContributionResponse>(
        API_ENDPOINTS.GOALS.ADD_CONTRIBUTION,
        contributionData
      )

      this.clearCache()
      return {
        success: true,
        data: response.data || response.contribution,
        message: response.message || 'Contribution added successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to add contribution',
        code: error.code || 'ADD_CONTRIBUTION_ERROR'
      }
    }
  }

  // Get contributions for a goal
  async getGoalContributions(goalId: number): Promise<GoalContributionResponse> {
    try {
      if (USE_MOCK_API) {
        return this.getMockContributions(goalId)
      }

      const url = API_ENDPOINTS.GOALS.GET_CONTRIBUTIONS.replace(':id', String(goalId))
      const response = await apiHelpers.get<GoalContributionResponse>(url)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch contributions',
        code: error.code || 'FETCH_CONTRIBUTIONS_ERROR'
      }
    }
  }

  /**
   * Utility Methods
   */

  private generateCacheKey(prefix: string, params: any): string {
    return `${prefix}_${JSON.stringify(params)}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private clearCache(): void {
    this.cache.clear()
  }

  private buildQueryParams(filters: Record<string, any>): string {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    return params.toString()
  }

  /**
   * Mock Data Methods (for development)
   */

  private getMockGoals(filters: GoalFilters): GoalResponse {
    const mockGoals: Goal[] = [
      {
        id: 1,
        user_id: 1,
        name: 'Emergency Fund',
        description: 'Build 6 months of expenses',
        type: 'emergency_fund',
        target_amount: 15000,
        current_amount: 8500,
        target_date: '2025-12-31',
        start_date: '2025-01-01',
        status: 'active',
        priority: 'high',
        is_recurring: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      },
      {
        id: 2,
        user_id: 1,
        name: 'Vacation to Japan',
        description: 'Save for 2-week trip to Japan',
        type: 'vacation',
        target_amount: 5000,
        current_amount: 2300,
        target_date: '2025-09-01',
        start_date: '2025-01-01',
        status: 'active',
        priority: 'medium',
        is_recurring: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z'
      },
      {
        id: 3,
        user_id: 1,
        name: 'New Laptop',
        description: 'Save for MacBook Pro',
        type: 'purchase',
        target_amount: 2500,
        current_amount: 2500,
        target_date: null,
        start_date: '2024-11-01',
        status: 'completed',
        priority: 'medium',
        is_recurring: false,
        created_at: '2024-11-01T00:00:00Z',
        updated_at: '2024-12-20T00:00:00Z'
      },
      {
        id: 4,
        user_id: 1,
        name: 'Investment Portfolio',
        description: 'Build diversified investment portfolio',
        type: 'investment',
        target_amount: 50000,
        current_amount: 12000,
        target_date: '2027-12-31',
        start_date: '2025-01-01',
        status: 'active',
        priority: 'high',
        is_recurring: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-20T00:00:00Z'
      }
    ]

    let filtered = [...mockGoals]

    if (filters.type) {
      filtered = filtered.filter(g => g.type === filters.type)
    }
    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status)
    }
    if (filters.priority) {
      filtered = filtered.filter(g => g.priority === filters.priority)
    }

    return {
      success: true,
      data: filtered
    }
  }

  private getMockGoal(id: number): GoalResponse {
    const goals = this.getMockGoals({})
    const goal = (goals.data as Goal[]).find(g => g.id === id)

    if (!goal) {
      throw {
        success: false,
        message: 'Goal not found',
        code: 'GOAL_NOT_FOUND'
      }
    }

    return {
      success: true,
      data: goal
    }
  }

  private createMockGoal(goalData: GoalFormData): GoalResponse {
    const newGoal: Goal = {
      id: Date.now(),
      user_id: 1,
      name: goalData.name,
      description: goalData.description || null,
      type: goalData.type,
      target_amount: goalData.target_amount,
      current_amount: goalData.current_amount || 0,
      target_date: goalData.target_date || null,
      start_date: goalData.start_date,
      status: 'active',
      priority: goalData.priority || 'medium',
      is_recurring: goalData.is_recurring || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      data: newGoal,
      message: 'Goal created successfully'
    }
  }

  private updateMockGoal(id: number, goalData: Partial<GoalFormData>): GoalResponse {
    const goalResponse = this.getMockGoal(id)
    const goal = goalResponse.data as Goal

    const updatedGoal: Goal = {
      ...goal,
      ...goalData,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      data: updatedGoal,
      message: 'Goal updated successfully'
    }
  }

  private deleteMockGoal(id: number): GoalResponse {
    return {
      success: true,
      message: 'Goal deleted successfully'
    }
  }

  private getMockGoalProgress(goalId?: number): GoalProgressResponse {
    const mockProgress: GoalProgress[] = [
      {
        goal_id: 1,
        goal_name: 'Emergency Fund',
        target_amount: 15000,
        current_amount: 8500,
        remaining_amount: 6500,
        percentage_completed: 56.67,
        is_completed: false,
        days_remaining: 335,
        projected_completion_date: '2026-01-15'
      },
      {
        goal_id: 2,
        goal_name: 'Vacation to Japan',
        target_amount: 5000,
        current_amount: 2300,
        remaining_amount: 2700,
        percentage_completed: 46,
        is_completed: false,
        days_remaining: 244,
        projected_completion_date: '2025-09-15'
      },
      {
        goal_id: 3,
        goal_name: 'New Laptop',
        target_amount: 2500,
        current_amount: 2500,
        remaining_amount: 0,
        percentage_completed: 100,
        is_completed: true,
        days_remaining: 0,
        projected_completion_date: null
      },
      {
        goal_id: 4,
        goal_name: 'Investment Portfolio',
        target_amount: 50000,
        current_amount: 12000,
        remaining_amount: 38000,
        percentage_completed: 24,
        is_completed: false,
        days_remaining: 1066,
        projected_completion_date: '2027-12-31'
      }
    ]

    if (goalId) {
      const progress = mockProgress.find(p => p.goal_id === goalId)
      return {
        success: true,
        data: progress
      }
    }

    return {
      success: true,
      data: mockProgress
    }
  }

  private getMockGoalStats(): GoalStatsResponse {
    return {
      success: true,
      data: {
        total_goals: 4,
        active_goals: 3,
        completed_goals: 1,
        total_target_amount: 72500,
        total_current_amount: 25300,
        overall_progress_percentage: 34.9,
        goals_on_track: 2,
        goals_behind: 1
      }
    }
  }

  private addMockContribution(contributionData: GoalContributionData): GoalContributionResponse {
    const newContribution: GoalContribution = {
      id: Date.now(),
      goal_id: contributionData.goal_id,
      amount: contributionData.amount,
      description: contributionData.description || null,
      contribution_date: contributionData.contribution_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      data: newContribution,
      message: 'Contribution added successfully'
    }
  }

  private getMockContributions(goalId: number): GoalContributionResponse {
    const mockContributions: GoalContribution[] = [
      {
        id: 1,
        goal_id: goalId,
        amount: 500,
        description: 'Initial contribution',
        contribution_date: '2025-01-01',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 2,
        goal_id: goalId,
        amount: 200,
        description: 'Monthly savings',
        contribution_date: '2025-01-15',
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      }
    ]

    return {
      success: true,
      data: mockContributions
    }
  }
}

// Export singleton instance
export default new GoalsService()
