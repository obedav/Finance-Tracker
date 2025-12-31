import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import settingsService from '@/services/settingsService'

interface Preferences {
  currency: string
  dateFormat: string
  theme: string
  language: string
  timezone: string
}

interface Notifications {
  email: boolean
  budgetAlerts: boolean
  monthlyReports: boolean
  goalReminders: boolean
  transactionReminders: boolean
  lowBalanceAlerts: boolean
}

interface Security {
  twoFactorEnabled: boolean
}

interface DataSettings {
  autoBackup: boolean
}

interface AllSettings extends Preferences {
  notifications: Notifications
  security: Security
  data: DataSettings
}

interface UpdateResponse {
  success: boolean
  message: string
  error?: string
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const isLoaded: Ref<boolean> = ref(false)
  const loading: Ref<boolean> = ref(false)

  // Default settings
  const defaultSettings: AllSettings = {
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
  const preferences: Ref<Preferences> = ref({
    currency: defaultSettings.currency,
    dateFormat: defaultSettings.dateFormat,
    theme: defaultSettings.theme,
    language: defaultSettings.language,
    timezone: defaultSettings.timezone
  })

  const notifications: Ref<Notifications> = ref({ ...defaultSettings.notifications })
  const security: Ref<Security> = ref({ ...defaultSettings.security })
  const data: Ref<DataSettings> = ref({ ...defaultSettings.data })

  // Computed getters
  const allSettings: ComputedRef<AllSettings> = computed(() => ({
    ...preferences.value,
    notifications: notifications.value,
    security: security.value,
    data: data.value
  }))

  // Actions
  const fetchSettings = async (): Promise<void> => {
    try {
      loading.value = true

      const response = await settingsService.getSettings()

      // Handle both response formats
      let settingsData: Partial<AllSettings>

      if (response && 'data' in response && response.success) {
        settingsData = response.data as Partial<AllSettings>
      } else if (response && 'data' in response) {
        settingsData = response.data as Partial<AllSettings>
      } else if (response) {
        settingsData = response as Partial<AllSettings>
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
    } catch (error) {
      // Use defaults if fetch fails
      preferences.value = {
        currency: defaultSettings.currency,
        dateFormat: defaultSettings.dateFormat,
        theme: defaultSettings.theme,
        language: defaultSettings.language,
        timezone: defaultSettings.timezone
      }
      notifications.value = { ...defaultSettings.notifications }
      security.value = { ...defaultSettings.security }
      data.value = { ...defaultSettings.data }
      isLoaded.value = true
    } finally {
      loading.value = false
    }
  }

  const updatePreferences = async (newPreferences: Partial<Preferences>): Promise<UpdateResponse> => {
    try {
      loading.value = true

      await settingsService.updatePreferences(newPreferences)

      // Update local state regardless of response format
      Object.assign(preferences.value, newPreferences)

      return {
        success: true,
        message: 'Preferences updated successfully!'
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        message: 'Failed to update preferences',
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  const updateNotifications = async (newNotifications: Partial<Notifications>): Promise<UpdateResponse> => {
    try {
      loading.value = true

      const response = await settingsService.updateNotifications(newNotifications)

      if (response && response.success !== false) {
        // Update local state immediately
        Object.assign(notifications.value, newNotifications)

        return {
          success: true,
          message: 'Notification settings updated successfully!'
        }
      } else {
        throw new Error(response?.message || 'Failed to update notifications')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        message: 'Failed to update notification settings',
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  const resetToDefaults = (): void => {
    preferences.value = {
      currency: defaultSettings.currency,
      dateFormat: defaultSettings.dateFormat,
      theme: defaultSettings.theme,
      language: defaultSettings.language,
      timezone: defaultSettings.timezone
    }
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
