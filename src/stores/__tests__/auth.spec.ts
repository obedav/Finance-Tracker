/**
 * Auth Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import authService from '@/services/authService'

// Mock authService
vi.mock('@/services/authService.js', () => ({
  default: {
    isAuthenticated: vi.fn(),
    getCurrentUserData: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    clearAuthData: vi.fn(),
    initializeAuth: vi.fn(),
    refreshUserData: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())

    // Reset all mocks
    vi.clearAllMocks()

    // Clear localStorage
    localStorage.clear()
  })

  describe('State', () => {
    it('should have initial state', () => {
      const store = useAuthStore()

      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.isInitialized).toBe(false)
    })
  })

  describe('Getters', () => {
    it('should check if user is authenticated', () => {
      const store = useAuthStore()

      vi.mocked(authService.isAuthenticated).mockReturnValue(true)

      expect(store.isAuthenticated).toBe(true)
      expect(authService.isAuthenticated).toHaveBeenCalled()
    })

    it('should return user full name', () => {
      const store = useAuthStore()

      vi.mocked(authService.getCurrentUserData).mockReturnValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      } as any)

      expect(store.userFullName).toBe('John Doe')
    })

    it('should return user initials', () => {
      const store = useAuthStore()

      vi.mocked(authService.getCurrentUserData).mockReturnValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      } as any)

      expect(store.userInitials).toBe('JD')
    })

    it('should return empty string for initials when no user', () => {
      const store = useAuthStore()

      vi.mocked(authService.getCurrentUserData).mockReturnValue(null)

      expect(store.userInitials).toBe('')
    })
  })

  describe('Actions', () => {
    describe('initializeAuth', () => {
      it('should initialize auth successfully', async () => {
        const store = useAuthStore()
        const mockUser = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }

        vi.mocked(authService.initializeAuth).mockResolvedValue(undefined)
        vi.mocked(authService.getCurrentUserData).mockReturnValue(mockUser as any)

        await store.initializeAuth()

        expect(store.isInitialized).toBe(true)
        expect(store.user).toEqual(mockUser)
      })

      it('should handle initialization error', async () => {
        const store = useAuthStore()

        vi.mocked(authService.initializeAuth).mockRejectedValue(new Error('Init failed'))

        await store.initializeAuth()

        expect(store.isInitialized).toBe(true)
        expect(store.user).toBeNull()
      })

      it('should not reinitialize if already initialized', async () => {
        const store = useAuthStore()
        store.isInitialized = true

        await store.initializeAuth()

        expect(authService.initializeAuth).not.toHaveBeenCalled()
      })
    })

    describe('login', () => {
      it('should login successfully', async () => {
        const store = useAuthStore()
        const credentials = { email: 'test@example.com', password: 'password123' }
        const mockResponse = {
          success: true,
          user: { id: 1, email: 'test@example.com' },
          token: 'mock-token'
        }

        vi.mocked(authService.login).mockResolvedValue(mockResponse as any)
        vi.mocked(authService.getCurrentUserData).mockReturnValue(mockResponse.user as any)

        const result = await store.login(credentials)

        expect(store.isLoading).toBe(false)
        expect(result).toEqual(mockResponse)
        expect(authService.login).toHaveBeenCalledWith(credentials)
      })

      it('should handle login error', async () => {
        const store = useAuthStore()
        const credentials = { email: 'test@example.com', password: 'wrong' }

        vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'))

        await expect(store.login(credentials)).rejects.toThrow('Invalid credentials')
        expect(store.isLoading).toBe(false)
      })
    })

    describe('register', () => {
      it('should register successfully', async () => {
        const store = useAuthStore()
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
        const mockResponse = {
          success: true,
          user: { id: 1, name: 'John Doe', email: 'john@example.com' },
          token: 'mock-token'
        }

        vi.mocked(authService.register).mockResolvedValue(mockResponse as any)

        const result = await store.register(userData)

        expect(store.isLoading).toBe(false)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('logout', () => {
      it('should logout successfully', async () => {
        const store = useAuthStore()
        store.user = { id: 1, email: 'test@example.com' } as any

        vi.mocked(authService.logout).mockResolvedValue(undefined)

        await store.logout()

        expect(store.user).toBeNull()
        expect(store.isLoading).toBe(false)
        expect(authService.logout).toHaveBeenCalled()
      })

      it('should force logout even if API fails', async () => {
        const store = useAuthStore()
        store.user = { id: 1, email: 'test@example.com' } as any

        vi.mocked(authService.logout).mockRejectedValue(new Error('API error'))

        await store.logout()

        expect(store.user).toBeNull()
        expect(authService.clearAuthData).toHaveBeenCalled()
      })
    })

    describe('updateProfile', () => {
      it('should update profile successfully', async () => {
        const store = useAuthStore()
        const profileData = { name: 'Jane Doe' }
        const mockUser = { id: 1, name: 'Jane Doe', email: 'jane@example.com' }

        vi.mocked(authService.updateProfile).mockResolvedValue(mockUser as any)
        vi.mocked(authService.getCurrentUserData).mockReturnValue(mockUser as any)

        const result = await store.updateProfile(profileData)

        expect(store.user).toEqual(mockUser)
        expect(result).toEqual(mockUser)
      })
    })

    describe('clearAuth', () => {
      it('should clear auth data', () => {
        const store = useAuthStore()
        store.user = { id: 1, email: 'test@example.com' } as any

        store.clearAuth()

        expect(store.user).toBeNull()
        expect(authService.clearAuthData).toHaveBeenCalled()
      })
    })
  })
})
