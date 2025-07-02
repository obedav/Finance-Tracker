// src/services/api.js
import axios from 'axios'
import { API_ENDPOINTS, ERROR_MESSAGES, STORAGE_KEYS, HTTP_STATUS, REQUEST_TIMEOUT } from '../utils/constants.js'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    // Calculate response time
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`)
    }

    return response
  },
  (error) => {
    // Calculate response time even for errors
    if (error.config?.metadata?.startTime) {
      const endTime = new Date()
      const duration = endTime - error.config.metadata.startTime
      console.log(`❌ API Error: ${error.config.method?.toUpperCase()} ${error.config.url} (${duration}ms)`)
    }

    // Handle different error types
    return handleApiError(error)
  }
)

// Error handler function
const handleApiError = (error) => {
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR
  let errorCode = 'UNKNOWN_ERROR'
  let statusCode = null

  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status
    
    switch (statusCode) {
      case HTTP_STATUS.BAD_REQUEST:
        errorMessage = error.response.data?.message || error.response.data?.error || ERROR_MESSAGES.VALIDATION_ERROR
        errorCode = 'VALIDATION_ERROR'
        break
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = error.response.data?.message || ERROR_MESSAGES.UNAUTHORIZED
        errorCode = 'UNAUTHORIZED'
        handleUnauthorized()
        break
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = error.response.data?.message || ERROR_MESSAGES.FORBIDDEN
        errorCode = 'FORBIDDEN'
        break
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = error.response.data?.message || ERROR_MESSAGES.NOT_FOUND
        errorCode = 'NOT_FOUND'
        break
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        errorMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR
        errorCode = 'VALIDATION_ERROR'
        break
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        errorMessage = error.response.data?.message || 'Too many requests. Please try again later.'
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
        errorMessage = error.response.data?.message || error.response.data?.error || ERROR_MESSAGES.UNKNOWN_ERROR
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
  const enhancedError = new Error(errorMessage)
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
const handleUnauthorized = () => {
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

// API helper methods
export const apiHelpers = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload file
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress
      }

      const response = await api.post(url, formData, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Download file
  download: async (url, filename, config = {}) => {
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

// Updated authApi.register method for your existing services/api.js
// Replace the existing authApi object with this enhanced version

export const authApi = {
  // Login
  login: async (credentials) => {
    console.log('🔐 AuthAPI.login called with:', {
      email: credentials.email,
      password: '[HIDDEN]'
    })
    
    const response = await apiHelpers.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    
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
    
    return response
  },

  // Register - Enhanced with debugging
  register: async (userData) => {
    console.log('🔐 AuthAPI.register called with:', {
      ...userData,
      password: '[HIDDEN]'
    })
    
    // Validate required fields on frontend
    const requiredFields = ['firstName', 'lastName', 'email', 'password']
    const missingFields = requiredFields.filter(field => !userData[field]?.toString().trim())
    
    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`)
      error.code = 'VALIDATION_ERROR'
      throw error
    }

    // Clean and format data
    const cleanedData = {
      firstName: userData.firstName.toString().trim(),
      lastName: userData.lastName.toString().trim(),
      email: userData.email.toString().trim().toLowerCase(),
      password: userData.password.toString()
    }

    console.log('🔐 Sending cleaned registration data:', {
      ...cleanedData,
      password: '[HIDDEN]'
    })

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanedData.email)) {
      const error = new Error('Please enter a valid email address')
      error.code = 'VALIDATION_ERROR'
      throw error
    }

    // Validate password length
    if (cleanedData.password.length < 6) {
      const error = new Error('Password must be at least 6 characters long')
      error.code = 'VALIDATION_ERROR'
      throw error
    }

    try {
      console.log('🌐 Making registration request to:', API_ENDPOINTS.AUTH.REGISTER)
      const response = await apiHelpers.post(API_ENDPOINTS.AUTH.REGISTER, cleanedData)
      console.log('✅ Registration successful:', {
        message: response.message,
        userId: response.user?.id
      })
      return response
    } catch (error) {
      console.error('❌ Registration API error:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        url: error.originalError?.config?.url,
        data: error.originalError?.response?.data
      })
      
      // Re-throw with enhanced error information
      throw error
    }
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    
    try {
      await apiHelpers.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      
      // Emit logout event
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiHelpers.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    
    if (response.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      }
    }
    
    return response
  },

  // Get profile
  getProfile: async () => {
    return await apiHelpers.get(API_ENDPOINTS.AUTH.PROFILE)
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await apiHelpers.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData)
    
    // Update stored user data
    if (response.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }
    
    return response
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiHelpers.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return await apiHelpers.post(API_ENDPOINTS.AUTH.REQUEST_RESET, { email })
  },

  // Reset password
  resetPassword: async (resetData) => {
    return await apiHelpers.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData)
  },

  // Test endpoints for debugging
  testConnection: async () => {
    try {
      const response = await apiHelpers.get('/api/auth/test')
      console.log('✅ Auth API connection test successful:', response)
      return response
    } catch (error) {
      console.error('❌ Auth API connection test failed:', error)
      throw error
    }
  },

  testDatabase: async () => {
    try {
      const response = await apiHelpers.get('/api/test/database')
      console.log('✅ Database connection test successful:', response)
      return response
    } catch (error) {
      console.error('❌ Database connection test failed:', error)
      throw error
    }
  }
}

// Transaction API methods
export const transactionApi = {
  // Get all transactions
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.LIST
    return await apiHelpers.get(url)
  },

  // Get single transaction
  getById: async (id) => {
    return await apiHelpers.get(API_ENDPOINTS.TRANSACTIONS.GET.replace(':id', id))
  },

  // Create transaction
  create: async (transactionData) => {
    return await apiHelpers.post(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData)
  },

  // Update transaction
  update: async (id, transactionData) => {
    return await apiHelpers.put(API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id), transactionData)
  },

  // Delete transaction
  delete: async (id) => {
    return await apiHelpers.delete(API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', id))
  },

  // Bulk delete transactions
  bulkDelete: async (transactionIds) => {
    return await apiHelpers.delete(API_ENDPOINTS.TRANSACTIONS.BULK_DELETE, {
      data: { transactionIds }
    })
  },

  // Get statistics
  getStatistics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.STATISTICS}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.STATISTICS
    return await apiHelpers.get(url)
  },

  // Get trends
  getTrends: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.TRANSACTIONS.TRENDS}?${queryString}` : API_ENDPOINTS.TRANSACTIONS.TRENDS
    return await apiHelpers.get(url)
  },

  // Import transactions
  import: async (file, onUploadProgress = null) => {
    const formData = new FormData()
    formData.append('file', file)
    return await apiHelpers.upload(API_ENDPOINTS.TRANSACTIONS.IMPORT, formData, onUploadProgress)
  },

  // Export transactions
  export: async (format = 'csv', params = {}) => {
    const exportParams = { format, ...params }
    const queryString = new URLSearchParams(exportParams).toString()
    const url = `${API_ENDPOINTS.TRANSACTIONS.EXPORT}?${queryString}`
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.${format}`
    return await apiHelpers.download(url, filename)
  }
}

// Category API methods
export const categoryApi = {
  // Get all categories
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.CATEGORIES.LIST}?${queryString}` : API_ENDPOINTS.CATEGORIES.LIST
    return await apiHelpers.get(url)
  },

  // Get single category
  getById: async (id) => {
    return await apiHelpers.get(API_ENDPOINTS.CATEGORIES.GET.replace(':id', id))
  },

  // Create category
  create: async (categoryData) => {
    return await apiHelpers.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData)
  },

  // Update category
  update: async (id, categoryData) => {
    return await apiHelpers.put(API_ENDPOINTS.CATEGORIES.UPDATE.replace(':id', id), categoryData)
  },

  // Delete category
  delete: async (id) => {
    return await apiHelpers.delete(API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', id))
  },

  // Restore category
  restore: async (id) => {
    return await apiHelpers.put(API_ENDPOINTS.CATEGORIES.RESTORE.replace(':id', id))
  },

  // Get statistics
  getStatistics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.CATEGORIES.STATISTICS}?${queryString}` : API_ENDPOINTS.CATEGORIES.STATISTICS
    return await apiHelpers.get(url)
  },

  // Get default categories
  getDefaults: async () => {
    return await apiHelpers.get(API_ENDPOINTS.CATEGORIES.DEFAULTS)
  }
}

// Report API methods
export const reportApi = {
  // Get monthly report
  getMonthly: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.REPORTS.MONTHLY}?${queryString}` : API_ENDPOINTS.REPORTS.MONTHLY
    return await apiHelpers.get(url)
  },

  // Get yearly report
  getYearly: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.REPORTS.YEARLY}?${queryString}` : API_ENDPOINTS.REPORTS.YEARLY
    return await apiHelpers.get(url)
  },

  // Get category report
  getCategory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${API_ENDPOINTS.REPORTS.CATEGORY}?${queryString}` : API_ENDPOINTS.REPORTS.CATEGORY
    return await apiHelpers.get(url)
  },

  // Export report
  export: async (reportType, format = 'pdf', params = {}) => {
    const exportParams = { type: reportType, format, ...params }
    const queryString = new URLSearchParams(exportParams).toString()
    const url = `${API_ENDPOINTS.REPORTS.EXPORT}?${queryString}`
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`
    return await apiHelpers.download(url, filename)
  }
}

// Health check API
export const healthApi = {
  check: async () => {
    // Health endpoint is at root level (/health), not under /api
    try {
      const response = await axios.get('http://localhost:3001/health', {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Mock API helpers for development
export const mockApiHelpers = {
  // Simulate network delay
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Generate mock response
  mockResponse: (data, delay = 500) => {
    return new Promise(async (resolve) => {
      await mockApiHelpers.delay(delay)
      resolve({ data, status: 200, message: 'Success' })
    })
  },

  // Generate mock error
  mockError: (message = 'Mock error', code = 400, delay = 500) => {
    return new Promise(async (resolve, reject) => {
      await mockApiHelpers.delay(delay)
      const error = new Error(message)
      error.code = code
      error.statusCode = code
      reject(error)
    })
  }
}

// Request/Response logging
export const enableApiLogging = (enabled = true) => {
  if (enabled) {
    api.interceptors.request.use((config) => {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      console.log('Headers:', config.headers)
      console.log('Data:', config.data)
      console.groupEnd()
      return config
    })

    api.interceptors.response.use((response) => {
      console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
      console.log('Status:', response.status)
      console.log('Data:', response.data)
      console.groupEnd()
      return response
    })
  }
}

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await healthApi.check()
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ...response
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }
  }
}

// Cancel token utilities
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

export const isRequestCancelled = (error) => {
  return axios.isCancel(error)
}

// Request queue for rate limiting
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent
    this.running = 0
    this.queue = []
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request: requestFn,
        resolve,
        reject
      })
      this.process()
    })
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const { request, resolve, reject } = this.queue.shift()

    try {
      const result = await request()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      this.process()
    }
  }
}

export const requestQueue = new RequestQueue()

// Token refresh interceptor
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Add token refresh logic to response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const newToken = response.token
        
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

// Utility function to build URL with parameters
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, API_ENDPOINTS.BASE_URL)
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })
  return url.toString().replace(API_ENDPOINTS.BASE_URL, '')
}



export default api