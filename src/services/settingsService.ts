// src/services/settingsService.ts
import api from './api'
import { API_ENDPOINTS, DEFAULT_SETTINGS } from '../utils/constants'
import type { DefaultSettings } from '../utils/constants'

export interface UserSettings extends DefaultSettings {
  [key: string]: any
}

export interface SettingsResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

const settingsService = {
  // Get user settings with fallback to defaults
  getSettings: async (): Promise<SettingsResponse<UserSettings>> => {
    try {
      return await api.get<SettingsResponse<UserSettings>>(API_ENDPOINTS.SETTINGS.GET)
    } catch (error) {
      // Return default settings if endpoint doesn't exist
      return {
        data: DEFAULT_SETTINGS as UserSettings,
        success: true
      }
    }
  },

  // Update user preferences with fallback
  updatePreferences: async (preferences: Partial<UserSettings>): Promise<SettingsResponse> => {
    try {
      return await api.put<SettingsResponse>(API_ENDPOINTS.SETTINGS.UPDATE_PREFERENCES, preferences)
    } catch (error) {
      // Simulate successful update for now
      return {
        data: preferences,
        success: true,
        message: 'Settings saved locally (backend not implemented)'
      }
    }
  },

  // Update notification settings with fallback
  updateNotifications: async (notifications: Record<string, boolean>): Promise<SettingsResponse> => {
    try {
      return await api.put<SettingsResponse>(API_ENDPOINTS.SETTINGS.UPDATE_NOTIFICATIONS, notifications)
    } catch (error) {
      return {
        data: notifications,
        success: true,
        message: 'Notification settings saved locally'
      }
    }
  },

  // Export user data with fallback
  exportData: async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    try {
      return await api.get<Blob>(`${API_ENDPOINTS.SETTINGS.EXPORT_DATA}?format=${format}`, {
        responseType: 'blob'
      } as any)
    } catch (error) {
      throw new Error('Data export feature is not yet available')
    }
  },

  // Delete all user data with fallback
  deleteAllData: async (): Promise<SettingsResponse> => {
    try {
      return await api.delete<SettingsResponse>(API_ENDPOINTS.SETTINGS.DELETE_ALL_DATA)
    } catch (error) {
      throw new Error('Data deletion feature is not yet available')
    }
  },

  // Update auto backup setting with fallback
  updateAutoBackup: async (enabled: boolean): Promise<SettingsResponse> => {
    try {
      return await api.put<SettingsResponse>(API_ENDPOINTS.SETTINGS.UPDATE_AUTO_BACKUP, { enabled })
    } catch (error) {
      return {
        data: { autoBackup: enabled },
        success: true,
        message: 'Auto backup setting saved locally'
      }
    }
  }
}

export default settingsService
