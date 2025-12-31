import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useRouter, type Router } from 'vue-router'
import authService from '../services/authService'
import { useLocalStorage } from './useLocalStorage'
import type { User } from '@/types/models'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface AuthResponse {
  success: boolean
  user?: User
  message?: string
}

interface UseAuthReturn {
  isAuthenticated: ComputedRef<boolean>
  user: ComputedRef<User | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  userInitials: ComputedRef<string>
  userDisplayName: ComputedRef<string>
  isAdmin: ComputedRef<boolean>
  isPremium: ComputedRef<boolean>
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (userData: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<AuthResponse>
  updateProfile: (profileData: Partial<User>) => Promise<AuthResponse>
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<AuthResponse>
  forgotPassword: (email: string) => Promise<AuthResponse>
  resetPassword: (token: string, newPassword: string) => Promise<AuthResponse>
  checkAuthStatus: () => Promise<void>
  refreshToken: () => Promise<boolean>
  clearError: () => void
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  initializeAuth: () => Promise<void>
}

// Global auth state (shared across all instances)
const isAuthenticated: Ref<boolean> = ref(false)
const user: Ref<User | null> = ref(null)
const loading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

export function useAuth(): UseAuthReturn {
  const router: Router = useRouter()
  const { data: getItem, save: setItem, remove: removeItem } = useLocalStorage<string>('intended_route')

  // Computed properties
  const isLoggedIn: ComputedRef<boolean> = computed(() => isAuthenticated.value)
  const currentUser: ComputedRef<User | null> = computed(() => user.value)
  const userInitials: ComputedRef<string> = computed(() => {
    if (!user.value || !user.value.name) return 'U'
    const names = user.value.name.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return user.value.name.charAt(0).toUpperCase()
  })

  const userDisplayName: ComputedRef<string> = computed(() => {
    if (!user.value) return 'Guest'
    return user.value.name || 'User'
  })

  const isAdmin: ComputedRef<boolean> = computed(() => {
    return false // Update based on your user model
  })

  const isPremium: ComputedRef<boolean> = computed(() => {
    return false // Update based on your user model
  })

  // Authentication methods
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response.success && response.user) {
        isAuthenticated.value = true
        user.value = response.user

        // Redirect to intended route or dashboard
        const intendedRoute = getItem.value || '/dashboard'
        removeItem()
        await router.push(intendedRoute)

        return { success: true, user: response.user }
      }

      throw new Error(response.message || 'Login failed')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)

      if (response.success && response.user) {
        isAuthenticated.value = true
        user.value = response.user

        // Redirect to dashboard after registration
        await router.push('/dashboard')

        return { success: true, user: response.user }
      }

      throw new Error(response.message || 'Registration failed')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      await authService.logout()

      // Clear state
      isAuthenticated.value = false
      user.value = null

      // Redirect to login
      await router.push('/login')

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      error.value = errorMessage
      // Clear state even if logout fails
      isAuthenticated.value = false
      user.value = null
      await router.push('/login')
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.updateProfile(profileData)

      if (response.success && response.user) {
        user.value = { ...user.value!, ...response.user }
        return { success: true, user: user.value }
      }

      throw new Error(response.message || 'Profile update failed')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )

      if (response.success) {
        return { success: true, message: response.message }
      }

      throw new Error(response.message || 'Password change failed')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.forgotPassword(email)

      if (response.success) {
        return { success: true, message: response.message }
      }

      throw new Error(response.message || 'Failed to send reset email')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.resetPassword(token, newPassword)

      if (response.success) {
        // Redirect to login after password reset
        await router.push('/login')
        return { success: true, message: response.message }
      }

      throw new Error(response.message || 'Password reset failed')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const checkAuthStatus = async (): Promise<void> => {
    loading.value = true

    try {
      const token = authService.getStoredToken()
      const storedUser = authService.getStoredUser()

      if (token && storedUser) {
        // Verify token is still valid
        const isValid = await authService.verifyToken()

        if (isValid) {
          isAuthenticated.value = true
          user.value = storedUser
        } else {
          // Token expired, clear auth data
          await logout()
        }
      }
    } catch (err) {
      await logout()
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken()

      if (response.success) {
        return true
      }

      // Refresh failed, logout user
      await logout()
      return false
    } catch (err) {
      await logout()
      return false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    if (!user.value) return false
    // Update based on your user model structure
    return false
  }

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false
    // Update based on your user model structure
    return false
  }

  // Initialize auth state on first use
  const initializeAuth = async (): Promise<void> => {
    if (!isAuthenticated.value && !loading.value) {
      await checkAuthStatus()
    }
  }

  // Watch for auth changes and update localStorage
  watch(
    [isAuthenticated, user],
    ([newIsAuth, newUser]) => {
      if (newIsAuth && newUser) {
        // Store user in localStorage if needed
      } else {
        // Remove user from localStorage if needed
      }
    },
    { deep: true }
  )

  // Auto-initialize when composable is used
  initializeAuth()

  return {
    // State
    isAuthenticated: isLoggedIn,
    user: currentUser,
    loading,
    error,

    // Computed
    userInitials,
    userDisplayName,
    isAdmin,
    isPremium,

    // Methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    checkAuthStatus,
    refreshToken,
    clearError,
    hasRole,
    hasPermission,
    initializeAuth
  }
}

// Auto-initialize global auth state
const globalAuth = useAuth()

// Export the global instance for use in other composables
export { globalAuth }
