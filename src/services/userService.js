import api, { authApi } from '@/services/api.js'
import { API_ENDPOINTS } from '@/utils/constants'

const userService = {
  // Add this missing method
  getCurrentUser: async () => {
    return await authApi.getProfile()
  },

  // Get user profile
  getProfile: async () => {
    return await authApi.getProfile()
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await authApi.updateProfile(profileData)
  },

  // Change password
  changePassword: async (passwordData) => {
    return await authApi.changePassword(passwordData)
  },

  // Enable two-factor authentication
  enable2FA: async () => {
    try {
      return await api.post(API_ENDPOINTS.AUTH.ENABLE_2FA)
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      throw error
    }
  },

  // Disable two-factor authentication
  disable2FA: async () => {
    try {
      return await api.post(API_ENDPOINTS.AUTH.DISABLE_2FA)
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      throw error
    }
  },

  // Verify two-factor authentication code
  verify2FACode: async (code) => {
    try {
      return await api.post(API_ENDPOINTS.AUTH.VERIFY_2FA, { code })
    } catch (error) {
      console.error('Error verifying 2FA code:', error)
      throw error
    }
  }
}

export default userService