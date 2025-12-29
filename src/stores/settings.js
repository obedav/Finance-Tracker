// src/stores/settings.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const preferences = ref({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York'
  })

  const notifications = ref({
    email: true,
    budgetAlerts: true,
    monthlyReports: true,
    goalReminders: false,
    transactionReminders: true,
    lowBalanceAlerts: true
  })

  const privacy = ref({
    dataSharing: false,
    analytics: true,
    marketingEmails: false,
    autoBackup: true,
    twoFactorAuth: false
  })

  const budget = ref({
    monthlyLimit: 0,
    categories: {},
    alertThreshold: 80, // percentage
    rolloverUnused: false
  })

  const goals = ref([])

  const loading = ref(false)
  const error = ref(null)

  // Getters
  const currencySymbol = computed(() => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥'
    }
    return symbols[preferences.value.currency] || '$'
  })

  const formattedCurrency = computed(() => (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: preferences.value.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return formatter.format(amount)
  })

  const formattedDate = computed(() => (date) => {
    const dateObj = new Date(date)
    const format = preferences.value.dateFormat
    
    switch (format) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB')
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0]
      default: // MM/DD/YYYY
        return dateObj.toLocaleDateString('en-US')
    }
  })

  const isDarkMode = computed(() => preferences.value.theme === 'dark')

  const notificationCount = computed(() => {
    return Object.values(notifications.value).filter(Boolean).length
  })

  // Actions
  const initializeSettings = () => {
    // Load from localStorage
    const storedPreferences = localStorage.getItem('finance_preferences')
    const storedNotifications = localStorage.getItem('finance_notifications')
    const storedPrivacy = localStorage.getItem('finance_privacy')
    const storedBudget = localStorage.getItem('finance_budget')
    const storedGoals = localStorage.getItem('finance_goals')

    if (storedPreferences) {
      try {
        preferences.value = { ...preferences.value, ...JSON.parse(storedPreferences) }
      } catch (err) {
      }
    }

    if (storedNotifications) {
      try {
        notifications.value = { ...notifications.value, ...JSON.parse(storedNotifications) }
      } catch (err) {
      }
    }

    if (storedPrivacy) {
      try {
        privacy.value = { ...privacy.value, ...JSON.parse(storedPrivacy) }
      } catch (err) {
      }
    }

    if (storedBudget) {
      try {
        budget.value = { ...budget.value, ...JSON.parse(storedBudget) }
      } catch (err) {
      }
    }

    if (storedGoals) {
      try {
        goals.value = JSON.parse(storedGoals)
      } catch (err) {
      }
    }

    // Apply theme
    applyTheme()
  }

  const saveToStorage = () => {
    localStorage.setItem('finance_preferences', JSON.stringify(preferences.value))
    localStorage.setItem('finance_notifications', JSON.stringify(notifications.value))
    localStorage.setItem('finance_privacy', JSON.stringify(privacy.value))
    localStorage.setItem('finance_budget', JSON.stringify(budget.value))
    localStorage.setItem('finance_goals', JSON.stringify(goals.value))
  }

  const updatePreferences = async (newPreferences) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      preferences.value = { ...preferences.value, ...newPreferences }
      
      // Apply theme if it was changed
      if (newPreferences.theme) {
        applyTheme()
      }

      saveToStorage()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to update preferences'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNotifications = async (newNotifications) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))

      notifications.value = { ...notifications.value, ...newNotifications }
      saveToStorage()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to update notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePrivacy = async (newPrivacy) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 400))

      privacy.value = { ...privacy.value, ...newPrivacy }
      saveToStorage()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to update privacy settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBudget = async (newBudget) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 600))

      budget.value = { ...budget.value, ...newBudget }
      saveToStorage()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to update budget settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addGoal = async (goalData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newGoal = {
        id: Date.now(),
        ...goalData,
        currentAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      goals.value.push(newGoal)
      saveToStorage()
      return { success: true, goal: newGoal }
    } catch (err) {
      error.value = err.message || 'Failed to add goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGoal = async (goalId, updateData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 400))

      const index = goals.value.findIndex(goal => goal.id === goalId)
      if (index === -1) {
        throw new Error('Goal not found')
      }

      goals.value[index] = {
        ...goals.value[index],
        ...updateData,
        updatedAt: new Date()
      }

      saveToStorage()
      return { success: true, goal: goals.value[index] }
    } catch (err) {
      error.value = err.message || 'Failed to update goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGoal = async (goalId) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))

      goals.value = goals.value.filter(goal => goal.id !== goalId)
      saveToStorage()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to delete goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const applyTheme = () => {
    const html = document.documentElement
    
    if (preferences.value.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // You can also set CSS custom properties here
    html.style.setProperty('--primary-color', '#10B981')
    html.style.setProperty('--secondary-color', '#F59E0B')
    html.style.setProperty('--background-color', '#FAF9F6')
  }

  const resetSettings = async () => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Reset to defaults
      preferences.value = {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York'
      }

      notifications.value = {
        email: true,
        budgetAlerts: true,
        monthlyReports: true,
        goalReminders: false,
        transactionReminders: true,
        lowBalanceAlerts: true
      }

      privacy.value = {
        dataSharing: false,
        analytics: true,
        marketingEmails: false,
        autoBackup: true,
        twoFactorAuth: false
      }

      budget.value = {
        monthlyLimit: 0,
        categories: {},
        alertThreshold: 80,
        rolloverUnused: false
      }

      goals.value = []

      saveToStorage()
      applyTheme()

      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to reset settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportSettings = () => {
    return {
      preferences: preferences.value,
      notifications: notifications.value,
      privacy: privacy.value,
      budget: budget.value,
      goals: goals.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }

  const importSettings = async (settingsData) => {
    loading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate settings data
      if (!settingsData || typeof settingsData !== 'object') {
        throw new Error('Invalid settings data format')
      }

      // Import each section if it exists
      if (settingsData.preferences) {
        preferences.value = { ...preferences.value, ...settingsData.preferences }
      }

      if (settingsData.notifications) {
        notifications.value = { ...notifications.value, ...settingsData.notifications }
      }

      if (settingsData.privacy) {
        privacy.value = { ...privacy.value, ...settingsData.privacy }
      }

      if (settingsData.budget) {
        budget.value = { ...budget.value, ...settingsData.budget }
      }

      if (settingsData.goals && Array.isArray(settingsData.goals)) {
        goals.value = settingsData.goals
      }

      saveToStorage()
      applyTheme()

      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to import settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkBudgetAlert = (categoryName, currentSpending) => {
    const categoryBudget = budget.value.categories[categoryName]
    if (!categoryBudget || !notifications.value.budgetAlerts) {
      return null
    }

    const percentage = (currentSpending / categoryBudget) * 100
    const threshold = budget.value.alertThreshold

    if (percentage >= threshold) {
      return {
        type: percentage >= 100 ? 'exceeded' : 'warning',
        category: categoryName,
        percentage: Math.round(percentage),
        amount: currentSpending,
        budget: categoryBudget
      }
    }

    return null
  }

  const getGoalProgress = (goalId) => {
    const goal = goals.value.find(g => g.id === goalId)
    if (!goal) return null

    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const remaining = goal.targetAmount - goal.currentAmount
    const daysLeft = goal.targetDate ? 
      Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null

    return {
      ...goal,
      progress: Math.min(progress, 100),
      remaining: Math.max(remaining, 0),
      daysLeft,
      isCompleted: progress >= 100
    }
  }

  // Watch for changes and save automatically
  watch(
    [preferences, notifications, privacy, budget, goals],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Initialize settings on store creation
  initializeSettings()

  return {
    // State
    preferences,
    notifications,
    privacy,
    budget,
    goals,
    loading,
    error,

    // Getters
    currencySymbol,
    formattedCurrency,
    formattedDate,
    isDarkMode,
    notificationCount,

    // Actions
    updatePreferences,
    updateNotifications,
    updatePrivacy,
    updateBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    resetSettings,
    exportSettings,
    importSettings,
    checkBudgetAlert,
    getGoalProgress,
    applyTheme,
    initializeSettings
  }
})