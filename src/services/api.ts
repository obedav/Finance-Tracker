// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { API_ENDPOINTS, ERROR_MESSAGES, STORAGE_KEYS, HTTP_STATUS, REQUEST_TIMEOUT } from '../utils/constants.js'
import type { User, Transaction, Category, Budget, AuthResponse, UserRegistration } from '@/types'

// Extended types for axios config with metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date
  }
  _retry?: boolean
}

interface ExtendedAxiosError extends AxiosError {
  config?: ExtendedAxiosRequestConfig
}

// Enhanced error type
interface EnhancedError extends Error {
  code?: string
  statusCode?: number | null
  originalError?: ExtendedAxiosError
  timestamp?: string
}

// API response types
interface ApiResponse<T = unknown> {
  data?: T
  success?: boolean
  message?: string
  token?: string
  refreshToken?: string
  user?: User
  imported?: number
  status?: number
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,  // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  xsrfCookieName: 'XSRF-TOKEN',  // Laravel's CSRF cookie name
  xsrfHeaderName: 'X-XSRF-TOKEN'  // Header name for CSRF token
})

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const extendedConfig = config as ExtendedAxiosRequestConfig

    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      extendedConfig.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    extendedConfig.metadata = { startTime: new Date() }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${extendedConfig.method?.toUpperCase()} ${extendedConfig.url}`)
    }

    return extendedConfig
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const config = response.config as ExtendedAxiosRequestConfig
    // Calculate response time
    const endTime = new Date()
    const duration = endTime.getTime() - (config.metadata?.startTime?.getTime() || 0)

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`)
    }

    return response
  },
  (error: ExtendedAxiosError): Promise<never> => {
    const config = error.config as ExtendedAxiosRequestConfig
    // Calculate response time even for errors
    if (config?.metadata?.startTime) {
      const endTime = new Date()
      const duration = endTime.getTime() - config.metadata.startTime.getTime()
      console.log(`❌ API Error: ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`)
    }

    // Handle different error types
    return handleApiError(error)
  }
)

// Error handler function
const handleApiError = (error: ExtendedAxiosError): Promise<never> => {
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR
  let errorCode = 'UNKNOWN_ERROR'
  let statusCode: number | null = null

  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status

    switch (statusCode) {
      case HTTP_STATUS.BAD_REQUEST:
        errorMessage = (error.response.data as any)?.message || (error.response.data as any)?.error || ERROR_MESSAGES.VALIDATION_ERROR
        errorCode = 'VALIDATION_ERROR'
        break
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = (error.response.data as any)?.message || ERROR_MESSAGES.UNAUTHORIZED
        errorCode = 'UNAUTHORIZED'
        handleUnauthorized()
        break
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = (error.response.data as any)?.message || ERROR_MESSAGES.FORBIDDEN
        errorCode = 'FORBIDDEN'
        break
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = (error.response.data as any)?.message || ERROR_MESSAGES.NOT_FOUND
        errorCode = 'NOT_FOUND'
        break
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        errorMessage = (error.response.data as any)?.message || ERROR_MESSAGES.VALIDATION_ERROR
        errorCode = 'VALIDATION_ERROR'
        break
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        errorMessage = (error.response.data as any)?.message || 'Too many requests. Please try again later.'
        errorCode = 'RATE_LIMIT'
        break
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR
        errorCode = 'SERVER_ERROR'
        break
      default:
        errorMessage = (error.response.data as any)?.message || (error.response.data as any)?.error || ERROR_MESSAGES.UNKNOWN_ERROR
        errorCode = 'API_ERROR'
    }
  } else if (error.request) {
    // Network error
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR
    errorCode = 'NETWORK_ERROR'
  } else {
    // Request setup error
    errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR
    errorCode = 'REQUEST_ERROR'
  }

  // Create enhanced error object
  const enhancedError: EnhancedError = new Error(errorMessage)
  enhancedError.code = errorCode
  enhancedError.statusCode = statusCode
  enhancedError.originalError = error
  enhancedError.timestamp = new Date().toISOString()

  // Log error
  console.error('API Error:', {
    message: errorMessage,
    code: errorCode,
    statusCode,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: enhancedError.timestamp
  })

  return Promise.reject(enhancedError)
}

// Handle unauthorized access
const handleUnauthorized = (): void => {
  // Clear stored auth data
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)

  // Emit event for auth state change
  window.dispatchEvent(new CustomEvent('auth:logout'))

  // Redirect to login if not already there
  if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = '/login'
  }
}

// Utility function to mask sensitive data in logs
const maskSensitiveData = <T extends Record<string, unknown>>(
  data: T,
  sensitiveFields: string[] = ['password', 'token', 'currentPassword', 'newPassword']
): T => {
  if (!data || typeof data !== 'object') return data

  const masked = { ...data }
  sensitiveFields.forEach(field => {
    if (field in masked) {
      (masked as any)[field] = '[REDACTED]'
    }
  })
  return masked
}

// API helper methods
export const apiHelpers = {
  // GET request
  get: async <T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.get<T>(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // POST request
  post: async <T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PUT request
  put: async <T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PATCH request
  patch: async <T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // DELETE request
  delete: async <T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload file
  upload: async <T = unknown>(
    url: string,
    formData: FormData,
    onUploadProgress: ((progressEvent: any) => void) | null = null
  ): Promise<T> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress
      }

      const response = await api.post<T>(url, formData, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Download file
  download: async (url: string, filename: string, config: AxiosRequestConfig = {}): Promise<boolean> => {
    try {
      const response = await api.get(url, {
        ...config,
        responseType: 'blob'
      })

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return true
    } catch (error) {
      throw error
    }
  }
}

// Auth API interfaces
interface LoginCredentials {
  email: string
  password: string
}

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
}

interface PasswordResetData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

// Auth API methods
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (import.meta.env.DEV) {
      console.log('🔐 AuthAPI.login called with:', maskSensitiveData(credentials))
    }

    const response = await apiHelpers.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials)

    // Store tokens if login successful
    if (response.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      }
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
      }
    }

    return response as AuthResponse
  },

  // Register
  register: async (userData: UserRegistration): Promise<AuthResponse> => {
    if (import.meta.env.DEV) {
      console.log('🔐 AuthAPI.register called with:', maskSensitiveData(userData as any))
    }

    const response = await apiHelpers.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response as AuthResponse
  },

  // Logout
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

    try {
      await apiHelpers.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)

      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiHelpers.post<ApiResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })

    if (response.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      }
    }

    return response
  },

  // Get profile
  getProfile: async (): Promise<User> => {
    return await apiHelpers.get<User>(API_ENDPOINTS.AUTH.PROFILE)
  },

  // Update profile
  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiHelpers.put<ApiResponse<User>>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData)

    if (response.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }

    return response
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData): Promise<ApiResponse> => {
    return await apiHelpers.put<ApiResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    return await apiHelpers.post<ApiResponse>(API_ENDPOINTS.AUTH.REQUEST_RESET, { email })
  },

  // Reset password
  resetPassword: async (resetData: PasswordResetData): Promise<ApiResponse> => {
    return await apiHelpers.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData)
  }
}

// Transaction API methods
export const transactionApi = {
  getAll: async (params: Record<string, unknown> = {}): Promise<ApiResponse<Transaction[]>> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.LIST
    return await apiHelpers.get<ApiResponse<Transaction[]>>(url)
  },

  getById: async (id: number): Promise<ApiResponse<Transaction>> => {
    return await apiHelpers.get<ApiResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS.GET.replace(':id', String(id)))
  },

  create: async (transactionData: unknown): Promise<ApiResponse<Transaction>> => {
    return await apiHelpers.post<ApiResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData)
  },

  update: async (id: number, transactionData: unknown): Promise<ApiResponse<Transaction>> => {
    return await apiHelpers.put<ApiResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', String(id)), transactionData)
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return await apiHelpers.delete<ApiResponse>(API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', String(id)))
  },

  bulkDelete: async (transactionIds: number[]): Promise<ApiResponse> => {
    return await apiHelpers.delete<ApiResponse>(API_ENDPOINTS.TRANSACTIONS.BULK_DELETE, {
      data: { transactionIds }
    })
  },

  getStatistics: async (params: Record<string, unknown> = {}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.STATISTICS}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.STATISTICS
    return await apiHelpers.get<ApiResponse>(url)
  },

  import: async (file: File, onUploadProgress: ((progressEvent: any) => void) | null = null): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return await apiHelpers.upload<ApiResponse>(API_ENDPOINTS.TRANSACTIONS.IMPORT, formData, onUploadProgress)
  },

  export: async (format: string = 'csv', params: Record<string, unknown> = {}): Promise<boolean> => {
    const exportParams = { format, ...params }
    const queryString = new URLSearchParams(exportParams as any).toString()
    const url = `${API_ENDPOINTS.TRANSACTIONS.EXPORT}?${queryString}`
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.${format}`
    return await apiHelpers.download(url, filename)
  }
}

// Category API methods
export const categoryApi = {
  getAll: async (params: Record<string, unknown> = {}): Promise<ApiResponse<Category[]>> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `${API_ENDPOINTS.CATEGORIES.LIST}?${queryString}` : API_ENDPOINTS.CATEGORIES.LIST
    return await apiHelpers.get<ApiResponse<Category[]>>(url)
  },

  getById: async (id: number): Promise<ApiResponse<Category>> => {
    return await apiHelpers.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.GET.replace(':id', String(id)))
  },

  create: async (categoryData: unknown): Promise<ApiResponse<Category>> => {
    return await apiHelpers.post<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.CREATE, categoryData)
  },

  update: async (id: number, categoryData: unknown): Promise<ApiResponse<Category>> => {
    return await apiHelpers.put<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.UPDATE.replace(':id', String(id)), categoryData)
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return await apiHelpers.delete<ApiResponse>(API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', String(id)))
  }
}

// Budget API methods
export const budgetApi = {
  getAll: async (params: Record<string, unknown> = {}): Promise<ApiResponse<Budget[]>> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `/budgets?${queryString}` : '/budgets'
    return await apiHelpers.get<ApiResponse<Budget[]>>(url)
  },

  getById: async (id: number): Promise<ApiResponse<Budget>> => {
    return await apiHelpers.get<ApiResponse<Budget>>(`/budgets/${id}`)
  },

  create: async (budgetData: unknown): Promise<ApiResponse<Budget>> => {
    return await apiHelpers.post<ApiResponse<Budget>>('/budgets', budgetData)
  },

  update: async (id: number, budgetData: unknown): Promise<ApiResponse<Budget>> => {
    return await apiHelpers.put<ApiResponse<Budget>>(`/budgets/${id}`, budgetData)
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return await apiHelpers.delete<ApiResponse>(`/budgets/${id}`)
  }
}

// Report API methods
export const reportApi = {
  getMonthly: async (params: Record<string, unknown> = {}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `${API_ENDPOINTS.REPORTS.MONTHLY}?${queryString}` : API_ENDPOINTS.REPORTS.MONTHLY
    return await apiHelpers.get<ApiResponse>(url)
  },

  getCategory: async (params: Record<string, unknown> = {}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = queryString ? `${API_ENDPOINTS.REPORTS.CATEGORY}?${queryString}` : API_ENDPOINTS.REPORTS.CATEGORY
    return await apiHelpers.get<ApiResponse>(url)
  },

  export: async (reportType: string, format: string = 'pdf', params: Record<string, unknown> = {}): Promise<boolean> => {
    const exportParams = { type: reportType, format, ...params }
    const queryString = new URLSearchParams(exportParams as any).toString()
    const url = `${API_ENDPOINTS.REPORTS.EXPORT}?${queryString}`
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`
    return await apiHelpers.download(url, filename)
  }
}

// CSRF Protection
let csrfInitialized = false

export const initCsrfProtection = async (): Promise<boolean> => {
  if (csrfInitialized) {
    console.log('📝 CSRF protection already initialized')
    return true
  }

  try {
    console.log('🔐 Initializing CSRF protection...')
    const baseUrl = API_ENDPOINTS.BASE_URL.replace('/api', '')
    await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true
    })

    csrfInitialized = true
    console.log('✅ CSRF protection initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize CSRF protection:', error)
    return false
  }
}

// Auto-initialize CSRF on first API call
let autoInitAttempted = false
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (!autoInitAttempted && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      autoInitAttempted = true
      await initCsrfProtection()
    }
    return config
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
)

// Token refresh interceptor
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })

  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: ExtendedAxiosError): Promise<never> => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await authApi.refreshToken()
        const newToken = response.token!

        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleUnauthorized()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return handleApiError(error)
  }
)

// Mock API helpers for development
export const mockApiHelpers = {
  // Simulate network delay
  delay: (ms: number = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms)),

  // Generate mock response
  mockResponse: async <T>(data: T, delay: number = 500): Promise<{ data: T; status: number; message: string }> => {
    await mockApiHelpers.delay(delay)
    return { data, status: 200, message: 'Success' }
  },

  // Generate mock error
  mockError: async (message: string = 'Mock error', code: number = 400, delay: number = 500): Promise<never> => {
    await mockApiHelpers.delay(delay)
    const error: any = new Error(message)
    error.code = code
    error.statusCode = code
    throw error
  }
}

export default api
