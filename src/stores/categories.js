// src/stores/categories.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Default categories
  const defaultCategories = [
    // Income Categories
    {
      id: 1,
      name: 'Salary',
      type: 'income',
      description: 'Regular employment income',
      icon: 'M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z',
      color: '#10B981',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Freelance',
      type: 'income',
      description: 'Freelance and contract work',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      color: '#10B981',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Business',
      type: 'income',
      description: 'Business revenue and profits',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: '#10B981',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Investment',
      type: 'income',
      description: 'Investment returns and dividends',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      color: '#10B981',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Gift',
      type: 'income',
      description: 'Gifts and monetary presents',
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      color: '#10B981',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Expense Categories
    {
      id: 6,
      name: 'Food & Dining',
      type: 'expense',
      description: 'Restaurants, groceries, meals',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'Transportation',
      type: 'expense',
      description: 'Gas, public transport, car expenses',
      icon: 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h3m10 0h3m-17 3h18',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Shopping',
      type: 'expense',
      description: 'Clothing, electronics, personal items',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: 'Entertainment',
      type: 'expense',
      description: 'Movies, games, hobbies',
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      name: 'Bills & Utilities',
      type: 'expense',
      description: 'Rent, electricity, internet, phone',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      name: 'Healthcare',
      type: 'expense',
      description: 'Medical expenses, insurance, pharmacy',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      name: 'Education',
      type: 'expense',
      description: 'Books, courses, training',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      color: '#F59E0B',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // Getters
  const incomeCategories = computed(() => 
    categories.value.filter(cat => cat.type === 'income')
  )

  const expenseCategories = computed(() => 
    categories.value.filter(cat => cat.type === 'expense')
  )

  const categoriesByType = computed(() => ({
    income: incomeCategories.value,
    expense: expenseCategories.value
  }))

  const getCategoryById = computed(() => (id) => 
    categories.value.find(cat => cat.id === id)
  )

  const getCategoryByName = computed(() => (name, type = null) => 
    categories.value.find(cat => 
      cat.name === name && (type ? cat.type === type : true)
    )
  )

  // Actions
  const initializeCategories = () => {
    const storedCategories = localStorage.getItem('finance_categories')
    
    if (storedCategories) {
      try {
        categories.value = JSON.parse(storedCategories)
      } catch (err) {
        console.error('Failed to parse stored categories:', err)
        categories.value = [...defaultCategories]
        saveToStorage()
      }
    } else {
      categories.value = [...defaultCategories]
      saveToStorage()
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('finance_categories', JSON.stringify(categories.value))
  }

  const addCategory = async (categoryData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newCategory = {
        id: Date.now(),
        ...categoryData,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      categories.value.push(newCategory)
      saveToStorage()

      return { success: true, category: newCategory }
    } catch (err) {
      error.value = err.message || 'Failed to add category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, updateData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = categories.value.findIndex(cat => cat.id === id)
      if (index === -1) {
        throw new Error('Category not found')
      }

      categories.value[index] = {
        ...categories.value[index],
        ...updateData,
        updatedAt: new Date()
      }

      saveToStorage()

      return { success: true, category: categories.value[index] }
    } catch (err) {
      error.value = err.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const category = categories.value.find(cat => cat.id === id)
      if (!category) {
        throw new Error('Category not found')
      }

      // Prevent deletion of default categories
      if (category.isDefault) {
        throw new Error('Cannot delete default category')
      }

      categories.value = categories.value.filter(cat => cat.id !== id)
      saveToStorage()

      return { success: true, message: 'Category deleted successfully' }
    } catch (err) {
      error.value = err.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryStats = (categoryId, transactions = []) => {
    const categoryTransactions = transactions.filter(t => 
      getCategoryByName.value(t.category, t.type)?.id === categoryId
    )

    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
    const transactionCount = categoryTransactions.length

    const lastTransaction = categoryTransactions
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))[0]

    return {
      totalAmount,
      transactionCount,
      lastTransaction: lastTransaction || null,
      averageAmount: transactionCount > 0 ? totalAmount / transactionCount : 0
    }
  }

  const resetToDefaults = () => {
    categories.value = [...defaultCategories]
    saveToStorage()
  }

  const importCategories = async (categoriesData) => {
    loading.value = true
    error.value = null

    try {
      // Validate categories data
      if (!Array.isArray(categoriesData)) {
        throw new Error('Invalid categories data format')
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Merge with existing categories
      const newCategories = categoriesData.map(cat => ({
        ...cat,
        id: Date.now() + Math.random(),
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      categories.value = [...categories.value, ...newCategories]
      saveToStorage()

      return { success: true, imported: newCategories.length }
    } catch (err) {
      error.value = err.message || 'Failed to import categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportCategories = () => {
    const exportData = categories.value.map(cat => ({
      name: cat.name,
      type: cat.type,
      description: cat.description,
      icon: cat.icon,
      color: cat.color
    }))

    return {
      categories: exportData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }

  // Initialize categories on store creation
  initializeCategories()

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
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats,
    resetToDefaults,
    importCategories,
    exportCategories,
    initializeCategories
  }
})