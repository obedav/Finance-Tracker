// src/utils/__tests__/validators.spec.ts
import { describe, it, expect } from 'vitest'
import {
  required,
  email,
  minLength,
  maxLength,
  numeric,
  alphanumeric,
  url,
  phoneNumber,
  creditCard,
  zipCode,
  strongPassword,
  matchField,
  transactionType,
  transactionAmount,
  transactionDate,
  transactionCategory,
  budgetAmount,
  budgetPeriod,
  dateRange,
  validateTransaction,
  validateBudget,
  validateCategory,
  validateUser,
  validateEmail,
  validatePassword,
  validateAmount,
  validateDate,
  composite
} from '../validators'

describe('validators.ts', () => {
  describe('required', () => {
    it('should return true for non-empty string', () => {
      expect(required('test')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(required('')).toBe(false)
    })

    it('should return false for whitespace only', () => {
      expect(required('   ')).toBe(false)
    })

    it('should return false for null', () => {
      expect(required(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(required(undefined)).toBe(false)
    })

    it('should return true for zero', () => {
      expect(required(0)).toBe(true)
    })

    it('should return true for boolean false', () => {
      expect(required(false)).toBe(true)
    })
  })

  describe('email', () => {
    it('should validate correct email addresses', () => {
      expect(email('test@example.com')).toBe(true)
      expect(email('user.name@example.com')).toBe(true)
      expect(email('user+tag@example.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(email('invalid')).toBe(false)
      expect(email('invalid@')).toBe(false)
      expect(email('@example.com')).toBe(false)
      expect(email('test@')).toBe(false)
      expect(email('test @example.com')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(email('')).toBe(false)
    })
  })

  describe('minLength', () => {
    it('should return true when length meets minimum', () => {
      expect(minLength(5)('hello')).toBe(true)
      expect(minLength(5)('hello world')).toBe(true)
    })

    it('should return false when length is below minimum', () => {
      expect(minLength(5)('hi')).toBe(false)
    })

    it('should handle exact match', () => {
      expect(minLength(5)('hello')).toBe(true)
    })

    it('should handle empty string', () => {
      expect(minLength(1)('')).toBe(false)
    })
  })

  describe('maxLength', () => {
    it('should return true when length is within maximum', () => {
      expect(maxLength(10)('hello')).toBe(true)
    })

    it('should return false when length exceeds maximum', () => {
      expect(maxLength(5)('hello world')).toBe(false)
    })

    it('should handle exact match', () => {
      expect(maxLength(5)('hello')).toBe(true)
    })

    it('should handle empty string', () => {
      expect(maxLength(5)('')).toBe(true)
    })
  })

  describe('numeric', () => {
    it('should validate numeric strings', () => {
      expect(numeric('123')).toBe(true)
      expect(numeric('0')).toBe(true)
    })

    it('should validate numbers', () => {
      expect(numeric(123)).toBe(true)
      expect(numeric(0)).toBe(true)
    })

    it('should validate decimal numbers', () => {
      expect(numeric('123.45')).toBe(true)
      expect(numeric(123.45)).toBe(true)
    })

    it('should validate negative numbers', () => {
      expect(numeric('-123')).toBe(true)
      expect(numeric(-123)).toBe(true)
    })

    it('should reject non-numeric values', () => {
      expect(numeric('abc')).toBe(false)
      expect(numeric('12abc')).toBe(false)
    })
  })

  describe('alphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(alphanumeric('abc123')).toBe(true)
      expect(alphanumeric('ABC123')).toBe(true)
    })

    it('should validate letters only', () => {
      expect(alphanumeric('abc')).toBe(true)
    })

    it('should validate numbers only', () => {
      expect(alphanumeric('123')).toBe(true)
    })

    it('should reject special characters', () => {
      expect(alphanumeric('abc@123')).toBe(false)
      expect(alphanumeric('abc 123')).toBe(false)
    })
  })

  describe('url', () => {
    it('should validate correct URLs', () => {
      expect(url('https://example.com')).toBe(true)
      expect(url('http://example.com')).toBe(true)
      expect(url('https://www.example.com/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(url('not a url')).toBe(false)
      expect(url('example.com')).toBe(false)
      expect(url('ftp://example.com')).toBe(false)
    })
  })

  describe('phoneNumber', () => {
    it('should validate 10-digit phone numbers', () => {
      expect(phoneNumber('1234567890')).toBe(true)
      expect(phoneNumber('(123) 456-7890')).toBe(true)
      expect(phoneNumber('123-456-7890')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(phoneNumber('123')).toBe(false)
      expect(phoneNumber('abcdefghij')).toBe(false)
    })
  })

  describe('creditCard', () => {
    it('should validate 16-digit card numbers', () => {
      expect(creditCard('1234567890123456')).toBe(true)
      expect(creditCard('1234 5678 9012 3456')).toBe(true)
    })

    it('should reject invalid card numbers', () => {
      expect(creditCard('1234')).toBe(false)
      expect(creditCard('abcd1234efgh5678')).toBe(false)
    })
  })

  describe('zipCode', () => {
    it('should validate 5-digit US zip codes', () => {
      expect(zipCode('12345')).toBe(true)
    })

    it('should validate ZIP+4 format', () => {
      expect(zipCode('12345-6789')).toBe(true)
    })

    it('should reject invalid zip codes', () => {
      expect(zipCode('123')).toBe(false)
      expect(zipCode('abcde')).toBe(false)
    })
  })

  describe('strongPassword', () => {
    it('should validate strong passwords', () => {
      expect(strongPassword('Password123!')).toBe(true)
      expect(strongPassword('MyP@ssw0rd')).toBe(true)
    })

    it('should reject weak passwords - no uppercase', () => {
      expect(strongPassword('password123!')).toBe(false)
    })

    it('should reject weak passwords - no lowercase', () => {
      expect(strongPassword('PASSWORD123!')).toBe(false)
    })

    it('should reject weak passwords - no numbers', () => {
      expect(strongPassword('Password!')).toBe(false)
    })

    it('should reject weak passwords - no special chars', () => {
      expect(strongPassword('Password123')).toBe(false)
    })

    it('should reject weak passwords - too short', () => {
      expect(strongPassword('Pass1!')).toBe(false)
    })
  })

  describe('matchField', () => {
    it('should return true when fields match', () => {
      expect(matchField('password123', 'password123')).toBe(true)
    })

    it('should return false when fields do not match', () => {
      expect(matchField('password123', 'different')).toBe(false)
    })

    it('should handle empty strings', () => {
      expect(matchField('', '')).toBe(true)
    })
  })

  describe('transactionType', () => {
    it('should validate INCOME type', () => {
      expect(transactionType('INCOME')).toBe(true)
    })

    it('should validate EXPENSE type', () => {
      expect(transactionType('EXPENSE')).toBe(true)
    })

    it('should reject invalid types', () => {
      expect(transactionType('INVALID')).toBe(false)
      expect(transactionType('income')).toBe(false)
    })
  })

  describe('transactionAmount', () => {
    it('should validate positive amounts', () => {
      expect(transactionAmount(100)).toBe(true)
      expect(transactionAmount(0.01)).toBe(true)
    })

    it('should reject zero', () => {
      expect(transactionAmount(0)).toBe(false)
    })

    it('should reject negative amounts', () => {
      expect(transactionAmount(-100)).toBe(false)
    })

    it('should reject non-numeric values', () => {
      expect(transactionAmount('invalid' as any)).toBe(false)
    })
  })

  describe('transactionDate', () => {
    it('should validate valid dates', () => {
      expect(transactionDate(new Date())).toBe(true)
      expect(transactionDate('2024-01-15')).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(transactionDate('invalid')).toBe(false)
      expect(transactionDate(null as any)).toBe(false)
    })
  })

  describe('transactionCategory', () => {
    it('should validate non-empty category', () => {
      expect(transactionCategory('Food')).toBe(true)
    })

    it('should reject empty category', () => {
      expect(transactionCategory('')).toBe(false)
      expect(transactionCategory('   ')).toBe(false)
    })
  })

  describe('budgetAmount', () => {
    it('should validate positive budget amounts', () => {
      expect(budgetAmount(1000)).toBe(true)
      expect(budgetAmount(0.01)).toBe(true)
    })

    it('should reject zero or negative', () => {
      expect(budgetAmount(0)).toBe(false)
      expect(budgetAmount(-100)).toBe(false)
    })
  })

  describe('budgetPeriod', () => {
    it('should validate monthly period', () => {
      expect(budgetPeriod('monthly')).toBe(true)
    })

    it('should validate weekly period', () => {
      expect(budgetPeriod('weekly')).toBe(true)
    })

    it('should validate yearly period', () => {
      expect(budgetPeriod('yearly')).toBe(true)
    })

    it('should reject invalid periods', () => {
      expect(budgetPeriod('daily')).toBe(false)
      expect(budgetPeriod('MONTHLY')).toBe(false)
    })
  })

  describe('dateRange', () => {
    it('should validate when end is after start', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-01-31')
      expect(dateRange(start, end)).toBe(true)
    })

    it('should validate when dates are equal', () => {
      const date = new Date('2024-01-01')
      expect(dateRange(date, date)).toBe(true)
    })

    it('should reject when end is before start', () => {
      const start = new Date('2024-01-31')
      const end = new Date('2024-01-01')
      expect(dateRange(start, end)).toBe(false)
    })

    it('should handle string dates', () => {
      expect(dateRange('2024-01-01', '2024-01-31')).toBe(true)
      expect(dateRange('2024-01-31', '2024-01-01')).toBe(false)
    })
  })

  describe('validateTransaction', () => {
    it('should validate valid transaction', () => {
      const transaction = {
        type: 'EXPENSE',
        amount: 100,
        date: new Date(),
        category: 'Food',
        description: 'Groceries'
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should invalidate transaction with invalid type', () => {
      const transaction = {
        type: 'INVALID',
        amount: 100,
        date: new Date(),
        category: 'Food'
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.type).toBeDefined()
    })

    it('should invalidate transaction with zero amount', () => {
      const transaction = {
        type: 'EXPENSE',
        amount: 0,
        date: new Date(),
        category: 'Food'
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.amount).toBeDefined()
    })

    it('should invalidate transaction with invalid date', () => {
      const transaction = {
        type: 'EXPENSE',
        amount: 100,
        date: 'invalid',
        category: 'Food'
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.date).toBeDefined()
    })

    it('should invalidate transaction without category', () => {
      const transaction = {
        type: 'EXPENSE',
        amount: 100,
        date: new Date(),
        category: ''
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBeDefined()
    })
  })

  describe('validateBudget', () => {
    it('should validate valid budget', () => {
      const budget = {
        category_id: 1,
        amount: 1000,
        period: 'monthly'
      }
      const result = validateBudget(budget)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should invalidate budget without category_id', () => {
      const budget = {
        amount: 1000,
        period: 'monthly'
      }
      const result = validateBudget(budget)
      expect(result.isValid).toBe(false)
      expect(result.errors.category_id).toBeDefined()
    })

    it('should invalidate budget with zero amount', () => {
      const budget = {
        category_id: 1,
        amount: 0,
        period: 'monthly'
      }
      const result = validateBudget(budget)
      expect(result.isValid).toBe(false)
      expect(result.errors.amount).toBeDefined()
    })

    it('should invalidate budget with invalid period', () => {
      const budget = {
        category_id: 1,
        amount: 1000,
        period: 'daily'
      }
      const result = validateBudget(budget)
      expect(result.isValid).toBe(false)
      expect(result.errors.period).toBeDefined()
    })
  })

  describe('validateCategory', () => {
    it('should validate valid new category', () => {
      const category = {
        name: 'Food',
        type: 'expense',
        icon: 'food-icon',
        color: '#FF0000'
      }
      const result = validateCategory(category, [])
      expect(result.isValid).toBe(true)
    })

    it('should invalidate category without name', () => {
      const category = {
        name: '',
        type: 'expense',
        icon: 'icon',
        color: '#FF0000'
      }
      const result = validateCategory(category, [])
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeDefined()
    })

    it('should invalidate duplicate category name', () => {
      const category = {
        name: 'Food',
        type: 'expense',
        icon: 'icon',
        color: '#FF0000'
      }
      const existing = [{ name: 'Food', type: 'expense' }]
      const result = validateCategory(category, existing)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('already exists')
    })

    it('should invalidate category with invalid type', () => {
      const category = {
        name: 'Food',
        type: 'invalid',
        icon: 'icon',
        color: '#FF0000'
      }
      const result = validateCategory(category, [])
      expect(result.isValid).toBe(false)
      expect(result.errors.type).toBeDefined()
    })
  })

  describe('validateUser', () => {
    it('should validate valid user', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!'
      }
      const result = validateUser(user)
      expect(result.isValid).toBe(true)
    })

    it('should invalidate user without firstName', () => {
      const user = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!'
      }
      const result = validateUser(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBeDefined()
    })

    it('should invalidate user with invalid email', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!'
      }
      const result = validateUser(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should invalidate user with weak password', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'weak'
      }
      const result = validateUser(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBeDefined()
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
    })

    it('should invalidate incorrect email', () => {
      const result = validateEmail('invalid')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('Password123!')
      expect(result.isValid).toBe(true)
    })

    it('should invalidate weak password', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateAmount', () => {
    it('should validate positive amount', () => {
      const result = validateAmount(100)
      expect(result.isValid).toBe(true)
    })

    it('should invalidate zero amount', () => {
      const result = validateAmount(0)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should invalidate negative amount', () => {
      const result = validateAmount(-100)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateDate', () => {
    it('should validate valid date', () => {
      const result = validateDate(new Date())
      expect(result.isValid).toBe(true)
    })

    it('should validate date string', () => {
      const result = validateDate('2024-01-15')
      expect(result.isValid).toBe(true)
    })

    it('should invalidate invalid date', () => {
      const result = validateDate('invalid')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('composite', () => {
    it('should validate when all validators pass', () => {
      const validator = composite([
        required,
        minLength(3),
        maxLength(10)
      ])
      expect(validator('hello')).toBe(true)
    })

    it('should fail when any validator fails', () => {
      const validator = composite([
        required,
        minLength(10)
      ])
      expect(validator('hello')).toBe(false)
    })

    it('should handle empty validators array', () => {
      const validator = composite([])
      expect(validator('anything')).toBe(true)
    })
  })
})
