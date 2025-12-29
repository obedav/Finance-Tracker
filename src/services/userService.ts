// src/services/userService.ts
import api, { authApi } from './api'
import { API_ENDPOINTS } from '../utils/constants'
import type { User } from '../types'

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

export interface TwoFactorResponse {
  success: boolean
  message?: string
  qrCode?: string
  secret?: string
}

const userService = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return await authApi.getProfile()
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    return await authApi.getProfile()
  },

  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return await authApi.updateProfile(profileData)
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData): Promise<{ success: boolean; message: string }> => {
    return await authApi.changePassword(passwordData)
  },

  // Enable two-factor authentication
  enable2FA: async (): Promise<TwoFactorResponse> => {
    try {
      return await api.post<TwoFactorResponse>(API_ENDPOINTS.AUTH.ENABLE_2FA)
    } catch (error) {
      throw error
    }
  },

  // Disable two-factor authentication
  disable2FA: async (): Promise<TwoFactorResponse> => {
    try {
      return await api.post<TwoFactorResponse>(API_ENDPOINTS.AUTH.DISABLE_2FA)
    } catch (error) {
      throw error
    }
  },

  // Verify two-factor authentication code
  verify2FACode: async (code: string): Promise<TwoFactorResponse> => {
    try {
      return await api.post<TwoFactorResponse>(API_ENDPOINTS.AUTH.VERIFY_2FA, { code })
    } catch (error) {
      throw error
    }
  }
}

export default userService
