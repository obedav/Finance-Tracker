// src/utils/__tests__/formatters.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  formatFileSize,
  formatDuration,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  slugify,
  formatPhoneNumber,
  formatCreditCard,
  parseFormattedCurrency,
  formatChartValue,
  formatChartLabel,
  formatChartTooltip
} from '../formatters'

describe('formatters.ts', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
    })

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR', 'de-DE')).toBe('1.234,56 €')
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
      expect(result).toMatch(/Jan/)
      expect(result).toMatch(/15/)
      expect(result).toMatch(/2024/)
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
      expect(formatDate('invalid')).toBe('Invalid Date')
    })

    it('should handle null date', () => {
      expect(formatDate(null as any)).toBe('Invalid Date')
    })

    it('should use custom locale', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date, 'short', 'de-DE')
      expect(result).toMatch(/15/)
      expect(result).toMatch(/1/)
      expect(result).toMatch(/24/)
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
      expect(formatDateTime('invalid')).toBe('Invalid Date')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00'))
    })

    it('should format time from a few seconds ago', () => {
      const date = new Date('2024-01-15T11:59:30')
      expect(formatRelativeTime(date)).toBe('just now')
    })

    it('should format time from minutes ago', () => {
      const date = new Date('2024-01-15T11:55:00')
      expect(formatRelativeTime(date)).toBe('5 minutes ago')
    })

    it('should format time from hours ago', () => {
      const date = new Date('2024-01-15T10:00:00')
      expect(formatRelativeTime(date)).toBe('2 hours ago')
    })

    it('should format time from days ago', () => {
      const date = new Date('2024-01-13T12:00:00')
      expect(formatRelativeTime(date)).toBe('2 days ago')
    })

    it('should format time from months ago', () => {
      const date = new Date('2023-11-15T12:00:00')
      expect(formatRelativeTime(date)).toBe('2 months ago')
    })

    it('should format time from years ago', () => {
      const date = new Date('2022-01-15T12:00:00')
      expect(formatRelativeTime(date)).toBe('2 years ago')
    })

    it('should handle future dates', () => {
      const date = new Date('2024-01-15T13:00:00')
      expect(formatRelativeTime(date)).toBe('in 1 hour')
    })

    afterEach(() => {
      vi.useRealTimers()
    })
  })

  describe('formatNumber', () => {
    it('should format number with default locale', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89')
    })

    it('should format number with custom locale', () => {
      expect(formatNumber(1234567.89, 'de-DE')).toBe('1.234.567,89')
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
      expect(formatPercentage(0.1234)).toBe('12.34%')
    })

    it('should format 100%', () => {
      expect(formatPercentage(1)).toBe('100.00%')
    })

    it('should format 0%', () => {
      expect(formatPercentage(0)).toBe('0.00%')
    })

    it('should handle negative percentages', () => {
      expect(formatPercentage(-0.15)).toBe('-15.00%')
    })

    it('should respect custom decimal places', () => {
      expect(formatPercentage(0.12345, 'en-US', 1)).toBe('12.3%')
    })
  })

  describe('formatCompactNumber', () => {
    it('should format small numbers without notation', () => {
      expect(formatCompactNumber(999)).toBe('999')
    })

    it('should format thousands with K', () => {
      expect(formatCompactNumber(1500)).toMatch(/1\.5K|1.5K/)
    })

    it('should format millions with M', () => {
      expect(formatCompactNumber(1500000)).toMatch(/1\.5M|1.5M/)
    })

    it('should format billions with B', () => {
      expect(formatCompactNumber(1500000000)).toMatch(/1\.5B|1.5B/)
    })

    it('should handle zero', () => {
      expect(formatCompactNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      const result = formatCompactNumber(-1500)
      expect(result).toMatch(/-1\.5K|-1.5K/)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B')
    })

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB')
    })

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1.00 MB')
    })

    it('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1.00 GB')
    })

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 B')
    })

    it('should handle custom decimal places', () => {
      expect(formatFileSize(1536, 1)).toBe('1.5 KB')
    })
  })

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(45)).toBe('0:45')
    })

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05')
    })

    it('should format hours, minutes, and seconds', () => {
      expect(formatDuration(3665)).toBe('1:01:05')
    })

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0:00')
    })
  })

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })

    it('should truncate long text with default ellipsis', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...')
    })

    it('should truncate with custom ellipsis', () => {
      expect(truncateText('Hello World', 8, '---')).toBe('Hello---')
    })

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle exact length match', () => {
      expect(truncateText('Hello', 5)).toBe('Hello')
    })
  })

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
    })

    it('should handle already capitalized text', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalizeFirst('h')).toBe('H')
    })

    it('should not affect rest of string', () => {
      expect(capitalizeFirst('hELLO')).toBe('HELLO')
    })
  })

  describe('capitalizeWords', () => {
    it('should capitalize all words', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World')
    })

    it('should handle single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello')
    })

    it('should handle multiple spaces', () => {
      expect(capitalizeWords('hello  world')).toBe('Hello  World')
    })

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('')
    })
  })

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world')
    })

    it('should trim leading/trailing dashes', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world')
    })

    it('should handle numbers', () => {
      expect(slugify('Test 123')).toBe('test-123')
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
      expect(formatCreditCard('1234')).toBe('1234')
    })
  })

  describe('parseFormattedCurrency', () => {
    it('should parse USD formatted currency', () => {
      expect(parseFormattedCurrency('$1,234.56')).toBe(1234.56)
    })

    it('should parse negative amounts', () => {
      expect(parseFormattedCurrency('-$1,234.56')).toBe(-1234.56)
    })

    it('should parse number without formatting', () => {
      expect(parseFormattedCurrency('1234.56')).toBe(1234.56)
    })

    it('should handle invalid input', () => {
      expect(parseFormattedCurrency('invalid')).toBe(0)
    })

    it('should handle empty string', () => {
      expect(parseFormattedCurrency('')).toBe(0)
    })
  })

  describe('formatChartValue', () => {
    it('should format currency values', () => {
      expect(formatChartValue(1234.56, 'currency')).toBe('$1,234.56')
    })

    it('should format percentage values', () => {
      expect(formatChartValue(0.1234, 'percentage')).toBe('12.34%')
    })

    it('should format number values', () => {
      expect(formatChartValue(1234.56, 'number')).toBe('1,234.56')
    })
  })

  describe('formatChartLabel', () => {
    it('should format month labels', () => {
      const date = new Date('2024-01-15')
      expect(formatChartLabel(date, 'month')).toMatch(/Jan/)
    })

    it('should format day labels', () => {
      const date = new Date('2024-01-15')
      const result = formatChartLabel(date, 'day')
      expect(result).toMatch(/15/)
    })

    it('should format year labels', () => {
      const date = new Date('2024-01-15')
      expect(formatChartLabel(date, 'year')).toBe('2024')
    })

    it('should handle string dates', () => {
      expect(formatChartLabel('2024-01-15', 'month')).toMatch(/Jan/)
    })
  })

  describe('formatChartTooltip', () => {
    it('should format tooltip with label and currency value', () => {
      const result = formatChartTooltip('January', 1234.56, 'currency')
      expect(result).toContain('January')
      expect(result).toContain('$1,234.56')
    })

    it('should format tooltip with percentage', () => {
      const result = formatChartTooltip('Savings', 0.25, 'percentage')
      expect(result).toContain('Savings')
      expect(result).toContain('25.00%')
    })

    it('should format tooltip with number', () => {
      const result = formatChartTooltip('Count', 42, 'number')
      expect(result).toContain('Count')
      expect(result).toContain('42')
    })
  })
})
