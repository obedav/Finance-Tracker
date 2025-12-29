// src/stores/categories.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import categoryService from '../services/categoryService.js'
import type { Category, CategoryFormData, ApiResponse } from '@/types'

interface CategoryStats {
  totalAmount: number
  transactionCount: number
  lastTransaction: string | null
  averageAmount: number
}

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories: Ref<Category[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  // Getters
  const incomeCategories: ComputedRef<Category[]> = computed(() =>
    categories.value.filter(cat => cat.type === 'income' || cat.type.toUpperCase() === 'INCOME')
  )

  const expenseCategories: ComputedRef<Category[]> = computed(() =>
    categories.value.filter(cat => cat.type === 'expense' || cat.type.toUpperCase() === 'EXPENSE')
  )

  const categoriesByType = computed(() => ({
    income: incomeCategories.value,
    expense: expenseCategories.value
  }))

  const getCategoryById = computed(() => (id: number): Category | undefined =>
    categories.value.find(cat => cat.id === id)
  )

  const getCategoryByName = computed(() => (name: string, type: string | null = null): Category | undefined =>
    categories.value.find(cat =>
      cat.name === name && (type ? cat.type.toUpperCase() === type.toUpperCase() : true)
    )
  )

  // Actions - Fetch from API
  const fetchCategories = async (type: string | null = null): Promise<{ success: boolean; data?: Category[]; message?: string }> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.getCategories(type)

      if (response.success && response.data) {
        categories.value = response.data
      } else if (Array.isArray(response)) {
        categories.value = response
      } else {
        categories.value = []
      }

      return { success: true, data: categories.value }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      error.value = errorMessage
      categories.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const initializeCategories = async (): Promise<void> => {
    await fetchCategories()
  }

  const addCategory = async (categoryData: CategoryFormData): Promise<{ success: boolean; category?: Category }> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.createCategory(categoryData)

      if (response.success && response.data) {
        categories.value.push(response.data)
        return { success: true, category: response.data }
      }

      throw new Error(response.message || 'Failed to create category')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, updateData: Partial<CategoryFormData>): Promise<{ success: boolean; category?: Category }> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.updateCategory(id, updateData)

      if (response.success && response.data) {
        const index = categories.value.findIndex(cat => cat.id === id)
        if (index !== -1) {
          categories.value[index] = response.data
        }
        return { success: true, category: response.data }
      }

      throw new Error(response.message || 'Failed to update category')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.deleteCategory(id)

      if (response.success) {
        categories.value = categories.value.filter(cat => cat.id !== id)
        return { success: true, message: 'Category deleted successfully' }
      }

      throw new Error(response.message || 'Failed to delete category')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryStats = async (categoryId: number, params: Record<string, unknown> = {}): Promise<CategoryStats> => {
    try {
      const response = await categoryService.getCategoryStatistics(categoryId, params)

      if (response.success && response.data) {
        return response.data
      }

      return {
        totalAmount: 0,
        transactionCount: 0,
        lastTransaction: null,
        averageAmount: 0
      }
    } catch (err) {
      return {
        totalAmount: 0,
        transactionCount: 0,
        lastTransaction: null,
        averageAmount: 0
      }
    }
  }

  const getDefaultCategories = async (): Promise<Category[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.getDefaultCategories()

      if (response.success && response.data) {
        return response.data
      }

      return []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch default categories'
      error.value = errorMessage
      return []
    } finally {
      loading.value = false
    }
  }

  const resetToDefaults = async (): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      // Fetch default categories and set them
      const defaults = await getDefaultCategories()
      categories.value = defaults
      return { success: true, message: 'Categories reset to defaults' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset categories'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const importCategories = async (file: File): Promise<{ success: boolean; imported: number }> => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.importCategories(file)

      if (response.success) {
        // Refresh categories from server
        await fetchCategories()
        return { success: true, imported: response.imported || 0 }
      }

      throw new Error(response.message || 'Failed to import categories')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import categories'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportCategories = async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    try {
      return await categoryService.exportCategories(format)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export categories'
      error.value = errorMessage
      throw err
    }
  }

  return {
    // State
    categories,
    loading,
    error,

    // Getters
    incomeCategories,
    expenseCategories,
    categoriesByType,
    getCategoryById,
    getCategoryByName,

    // Actions
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats,
    getDefaultCategories,
    resetToDefaults,
    importCategories,
    exportCategories,
    initializeCategories
  }
})
