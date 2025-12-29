// src/composables/useCategories.js
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_CATEGORIES, TRANSACTION_TYPES } from '../utils/constants'

export function useCategories() {
  const { data: cachedCategories } = useLocalStorage('categories', [])

  // State
  const categories = ref(cachedCategories.value || [])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref(null)

  // Computed properties
  const incomeCategories = computed(() => 
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.INCOME)
  )

  const expenseCategories = computed(() => 
    categories.value.filter(cat => cat.type === TRANSACTION_TYPES.EXPENSE)
  )

  const categoriesByType = computed(() => ({
    income: incomeCategories.value,
    expense: expenseCategories.value
  }))

  const categoryNames = computed(() => ({
    income: incomeCategories.value.map(cat => cat.name),
    expense: expenseCategories.value.map(cat => cat.name)
  }))

  const defaultCategories = computed(() => 
    categories.value.filter(cat => cat.isDefault)
  )

  const customCategories = computed(() => 
    categories.value.filter(cat => !cat.isDefault)
  )

  const totalCategories = computed(() => categories.value.length)

  const categoriesWithStats = computed(() => {
    return categories.value.map(category => ({
      ...category,
      transactionCount: category.transactionCount || 0,
      totalAmount: category.totalAmount || 0,
      percentage: category.percentage || 0,
      lastUsed: category.lastUsed || null
    }))
  })

  // Validation helper
  const validateCategory = (categoryData, existingCategories = []) => {
    const errors = {}
    const isValid = true

    // Required fields
    if (!categoryData.name || categoryData.name.trim() === '') {
      errors.name = 'Category name is required'
    }

    if (!categoryData.type || !Object.values(TRANSACTION_TYPES).includes(categoryData.type)) {
      errors.type = 'Valid category type is required'
    }

    // Check for duplicate names within the same type
    const duplicateName = existingCategories.find(cat => 
      cat.name.toLowerCase() === categoryData.name.toLowerCase() &&
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
  const mockCategoryService = {
    async getCategories(type = null) {
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

    async getCategory(id) {
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const category = categories.value.find(cat => cat.id === id)
      return {
        success: !!category,
        category,
        message: category ? null : 'Category not found'
      }
    },

    async createCategory(categoryData) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newCategory = {
        id: Date.now() + Math.random(),
        ...categoryData,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        transactionCount: 0,
        totalAmount: 0
      }

      return {
        success: true,
        category: newCategory
      }
    },

    async updateCategory(id, categoryData) {
      await new Promise(resolve => setTimeout(resolve, 250))
      
      const existingCategory = categories.value.find(cat => cat.id === id)
      if (!existingCategory) {
        return {
          success: false,
          message: 'Category not found'
        }
      }

      const updatedCategory = {
        ...existingCategory,
        ...categoryData,
        updatedAt: new Date()
      }

      return {
        success: true,
        category: updatedCategory
      }
    },

    async deleteCategory(id) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const categoryExists = categories.value.some(cat => cat.id === id)
      return {
        success: categoryExists,
        message: categoryExists ? null : 'Category not found'
      }
    },

    async getCategoryStats(id, period = 'month') {
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

    async getMostUsedCategories(type = null, limit = 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let result = categories.value
      if (type) {
        result = result.filter(cat => cat.type === type)
      }
      
      // Sort by usage (mock data)
      result = result.sort((a, b) => (b.transactionCount || 0) - (a.transactionCount || 0))
      result = result.slice(0, limit)

      return {
        success: true,
        categories: result
      }
    },

    async getCategoryTrends(id, months = 6) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock trend data
      const trends = Array.from({ length: months }, (_, i) => ({
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

    async importCategories(file) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        importedCount: Math.floor(Math.random() * 10),
        skippedCount: Math.floor(Math.random() * 3)
      }
    },

    async exportCategories(format = 'json') {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      return {
        success: true,
        message: 'Categories exported successfully'
      }
    }
  }

  // Methods
  const fetchCategories = async (type = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategories(type)
      
      if (response.success) {
        categories.value = response.categories || []
        return response.categories
      }
      
      throw new Error(response.message || 'Failed to fetch categories')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategory = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategory(id)
      
      if (response.success) {
        selectedCategory.value = response.category
        return response.category
      }
      
      throw new Error(response.message || 'Failed to fetch category')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData) => {
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
      
      throw new Error(response.message || 'Failed to create category')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, categoryData) => {
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
      
      if (response.success) {
        // Update local state
        const index = categories.value.findIndex(cat => cat.id === id)
        if (index !== -1) {
          categories.value[index] = response.category
        }
        return response.category
      }
      
      throw new Error(response.message || 'Failed to update category')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryStats = async (id, period = 'month') => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategoryStats(id, period)
      
      if (response.success) {
        return response.stats
      }
      
      throw new Error(response.message || 'Failed to fetch category statistics')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMostUsedCategories = async (type = null, limit = 10) => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getMostUsedCategories(type, limit)
      
      if (response.success) {
        return response.categories
      }
      
      throw new Error(response.message || 'Failed to fetch most used categories')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryTrends = async (id, months = 6) => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.getCategoryTrends(id, months)
      
      if (response.success) {
        return response.trends
      }
      
      throw new Error(response.message || 'Failed to fetch category trends')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetToDefaults = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await mockCategoryService.resetToDefaults()
      
      if (response.success) {
        // Reset to default categories
        const defaultCats = []
        
        // Add default income categories
        DEFAULT_CATEGORIES.income.forEach((name, index) => {
          defaultCats.push({
            id: `income_${index}`,
            name,
            type: TRANSACTION_TYPES.INCOME,
            icon: '💰',
            color: '#10B981',
            isDefault: true,
            description: `Default ${name.toLowerCase()} category`,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactionCount: 0,
            totalAmount: 0
          })
        })

        // Add default expense categories
        DEFAULT_CATEGORIES.expense.forEach((name, index) => {
          defaultCats.push({
            id: `expense_${index}`,
            name,
            type: TRANSACTION_TYPES.EXPENSE,
            icon: '💸',
            color: '#F59E0B',
            isDefault: true,
            description: `Default ${name.toLowerCase()} category`,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactionCount: 0,
            totalAmount: 0
          })
        })

        categories.value = defaultCats
        return true
      }
      
      throw new Error(response.message || 'Failed to reset categories')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const importCategories = async (file) => {
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
      
      throw new Error(response.message || 'Failed to import categories')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportCategories = async (format = 'json') => {
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
            isDefault: cat.isDefault
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
              cat.isDefault
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id) || null
  }

  const getCategoryByName = (name, type = null) => {
    return categories.value.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && (type ? cat.type === type : true)
    ) || null
  }

  const getCategoriesByType = (type) => {
    return categories.value.filter(cat => cat.type === type)
  }

  const isCategoryNameAvailable = (name, type, excludeId = null) => {
    return !categories.value.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      cat.type === type && 
      cat.id !== excludeId
    )
  }

  const getDefaultCategoriesForType = (type) => {
    return DEFAULT_CATEGORIES[type] || []
  }

  const createDefaultCategory = (name, type, icon = null, description = '') => {
    return {
      name,
      type,
      icon: icon || (type === TRANSACTION_TYPES.INCOME ? '💰' : '💸'),
      description,
      color: type === TRANSACTION_TYPES.INCOME ? '#10B981' : '#F59E0B',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionCount: 0,
      totalAmount: 0
    }
  }

  const searchCategories = (query) => {
    const searchTerm = query.toLowerCase()
    return categories.value.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm))
    )
  }

  const sortCategories = (sortBy = 'name', order = 'asc') => {
    const sorted = [...categories.value].sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

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

  const groupCategoriesByType = () => {
    const grouped = {
      income: [],
      expense: []
    }

    categories.value.forEach(category => {
      if (grouped[category.type]) {
        grouped[category.type].push(category)
      }
    })

    return grouped
  }

  const getCategoryUsageData = (transactionData = []) => {
    const usage = {}

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
        
        const transactionDate = new Date(transaction.createdAt || transaction.date)
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

  const getCategoryInsights = (transactionData = []) => {
    const usage = getCategoryUsageData(transactionData)
    const usageArray = Object.values(usage).filter(u => u.transactionCount > 0)

    const insights = {
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

  const clearError = () => {
    error.value = null
  }

  const clearSelectedCategory = () => {
    selectedCategory.value = null
  }

  const refreshCategories = async () => {
    await fetchCategories()
  }

  // Initialize categories with defaults if empty
  const initializeCategories = async () => {
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