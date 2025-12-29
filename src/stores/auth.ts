// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { STORAGE_KEYS } from '@/utils/constants'
import type { User, UserLogin, UserRegistration, AuthResponse } from '@/types'

// Sentry user tracking (optional - only if Sentry is configured)
const setSentryUser = (user: any) => {
  // Will be enabled when Sentry is configured
  // import('@/plugins/sentry').then(({ setUser }) => setUser(user))
}

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  newPassword_confirmation: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

  // Getters
  const isAuthenticated = computed<boolean>(() => authService.isAuthenticated())

  const userFullName = computed<string>(() => {
    const currentUser = authService.getCurrentUserData()
    if (!currentUser) return ''
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  })

  const userInitials = computed<string>(() => {
    const currentUser = authService.getCurrentUserData()
    if (!currentUser) return ''
    const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || ''
    const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || ''
    return `${firstInitial}${lastInitial}`
  })

  // Actions
  const initializeAuth = async (): Promise<void> => {
    if (isInitialized.value) return

    try {
      // Initialize auth service if it has an init method
      if (typeof authService.initializeAuth === 'function') {
        await authService.initializeAuth()
      }

      // Load current user data
      user.value = authService.getCurrentUserData()
    } catch (error) {
      clearAuth()
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials: UserLogin): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await authService.login(credentials)
      user.value = authService.getCurrentUserData()

      // Set user context for error tracking
      if (user.value) {
        setSentryUser({
          id: user.value.id || user.value.email,
          email: user.value.email,
          username: user.value.name || user.value.email
        })
      }

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: UserRegistration): Promise<AuthResponse> => {
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

  const logout = async (): Promise<void> => {
    isLoading.value = true
    try {
      await authService.logout()
      user.value = null

      // Clear user context from error tracking
      setSentryUser(null)
    } catch (error) {
      // Force clear auth data even if API call fails
      authService.clearAuthData()
      user.value = null

      // Clear user context from error tracking
      setSentryUser(null)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<User> => {
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

  const changePassword = async (passwordData: PasswordChangeData): Promise<void> => {
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

  const clearAuth = (): void => {
    user.value = null
    authService.clearAuthData()
  }

  const refreshUserData = async (): Promise<void> => {
    try {
      if (typeof authService.refreshUserData === 'function') {
        await authService.refreshUserData()
        user.value = authService.getCurrentUserData()
      }
    } catch (error) {
    }
  }

  // Setup cross-tab logout detection
  const setupCrossTabLogout = (): void => {
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === STORAGE_KEYS.TOKEN && !event.newValue) {
        // Token was removed in another tab
        clearAuth()
        window.location.href = '/login'
      }
    }

    const handleLogoutEvent = (): void => {
      clearAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth:logout', handleLogoutEvent)
  }

  const cleanupCrossTabLogout = (): void => {
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
