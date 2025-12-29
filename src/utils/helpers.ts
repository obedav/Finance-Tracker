// src/utils/helpers.ts
import { TIME_PERIODS, STORAGE_KEYS, type TimePeriod } from './constants'

/**
 * Type Definitions for Helpers
 */

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface RGB {
  r: number
  g: number
  b: number
}

export type SortKey = string | `-${string}`

/**
 * Array Utilities
 */

// Group array by key
export const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Sort array by multiple keys
export const sortBy = <T extends Record<string, any>>(array: T[], ...keys: SortKey[]): T[] => {
  return array.sort((a, b) => {
    for (const key of keys) {
      const direction = key.startsWith('-') ? -1 : 1
      const cleanKey = key.replace(/^-/, '') as keyof T

      const aVal = a[cleanKey]
      const bVal = b[cleanKey]

      if (aVal < bVal) return -1 * direction
      if (aVal > bVal) return 1 * direction
    }
    return 0
  })
}

// Remove duplicates from array
export function unique<T>(array: T[]): T[]
export function unique<T extends Record<string, any>>(array: T[], key: keyof T): T[]
export function unique<T extends Record<string, any>>(array: T[], key?: keyof T): T[] {
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
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Find items by multiple criteria
export const findWhere = <T extends Record<string, any>>(array: T[], criteria: Partial<T>): T[] => {
  return array.filter(item => {
    return Object.keys(criteria).every(key => item[key] === criteria[key as keyof T])
  })
}

/**
 * Object Utilities
 */

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any

  const cloned = {} as T
  Object.keys(obj as any).forEach(key => {
    (cloned as any)[key] = deepClone((obj as any)[key])
  })
  return cloned
}

// Deep merge objects
export const deepMerge = <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
  if (!sources.length) return target
  const source = sources.shift()!

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

// Check if value is object
export const isObject = (item: any): item is Record<string, any> => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Get nested object value safely
export function get<T>(obj: any, path: string): T | undefined
export function get<T>(obj: any, path: string, defaultValue: T): T
export function get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
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
export const set = <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let current: any = obj

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
export const getDateRange = (period: string): DateRange => {
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
export const isDateInRange = (date: string | Date, startDate: string | Date | null, endDate: string | Date | null): boolean => {
  const checkDate = new Date(date)
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  if (start && checkDate < start) return false
  if (end && checkDate > end) return false

  return true
}

// Get month difference between dates
export const getMonthDifference = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
}

// Get days in month
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

// Check if date is today
export const isToday = (date: string | Date): boolean => {
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
export const randomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Slugify string
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Escape HTML
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
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
export const round = (value: number, decimals: number = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
}

// Calculate percentage
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0
  return (part / total) * 100
}

// Calculate percentage change
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

// Generate range of numbers
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Local Storage Utilities
 */

// Safe localStorage get
export const getFromStorage = <T = any>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

// Safe localStorage set
export const setToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}

// Remove from localStorage
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    return false
  }
}

// Clear all app data from localStorage
export const clearAppStorage = (): boolean => {
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
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

// Parse query string to object
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}

  for (const [key, value] of params) {
    result[key] = value
  }

  return result
}

/**
 * File Utilities
 */

// Download file
export const downloadFile = (content: string, filename: string, contentType: string = 'text/plain'): void => {
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
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

// Validate file size
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

/**
 * Async Utilities
 */

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Sleep function
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// Retry async function
export const retry = async <T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> => {
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
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Add opacity to hex color
export const addOpacity = (hex: string, opacity: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

/**
 * Validation Utilities
 */

// Check if email is valid
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check if phone number is valid
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Check if password is strong
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongRegex.test(password)
}

/**
 * Financial Calculations
 */

// Calculate compound interest
export const calculateCompoundInterest = (principal: number, rate: number, time: number, frequency: number = 12): number => {
  return principal * Math.pow((1 + rate / frequency), frequency * time)
}

// Calculate simple interest
export const calculateSimpleInterest = (principal: number, rate: number, time: number): number => {
  return principal * rate * time
}

// Calculate monthly payment for loan
export const calculateLoanPayment = (principal: number, rate: number, months: number): number => {
  const monthlyRate = rate / 12
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
}

// Calculate savings goal monthly amount
export const calculateSavingsGoal = (targetAmount: number, currentAmount: number, months: number): number => {
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
