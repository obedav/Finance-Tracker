/**
 * Unit tests for src/utils/constants.ts
 * Testing application constants, validation rules, and configurations
 */

import { describe, it, expect } from 'vitest'
import {
  API_ENDPOINTS,
  VALIDATION_RULES,
  CURRENCIES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_CATEGORIES,
  FEATURES,
  FILE_LIMITS,
  PAGINATION
} from '../constants'

// ============================================================================
// TEST 1: API Endpoints Structure and Completeness
// ============================================================================

describe('API_ENDPOINTS', () => {
  it('should have a valid BASE_URL', () => {
    expect(API_ENDPOINTS.BASE_URL).toBeDefined()
    expect(typeof API_ENDPOINTS.BASE_URL).toBe('string')
    expect(API_ENDPOINTS.BASE_URL).toMatch(/^https?:\/\//)
  })

  it('should have all authentication endpoints', () => {
    const authEndpoints = API_ENDPOINTS.AUTH

    expect(authEndpoints).toBeDefined()
    expect(authEndpoints.LOGIN).toBe('/auth/login')
    expect(authEndpoints.REGISTER).toBe('/auth/register')
    expect(authEndpoints.LOGOUT).toBe('/auth/logout')
    expect(authEndpoints.PROFILE).toBe('/auth/profile')
    expect(authEndpoints.CHANGE_PASSWORD).toBe('/auth/change-password')
    expect(authEndpoints.REQUEST_RESET).toBe('/auth/request-reset')
    expect(authEndpoints.RESET_PASSWORD).toBe('/auth/reset-password')
  })

  it('should have all transaction endpoints', () => {
    const txEndpoints = API_ENDPOINTS.TRANSACTIONS

    expect(txEndpoints).toBeDefined()
    expect(txEndpoints.LIST).toBe('/transactions')
    expect(txEndpoints.CREATE).toBe('/transactions')
    expect(txEndpoints.GET).toBe('/transactions/:id')
    expect(txEndpoints.UPDATE).toBe('/transactions/:id')
    expect(txEndpoints.DELETE).toBe('/transactions/:id')
    expect(txEndpoints.EXPORT_CSV).toBe('/transactions/export/csv')
    expect(txEndpoints.IMPORT_CSV).toBe('/transactions/import/csv')
  })

  it('should have all category endpoints', () => {
    const catEndpoints = API_ENDPOINTS.CATEGORIES

    expect(catEndpoints).toBeDefined()
    expect(catEndpoints.LIST).toBe('/categories')
    expect(catEndpoints.CREATE).toBe('/categories')
    expect(catEndpoints.GET).toBe('/categories/:id')
    expect(catEndpoints.UPDATE).toBe('/categories/:id')
    expect(catEndpoints.DELETE).toBe('/categories/:id')
  })

  it('should have all budget endpoints', () => {
    const budgetEndpoints = API_ENDPOINTS.BUDGETS

    expect(budgetEndpoints).toBeDefined()
    expect(budgetEndpoints.LIST).toBe('/budgets')
    expect(budgetEndpoints.CREATE).toBe('/budgets')
    expect(budgetEndpoints.GET).toBe('/budgets/:id')
    expect(budgetEndpoints.UPDATE).toBe('/budgets/:id')
    expect(budgetEndpoints.DELETE).toBe('/budgets/:id')
  })

  it('should have report endpoints', () => {
    const reportEndpoints = API_ENDPOINTS.REPORTS

    expect(reportEndpoints).toBeDefined()
    expect(reportEndpoints.MONTHLY).toBe('/reports/monthly')
    expect(reportEndpoints.YEARLY).toBe('/reports/yearly')
    expect(reportEndpoints.CATEGORY).toBe('/reports/category')
    expect(reportEndpoints.EXPORT).toBe('/reports/export')
  })
})

// ============================================================================
// TEST 2: Validation Rules - Regex Patterns
// ============================================================================

describe('VALIDATION_RULES', () => {
  describe('EMAIL validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com',
        'firstname.lastname@company.org'
      ]

      validEmails.forEach(email => {
        expect(VALIDATION_RULES.EMAIL.test(email)).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user@.com',
        'user @example.com',
        'user@example',
        ''
      ]

      invalidEmails.forEach(email => {
        expect(VALIDATION_RULES.EMAIL.test(email)).toBe(false)
      })
    })
  })

  describe('PHONE validation', () => {
    it('should accept valid phone numbers', () => {
      const validPhones = [
        '+12345678901',
        '12345678901',
        '+1234567890123456',
        '1234567890'
      ]

      validPhones.forEach(phone => {
        expect(VALIDATION_RULES.PHONE.test(phone)).toBe(true)
      })
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '0123456789', // starts with 0
        '+0123456789', // starts with +0
        'abc123',
        '+',
        ''
      ]

      invalidPhones.forEach(phone => {
        expect(VALIDATION_RULES.PHONE.test(phone)).toBe(false)
      })
    })
  })

  describe('PASSWORD validation', () => {
    it('should have minimum length requirement', () => {
      expect(VALIDATION_RULES.PASSWORD.MIN_LENGTH).toBe(8)
    })

    it('should accept strong passwords', () => {
      const strongPasswords = [
        'Password1!',
        'MyP@ssw0rd',
        'Secure123$',
        'Test@1234'
      ]

      strongPasswords.forEach(password => {
        expect(VALIDATION_RULES.PASSWORD.PATTERN.test(password)).toBe(true)
      })
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password', // no uppercase, no number, no special char
        'PASSWORD', // no lowercase, no number, no special char
        'Password', // no number, no special char
        'Pass1', // too short
        '12345678' // no letters
      ]

      weakPasswords.forEach(password => {
        expect(VALIDATION_RULES.PASSWORD.PATTERN.test(password)).toBe(false)
      })
    })
  })

  describe('AMOUNT validation', () => {
    it('should have correct min and max values', () => {
      expect(VALIDATION_RULES.AMOUNT.MIN).toBe(0.01)
      expect(VALIDATION_RULES.AMOUNT.MAX).toBe(999999999.99)
    })

    it('should accept valid amounts', () => {
      const validAmounts = [
        '100',
        '100.50',
        '0.01',
        '1234.56',
        '999999999.99'
      ]

      validAmounts.forEach(amount => {
        expect(VALIDATION_RULES.AMOUNT.PATTERN.test(amount)).toBe(true)
      })
    })

    it('should reject invalid amounts', () => {
      const invalidAmounts = [
        '100.123', // more than 2 decimal places
        '.50', // missing leading digit
        '-100', // negative
        '1,000.00', // contains comma
        'abc'
      ]

      invalidAmounts.forEach(amount => {
        expect(VALIDATION_RULES.AMOUNT.PATTERN.test(amount)).toBe(false)
      })
    })
  })

  describe('NAME validation', () => {
    it('should have min and max length constraints', () => {
      expect(VALIDATION_RULES.NAME.MIN_LENGTH).toBe(2)
      expect(VALIDATION_RULES.NAME.MAX_LENGTH).toBe(50)
    })

    it('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'Mary Jane',
        'Sam',
        'Alexander Hamilton'
      ]

      validNames.forEach(name => {
        expect(VALIDATION_RULES.NAME.PATTERN!.test(name)).toBe(true)
      })
    })

    it('should reject names with numbers or special characters', () => {
      const invalidNames = [
        'John123',
        'Mary@Jane',
        'Sam!',
        'User_Name'
      ]

      invalidNames.forEach(name => {
        expect(VALIDATION_RULES.NAME.PATTERN!.test(name)).toBe(false)
      })
    })
  })
})

// ============================================================================
// TEST 3: Currency Data Structure and Completeness
// ============================================================================

describe('CURRENCIES', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(CURRENCIES)).toBe(true)
    expect(CURRENCIES.length).toBeGreaterThan(0)
  })

  it('should have exactly 10 currencies', () => {
    expect(CURRENCIES.length).toBe(10)
  })

  it('should have all required properties for each currency', () => {
    CURRENCIES.forEach(currency => {
      expect(currency).toHaveProperty('code')
      expect(currency).toHaveProperty('name')
      expect(currency).toHaveProperty('symbol')

      expect(typeof currency.code).toBe('string')
      expect(typeof currency.name).toBe('string')
      expect(typeof currency.symbol).toBe('string')
    })
  })

  it('should have USD as the first currency', () => {
    expect(CURRENCIES[0].code).toBe('USD')
    expect(CURRENCIES[0].name).toBe('US Dollar')
    expect(CURRENCIES[0].symbol).toBe('$')
  })

  it('should have unique currency codes', () => {
    const codes = CURRENCIES.map(c => c.code)
    const uniqueCodes = new Set(codes)
    expect(uniqueCodes.size).toBe(codes.length)
  })

  it('should have valid 3-letter currency codes', () => {
    CURRENCIES.forEach(currency => {
      expect(currency.code).toMatch(/^[A-Z]{3}$/)
    })
  })

  it('should contain major world currencies', () => {
    const codes = CURRENCIES.map(c => c.code)

    expect(codes).toContain('USD')
    expect(codes).toContain('EUR')
    expect(codes).toContain('GBP')
    expect(codes).toContain('JPY')
    expect(codes).toContain('CNY')
  })
})

// ============================================================================
// ADDITIONAL TESTS: Core Constants
// ============================================================================

describe('TRANSACTION_TYPES', () => {
  it('should have INCOME and EXPENSE types', () => {
    expect(TRANSACTION_TYPES.INCOME).toBe('INCOME')
    expect(TRANSACTION_TYPES.EXPENSE).toBe('EXPENSE')
  })
})

describe('TRANSACTION_STATUS', () => {
  it('should have all required status values', () => {
    expect(TRANSACTION_STATUS.PENDING).toBe('pending')
    expect(TRANSACTION_STATUS.COMPLETED).toBe('completed')
    expect(TRANSACTION_STATUS.CANCELLED).toBe('cancelled')
    expect(TRANSACTION_STATUS.FAILED).toBe('failed')
  })
})

describe('HTTP_STATUS', () => {
  it('should have common HTTP status codes', () => {
    expect(HTTP_STATUS.OK).toBe(200)
    expect(HTTP_STATUS.CREATED).toBe(201)
    expect(HTTP_STATUS.BAD_REQUEST).toBe(400)
    expect(HTTP_STATUS.UNAUTHORIZED).toBe(401)
    expect(HTTP_STATUS.NOT_FOUND).toBe(404)
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500)
  })
})

describe('ERROR_MESSAGES', () => {
  it('should have all critical error messages', () => {
    expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined()
    expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined()
    expect(ERROR_MESSAGES.VALIDATION_ERROR).toBeDefined()
    expect(ERROR_MESSAGES.INVALID_CREDENTIALS).toBeDefined()

    expect(typeof ERROR_MESSAGES.NETWORK_ERROR).toBe('string')
    expect(ERROR_MESSAGES.NETWORK_ERROR.length).toBeGreaterThan(0)
  })
})

describe('SUCCESS_MESSAGES', () => {
  it('should have all success messages', () => {
    expect(SUCCESS_MESSAGES.LOGIN_SUCCESS).toBeDefined()
    expect(SUCCESS_MESSAGES.TRANSACTION_ADDED).toBeDefined()
    expect(SUCCESS_MESSAGES.CATEGORY_ADDED).toBeDefined()

    expect(typeof SUCCESS_MESSAGES.LOGIN_SUCCESS).toBe('string')
    expect(SUCCESS_MESSAGES.LOGIN_SUCCESS.length).toBeGreaterThan(0)
  })
})

describe('DEFAULT_CATEGORIES', () => {
  it('should have income categories', () => {
    expect(Array.isArray(DEFAULT_CATEGORIES.INCOME)).toBe(true)
    expect(DEFAULT_CATEGORIES.INCOME.length).toBeGreaterThan(0)
    expect(DEFAULT_CATEGORIES.INCOME).toContain('Salary')
  })

  it('should have expense categories', () => {
    expect(Array.isArray(DEFAULT_CATEGORIES.EXPENSE)).toBe(true)
    expect(DEFAULT_CATEGORIES.EXPENSE.length).toBeGreaterThan(0)
    expect(DEFAULT_CATEGORIES.EXPENSE).toContain('Food & Dining')
  })
})

describe('FEATURES', () => {
  it('should have boolean values for all feature flags', () => {
    Object.values(FEATURES).forEach(value => {
      expect(typeof value).toBe('boolean')
    })
  })

  it('should have implemented features enabled', () => {
    expect(FEATURES.DARK_MODE).toBe(true)
    expect(FEATURES.BUDGET_ALERTS).toBe(true)
    expect(FEATURES.CATEGORIES_MANAGEMENT).toBe(true)
  })

  it('should have unimplemented features disabled', () => {
    expect(FEATURES.BANK_INTEGRATION).toBe(false)
    expect(FEATURES.TWO_FACTOR_AUTH).toBe(false)
  })
})

describe('FILE_LIMITS', () => {
  it('should have max size limit of 5MB', () => {
    expect(FILE_LIMITS.MAX_SIZE).toBe(5 * 1024 * 1024)
  })

  it('should have allowed file types', () => {
    expect(FILE_LIMITS.ALLOWED_TYPES.IMAGES).toBeDefined()
    expect(FILE_LIMITS.ALLOWED_TYPES.DOCUMENTS).toBeDefined()
    expect(FILE_LIMITS.ALLOWED_TYPES.EXPORTS).toBeDefined()

    expect(Array.isArray(FILE_LIMITS.ALLOWED_TYPES.IMAGES)).toBe(true)
    expect(FILE_LIMITS.ALLOWED_TYPES.IMAGES.length).toBeGreaterThan(0)
  })
})

describe('PAGINATION', () => {
  it('should have default page size', () => {
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(15)
  })

  it('should have max page size', () => {
    expect(PAGINATION.MAX_PAGE_SIZE).toBe(100)
  })

  it('should have page size options', () => {
    expect(Array.isArray(PAGINATION.PAGE_SIZE_OPTIONS)).toBe(true)
    expect(PAGINATION.PAGE_SIZE_OPTIONS).toContain(15)
    expect(PAGINATION.PAGE_SIZE_OPTIONS).toContain(50)
  })
})
