// src/stores/settingsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import settingsService from '@/services/settingsService'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const isLoaded = ref(false)
  const loading = ref(false)
  
  // Default settings
  const defaultSettings = {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      budgetAlerts: true,
      monthlyReports: true,
      goalReminders: false,
      transactionReminders: false,
      lowBalanceAlerts: false
    },
    security: {
      twoFactorEnabled: false
    },
    data: {
      autoBackup: false
    }
  }
  
  // Reactive state
  const preferences = ref({ ...defaultSettings })
  const notifications = ref({ ...defaultSettings.notifications })
  const security = ref({ ...defaultSettings.security })
  const data = ref({ ...defaultSettings.data })
  
  // Computed getters
  const allSettings = computed(() => ({
    ...preferences.value,
    notifications: notifications.value,
    security: security.value,
    data: data.value
  }))
  
  // Actions
const fetchSettings = async () => {
  try {
    loading.value = true
    console.log('Fetching settings from API...')
    
    const response = await settingsService.getSettings()
    console.log('Settings response:', response)
    
    // Handle both response formats
    let settingsData
    if (response && response.data && response.success) {
      // If response has success wrapper
      settingsData = response.data
    } else if (response && response.data) {
      // If response.data contains the settings directly
      settingsData = response.data
    } else if (response) {
      // If response contains the settings directly
      settingsData = response
    } else {
      throw new Error('No settings data received')
    }
    
    // Update preferences
    preferences.value = {
      currency: settingsData.currency || defaultSettings.currency,
      dateFormat: settingsData.dateFormat || defaultSettings.dateFormat,
      theme: settingsData.theme || defaultSettings.theme,
      language: settingsData.language || defaultSettings.language,
      timezone: settingsData.timezone || defaultSettings.timezone
    }
    
    // Update notifications
    notifications.value = {
      ...defaultSettings.notifications,
      ...settingsData.notifications
    }
    
    // Update security
    security.value = {
      ...defaultSettings.security,
      ...settingsData.security
    }
    
    // Update data settings
    data.value = {
      ...defaultSettings.data,
      ...settingsData.data
    }
    
    isLoaded.value = true
    console.log('Settings loaded successfully:', allSettings.value)
    
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // Use defaults if fetch fails
    preferences.value = { ...defaultSettings }
    notifications.value = { ...defaultSettings.notifications }
    security.value = { ...defaultSettings.security }
    data.value = { ...defaultSettings.data }
    isLoaded.value = true
  } finally {
    loading.value = false
  }
}
  
 const updatePreferences = async (newPreferences) => {
  try {
    loading.value = true
    console.log('Store: Updating preferences:', newPreferences)
    
    // Call the service
    const response = await settingsService.updatePreferences(newPreferences)
    console.log('Store: Service response:', response)
    
    // Update local state regardless of response format
    Object.assign(preferences.value, newPreferences)
    console.log('Store: Updated local preferences:', preferences.value)
    
    return {
      success: true,
      message: 'Preferences updated successfully!'
    }
    
  } catch (error) {
    console.error('Store: Error updating preferences:', error)
    return {
    success: false,
    message: 'Failed to update preferences',
    error: error.message
    }
  } finally {
    loading.value = false
  }
}
  
  const updateNotifications = async (newNotifications) => {
    try {
      loading.value = true
      console.log('Updating notifications:', newNotifications)
      
      const response = await settingsService.updateNotifications(newNotifications)
      console.log('Update notifications response:', response)
      
      if (response && (response.success !== false)) {
        // Update local state immediately
        Object.assign(notifications.value, newNotifications)
        
        console.log('Notifications updated successfully:', notifications.value)
        
        return {
          success: true,
          message: 'Notification settings updated successfully!'
        }
      } else {
        throw new Error(response?.message || 'Failed to update notifications')
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      
      return {
        success: false,
        message: 'Failed to update notification settings',
        error: error.message
      }
    } finally {
      loading.value = false
    }
  }
  
  const resetToDefaults = () => {
    preferences.value = { ...defaultSettings }
    notifications.value = { ...defaultSettings.notifications }
    security.value = { ...defaultSettings.security }
    data.value = { ...defaultSettings.data }
  }
  
  return {
    // State
    isLoaded,
    loading,
    preferences,
    notifications,
    security,
    data,
    
    // Computed
    allSettings,
    
    // Actions
    fetchSettings,
    updatePreferences,
    updateNotifications,
    resetToDefaults
  }
})