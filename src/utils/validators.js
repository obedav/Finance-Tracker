// src/utils/validators.js
import { VALIDATION_RULES, CURRENCIES } from './constants.js'

/**
 * Basic Validation Functions
 */

// Check if value is required (not empty)
export const required = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

// Check minimum length
export const minLength = (value, min) => {
  if (!value) return false
  return String(value).length >= min
}

// Check maximum length
export const maxLength = (value, max) => {
  if (!value) return true // Allow empty values
  return String(value).length <= max
}

// Check exact length
export const exactLength = (value, length) => {
  if (!value) return false
  return String(value).length === length
}

// Check if value matches pattern
export const pattern = (value, regex) => {
  if (!value) return true // Allow empty values
  return regex.test(String(value))
}

/**
 * Email Validation
 */
export const email = (value) => {
  if (!value) return true // Allow empty values
  return VALIDATION_RULES.EMAIL.test(String(value).toLowerCase())
}

/**
 * Password Validation
 */
export const password = (value) => {
  if (!value) return false
  return value.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH
}

export const strongPassword = (value) => {
  if (!value) return false
  return VALIDATION_RULES.PASSWORD.PATTERN.test(value)
}

export const confirmPassword = (password, confirmPassword) => {
  return password === confirmPassword
}

/**
 * Phone Number Validation
 */
export const phone = (value) => {
  if (!value) return true // Allow empty values
  const cleaned = String(value).replace(/\D/g, '')
  return VALIDATION_RULES.PHONE.test(cleaned)
}

/**
 * Numeric Validations
 */
export const numeric = (value) => {
  if (value === null || value === undefined || value === '') return true
  return !isNaN(Number(value)) && isFinite(Number(value))
}

export const integer = (value) => {
  if (!numeric(value)) return false
  return Number.isInteger(Number(value))
}

export const positive = (value) => {
  if (!numeric(value)) return false
  return Number(value) > 0
}

export const nonNegative = (value) => {
  if (!numeric(value)) return false
  return Number(value) >= 0
}

export const min = (value, minimum) => {
  if (!numeric(value)) return false
  return Number(value) >= minimum
}

export const max = (value, maximum) => {
  if (!numeric(value)) return false
  return Number(value) <= maximum
}

export const range = (value, minimum, maximum) => {
  return min(value, minimum) && max(value, maximum)
}

/**
 * Currency Amount Validation
 */
export const amount = (value) => {
  if (!value) return false
  const numValue = Number(value)
  return numeric(value) && 
         numValue >= VALIDATION_RULES.AMOUNT.MIN && 
         numValue <= VALIDATION_RULES.AMOUNT.MAX
}

export const currency = (value, currencyCode = 'USD') => {
  if (!amount(value)) return false
  
  // Check decimal places based on currency
  const numValue = Number(value)
  const decimalPlaces = (numValue.toString().split('.')[1] || '').length
  
  // Most currencies allow 2 decimal places, some like JPY allow 0
  const maxDecimals = ['JPY', 'KRW', 'VND'].includes(currencyCode) ? 0 : 2
  
  return decimalPlaces <= maxDecimals
}

/**
 * Date Validation
 */
export const date = (value) => {
  if (!value) return true // Allow empty values
  const dateObj = new Date(value)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export const futureDate = (value) => {
  if (!date(value)) return false
  return new Date(value) > new Date()
}

export const pastDate = (value) => {
  if (!date(value)) return false
  return new Date(value) < new Date()
}

export const dateRange = (startDate, endDate) => {
  if (!date(startDate) || !date(endDate)) return false
  return new Date(startDate) <= new Date(endDate)
}

export const minAge = (birthDate, minimumAge) => {
  if (!date(birthDate)) return false
  const today = new Date()
  const birth = new Date(birthDate)
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minimumAge
  }
  
  return age >= minimumAge
}

/**
 * File Validation
 */
export const fileSize = (file, maxSizeInBytes) => {
  if (!file) return false
  return file.size <= maxSizeInBytes
}

export const fileType = (file, allowedTypes) => {
  if (!file) return false
  return allowedTypes.includes(file.type)
}

export const fileExtension = (file, allowedExtensions) => {
  if (!file) return false
  const extension = file.name.split('.').pop().toLowerCase()
  return allowedExtensions.includes(extension)
}

/**
 * String Content Validation
 */
export const alphaOnly = (value) => {
  if (!value) return true
  return /^[a-zA-Z]+$/.test(value)
}

export const alphaNumeric = (value) => {
  if (!value) return true
  return /^[a-zA-Z0-9]+$/.test(value)
}

export const alphaNumericSpaces = (value) => {
  if (!value) return true
  return /^[a-zA-Z0-9\s]+$/.test(value)
}

export const noSpecialChars = (value) => {
  if (!value) return true
  return /^[a-zA-Z0-9\s]+$/.test(value)
}

export const slug = (value) => {
  if (!value) return true
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

/**
 * Transaction Specific Validations
 */
export const transactionType = (value) => {
  return ['income', 'expense'].includes(value)
}

export const transactionCategory = (value, categories = []) => {
  if (!required(value)) return false
  return categories.includes(value)
}

export const transactionDescription = (value) => {
  if (!value) return true // Optional field
  return maxLength(value, VALIDATION_RULES.DESCRIPTION.MAX_LENGTH)
}

export const transactionAmount = (value) => {
  return amount(value) && positive(value)
}

export const transactionDate = (value) => {
  if (!date(value)) return false
  // Don't allow future dates more than 1 day
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return new Date(value) <= tomorrow
}

/**
 * Category Validation
 */
export const categoryName = (value, existingCategories = []) => {
  if (!required(value)) return false
  if (!minLength(value, VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH)) return false
  if (!maxLength(value, VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH)) return false
  
  // Check for duplicates (case insensitive)
  const normalizedValue = value.trim().toLowerCase()
  const normalizedExisting = existingCategories.map(cat => 
    typeof cat === 'string' ? cat.toLowerCase() : cat.name?.toLowerCase()
  )
  
  return !normalizedExisting.includes(normalizedValue)
}

export const categoryDescription = (value) => {
  if (!value) return true // Optional field
  return maxLength(value, 255)
}

export const categoryIcon = (value) => {
  if (!value) return false
  // Basic SVG path validation
  return typeof value === 'string' && value.length > 0
}

/**
 * User Profile Validations
 */
export const firstName = (value) => {
  return required(value) && 
         minLength(value, 2) && 
         maxLength(value, 50) && 
         alphaNumericSpaces(value)
}

export const lastName = (value) => {
  return required(value) && 
         minLength(value, 2) && 
         maxLength(value, 50) && 
         alphaNumericSpaces(value)
}

export const username = (value) => {
  return required(value) && 
         minLength(value, 3) && 
         maxLength(value, 30) && 
         /^[a-zA-Z0-9_-]+$/.test(value)
}

/**
 * Settings Validations
 */
export const currencyCode = (value) => {
  return CURRENCIES.some(currency => currency.code === value)
}

export const dateFormat = (value) => {
  const validFormats = Object.keys(VALIDATION_RULES.DATE_FORMATS || {})
  return validFormats.includes(value)
}

export const theme = (value) => {
  return ['light', 'dark', 'system'].includes(value)
}

export const language = (value) => {
  const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar']
  return validLanguages.includes(value)
}

/**
 * Composite Validators
 */

// Validate entire transaction object
export const validateTransaction = (transaction) => {
  const errors = {}
  
  if (!transactionType(transaction.type)) {
    errors.type = 'Invalid transaction type'
  }
  
  if (!transactionAmount(transaction.amount)) {
    errors.amount = 'Invalid amount'
  }
  
  if (!required(transaction.category)) {
    errors.category = 'Category is required'
  }
  
  if (!transactionDate(transaction.date)) {
    errors.date = 'Invalid date'
  }
  
  if (transaction.description && !transactionDescription(transaction.description)) {
    errors.description = 'Description is too long'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate user registration
export const validateUserRegistration = (userData) => {
  const errors = {}
  
  if (!firstName(userData.firstName)) {
    errors.firstName = 'Invalid first name'
  }
  
  if (!lastName(userData.lastName)) {
    errors.lastName = 'Invalid last name'
  }
  
  if (!email(userData.email)) {
    errors.email = 'Invalid email address'
  }
  
  if (!strongPassword(userData.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  }
  
  if (!confirmPassword(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  if (userData.phone && !phone(userData.phone)) {
    errors.phone = 'Invalid phone number'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate category creation
export const validateCategory = (categoryData, existingCategories = []) => {
  const errors = {}
  
  if (!categoryName(categoryData.name, existingCategories)) {
    errors.name = 'Invalid or duplicate category name'
  }
  
  if (!transactionType(categoryData.type)) {
    errors.type = 'Invalid category type'
  }
  
  if (categoryData.description && !categoryDescription(categoryData.description)) {
    errors.description = 'Description is too long'
  }
  
  if (!categoryIcon(categoryData.icon)) {
    errors.icon = 'Icon is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Form Field Validators with Messages
 */
export const validators = {
  required: {
    validator: required,
    message: 'This field is required'
  },
  
  email: {
    validator: email,
    message: 'Please enter a valid email address'
  },
  
  password: {
    validator: password,
    message: 'Password must be at least 8 characters long'
  },
  
  strongPassword: {
    validator: strongPassword,
    message: 'Password must contain uppercase, lowercase, number, and special character'
  },
  
  phone: {
    validator: phone,
    message: 'Please enter a valid phone number'
  },
  
  amount: {
    validator: transactionAmount,
    message: 'Please enter a valid positive amount'
  },
  
  date: {
    validator: date,
    message: 'Please enter a valid date'
  },
  
  categoryName: {
    validator: (value, existingCategories) => categoryName(value, existingCategories),
    message: 'Please enter a unique category name (2-50 characters)'
  }
}

/**
 * Real-time Validation Helper
 */
export const validateField = (value, validatorName, ...args) => {
  const validator = validators[validatorName]
  if (!validator) {
    console.warn(`Validator "${validatorName}" not found`)
    return { isValid: true, message: '' }
  }
  
  const isValid = validator.validator(value, ...args)
  return {
    isValid,
    message: isValid ? '' : validator.message
  }
}

/**
 * Bulk Validation
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field]
    const value = formData[field]
    
    for (const rule of rules) {
      const { validator, message, ...args } = rule
      
      if (!validator(value, ...Object.values(args))) {
        errors[field] = message
        break // Stop at first validation error for this field
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  // Basic validators
  required,
  minLength,
  maxLength,
  exactLength,
  pattern,
  
  // Specific validators
  email,
  password,
  strongPassword,
  confirmPassword,
  phone,
  numeric,
  integer,
  positive,
  nonNegative,
  min,
  max,
  range,
  amount,
  currency,
  date,
  futureDate,
  pastDate,
  dateRange,
  minAge,
  fileSize,
  fileType,
  fileExtension,
  
  // String validators
  alphaOnly,
  alphaNumeric,
  alphaNumericSpaces,
  noSpecialChars,
  slug,
  
  // Transaction validators
  transactionType,
  transactionCategory,
  transactionDescription,
  transactionAmount,
  transactionDate,
  
  // Category validators
  categoryName,
  categoryDescription,
  categoryIcon,
  
  // User validators
  firstName,
  lastName,
  username,
  
  // Settings validators
  currencyCode,
  dateFormat,
  theme,
  language,
  
  // Composite validators
  validateTransaction,
  validateUserRegistration,
  validateCategory,
  
  // Helper functions
  validators,
  validateField,
  validateForm
}