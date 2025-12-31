// src/services/__tests__/authService.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import authService from '../authService'
import { apiHelpers } from '../api'
import type { LoginCredentials, RegisterUserData } from '../authService'

// Mock the API helpers
vi.mock('../api', () => ({
  apiHelpers: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  },
  mockApiHelpers: {
    delay: vi.fn()
  }
}))

describe('authService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Clear auth service state first (before clearing localStorage)
    authService.clearAuthData()
    // Then clear localStorage completely
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
        remember: false
      }

      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        },
        message: 'Login successful'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await authService.login(credentials)

      expect(result.success).toBe(true)
      expect(result.user).toEqual(mockResponse.user)
      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          email: credentials.email,
          password: credentials.password
        })
      )
    })

    it('should store user data in localStorage on successful login', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        }
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      await authService.login({
        email: 'test@example.com',
        password: 'password123'
      })

      const storedUser = localStorage.getItem('finance_user')
      expect(storedUser).toBeTruthy()
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        expect(parsed.email).toBe('test@example.com')
      }
    })

    it('should throw error on failed login', async () => {
      const mockError = {
        success: false,
        message: 'Invalid credentials'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockError)

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow()
    })

    it('should handle remember me option', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        }
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      await authService.login({
        email: 'test@example.com',
        password: 'password123',
        remember: true
      })

      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ remember: true })
      )
    })

    it('should handle network errors gracefully', async () => {
      vi.mocked(apiHelpers.post).mockRejectedValue(new Error('Network error'))

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userData: RegisterUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '1234567890'
      }

      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'John Doe',
          email: userData.email,
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        },
        message: 'Registration successful'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await authService.register(userData)

      expect(result.success).toBe(true)
      expect(result.user?.email).toBe(userData.email)
      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email
        })
      )
    })

    it('should not validate fields (validation done by API)', async () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!'
      } as RegisterUserData

      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'Doe',
          email: 'john@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        }
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      // Should not throw - validation is handled by API
      const result = await authService.register(invalidData)
      expect(result.success).toBe(true)
    })

    it('should handle duplicate email error', async () => {
      const userData: RegisterUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'Password123!'
      }

      vi.mocked(apiHelpers.post).mockRejectedValue({
        message: 'Email already exists'
      })

      await expect(authService.register(userData)).rejects.toThrow()
    })

    it('should transform field names for API', async () => {
      const userData: RegisterUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue({
        success: true,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        }
      })

      await authService.register(userData)

      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe'
        })
      )
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set up logged in state
      authService.setAuthData('mock-token', {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        email_verified_at: null,
        profile_picture: null,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      })

      const result = await authService.logout()

      expect(result.success).toBe(true)
    })

    it('should clear user data from localStorage on logout', async () => {
      localStorage.setItem('finance_user', JSON.stringify({ id: 1 }))

      await authService.logout()

      expect(localStorage.getItem('finance_user')).toBeNull()
    })

    it('should handle logout without errors even if API fails', async () => {
      vi.mocked(apiHelpers.post).mockRejectedValue(new Error('Logout failed'))

      const result = await authService.logout()

      // Should still succeed even if API fails
      expect(result.success).toBe(true)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', () => {
      authService.setAuthData('mock-token', {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        email_verified_at: null,
        profile_picture: null,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      })

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('should return false when no user is stored', () => {
      expect(authService.isAuthenticated()).toBe(false)
    })

    it('should return true when user is in localStorage', () => {
      localStorage.setItem('finance_user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }))

      // Reinitialize to load from storage
      authService.initializeAuth()

      expect(authService.isAuthenticated()).toBe(true)
    })
  })

  describe('getCurrentUserData', () => {
    it('should return current user data', () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        email_verified_at: null,
        profile_picture: null,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }

      authService.setAuthData('mock-token', mockUser)

      const user = authService.getCurrentUserData()
      expect(user).toEqual(mockUser)
    })

    it('should return null when no user is logged in', () => {
      expect(authService.getCurrentUserData()).toBeNull()
    })

    it('should return user from localStorage if not in memory', () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }

      localStorage.setItem('finance_user', JSON.stringify(mockUser))

      const user = authService.getCurrentUserData()
      expect(user?.id).toBe(1)
    })
  })

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com'
      const mockResponse = {
        message: 'Password reset email sent'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await authService.forgotPassword(email)

      expect(result.success).toBe(true)
      expect(result.message).toContain('reset')
      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.stringContaining('/request-reset'),
        expect.objectContaining({ email })
      )
    })

    it('should not validate email (done by API)', async () => {
      vi.mocked(apiHelpers.post).mockResolvedValue({
        message: 'Password reset email sent'
      })

      // Should not throw - validation is handled by API
      const result = await authService.forgotPassword('')
      expect(result.success).toBe(true)
    })

    it('should handle API errors', async () => {
      vi.mocked(apiHelpers.post).mockRejectedValue({
        message: 'Email not found'
      })

      await expect(
        authService.forgotPassword('nonexistent@example.com')
      ).rejects.toThrow()
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetData = {
        token: 'reset-token-123',
        password: 'NewPassword123!'
      }

      const mockResponse = {
        message: 'Password reset successfully'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await authService.resetPassword(
        resetData.token,
        resetData.password
      )

      expect(result.success).toBe(true)
      expect(apiHelpers.post).toHaveBeenCalledWith(
        expect.stringContaining('/reset-password'),
        expect.objectContaining({
          token: resetData.token,
          password: resetData.password
        })
      )
    })

    it('should not validate password (done by API)', async () => {
      vi.mocked(apiHelpers.post).mockResolvedValue({
        message: 'Password reset successfully'
      })

      // Should not throw - validation is handled by API
      const result = await authService.resetPassword('token', 'weak')
      expect(result.success).toBe(true)
    })

    it('should handle API errors', async () => {
      vi.mocked(apiHelpers.post).mockRejectedValue({
        message: 'Invalid or expired token'
      })

      await expect(
        authService.resetPassword('invalid-token', 'Password123!')
      ).rejects.toThrow()
    })
  })

  describe('clearAuthData', () => {
    it('should clear all authentication data', () => {
      localStorage.setItem('finance_user', JSON.stringify({ id: 1 }))

      authService.clearAuthData()

      expect(localStorage.getItem('finance_user')).toBeNull()
      expect(authService.getCurrentUserData()).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle API errors with proper error messages', async () => {
      const apiError = {
        message: 'Validation failed'
      }

      vi.mocked(apiHelpers.post).mockRejectedValue(apiError)

      await expect(
        authService.login({
          email: '',
          password: 'password'
        })
      ).rejects.toThrow()
    })

    it('should handle timeout errors', async () => {
      vi.mocked(apiHelpers.post).mockRejectedValue(
        new Error('Request timeout')
      )

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password'
        })
      ).rejects.toThrow()
    })
  })

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Set initial user
      authService.setAuthData('mock-token', {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        email_verified_at: null,
        profile_picture: null,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      })

      const profileData = {
        firstName: 'Jane',
        lastName: 'Smith'
      }

      const mockResponse = {
        user: {
          id: 1,
          name: 'Jane Smith',
          email: 'test@example.com',
          email_verified_at: null,
          profile_picture: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        },
        message: 'Profile updated successfully'
      }

      vi.mocked(apiHelpers.put).mockResolvedValue(mockResponse)

      const result = await authService.updateProfile(profileData)

      expect(result.success).toBe(true)
      expect(result.user?.name).toBe('Jane Smith')
    })
  })

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockResponse = {
        message: 'Password changed successfully'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await authService.changePassword('oldpass', 'newpass')

      expect(result.success).toBe(true)
    })
  })
})
