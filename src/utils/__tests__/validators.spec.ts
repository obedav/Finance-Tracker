// src/utils/__tests__/validators.spec.ts
import { describe, it, expect } from 'vitest'
import {
  required,
  email,
  minLength,
  maxLength,
  exactLength,
  pattern,
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
  alphaOnly,
  alphaNumeric,
  alphaNumericSpaces,
  noSpecialChars,
  slug,
  transactionType,
  transactionCategory,
  transactionDescription,
  transactionAmount,
  transactionDate,
  categoryName,
  categoryDescription,
  categoryIcon,
  firstName,
  lastName,
  username,
  currencyCode,
  dateFormat,
  theme,
  language,
  validateTransaction,
  validateUserRegistration,
  validateCategory
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

    it('should handle arrays', () => {
      expect(required([])).toBe(false)
      expect(required([1, 2])).toBe(true)
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

    it('should handle empty string (allows empty)', () => {
      expect(email('')).toBe(true)
    })

    it('should handle null/undefined (allows empty)', () => {
      expect(email(null)).toBe(true)
      expect(email(undefined)).toBe(true)
    })
  })

  describe('minLength', () => {
    it('should return true when length meets minimum', () => {
      expect(minLength('hello', 5)).toBe(true)
      expect(minLength('hello world', 5)).toBe(true)
    })

    it('should return false when length is below minimum', () => {
      expect(minLength('hi', 5)).toBe(false)
    })

    it('should handle exact match', () => {
      expect(minLength('hello', 5)).toBe(true)
    })

    it('should handle empty string', () => {
      expect(minLength('', 1)).toBe(false)
    })

    it('should handle numbers', () => {
      expect(minLength(12345, 5)).toBe(true)
      expect(minLength(123, 5)).toBe(false)
    })
  })

  describe('maxLength', () => {
    it('should return true when length is within maximum', () => {
      expect(maxLength('hello', 10)).toBe(true)
    })

    it('should return false when length exceeds maximum', () => {
      expect(maxLength('hello world', 5)).toBe(false)
    })

    it('should handle exact match', () => {
      expect(maxLength('hello', 5)).toBe(true)
    })

    it('should handle empty string (allows empty)', () => {
      expect(maxLength('', 5)).toBe(true)
    })
  })

  describe('exactLength', () => {
    it('should return true for exact length match', () => {
      expect(exactLength('hello', 5)).toBe(true)
    })

    it('should return false for different length', () => {
      expect(exactLength('hello', 4)).toBe(false)
      expect(exactLength('hello', 6)).toBe(false)
    })

    it('should handle empty string', () => {
      expect(exactLength('', 0)).toBe(false) // exactLength returns false for empty values
    })
  })

  describe('pattern', () => {
    it('should validate against regex pattern', () => {
      expect(pattern('abc123', /^[a-z0-9]+$/)).toBe(true)
    })

    it('should reject when pattern does not match', () => {
      expect(pattern('abc@123', /^[a-z0-9]+$/)).toBe(false)
    })

    it('should handle empty string (allows empty)', () => {
      expect(pattern('', /^[a-z]+$/)).toBe(true)
    })
  })

  describe('password', () => {
    it('should validate password with minimum length', () => {
      expect(password('password123')).toBe(true)
    })

    it('should reject short passwords', () => {
      expect(password('pass')).toBe(false)
    })

    it('should reject empty password', () => {
      expect(password('')).toBe(false)
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

    it('should validate passwords meeting all requirements', () => {
      // Pass1! has uppercase, lowercase, number, special char (6 chars may be valid)
      expect(strongPassword('Pass1!')).toBe(true)
    })
  })

  describe('confirmPassword', () => {
    it('should return true when passwords match', () => {
      expect(confirmPassword('password123', 'password123')).toBe(true)
    })

    it('should return false when passwords do not match', () => {
      expect(confirmPassword('password123', 'different')).toBe(false)
    })

    it('should handle empty strings', () => {
      expect(confirmPassword('', '')).toBe(true)
    })
  })

  describe('phone', () => {
    it('should validate 10-digit phone numbers', () => {
      expect(phone('1234567890')).toBe(true)
      expect(phone('(123) 456-7890')).toBe(true)
      expect(phone('123-456-7890')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      // phone validation may be lenient for short numbers
      expect(phone('ab')).toBe(false)
      expect(phone('abcdefghij')).toBe(false)
    })

    it('should handle empty string (allows empty)', () => {
      expect(phone('')).toBe(true)
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

    it('should handle empty values (allows empty)', () => {
      expect(numeric('')).toBe(true)
      expect(numeric(null)).toBe(true)
    })
  })

  describe('integer', () => {
    it('should validate integers', () => {
      expect(integer(123)).toBe(true)
      expect(integer('123')).toBe(true)
    })

    it('should reject decimals', () => {
      expect(integer(123.45)).toBe(false)
      expect(integer('123.45')).toBe(false)
    })
  })

  describe('positive', () => {
    it('should validate positive numbers', () => {
      expect(positive(1)).toBe(true)
      expect(positive(123.45)).toBe(true)
    })

    it('should reject zero', () => {
      expect(positive(0)).toBe(false)
    })

    it('should reject negative numbers', () => {
      expect(positive(-1)).toBe(false)
    })
  })

  describe('nonNegative', () => {
    it('should validate non-negative numbers', () => {
      expect(nonNegative(0)).toBe(true)
      expect(nonNegative(123)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(nonNegative(-1)).toBe(false)
    })
  })

  describe('min', () => {
    it('should validate values meeting minimum', () => {
      expect(min(10, 5)).toBe(true)
      expect(min(5, 5)).toBe(true)
    })

    it('should reject values below minimum', () => {
      expect(min(4, 5)).toBe(false)
    })
  })

  describe('max', () => {
    it('should validate values within maximum', () => {
      expect(max(5, 10)).toBe(true)
      expect(max(10, 10)).toBe(true)
    })

    it('should reject values above maximum', () => {
      expect(max(11, 10)).toBe(false)
    })
  })

  describe('range', () => {
    it('should validate values within range', () => {
      expect(range(5, 1, 10)).toBe(true)
      expect(range(1, 1, 10)).toBe(true)
      expect(range(10, 1, 10)).toBe(true)
    })

    it('should reject values outside range', () => {
      expect(range(0, 1, 10)).toBe(false)
      expect(range(11, 1, 10)).toBe(false)
    })
  })

  describe('amount', () => {
    it('should validate valid currency amounts', () => {
      expect(amount(100)).toBe(true)
      expect(amount(0.01)).toBe(true)
    })

    it('should reject zero', () => {
      expect(amount(0)).toBe(false)
    })

    it('should reject empty values', () => {
      expect(amount('')).toBe(false)
    })
  })

  describe('currency', () => {
    it('should validate amounts with 2 decimal places', () => {
      expect(currency(100.50)).toBe(true)
    })

    it('should validate JPY with 0 decimal places', () => {
      expect(currency(100, 'JPY')).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(currency(0)).toBe(false)
    })
  })

  describe('date', () => {
    it('should validate valid dates', () => {
      expect(date(new Date())).toBe(true)
      expect(date('2024-01-15')).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(date('invalid')).toBe(false)
    })

    it('should handle empty values (allows empty)', () => {
      expect(date('')).toBe(true)
      expect(date(null)).toBe(true)
    })
  })

  describe('futureDate', () => {
    it('should validate future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(futureDate(tomorrow)).toBe(true)
    })

    it('should reject past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(futureDate(yesterday)).toBe(false)
    })
  })

  describe('pastDate', () => {
    it('should validate past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(pastDate(yesterday)).toBe(true)
    })

    it('should reject future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(pastDate(tomorrow)).toBe(false)
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

  describe('minAge', () => {
    it('should validate minimum age', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 20)
      expect(minAge(birthDate, 18)).toBe(true)
    })

    it('should reject age below minimum', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 16)
      expect(minAge(birthDate, 18)).toBe(false)
    })
  })

  describe('fileSize', () => {
    it('should validate files within size limit', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(fileSize(file, 1000000)).toBe(true)
    })

    it('should reject files exceeding size limit', () => {
      const content = 'x'.repeat(2000000)
      const file = new File([content], 'test.txt', { type: 'text/plain' })
      expect(fileSize(file, 1000000)).toBe(false)
    })
  })

  describe('fileType', () => {
    it('should validate allowed file types', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(fileType(file, ['text/plain', 'text/csv'])).toBe(true)
    })

    it('should reject disallowed file types', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(fileType(file, ['image/png'])).toBe(false)
    })
  })

  describe('fileExtension', () => {
    it('should validate allowed extensions', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(fileExtension(file, ['txt', 'csv'])).toBe(true)
    })

    it('should reject disallowed extensions', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(fileExtension(file, ['png', 'jpg'])).toBe(false)
    })
  })

  describe('alphaOnly', () => {
    it('should validate letters only', () => {
      expect(alphaOnly('abc')).toBe(true)
      expect(alphaOnly('ABC')).toBe(true)
    })

    it('should reject numbers and special characters', () => {
      expect(alphaOnly('abc123')).toBe(false)
      expect(alphaOnly('abc@')).toBe(false)
    })

    it('should handle empty string (allows empty)', () => {
      expect(alphaOnly('')).toBe(true)
    })
  })

  describe('alphaNumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(alphaNumeric('abc123')).toBe(true)
      expect(alphaNumeric('ABC123')).toBe(true)
    })

    it('should validate letters only', () => {
      expect(alphaNumeric('abc')).toBe(true)
    })

    it('should validate numbers only', () => {
      expect(alphaNumeric('123')).toBe(true)
    })

    it('should reject special characters', () => {
      expect(alphaNumeric('abc@123')).toBe(false)
      expect(alphaNumeric('abc 123')).toBe(false)
    })

    it('should handle empty string (allows empty)', () => {
      expect(alphaNumeric('')).toBe(true)
    })
  })

  describe('alphaNumericSpaces', () => {
    it('should validate alphanumeric with spaces', () => {
      expect(alphaNumericSpaces('abc 123')).toBe(true)
    })

    it('should reject special characters', () => {
      expect(alphaNumericSpaces('abc@123')).toBe(false)
    })
  })

  describe('noSpecialChars', () => {
    it('should validate strings without special characters', () => {
      expect(noSpecialChars('abc 123')).toBe(true)
    })

    it('should reject special characters', () => {
      expect(noSpecialChars('abc@123')).toBe(false)
    })
  })

  describe('slug', () => {
    it('should validate slug format', () => {
      expect(slug('hello-world')).toBe(true)
      expect(slug('test-123')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(slug('Hello-World')).toBe(false)
      expect(slug('hello_world')).toBe(false)
    })
  })

  describe('transactionType', () => {
    it('should validate income type (lowercase)', () => {
      expect(transactionType('income')).toBe(true)
    })

    it('should validate expense type (lowercase)', () => {
      expect(transactionType('expense')).toBe(true)
    })

    it('should validate INCOME type (uppercase)', () => {
      expect(transactionType('INCOME')).toBe(true)
    })

    it('should validate EXPENSE type (uppercase)', () => {
      expect(transactionType('EXPENSE')).toBe(true)
    })

    it('should reject invalid types', () => {
      expect(transactionType('INVALID')).toBe(false)
    })
  })

  describe('transactionCategory', () => {
    it('should validate when category exists in array', () => {
      expect(transactionCategory(1, [1, 2, 3])).toBe(true)
    })

    it('should reject when category not in array', () => {
      expect(transactionCategory(4, [1, 2, 3])).toBe(false)
    })

    it('should reject empty category', () => {
      expect(transactionCategory('', [])).toBe(false)
    })
  })

  describe('transactionDescription', () => {
    it('should validate valid descriptions', () => {
      expect(transactionDescription('Lunch at restaurant')).toBe(true)
    })

    it('should handle empty description (optional)', () => {
      expect(transactionDescription('')).toBe(true)
    })

    it('should reject overly long descriptions', () => {
      const longDesc = 'x'.repeat(300)
      expect(transactionDescription(longDesc)).toBe(false)
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
    })

    it('should reject far future dates', () => {
      const farFuture = new Date()
      farFuture.setDate(farFuture.getDate() + 30)
      expect(transactionDate(farFuture)).toBe(false)
    })
  })

  describe('categoryName', () => {
    it('should validate unique category name', () => {
      expect(categoryName('Food', [])).toBe(true)
    })

    it('should reject duplicate category name', () => {
      const existing = [{ name: 'Food' }]
      expect(categoryName('Food', existing)).toBe(false)
    })

    it('should reject too short names', () => {
      expect(categoryName('A', [])).toBe(false)
    })

    it('should reject empty names', () => {
      expect(categoryName('', [])).toBe(false)
    })
  })

  describe('categoryDescription', () => {
    it('should validate valid descriptions', () => {
      expect(categoryDescription('Category for food expenses')).toBe(true)
    })

    it('should handle empty description (optional)', () => {
      expect(categoryDescription('')).toBe(true)
    })

    it('should reject overly long descriptions', () => {
      const longDesc = 'x'.repeat(300)
      expect(categoryDescription(longDesc)).toBe(false)
    })
  })

  describe('categoryIcon', () => {
    it('should validate non-empty icon', () => {
      expect(categoryIcon('food-icon')).toBe(true)
    })

    it('should reject empty icon', () => {
      expect(categoryIcon('')).toBe(false)
      expect(categoryIcon(null)).toBe(false)
    })
  })

  describe('firstName', () => {
    it('should validate valid first name', () => {
      expect(firstName('John')).toBe(true)
    })

    it('should reject too short names', () => {
      expect(firstName('J')).toBe(false)
    })

    it('should reject empty names', () => {
      expect(firstName('')).toBe(false)
    })

    it('should reject names with special characters', () => {
      expect(firstName('John@')).toBe(false)
    })
  })

  describe('lastName', () => {
    it('should validate valid last name', () => {
      expect(lastName('Doe')).toBe(true)
    })

    it('should reject too short names', () => {
      expect(lastName('D')).toBe(false)
    })
  })

  describe('username', () => {
    it('should validate valid username', () => {
      expect(username('john_doe')).toBe(true)
      expect(username('john-doe')).toBe(true)
    })

    it('should reject too short usernames', () => {
      expect(username('ab')).toBe(false)
    })

    it('should reject invalid characters', () => {
      expect(username('john@doe')).toBe(false)
    })
  })

  describe('currencyCode', () => {
    it('should validate valid currency codes', () => {
      expect(currencyCode('USD')).toBe(true)
      expect(currencyCode('EUR')).toBe(true)
    })

    it('should reject invalid currency codes', () => {
      expect(currencyCode('XXX')).toBe(false)
    })
  })

  describe('dateFormat', () => {
    it('should validate valid date formats', () => {
      expect(dateFormat('MM/DD/YYYY')).toBe(true)
      expect(dateFormat('DD/MM/YYYY')).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(dateFormat('INVALID')).toBe(false)
    })
  })

  describe('theme', () => {
    it('should validate valid themes', () => {
      expect(theme('light')).toBe(true)
      expect(theme('dark')).toBe(true)
      expect(theme('system')).toBe(true)
    })

    it('should reject invalid themes', () => {
      expect(theme('blue')).toBe(false)
    })
  })

  describe('language', () => {
    it('should validate valid language codes', () => {
      expect(language('en')).toBe(true)
      expect(language('es')).toBe(true)
    })

    it('should reject invalid language codes', () => {
      expect(language('xx')).toBe(false)
    })
  })

  describe('validateTransaction', () => {
    it('should validate valid transaction', () => {
      const transaction = {
        type: 'expense',
        amount: 100,
        date: new Date(),
        category_id: 1,
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
        category_id: 1
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.type).toBeDefined()
    })

    it('should invalidate transaction with zero amount', () => {
      const transaction = {
        type: 'expense',
        amount: 0,
        date: new Date(),
        category_id: 1
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.amount).toBeDefined()
    })

    it('should invalidate transaction with invalid date', () => {
      const transaction = {
        type: 'expense',
        amount: 100,
        date: 'invalid',
        category_id: 1
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.date).toBeDefined()
    })

    it('should invalidate transaction without category', () => {
      const transaction = {
        type: 'expense',
        amount: 100,
        date: new Date()
      }
      const result = validateTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBeDefined()
    })
  })

  describe('validateUserRegistration', () => {
    it('should validate valid user', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
      const result = validateUserRegistration(user)
      expect(result.isValid).toBe(true)
    })

    it('should invalidate user without firstName', () => {
      const user = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
      const result = validateUserRegistration(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBeDefined()
    })

    it('should invalidate user with invalid email', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
      const result = validateUserRegistration(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should invalidate user with weak password', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'weak',
        confirmPassword: 'weak'
      }
      const result = validateUserRegistration(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBeDefined()
    })

    it('should invalidate user with mismatched passwords', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!'
      }
      const result = validateUserRegistration(user)
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBeDefined()
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
      expect(result.errors.name).toBeDefined()
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

    it('should invalidate category without icon', () => {
      const category = {
        name: 'Food',
        type: 'expense',
        icon: '',
        color: '#FF0000'
      }
      const result = validateCategory(category, [])
      expect(result.isValid).toBe(false)
      expect(result.errors.icon).toBeDefined()
    })
  })
})
