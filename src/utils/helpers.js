// src/utils/helpers.js
import { TIME_PERIODS, STORAGE_KEYS } from './constants.js'

/**
 * Array Utilities
 */

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

// Sort array by multiple keys
export const sortBy = (array, ...keys) => {
  return array.sort((a, b) => {
    for (const key of keys) {
      const direction = key.startsWith('-') ? -1 : 1
      const cleanKey = key.replace(/^-/, '')
      
      const aVal = a[cleanKey]
      const bVal = b[cleanKey]
      
      if (aVal < bVal) return -1 * direction
      if (aVal > bVal) return 1 * direction
    }
    return 0
  })
}

// Remove duplicates from array
export const unique = (array, key = null) => {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

// Chunk array into smaller arrays
export const chunk = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Find items by multiple criteria
export const findWhere = (array, criteria) => {
  return array.filter(item => {
    return Object.keys(criteria).every(key => item[key] === criteria[key])
  })
}

/**
 * Object Utilities
 */

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const cloned = {}
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key])
  })
  return cloned
}

// Deep merge objects
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

// Check if value is object
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Get nested object value safely
export const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue
    }
    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

// Set nested object value
export const set = (obj, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  let current = obj

  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[lastKey] = value
  return obj
}

/**
 * Date Utilities
 */

// Get date range for time period
export const getDateRange = (period) => {
  const now = new Date()
  const start = new Date()
  const end = new Date()

  switch (period) {
    case TIME_PERIODS.TODAY:
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.YESTERDAY:
      start.setDate(now.getDate() - 1)
      start.setHours(0, 0, 0, 0)
      end.setDate(now.getDate() - 1)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.THIS_WEEK:
      const dayOfWeek = now.getDay()
      start.setDate(now.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.LAST_WEEK:
      const lastWeekStart = new Date(now)
      lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
      lastWeekStart.setHours(0, 0, 0, 0)
      const lastWeekEnd = new Date(lastWeekStart)
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
      lastWeekEnd.setHours(23, 59, 59, 999)
      return { start: lastWeekStart, end: lastWeekEnd }
    
    case TIME_PERIODS.THIS_MONTH:
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(now.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.LAST_MONTH:
      start.setMonth(now.getMonth() - 1, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(now.getMonth(), 0)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.THIS_QUARTER:
      const quarter = Math.floor(now.getMonth() / 3)
      start.setMonth(quarter * 3, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(quarter * 3 + 3, 0)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.THIS_YEAR:
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
      break
    
    case TIME_PERIODS.LAST_YEAR:
      start.setFullYear(now.getFullYear() - 1, 0, 1)
      start.setHours(0, 0, 0, 0)
      end.setFullYear(now.getFullYear() - 1, 11, 31)
      end.setHours(23, 59, 59, 999)
      break
    
    default:
      // All time - return null to indicate no filter
      return { start: null, end: null }
  }

  return { start, end }
}

// Check if date is in range
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date)
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  if (start && checkDate < start) return false
  if (end && checkDate > end) return false
  
  return true
}

// Get month difference between dates
export const getMonthDifference = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return (end.getFullYear() - start.getFullYear()) * 12 + 
         (end.getMonth() - start.getMonth())
}

// Get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

// Check if date is today
export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  
  return today.getDate() === checkDate.getDate() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getFullYear() === checkDate.getFullYear()
}

/**
 * String Utilities
 */

// Generate random string
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Slugify string
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Escape HTML
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * Math Utilities
 */

// Round to decimal places
export const round = (value, decimals = 2) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (total === 0) return 0
  return (part / total) * 100
}

// Calculate percentage change
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Clamp value between min and max
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// Generate range of numbers
export const range = (start, end, step = 1) => {
  const result = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Local Storage Utilities
 */

// Safe localStorage get
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

// Safe localStorage set
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}

// Remove from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    return false
  }
}

// Clear all app data from localStorage
export const clearAppStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    return false
  }
}

/**
 * URL Utilities
 */

// Build query string from object
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  return searchParams.toString()
}

// Parse query string to object
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}

/**
 * File Utilities
 */

// Download file
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(url)
}

// Read file as text
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Validate file type
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type)
}

// Validate file size
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize
}

/**
 * Async Utilities
 */

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Retry async function
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await sleep(delay)
      return retry(fn, retries - 1, delay)
    }
    throw error
  }
}

/**
 * Color Utilities
 */

// Convert hex to RGB
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Add opacity to hex color
export const addOpacity = (hex, opacity) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

/**
 * Validation Utilities
 */

// Check if email is valid
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check if phone number is valid
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Check if password is strong
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongRegex.test(password)
}

/**
 * Financial Calculations
 */

// Calculate compound interest
export const calculateCompoundInterest = (principal, rate, time, frequency = 12) => {
  return principal * Math.pow((1 + rate / frequency), frequency * time)
}

// Calculate simple interest
export const calculateSimpleInterest = (principal, rate, time) => {
  return principal * rate * time
}

// Calculate monthly payment for loan
export const calculateLoanPayment = (principal, rate, months) => {
  const monthlyRate = rate / 12
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1)
}

// Calculate savings goal monthly amount
export const calculateSavingsGoal = (targetAmount, currentAmount, months) => {
  return (targetAmount - currentAmount) / months
}

export default {
  // Array utilities
  groupBy,
  sortBy,
  unique,
  chunk,
  findWhere,
  
  // Object utilities
  deepClone,
  deepMerge,
  isObject,
  get,
  set,
  
  // Date utilities
  getDateRange,
  isDateInRange,
  getMonthDifference,
  getDaysInMonth,
  isToday,
  
  // String utilities
  randomString,
  slugify,
  escapeHtml,
  
  // Math utilities
  round,
  calculatePercentage,
  calculatePercentageChange,
  clamp,
  range,
  
  // Storage utilities
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearAppStorage,
  
  // URL utilities
  buildQueryString,
  parseQueryString,
  
  // File utilities
  downloadFile,
  readFileAsText,
  validateFileType,
  validateFileSize,
  
  // Async utilities
  debounce,
  throttle,
  sleep,
  retry,
  
  // Color utilities
  hexToRgb,
  addOpacity,
  
  // Validation utilities
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  
  // Financial calculations
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateLoanPayment,
  calculateSavingsGoal
}