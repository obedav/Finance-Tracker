// src/services/authService.ts
import { apiHelpers, mockApiHelpers } from './api'
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants'
import type { User, AuthResponse, LoginCredentials } from '../types'

/**
 * Type Definitions for Auth Service
 */

export interface RegisterUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface ProfileData {
  firstName?: string
  lastName: string
  email?: string
  phone?: string
  avatar?: string | null
  preferences?: Record<string, any>
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface AuthServiceResponse {
  success: boolean
  message: string
  user?: User
  token?: string
  expiresIn?: number
}

export interface MockUser {
  id: number
  firstName: string
  lastName: string
  email: string
  passwordHash?: string
  phone: string | null
  avatar: string | null
  createdAt: Date | string
  preferences: {
    currency: string
    dateFormat: string
    theme: string
    language: string
  }
}

// Flag to use mock API or real API
const USE_MOCK_API = false  // Changed to use real Laravel API

class AuthService {
  private currentUser: User | null
  private token: string | null
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null

  constructor() {
    this.currentUser = null
    this.token = null
    this.refreshTokenTimeout = null
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockLogin(credentials)
      }

      const response = await apiHelpers.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember || false
      })

      // httpOnly cookie authentication - token is in cookie, not response
      if (response.success && response.user) {
        this.currentUser = response.user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

        return {
          success: true,
          user: response.user,
          message: response.message || 'Login successful'
        }
      }

      throw new Error(response.message || 'Invalid response from server')
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Login failed',
        code: error.code || 'LOGIN_ERROR'
      }
    }
  }

  // Register new user
  async register(userData: RegisterUserData): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockRegister(userData)
      }

      const response = await apiHelpers.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password,
        phone: userData.phone || null
      })

      // httpOnly cookie authentication - token is in cookie, not response
      if (response.success && response.user) {
        this.currentUser = response.user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

        return {
          success: true,
          user: response.user,
          message: response.message || 'Registration successful'
        }
      }

      throw new Error(response.message || 'Invalid response from server')
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Registration failed',
        code: error.code || 'REGISTRATION_ERROR'
      }
    }
  }

  // Logout user
  async logout(): Promise<AuthServiceResponse> {
    try {
      if (!USE_MOCK_API && this.token) {
        await apiHelpers.post(API_ENDPOINTS.AUTH.LOGOUT)
      }

      this.clearAuthData()
      this.stopRefreshTokenTimer()

      return {
        success: true,
        message: 'Logout successful'
      }
    } catch (error) {
      // Clear data even if API call fails
      this.clearAuthData()
      this.stopRefreshTokenTimer()

      return {
        success: true,
        message: 'Logout completed'
      }
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    try {
      if (USE_MOCK_API) {
        return await this.mockRefreshToken()
      }

      const response = await apiHelpers.post<{ token?: string; user?: User; expiresIn?: number }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken: this.getRefreshToken() }
      )

      if (response.token) {
        this.setAuthData(response.token, response.user || this.currentUser!)
        this.startRefreshTokenTimer(response.expiresIn)

        return {
          success: true,
          token: response.token
        }
      }

      throw new Error('Failed to refresh token')
    } catch (error) {
      this.clearAuthData()
      throw error
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockForgotPassword(email)
      }

      const response = await apiHelpers.post<{ message?: string }>(API_ENDPOINTS.AUTH.REQUEST_RESET, {
        email
      })

      return {
        success: true,
        message: response.message || 'Password reset email sent'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to send reset email',
        code: error.code || 'FORGOT_PASSWORD_ERROR'
      }
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockResetPassword(token, newPassword)
      }

      const response = await apiHelpers.post<{ message?: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword
      })

      return {
        success: true,
        message: response.message || 'Password reset successful'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to reset password',
        code: error.code || 'RESET_PASSWORD_ERROR'
      }
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockChangePassword(currentPassword, newPassword)
      }

      const response = await apiHelpers.post<{ message?: string }>('/user/change-password', {
        currentPassword,
        newPassword
      })

      return {
        success: true,
        message: response.message || 'Password changed successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to change password',
        code: error.code || 'CHANGE_PASSWORD_ERROR'
      }
    }
  }

  /**
   * User Profile Management
   */

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      if (USE_MOCK_API) {
        return this.currentUser!
      }

      const response = await apiHelpers.get<{ user: User }>(API_ENDPOINTS.USER.PROFILE)
      this.currentUser = response.user

      return response.user
    } catch (error) {
      throw error
    }
  }

  // Update user profile
  async updateProfile(profileData: ProfileData): Promise<AuthServiceResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockUpdateProfile(profileData)
      }

      const response = await apiHelpers.put<{ user?: User; message?: string }>(
        API_ENDPOINTS.USER.PROFILE,
        profileData
      )

      if (response.user) {
        this.currentUser = { ...this.currentUser!, ...response.user }
        this.saveUserToStorage(this.currentUser)
      }

      return {
        success: true,
        user: response.user,
        message: response.message || 'Profile updated successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to update profile',
        code: error.code || 'UPDATE_PROFILE_ERROR'
      }
    }
  }

  /**
   * Token Management
   */

  // Set authentication data
  setAuthData(token: string, user: User): void {
    this.token = token
    this.currentUser = user

    // Store user data in localStorage (tokens are now in httpOnly cookies)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  // Clear authentication data
  clearAuthData(): void {
    this.token = null
    this.currentUser = null

    // Clear user data from localStorage (token is in httpOnly cookie, handled by server)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  // Save user to storage
  saveUserToStorage(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  // Get stored token
  getStoredToken(): null {
    // Tokens are now stored in httpOnly cookies, not in localStorage
    return null
  }

  // Get stored user
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      return null
    }
  }

  // Get refresh token
  getRefreshToken(): null {
    // Refresh token is now handled by httpOnly cookies on the server side
    return null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Check for user data instead of token (tokens are in httpOnly cookies)
    return !!(this.currentUser || this.getStoredUser())
  }

  // Get current user
  getCurrentUserData(): User | null {
    return this.currentUser || this.getStoredUser()
  }

  // Initialize auth state from storage
  initializeAuth(): boolean {
    const user = this.getStoredUser()

    if (user) {
      this.currentUser = user
      // Token is in httpOnly cookie, server will handle refresh
      return true
    }

    return false
  }

  /**
   * Token Refresh Timer
   */

  // Start automatic token refresh
  startRefreshTokenTimer(expiresIn: number = 3600): void {
    // Refresh token 5 minutes before it expires
    const refreshTime = (expiresIn - 300) * 1000

    this.stopRefreshTokenTimer()
    this.refreshTokenTimeout = setTimeout(async () => {
      try {
        await this.refreshToken()
      } catch (error) {
        this.clearAuthData()
      }
    }, refreshTime)
  }

  // Stop token refresh timer
  stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout)
      this.refreshTokenTimeout = null
    }
  }

  /**
   * Mock API Methods (for development)
   */

  // Simple hash function for mock mode (NOT for production use)
  private mockHashPassword(password: string): string {
    // This is a simple hash for demo purposes only
    // In a real app, password hashing should only be done server-side
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  private async mockLogin(credentials: LoginCredentials): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(800)

    // Get stored users from localStorage (for registered users)
    const storedUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]')

    // Check demo account first
    const demoPasswordHash = this.mockHashPassword('password123')
    if (credentials.email === 'demo@example.com' && this.mockHashPassword(credentials.password) === demoPasswordHash) {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: credentials.email,
        email_verified_at: new Date('2024-01-01').toISOString(),
        profile_picture: null,
        settings: {
          currency: 'USD',
          language: 'en',
          timezone: 'UTC',
          theme: 'light',
          notifications: {
            email: true,
            push: false,
            budget_alerts: true,
            transaction_reminders: false
          }
        },
        created_at: new Date('2024-01-01').toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }

      const mockToken = 'mock-jwt-token-' + Date.now()
      this.setAuthData(mockToken, mockUser)

      return {
        success: true,
        user: mockUser,
        token: mockToken,
        expiresIn: 3600,
        message: 'Login successful'
      }
    }

    // Check registered users (compare hashed passwords)
    const hashedPassword = this.mockHashPassword(credentials.password)
    const user = storedUsers.find(u => u.email === credentials.email && u.passwordHash === hashedPassword)

    if (user) {
      // Create user object without password
      const userWithoutPassword: User = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        email_verified_at: null,
        profile_picture: user.avatar,
        settings: user.preferences as any,
        created_at: new Date(user.createdAt).toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }

      const mockToken = 'mock-jwt-token-' + Date.now()
      this.setAuthData(mockToken, userWithoutPassword)

      return {
        success: true,
        user: userWithoutPassword,
        token: mockToken,
        expiresIn: 3600,
        message: 'Login successful'
      }
    }

    throw new Error('Invalid email or password')
  }

  private async mockRegister(userData: RegisterUserData): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(1000)

    // Get existing users
    const storedUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]')

    // Check if user already exists
    const existingUser = storedUsers.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const mockUser: MockUser = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: this.mockHashPassword(userData.password), // Store hashed password for mock login
      phone: userData.phone || null,
      avatar: null,
      createdAt: new Date(),
      preferences: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
        language: 'en'
      }
    }

    // Store user in mock database
    storedUsers.push(mockUser)
    localStorage.setItem('mock_users', JSON.stringify(storedUsers))

    // Create user object without password for return
    const userWithoutPassword: User = {
      id: mockUser.id,
      name: `${mockUser.firstName} ${mockUser.lastName}`,
      email: mockUser.email,
      email_verified_at: null,
      profile_picture: mockUser.avatar,
      settings: mockUser.preferences as any,
      created_at: new Date(mockUser.createdAt).toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const mockToken = 'mock-jwt-token-' + Date.now()
    this.setAuthData(mockToken, userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword,
      token: mockToken,
      expiresIn: 3600,
      message: 'Registration successful'
    }
  }

  private async mockRefreshToken(): Promise<{ success: boolean; token: string; expiresIn: number }> {
    await mockApiHelpers.delay(300)

    const newToken = 'mock-jwt-token-' + Date.now()
    this.token = newToken
    // Token is stored in httpOnly cookie on the server side, not in localStorage

    return {
      success: true,
      token: newToken,
      expiresIn: 3600
    }
  }

  private async mockForgotPassword(email: string): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(1000)

    return {
      success: true,
      message: `Password reset email sent to ${email}`
    }
  }

  private async mockResetPassword(token: string, newPassword: string): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(800)

    return {
      success: true,
      message: 'Password reset successful'
    }
  }

  private async mockChangePassword(currentPassword: string, newPassword: string): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(600)

    // In mock mode, just verify current password is not empty
    if (!currentPassword || currentPassword.length < 6) {
      throw new Error('Current password is incorrect')
    }

    // In a real implementation, this would update the password hash
    return {
      success: true,
      message: 'Password changed successfully'
    }
  }

  private async mockUpdateProfile(profileData: ProfileData): Promise<AuthServiceResponse> {
    await mockApiHelpers.delay(500)

    const updatedUser: User = {
      ...this.currentUser!,
      ...profileData,
      updated_at: new Date().toISOString()
    } as User

    this.currentUser = updatedUser
    this.saveUserToStorage(updatedUser)

    return {
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    }
  }

  // Get redirect URL after login
  getRedirectAfterLogin(): string {
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute && intendedRoute !== '/login') {
      localStorage.removeItem('intended_route')
      return intendedRoute
    }
    return '/dashboard'
  }

  /**
   * Token Verification
   */

  // Verify if the current token is valid
  async verifyToken(): Promise<boolean> {
    try {
      // Check if user data exists (tokens are in httpOnly cookies)
      if (!this.currentUser && !this.getStoredUser()) {
        return false
      }

      if (USE_MOCK_API) {
        // For mock API, just check if user exists
        return !!this.currentUser
      }

      // For real API, verify with backend (token is in httpOnly cookie, server side)
      const response = await apiHelpers.get<{ valid: boolean }>(API_ENDPOINTS.AUTH.VERIFY_2FA)
      return response.valid === true
    } catch (error) {
      return false
    }
  }
}

// Create and export singleton instance
const authService = new AuthService()

// Initialize auth state on import
authService.initializeAuth()

export default authService
