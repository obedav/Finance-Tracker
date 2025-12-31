// src/composables/useCategories.ts
import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_CATEGORIES, TRANSACTION_TYPES } from '../utils/constants'
import type { Category, TransactionType } from '../types'

/**
 * Composable for managing categories
 * Provides comprehensive category CRUD operations, validation, and analytics
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CategoryWithStats extends Category {
  transactionCount: number
  totalAmount: number
  percentage: number
  lastUsed: Date | null
}

export interface CategoryValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface CategoryUsageData {
  category: Category
  transactionCount: number
  totalAmount: number
  lastUsed: Date | null
  averageAmount: number
}

export interface CategoryInsights {
  mostUsed: CategoryUsageData | null
  leastUsed: CategoryUsageData | null
  highestSpending: CategoryUsageData | null
  mostFrequent: CategoryUsageData | null
  unused: Category[]
  totalCategories: number
  usedCategories: number
}

export interface CategoryStats {
  transactionCount: number
  totalAmount: number
  averageAmount: number
  percentage: number
}

export interface CategoryTrend {
  month: string
  amount: number
  transactionCount: number
}

export interface ImportResult {
  imported: number
  skipped: number
}

export interface MockCategoryService {
  getCategories(type?: TransactionType | null): Promise<{ success: boolean; categories: Category[] }>
  getCategory(id: number | string): Promise<{ success: boolean; category?: Category; message?: string }>
  createCategory(categoryData: Partial<Category>): Promise<{ success: boolean; category: Category }>
  updateCategory(id: number | string, categoryData: Partial<Category>): Promise<{ success: boolean; category?: Category; message?: string }>
  deleteCategory(id: number | string): Promise<{ success: boolean; message?: string }>
  getCategoryStats(id: number | string, period?: string): Promise<{ success: boolean; stats: CategoryStats }>
  getMostUsedCategories(type?: TransactionType | null, limit?: number): Promise<{ success: boolean; categories: Category[] }>
  getCategoryTrends(id: number | string, months?: number): Promise<{ success: boolean; trends: CategoryTrend[] }>
  resetToDefaults(): Promise<{ success: boolean; message?: string }>
  importCategories(file: File): Promise<{ success: boolean; importedCount: number; skippedCount: number }>
  exportCategories(format?: string): Promise<{ success: boolean; message?: string }>
}

export interface UseCategoriesReturn {
  // State
  categories: Ref<Category[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  selectedCategory: Ref<Category | null>

  // Computed
  incomeCategories: ComputedRef<Category[]>
  expenseCategories: ComputedRef<Category[]>
  categoriesByType: ComputedRef<{ income: Category[]; expense: Category[] }>
  categoryNames: ComputedRef<{ income: string[]; expense: string[] }>
  defaultCategories: ComputedRef<Category[]>
  customCategories: ComputedRef<Category[]>
  totalCategories: ComputedRef<number>
  categoriesWithStats: ComputedRef<CategoryWithStats[]>

  // CRUD Methods
  fetchCategories: (type?: TransactionType | null) => Promise<Category[]>
  getCategory: (id: number | string) => Promise<Category | undefined>
  createCategory: (categoryData: Partial<Category>) => Promise<Category>
  updateCategory: (id: number | string, categoryData: Partial<Category>) => Promise<Category>
  deleteCategory: (id: number | string) => Promise<boolean>

  // Analytics Methods
  getCategoryStats: (id: number | string, period?: string) => Promise<CategoryStats>
  getMostUsedCategories: (type?: TransactionType | null, limit?: number) => Promise<Category[]>
  getCategoryTrends: (id: number | string, months?: number) => Promise<CategoryTrend[]>

  // Management Methods
  resetToDefaults: () => Promise<boolean>
  importCategories: (file: File) => Promise<ImportResult>
  exportCategories: (format?: 'json' | 'csv') => Promise<boolean>

  // Utility Methods
  getCategoryById: (id: number | string) => Category | null
  getCategoryByName: (name: string, type?: TransactionType | null) => Category | null
  getCategoriesByType: (type: TransactionType) => Category[]
  isCategoryNameAvailable: (name: string, type: TransactionType, excludeId?: number | string | null) => boolean
  getDefaultCategoriesForType: (type: string) => readonly string[]
  createDefaultCategory: (name: string, type: TransactionType, icon?: string | null, description?: string) => Partial<Category>
  searchCategories: (query: string) => Category[]
  sortCategories: (sortBy?: string, order?: 'asc' | 'desc') => Category[]
  groupCategoriesByType: () => { income: Category[]; expense: Category[] }
  getCategoryUsageData: (transactionData?: any[]) => Record<string | number, CategoryUsageData>
  getCategoryInsights: (transactionData?: any[]) => CategoryInsights
  clearError: () => void
  clearSelectedCategory: () => void
  refreshCategories: () => Promise<void>
  initializeCategories: () => Promise<void>
  validateCategory: (categoryData: Partial<Category>, existingCategories?: Category[]) => CategoryValidationResult
}

// ============================================================================
// Main Composable
// ============================================================================

export function useCategories(): UseCategoriesReturn {
  const { data: cachedCategories } = useLocalStorage<Category[]>('categories', [])

  // State
  const categories = ref<Category[]>(cachedCategories.value || [])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<Category | null>(null)

  // Computed properties
  const incomeCategories = computed<Category[]>(() =>
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.INCOME)
  )

  const expenseCategories = computed<Category[]>(() =>
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.EXPENSE)
  )

  const categoriesByType = computed<{ income: Category[]; expense: Category[] }>(() => ({
    income: incomeCategories.value,
    expense: expenseCategories.value
  }))

  const categoryNames = computed<{ income: string[]; expense: string[] }>(() => ({
    income: incomeCategories.value.map(cat => cat.name),
    expense: expenseCategories.value.map(cat => cat.name)
  }))

  const defaultCategories = computed<Category[]>(() =>
    categories.value.filter(cat => cat.is_default)
  )

  const customCategories = computed<Category[]>(() =>
    categories.value.filter(cat => !cat.is_default)
  )

  const totalCategories = computed<number>(() => categories.value.length)

  const categoriesWithStats = computed<CategoryWithStats[]>(() => {
    return categories.value.map(category => ({
      ...category,
      transactionCount: 0,
      totalAmount: 0,
      percentage: 0,
      lastUsed: null
    }))
  })

  // Validation helper
  const validateCategory = (categoryData: Partial<Category>, existingCategories: Category[] = []): CategoryValidationResult => {
    const errors: Record<string, string> = {}

    // Required fields
    if (!categoryData.name || categoryData.name.trim() === '') {
      errors.name = 'Category name is required'
    }

    if (!categoryData.type || !Object.values(TRANSACTION_TYPES).includes(categoryData.type as any)) {
      errors.type = 'Valid category type is required'
    }

    // Check for duplicate names within the same type
    const duplicateName = existingCategories.find(cat =>
      cat.name.toLowerCase() === categoryData.name?.toLowerCase() &&
      cat.type === categoryData.type
    )

    if (duplicateName) {
      errors.name = 'Category name already exists for this type'
    }

    // Name length validation
    if (categoryData.name && (categoryData.name.length < 2 || categoryData.name.length > 50)) {
      errors.name = 'Category name must be between 2 and 50 characters'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Mock service functions (replace with real API calls when backend is available)
  const mockCategoryService: MockCategoryService = {
    async getCategories(type: TransactionType | null = null) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      let result = categories.value
      if (type) {
        result = result.filter(cat => cat.type === type)
      }

      return {
        success: true,
        categories: result
      }
    },

    async getCategory(id: number | string) {
      await new Promise(resolve => setTimeout(resolve, 150))

      const category = categories.value.find(cat => cat.id === id)
      return {
        success: !!category,
        category,
        message: category ? undefined : 'Category not found'
      }
    },

    async createCategory(categoryData: Partial<Category>) {
      await new Promise(resolve => setTimeout(resolve, 300))

      const newCategory: Category = {
        id: Date.now() + Math.random(),
        user_id: null,
        name: categoryData.name || '',
        type: categoryData.type || 'EXPENSE',
        icon: categoryData.icon || '📁',
        color: categoryData.color || '#10B981',
        description: categoryData.description,
        is_default: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }

      return {
        success: true,
        category: newCategory
      }
    },

    async updateCategory(id: number | string, categoryData: Partial<Category>) {
      await new Promise(resolve => setTimeout(resolve, 250))

      const existingCategory = categories.value.find(cat => cat.id === id)
      if (!existingCategory) {
        return {
          success: false,
          message: 'Category not found'
        }
      }

      const updatedCategory: Category = {
        ...existingCategory,
        ...categoryData,
        updated_at: new Date().toISOString()
      }

      return {
        success: true,
        category: updatedCategory
      }
    },

    async deleteCategory(id: number | string) {
      await new Promise(resolve => setTimeout(resolve, 200))

      const categoryExists = categories.value.some(cat => cat.id === id)
      return {
        success: categoryExists,
        message: categoryExists ? undefined : 'Category not found'
      }
    },

    async getCategoryStats(id: number | string, period: string = 'month') {
      await new Promise(resolve => setTimeout(resolve, 400))

      // Mock statistics
      return {
        success: true,
        stats: {
          transactionCount: Math.floor(Math.random() * 50),
          totalAmount: Math.floor(Math.random() * 5000),
          averageAmount: Math.floor(Math.random() * 200),
          percentage: Math.floor(Math.random() * 100)
        }
      }
    },

    async getMostUsedCategories(type: TransactionType | null = null, limit: number = 10) {
      await new Promise(resolve => setTimeout(resolve, 300))

      let result = categories.value
      if (type) {
        result = result.filter(cat => cat.type === type)
      }

      // Sort by usage (mock data)
      result = result.sort((a, b) => 0)
      result = result.slice(0, limit)

      return {
        success: true,
        categories: result
      }
    },

    async getCategoryTrends(id: number | string, months: number = 6) {
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock trend data
      const trends: CategoryTrend[] = Array.from({ length: months }, (_, i) => ({
        month: new Date(Date.now() - (months - i - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        amount: Math.floor(Math.random() * 1000),
        transactionCount: Math.floor(Math.random() * 20)
      }))

      return {
        success: true,
        trends
      }
    },

    async resetToDefaults() {
      await new Promise(resolve => setTimeout(resolve, 600))

      return {
        success: true,
        message: 'Categories reset to defaults'
      }
    },

    async importCategories(file: File) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        importedCount: Math.floor(Math.random() * 10),
        skippedCount: Math.floor(Math.random() * 3)
      }
    },

    async exportCategories(format: string = 'json') {
      await new Promise(resolve => setTimeout(resolve, 400))

      return {
        success: true,
        message: 'Categories exported successfully'
      }
    }
  }

  // Methods
  const fetchCategories = async (type: TransactionType | null = null): Promise<Category[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategories(type)

      if (response.success) {
        categories.value = response.categories || []
        return response.categories
      }

      throw new Error('Failed to fetch categories')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategory = async (id: number | string): Promise<Category | undefined> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategory(id)

      if (response.success && response.category) {
        selectedCategory.value = response.category
        return response.category
      }

      throw new Error(response.message || 'Failed to fetch category')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    loading.value = true
    error.value = null

    try {
      // Validate category data
      const existingCategories = categories.value.filter(cat => cat.type === categoryData.type)
      const validation = validateCategory(categoryData, existingCategories)

      if (!validation.isValid) {
        throw new Error('Invalid category data: ' + Object.values(validation.errors).join(', '))
      }

      const response = await mockCategoryService.createCategory(categoryData)

      if (response.success) {
        // Add to local state
        categories.value.push(response.category)
        return response.category
      }

      throw new Error('Failed to create category')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number | string, categoryData: Partial<Category>): Promise<Category> => {
    loading.value = true
    error.value = null

    try {
      // Validate category data
      const existingCategories = categories.value.filter(cat => cat.type === categoryData.type && cat.id !== id)
      const validation = validateCategory(categoryData, existingCategories)

      if (!validation.isValid) {
        throw new Error('Invalid category data: ' + Object.values(validation.errors).join(', '))
      }

      const response = await mockCategoryService.updateCategory(id, categoryData)

      if (response.success && response.category) {
        // Update local state
        const index = categories.value.findIndex(cat => cat.id === id)
        if (index !== -1) {
          categories.value[index] = response.category
        }
        return response.category
      }

      throw new Error(response.message || 'Failed to update category')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number | string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Check if category can be deleted (not used in transactions)
      const categoryInUse = false // This would be checked against transactions

      if (categoryInUse) {
        throw new Error('Cannot delete category that is being used in transactions')
      }

      const response = await mockCategoryService.deleteCategory(id)

      if (response.success) {
        // Remove from local state
        categories.value = categories.value.filter(cat => cat.id !== id)
        return true
      }

      throw new Error(response.message || 'Failed to delete category')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryStats = async (id: number | string, period: string = 'month'): Promise<CategoryStats> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategoryStats(id, period)

      if (response.success) {
        return response.stats
      }

      throw new Error('Failed to fetch category statistics')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMostUsedCategories = async (type: TransactionType | null = null, limit: number = 10): Promise<Category[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getMostUsedCategories(type, limit)

      if (response.success) {
        return response.categories
      }

      throw new Error('Failed to fetch most used categories')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryTrends = async (id: number | string, months: number = 6): Promise<CategoryTrend[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategoryTrends(id, months)

      if (response.success) {
        return response.trends
      }

      throw new Error('Failed to fetch category trends')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetToDefaults = async (): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.resetToDefaults()

      if (response.success) {
        // Reset to default categories
        const defaultCats: Category[] = []

        // Add default income categories
        DEFAULT_CATEGORIES.INCOME.forEach((name, index) => {
          defaultCats.push({
            id: `income_${index}`,
            user_id: null,
            name,
            type: TRANSACTION_TYPES.INCOME,
            icon: '💰',
            color: '#10B981',
            is_default: true,
            is_active: true,
            description: `Default ${name.toLowerCase()} category`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null
          })
        })

        // Add default expense categories
        DEFAULT_CATEGORIES.EXPENSE.forEach((name, index) => {
          defaultCats.push({
            id: `expense_${index}`,
            user_id: null,
            name,
            type: TRANSACTION_TYPES.EXPENSE,
            icon: '💸',
            color: '#F59E0B',
            is_default: true,
            is_active: true,
            description: `Default ${name.toLowerCase()} category`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null
          })
        })

        categories.value = defaultCats
        return true
      }

      throw new Error(response.message || 'Failed to reset categories')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const importCategories = async (file: File): Promise<ImportResult> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.importCategories(file)

      if (response.success) {
        // Refresh categories after import
        await fetchCategories()
        return {
          imported: response.importedCount,
          skipped: response.skippedCount
        }
      }

      throw new Error('Failed to import categories')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportCategories = async (format: 'json' | 'csv' = 'json'): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.exportCategories(format)

      if (response.success) {
        // Create export data
        const exportData = {
          categories: categories.value.map(cat => ({
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            color: cat.color,
            description: cat.description,
            is_default: cat.is_default
          })),
          exportedAt: new Date().toISOString(),
          version: '1.0'
        }

        if (format === 'csv') {
          const headers = ['Name', 'Type', 'Icon', 'Color', 'Description', 'IsDefault']
          const csvContent = [
            headers.join(','),
            ...exportData.categories.map(cat => [
              `"${cat.name}"`,
              cat.type,
              cat.icon,
              cat.color,
              `"${cat.description || ''}"`,
              cat.is_default
            ].join(','))
          ].join('\n')

          // Create and download CSV file
          const blob = new Blob([csvContent], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `categories_export_${new Date().toISOString().split('T')[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } else {
          // JSON export
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `categories_export_${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }

        return true
      }

      throw new Error(response.message || 'Failed to export categories')
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const getCategoryById = (id: number | string): Category | null => {
    return categories.value.find(cat => cat.id === id) || null
  }

  const getCategoryByName = (name: string, type: TransactionType | null = null): Category | null => {
    return categories.value.find(cat =>
      cat.name.toLowerCase() === name.toLowerCase() && (type ? cat.type === type : true)
    ) || null
  }

  const getCategoriesByType = (type: TransactionType): Category[] => {
    return categories.value.filter(cat => cat.type === type)
  }

  const isCategoryNameAvailable = (name: string, type: TransactionType, excludeId: number | string | null = null): boolean => {
    return !categories.value.some(cat =>
      cat.name.toLowerCase() === name.toLowerCase() &&
      cat.type === type &&
      cat.id !== excludeId
    )
  }

  const getDefaultCategoriesForType = (type: string): readonly string[] => {
    return DEFAULT_CATEGORIES[type as keyof typeof DEFAULT_CATEGORIES] || []
  }

  const createDefaultCategory = (name: string, type: TransactionType, icon: string | null = null, description: string = ''): Partial<Category> => {
    return {
      name,
      type,
      icon: icon || (type === TRANSACTION_TYPES.INCOME ? '💰' : '💸'),
      description,
      color: type === TRANSACTION_TYPES.INCOME ? '#10B981' : '#F59E0B',
      is_default: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const searchCategories = (query: string): Category[] => {
    const searchTerm = query.toLowerCase()
    return categories.value.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm))
    )
  }

  const sortCategories = (sortBy: string = 'name', order: 'asc' | 'desc' = 'asc'): Category[] => {
    const sorted = [...categories.value].sort((a, b) => {
      let aValue: any = (a as any)[sortBy]
      let bValue: any = (b as any)[sortBy]

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return sorted
  }

  const groupCategoriesByType = (): { income: Category[]; expense: Category[] } => {
    const grouped: { income: Category[]; expense: Category[] } = {
      income: [],
      expense: []
    }

    categories.value.forEach(category => {
      const typeKey = category.type.toLowerCase() as 'income' | 'expense'
      if (grouped[typeKey]) {
        grouped[typeKey].push(category)
      }
    })

    return grouped
  }

  const getCategoryUsageData = (transactionData: any[] = []): Record<string | number, CategoryUsageData> => {
    const usage: Record<string | number, CategoryUsageData> = {}

    // Initialize usage data for all categories
    categories.value.forEach(category => {
      usage[category.id] = {
        category,
        transactionCount: 0,
        totalAmount: 0,
        lastUsed: null,
        averageAmount: 0
      }
    })

    // Calculate usage from transactions
    transactionData.forEach(transaction => {
      const category = getCategoryByName(transaction.category, transaction.type)
      if (category && usage[category.id]) {
        const categoryUsage = usage[category.id]
        categoryUsage.transactionCount++
        categoryUsage.totalAmount += transaction.amount

        const transactionDate = new Date(transaction.created_at || transaction.date)
        if (!categoryUsage.lastUsed || transactionDate > categoryUsage.lastUsed) {
          categoryUsage.lastUsed = transactionDate
        }
      }
    })

    // Calculate averages
    Object.values(usage).forEach(categoryUsage => {
      if (categoryUsage.transactionCount > 0) {
        categoryUsage.averageAmount = categoryUsage.totalAmount / categoryUsage.transactionCount
      }
    })

    return usage
  }

  const getCategoryInsights = (transactionData: any[] = []): CategoryInsights => {
    const usage = getCategoryUsageData(transactionData)
    const usageArray = Object.values(usage).filter(u => u.transactionCount > 0)

    const insights: CategoryInsights = {
      mostUsed: null,
      leastUsed: null,
      highestSpending: null,
      mostFrequent: null,
      unused: categories.value.filter(cat => !usageArray.find(u => u.category.id === cat.id)),
      totalCategories: categories.value.length,
      usedCategories: usageArray.length
    }

    if (usageArray.length > 0) {
      // Most used by transaction count
      insights.mostFrequent = usageArray.reduce((max, current) =>
        current.transactionCount > max.transactionCount ? current : max
      )

      // Highest spending
      insights.highestSpending = usageArray.reduce((max, current) =>
        current.totalAmount > max.totalAmount ? current : max
      )

      // Least used (but still used)
      insights.leastUsed = usageArray.reduce((min, current) =>
        current.transactionCount < min.transactionCount ? current : min
      )

      // Most used by amount
      insights.mostUsed = insights.highestSpending
    }

    return insights
  }

  const clearError = (): void => {
    error.value = null
  }

  const clearSelectedCategory = (): void => {
    selectedCategory.value = null
  }

  const refreshCategories = async (): Promise<void> => {
    await fetchCategories()
  }

  // Initialize categories with defaults if empty
  const initializeCategories = async (): Promise<void> => {
    if (categories.value.length === 0) {
      await resetToDefaults()
    }
  }

  // Watch categories and save to memory storage
  watch(
    categories,
    (newCategories) => {
      cachedCategories.value = newCategories
    },
    { deep: true }
  )

  return {
    // State
    categories,
    loading,
    error,
    selectedCategory,

    // Computed
    incomeCategories,
    expenseCategories,
    categoriesByType,
    categoryNames,
    defaultCategories,
    customCategories,
    totalCategories,
    categoriesWithStats,

    // CRUD Methods
    fetchCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,

    // Analytics Methods
    getCategoryStats,
    getMostUsedCategories,
    getCategoryTrends,

    // Management Methods
    resetToDefaults,
    importCategories,
    exportCategories,

    // Utility Methods
    getCategoryById,
    getCategoryByName,
    getCategoriesByType,
    isCategoryNameAvailable,
    getDefaultCategoriesForType,
    createDefaultCategory,
    searchCategories,
    sortCategories,
    groupCategoriesByType,
    getCategoryUsageData,
    getCategoryInsights,
    clearError,
    clearSelectedCategory,
    refreshCategories,
    initializeCategories,
    validateCategory
  }
}
