// src/composables/useAuth.js
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'
import { useLocalStorage } from './useLocalStorage.js'

// Global auth state (shared across all instances)
const isAuthenticated = ref(false)
const user = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  const router = useRouter()
  const { getItem, setItem, removeItem } = useLocalStorage()

  // Computed properties
  const isLoggedIn = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value)
  const userInitials = computed(() => {
    if (!user.value) return 'U'
    const firstName = user.value.firstName || ''
    const lastName = user.value.lastName || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  })

  const userDisplayName = computed(() => {
    if (!user.value) return 'Guest'
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
  })

  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.isAdmin || false
  })

  const isPremium = computed(() => {
    return user.value?.subscription?.status === 'active' || user.value?.isPremium || false
  })

  // Authentication methods
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        isAuthenticated.value = true
        user.value = response.user
        
        // Redirect to intended route or dashboard
        const intendedRoute = getItem('intended_route') || '/dashboard'
        removeItem('intended_route')
        await router.push(intendedRoute)
        
        return { success: true, user: response.user }
      }
      
      throw new Error(response.message || 'Login failed')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)
      
      if (response.success) {
        isAuthenticated.value = true
        user.value = response.user
        
        // Redirect to dashboard after registration
        await router.push('/dashboard')
        
        return { success: true, user: response.user }
      }
      
      throw new Error(response.message || 'Registration failed')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
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
    } catch (err) {
      error.value = err.message
      // Clear state even if logout fails
      isAuthenticated.value = false
      user.value = null
      await router.push('/login')
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        user.value = { ...user.value, ...response.user }
        return { success: true, user: user.value }
      }
      
      throw new Error(response.message || 'Profile update failed')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        return { success: true, message: response.message }
      }
      
      throw new Error(response.message || 'Failed to send reset email')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token, newPassword) => {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const checkAuthStatus = async () => {
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
      console.error('Auth status check failed:', err)
      await logout()
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      
      if (response.success) {
        return true
      }
      
      // Refresh failed, logout user
      await logout()
      return false
    } catch (err) {
      console.error('Token refresh failed:', err)
      await logout()
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false
    
    const userRoles = Array.isArray(user.value.roles) 
      ? user.value.roles 
      : [user.value.role].filter(Boolean)
    
    return userRoles.includes(role)
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    const userPermissions = user.value.permissions || []
    return userPermissions.includes(permission)
  }

  // Initialize auth state on first use
  const initializeAuth = async () => {
    if (!isAuthenticated.value && !loading.value) {
      await checkAuthStatus()
    }
  }

  // Watch for auth changes and update localStorage
  watch(
    [isAuthenticated, user],
    ([newIsAuth, newUser]) => {
      if (newIsAuth && newUser) {
        setItem('auth_user', newUser)
      } else {
        removeItem('auth_user')
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