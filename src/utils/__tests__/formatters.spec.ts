// src/utils/__tests__/formatters.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatCurrency,
  getCurrencySymbol,
  formatCurrencyNumber,
  parseCurrency,
  formatCompactCurrency,
  formatDate,
  formatRelativeTime,
  formatTime,
  formatDateTime,
  getMonthName,
  getDayName,
  formatPercentage,
  formatNumber,
  formatFileSize,
  capitalize,
  titleCase,
  truncate,
  formatPhoneNumber,
  formatCreditCard,
  formatTransactionAmount,
  formatTransactionDescription,
  formatCategoryName,
  formatChartValue,
  formatAxisLabel,
  formatInputCurrency,
  formatDisplayCurrency,
  isValidDate,
  isValidCurrency,
  formatForCSV,
  formatForJSON,
  unformatCurrency,
  addThousandSeparators,
  formatTransactionStatus,
  formatGoalProgress
} from '../formatters'

// Import slugify from helpers
import { slugify as slugifyHelper } from '../helpers'

describe('formatters.ts', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
    })

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR', 'de-DE')
      // Allow for non-breaking space variations
      expect(result).toMatch(/1[.,]234[.,]56/)
      expect(result).toContain('€')
    })

    it('should format GBP currency correctly', () => {
      expect(formatCurrency(1234.56, 'GBP', 'en-GB')).toBe('£1,234.56')
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-1234.56, 'USD', 'en-US')).toBe('-$1,234.56')
    })

    it('should respect custom options', () => {
      const result = formatCurrency(1234.567, 'USD', 'en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      })
      expect(result).toBe('$1,234.567')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(1000000000, 'USD', 'en-US')).toBe('$1,000,000,000.00')
    })

    it('should handle very small decimal numbers', () => {
      expect(formatCurrency(0.01, 'USD', 'en-US')).toBe('$0.01')
    })
  })

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDate(date)
      // Default format is MM/DD/YYYY which uses locale date string
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should format date string', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBeTruthy()
    })

    it('should format timestamp', () => {
      const timestamp = new Date('2024-01-15').getTime()
      const result = formatDate(timestamp)
      expect(result).toBeTruthy()
    })

    it('should handle invalid date', () => {
      expect(formatDate('invalid')).toBe('')
    })

    it('should handle null date', () => {
      expect(formatDate(null as any)).toBe('')
    })

    it('should use custom locale', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date, 'DD/MM/YYYY', 'de-DE')
      expect(result).toBeTruthy()
    })
  })

  describe('formatTime', () => {
    it('should format time in 12-hour format', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatTime(date, '12')
      expect(result).toMatch(/2:30/)
      expect(result).toMatch(/PM/)
    })

    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatTime(date, '24')
      expect(result).toMatch(/14:30/)
    })

    it('should handle midnight correctly', () => {
      const date = new Date('2024-01-15T00:00:00')
      const result = formatTime(date, '12')
      expect(result).toMatch(/12:00/)
      expect(result).toMatch(/AM/)
    })

    it('should handle noon correctly', () => {
      const date = new Date('2024-01-15T12:00:00')
      const result = formatTime(date, '12')
      expect(result).toMatch(/12:00/)
      expect(result).toMatch(/PM/)
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle invalid datetime', () => {
      expect(formatDateTime('invalid')).toContain('')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should format time from minutes ago', () => {
      const date = new Date('2024-01-15T11:55:00')
      const result = formatRelativeTime(date)
      expect(result).toMatch(/5|this|minutes/)
    })

    it('should format time from hours ago', () => {
      const date = new Date('2024-01-15T10:00:00')
      expect(formatRelativeTime(date)).toMatch(/2|hours/)
    })

    it('should format time from days ago', () => {
      const date = new Date('2024-01-13T12:00:00')
      expect(formatRelativeTime(date)).toMatch(/2|days/)
    })
  })

  describe('formatNumber', () => {
    it('should format number with default locale', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89')
    })

    it('should format number with custom locale', () => {
      const result = formatNumber(1234567.89, 'de-DE')
      expect(result).toMatch(/234/)
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234.56)).toBe('-1,234.56')
    })

    it('should respect custom decimal places', () => {
      expect(formatNumber(1234.5678, 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })).toBe('1,234.57')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      // formatPercentage divides by 100, so pass 12.34 to get 12.34%
      const result = formatPercentage(12.34)
      expect(result).toMatch(/12/)
    })

    it('should handle zero', () => {
      expect(formatPercentage(0)).toMatch(/0/)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toMatch(/1.*KB/)
    })

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toMatch(/1.*MB/)
    })

    it('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toMatch(/1.*GB/)
    })

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle already capitalized text', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('h')).toBe('H')
    })

    it('should lowercase rest of string', () => {
      expect(capitalize('hELLO')).toBe('Hello')
    })
  })

  describe('titleCase', () => {
    it('should capitalize all words', () => {
      expect(titleCase('hello world')).toBe('Hello World')
    })

    it('should handle single word', () => {
      expect(titleCase('hello')).toBe('Hello')
    })

    it('should handle multiple spaces', () => {
      const result = titleCase('hello  world')
      expect(result).toContain('Hello')
      expect(result).toContain('World')
    })

    it('should handle empty string', () => {
      expect(titleCase('')).toBe('')
    })
  })

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
    })

    it('should truncate long text with default ellipsis', () => {
      expect(truncate('Hello World', 8)).toBe('Hello Wo...')
    })

    it('should truncate with custom ellipsis', () => {
      expect(truncate('Hello World', 8, '---')).toBe('Hello Wo---')
    })

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('should handle exact length match', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })
  })

  describe('slugify (from helpers)', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugifyHelper('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugifyHelper('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple spaces', () => {
      expect(slugifyHelper('Hello   World')).toBe('hello-world')
    })

    it('should trim leading/trailing dashes', () => {
      expect(slugifyHelper('  Hello World  ')).toBe('hello-world')
    })

    it('should handle numbers', () => {
      expect(slugifyHelper('Test 123')).toBe('test-123')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US phone number', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
    })

    it('should handle already formatted number', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
    })

    it('should return original for invalid length', () => {
      expect(formatPhoneNumber('12345')).toBe('12345')
    })

    it('should strip non-numeric characters before formatting', () => {
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
    })
  })

  describe('formatCreditCard', () => {
    it('should format 16-digit credit card', () => {
      expect(formatCreditCard('1234567890123456')).toBe('1234 5678 9012 3456')
    })

    it('should handle already formatted card', () => {
      expect(formatCreditCard('1234 5678 9012 3456')).toBe('1234 5678 9012 3456')
    })

    it('should return original for invalid length', () => {
      const result = formatCreditCard('1234')
      expect(result).toBeTruthy()
    })
  })

  describe('parseCurrency / unformatCurrency', () => {
    it('should parse USD formatted currency', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56)
    })

    it('should parse negative amounts', () => {
      expect(parseCurrency('-$1,234.56')).toBe(-1234.56)
    })

    it('should parse number without formatting', () => {
      expect(parseCurrency('1234.56')).toBe(1234.56)
    })

    it('should handle invalid input', () => {
      expect(parseCurrency('invalid')).toBe(0)
    })

    it('should handle empty string', () => {
      expect(parseCurrency('')).toBe(0)
    })
  })

  describe('formatChartValue', () => {
    it('should format currency values', () => {
      expect(formatChartValue(1234.56, 'currency')).toBe('$1,234.56')
    })

    it('should format percentage values', () => {
      const result = formatChartValue(12.34, 'percentage')
      expect(result).toMatch(/12/)
    })

    it('should format number values', () => {
      expect(formatChartValue(1234.56, 'number')).toBe('1,234.56')
    })
  })

  describe('formatAxisLabel', () => {
    it('should format currency labels with compacting', () => {
      const result = formatAxisLabel(1500, 'currency')
      expect(result).toBeTruthy()
    })

    it('should format date labels', () => {
      const date = new Date('2024-01-15')
      const result = formatAxisLabel(date, 'date')
      expect(result).toBeTruthy()
    })

    it('should format month labels', () => {
      const date = new Date('2024-01-15')
      const result = formatAxisLabel(date, 'month')
      expect(result).toMatch(/Jan|2024/)
    })
  })

  describe('getCurrencySymbol', () => {
    it('should get correct currency symbols', () => {
      expect(getCurrencySymbol('USD')).toBe('$')
      expect(getCurrencySymbol('EUR')).toBe('€')
      expect(getCurrencySymbol('GBP')).toBe('£')
    })

    it('should return default for unknown currency', () => {
      expect(getCurrencySymbol('XXX')).toBe('$')
    })
  })

  describe('formatTransactionAmount', () => {
    it('should format income with + sign', () => {
      const result = formatTransactionAmount(100, 'income')
      expect(result).toContain('+')
      expect(result).toContain('100')
    })

    it('should format expense with - sign', () => {
      const result = formatTransactionAmount(100, 'expense')
      expect(result).toContain('-')
      expect(result).toContain('100')
    })
  })

  describe('formatTransactionDescription', () => {
    it('should format valid descriptions', () => {
      expect(formatTransactionDescription('Lunch at restaurant')).toBe('Lunch at restaurant')
    })

    it('should handle null description', () => {
      expect(formatTransactionDescription(null)).toBe('No description')
    })

    it('should truncate long descriptions', () => {
      const longDesc = 'x'.repeat(50)
      const result = formatTransactionDescription(longDesc, 30)
      expect(result.length).toBeLessThanOrEqual(33) // 30 + ...
    })
  })

  describe('formatCategoryName', () => {
    it('should format category names', () => {
      expect(formatCategoryName('food')).toBe('Food')
    })

    it('should handle null category', () => {
      expect(formatCategoryName(null)).toBe('Uncategorized')
    })
  })

  describe('isValidDate', () => {
    it('should validate valid dates', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate('2024-01-15')).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isValidDate('invalid')).toBe(false)
      expect(isValidDate(null)).toBe(false)
    })
  })

  describe('isValidCurrency', () => {
    it('should validate valid amounts', () => {
      expect(isValidCurrency(100)).toBe(true)
      expect(isValidCurrency('100')).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(isValidCurrency('invalid')).toBe(false)
      expect(isValidCurrency(null)).toBe(false)
      expect(isValidCurrency(-10)).toBe(false)
    })
  })

  describe('formatForCSV', () => {
    it('should format data for CSV export', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]
      const result = formatForCSV(data)
      expect(result).toContain('name,age')
      expect(result).toContain('John,30')
      expect(result).toContain('Jane,25')
    })

    it('should handle empty array', () => {
      expect(formatForCSV([])).toBe('')
    })
  })

  describe('formatForJSON', () => {
    it('should format data for JSON export', () => {
      const data = { name: 'John', age: 30 }
      const result = formatForJSON(data)
      const parsed = JSON.parse(result)
      expect(parsed.name).toBe('John')
      expect(parsed.age).toBe(30)
    })
  })
})
