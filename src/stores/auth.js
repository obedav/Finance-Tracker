// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService.js'
import { STORAGE_KEYS } from '@/utils/constants.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => authService.isAuthenticated())
  const userFullName = computed(() => {
    const currentUser = authService.getCurrentUserData()
    if (!currentUser) return ''
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  })
  const userInitials = computed(() => {
    const currentUser = authService.getCurrentUserData()
    if (!currentUser) return ''
    const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || ''
    const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || ''
    return `${firstInitial}${lastInitial}`
  })

  // Actions
  const initializeAuth = async () => {
    if (isInitialized.value) return

    try {
      // Initialize auth service if it has an init method
      if (typeof authService.initializeAuth === 'function') {
        await authService.initializeAuth()
      }
      
      // Load current user data
      user.value = authService.getCurrentUserData()
    } catch (error) {
      console.error('Error initializing auth:', error)
      clearAuth()
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await authService.login(credentials)
      user.value = authService.getCurrentUserData()
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authService.logout()
      user.value = null
    } catch (error) {
      console.warn('Logout API call failed:', error)
      // Force clear auth data even if API call fails
      authService.clearAuthData()
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await authService.updateProfile(profileData)
      user.value = authService.getCurrentUserData()
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    isLoading.value = true
    try {
      const response = await authService.changePassword(passwordData)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearAuth = () => {
    user.value = null
    authService.clearAuthData()
  }

  const refreshUserData = async () => {
    try {
      if (typeof authService.refreshUserData === 'function') {
        await authService.refreshUserData()
        user.value = authService.getCurrentUserData()
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Setup cross-tab logout detection
  const setupCrossTabLogout = () => {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.TOKEN && !event.newValue) {
        // Token was removed in another tab
        clearAuth()
        window.location.href = '/login'
      }
    })
    
    // Listen for custom logout events
    window.addEventListener('auth:logout', () => {
      clearAuth()
    })
  }

  const cleanupCrossTabLogout = () => {
    // Remove event listeners
    window.removeEventListener('storage', clearAuth)
    window.removeEventListener('auth:logout', clearAuth)
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,
    
    // Getters
    isAuthenticated,
    userFullName,
    userInitials,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearAuth,
    refreshUserData,
    setupCrossTabLogout,
    cleanupCrossTabLogout
  }
})