// src/utils/formatters.js
import { CURRENCIES, DATE_FORMATS } from './constants.js'

/**
 * Currency Formatting
 */

// Format currency with locale support
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US', options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }

  try {
    return new Intl.NumberFormat(locale, defaultOptions).format(amount)
  } catch (error) {
    console.error('Currency formatting error:', error)
    // Fallback formatting
    const symbol = getCurrencySymbol(currency)
    return `${symbol}${Number(amount).toFixed(2)}`
  }
}

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode)
  return currency ? currency.symbol : '$'
}

// Format currency without symbol (for inputs)
export const formatCurrencyNumber = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00'
  }
  return Number(amount).toFixed(decimals)
}

// Parse currency input string to number
export const parseCurrency = (value) => {
  if (typeof value !== 'string') return value
  
  // Remove currency symbols, commas, and spaces
  const cleanValue = value.replace(/[$€£¥₹,\s]/g, '')
  const parsed = parseFloat(cleanValue)
  
  return isNaN(parsed) ? 0 : parsed
}

// Format large numbers with abbreviations (K, M, B)
export const formatCompactCurrency = (amount, currency = 'USD') => {
  const absAmount = Math.abs(amount)
  
  if (absAmount >= 1e9) {
    return formatCurrency(amount / 1e9, currency, 'en-US', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }) + 'B'
  } else if (absAmount >= 1e6) {
    return formatCurrency(amount / 1e6, currency, 'en-US', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }) + 'M'
  } else if (absAmount >= 1e3) {
    return formatCurrency(amount / 1e3, currency, 'en-US', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }) + 'K'
  }
  
  return formatCurrency(amount, currency)
}

/**
 * Date Formatting
 */

// Format date with custom format
export const formatDate = (date, format = 'MM/DD/YYYY', locale = 'en-US') => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''

  try {
    switch (format) {
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US')
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB')
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0]
      case 'DD MMM YYYY':
        return dateObj.toLocaleDateString(locale, { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        })
      case 'MMM DD, YYYY':
        return dateObj.toLocaleDateString(locale, { 
          month: 'short', 
          day: '2-digit', 
          year: 'numeric' 
        })
      default:
        return dateObj.toLocaleDateString(locale)
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateObj.toLocaleDateString()
  }
}

// Format relative time (e.g., "2 days ago", "in 3 hours")
export const formatRelativeTime = (date, locale = 'en-US') => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const now = new Date()
    const diffTime = dateObj.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))

    if (Math.abs(diffDays) >= 1) {
      return rtf.format(diffDays, 'day')
    } else if (Math.abs(diffHours) >= 1) {
      return rtf.format(diffHours, 'hour')
    } else {
      return rtf.format(diffMinutes, 'minute')
    }
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return formatDate(date)
  }
}

// Format time only
export const formatTime = (date, format = '12', locale = 'en-US') => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12'
  }

  return dateObj.toLocaleTimeString(locale, options)
}

// Format datetime
export const formatDateTime = (date, dateFormat = 'MM/DD/YYYY', timeFormat = '12', locale = 'en-US') => {
  const formattedDate = formatDate(date, dateFormat, locale)
  const formattedTime = formatTime(date, timeFormat, locale)
  return `${formattedDate} ${formattedTime}`
}

// Get month name
export const getMonthName = (month, locale = 'en-US', length = 'long') => {
  const date = new Date(2000, month, 1)
  return date.toLocaleDateString(locale, { month: length })
}

// Get day name
export const getDayName = (day, locale = 'en-US', length = 'long') => {
  // day: 0 = Sunday, 1 = Monday, etc.
  const date = new Date(2000, 0, day + 1) // Start from Sunday
  return date.toLocaleDateString(locale, { weekday: length })
}

/**
 * Number Formatting
 */

// Format percentage
export const formatPercentage = (value, decimals = 1, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100)
  } catch (error) {
    console.error('Percentage formatting error:', error)
    return `${Number(value).toFixed(decimals)}%`
  }
}

// Format large numbers with commas
export const formatNumber = (value, locale = 'en-US', options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }

  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }

  try {
    return new Intl.NumberFormat(locale, defaultOptions).format(value)
  } catch (error) {
    console.error('Number formatting error:', error)
    return Number(value).toLocaleString()
  }
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Text Formatting
 */

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Title case
export const titleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

// Truncate text with ellipsis
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + suffix
}

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Format with country code
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phoneNumber
}

// Format credit card number
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return ''
  
  const cleaned = cardNumber.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  
  return groups.join(' ')
}

/**
 * Transaction Specific Formatters
 */

// Format transaction amount with sign
export const formatTransactionAmount = (amount, type, currency = 'USD') => {
  const sign = type === 'income' ? '+' : '-'
  const formattedAmount = formatCurrency(Math.abs(amount), currency)
  return `${sign}${formattedAmount}`
}

// Format transaction description
export const formatTransactionDescription = (description, maxLength = 30) => {
  if (!description) return 'No description'
  return truncate(description, maxLength)
}

// Format category name
export const formatCategoryName = (category) => {
  if (!category) return 'Uncategorized'
  return titleCase(category)
}

/**
 * Chart Data Formatters
 */

// Format chart tooltip value
export const formatChartValue = (value, type = 'currency', currency = 'USD') => {
  switch (type) {
    case 'currency':
      return formatCurrency(value, currency)
    case 'percentage':
      return formatPercentage(value)
    case 'number':
      return formatNumber(value)
    default:
      return String(value)
  }
}

// Format axis labels for charts
export const formatAxisLabel = (value, type = 'currency', currency = 'USD') => {
  switch (type) {
    case 'currency':
      return formatCompactCurrency(value, currency)
    case 'date':
      return formatDate(value, 'MMM DD')
    case 'month':
      return formatDate(value, 'MMM YYYY')
    default:
      return String(value)
  }
}

/**
 * Input Formatters (for form inputs)
 */

// Format input currency (removes formatting for editing)
export const formatInputCurrency = (value) => {
  if (!value) return ''
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  const parts = cleaned.split('.')
  
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  return cleaned
}

// Format display currency (adds formatting for display)
export const formatDisplayCurrency = (value, currency = 'USD') => {
  const numValue = parseCurrency(value)
  return formatCurrency(numValue, currency)
}

/**
 * Validation Helpers
 */

// Check if date is valid
export const isValidDate = (date) => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

// Check if currency amount is valid
export const isValidCurrency = (amount) => {
  const numValue = Number(amount)
  return !isNaN(numValue) && isFinite(numValue) && numValue >= 0
}

/**
 * Export/Import Formatters
 */

// Format data for CSV export
export const formatForCSV = (data) => {
  if (!Array.isArray(data)) return ''
  
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  return csvContent
}

// Format data for JSON export
export const formatForJSON = (data) => {
  try {
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('JSON formatting error:', error)
    return '{}'
  }
}

/**
 * Utility Functions
 */

// Remove formatting from currency string
export const unformatCurrency = (formattedCurrency) => {
  return parseCurrency(formattedCurrency)
}

// Add thousand separators
export const addThousandSeparators = (number, separator = ',') => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

// Format transaction status
export const formatTransactionStatus = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Cancelled'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

// Format goal progress
export const formatGoalProgress = (current, target) => {
  if (!target || target === 0) return '0%'
  const percentage = (current / target) * 100
  return formatPercentage(Math.min(percentage, 100))
}

export default {
  // Currency
  formatCurrency,
  getCurrencySymbol,
  formatCurrencyNumber,
  parseCurrency,
  formatCompactCurrency,
  
  // Date & Time
  formatDate,
  formatRelativeTime,
  formatTime,
  formatDateTime,
  getMonthName,
  getDayName,
  
  // Numbers
  formatPercentage,
  formatNumber,
  formatFileSize,
  
  // Text
  capitalize,
  titleCase,
  truncate,
  formatPhoneNumber,
  formatCreditCard,
  
  // Transaction specific
  formatTransactionAmount,
  formatTransactionDescription,
  formatCategoryName,
  
  // Charts
  formatChartValue,
  formatAxisLabel,
  
  // Inputs
  formatInputCurrency,
  formatDisplayCurrency,
  
  // Validation
  isValidDate,
  isValidCurrency,
  
  // Export/Import
  formatForCSV,
  formatForJSON,
  
  // Utilities
  unformatCurrency,
  addThousandSeparators,
  formatTransactionStatus,
  formatGoalProgress
}