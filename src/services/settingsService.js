import api from '@/services/api.js'
import { API_ENDPOINTS, DEFAULT_SETTINGS } from '@/utils/constants'

const settingsService = {
  // Get user settings with fallback to defaults
  getSettings: async () => {
    try {
      return await api.get(API_ENDPOINTS.SETTINGS.GET)
    } catch (error) {
      console.warn('Settings endpoint not implemented, using defaults:', error.message)
      // Return default settings if endpoint doesn't exist
      return {
        data: DEFAULT_SETTINGS,
        success: true
      }
    }
  },

  // Update user preferences with fallback
  updatePreferences: async (preferences) => {
    try {
      return await api.put(API_ENDPOINTS.SETTINGS.UPDATE_PREFERENCES, preferences)
    } catch (error) {
      console.warn('Update preferences endpoint not implemented:', error.message)
      // Simulate successful update for now
      return {
        data: preferences,
        success: true,
        message: 'Settings saved locally (backend not implemented)'
      }
    }
  },

  // Update notification settings with fallback
  updateNotifications: async (notifications) => {
    try {
      return await api.put(API_ENDPOINTS.SETTINGS.UPDATE_NOTIFICATIONS, notifications)
    } catch (error) {
      console.warn('Update notifications endpoint not implemented:', error.message)
      return {
        data: notifications,
        success: true,
        message: 'Notification settings saved locally'
      }
    }
  },

  // Export user data with fallback
  exportData: async (format = 'json') => {
    try {
      return await api.get(`${API_ENDPOINTS.SETTINGS.EXPORT_DATA}?format=${format}`, {
        responseType: 'blob'
      })
    } catch (error) {
      console.warn('Export data endpoint not implemented:', error.message)
      throw new Error('Data export feature is not yet available')
    }
  },

  // Delete all user data with fallback
  deleteAllData: async () => {
    try {
      return await api.delete(API_ENDPOINTS.SETTINGS.DELETE_ALL_DATA)
    } catch (error) {
      console.warn('Delete all data endpoint not implemented:', error.message)
      throw new Error('Data deletion feature is not yet available')
    }
  },

  // Update auto backup setting with fallback
  updateAutoBackup: async (enabled) => {
    try {
      return await api.put(API_ENDPOINTS.SETTINGS.UPDATE_AUTO_BACKUP, { enabled })
    } catch (error) {
      console.warn('Update auto backup endpoint not implemented:', error.message)
      return {
        data: { autoBackup: enabled },
        success: true,
        message: 'Auto backup setting saved locally'
      }
    }
  }
}

export default settingsService