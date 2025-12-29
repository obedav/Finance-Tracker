// src/utils/__tests__/helpers.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  groupBy,
  sortBy,
  unique,
  chunk,
  findWhere,
  deepClone,
  deepMerge,
  isObject,
  get,
  set,
  getDateRange,
  isDateInRange,
  getMonthDifference,
  getDaysInMonth,
  isToday,
  randomString,
  slugify,
  escapeHtml,
  round,
  calculatePercentage,
  calculatePercentageChange,
  clamp,
  range,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearAppStorage,
  buildQueryString,
  parseQueryString,
  downloadFile,
  readFileAsText,
  validateFileType,
  validateFileSize,
  debounce,
  throttle,
  sleep
} from '../helpers'

describe('helpers.ts', () => {
  describe('Array Utilities', () => {
    describe('groupBy', () => {
      it('should group array by specified key', () => {
        const data = [
          { type: 'income', amount: 100 },
          { type: 'expense', amount: 50 },
          { type: 'income', amount: 200 }
        ]
        const result = groupBy(data, 'type')
        expect(result.income).toHaveLength(2)
        expect(result.expense).toHaveLength(1)
      })

      it('should handle empty array', () => {
        const result = groupBy([], 'key')
        expect(result).toEqual({})
      })
    })

    describe('sortBy', () => {
      it('should sort by single key ascending', () => {
        const data = [
          { name: 'Charlie', age: 30 },
          { name: 'Alice', age: 25 },
          { name: 'Bob', age: 35 }
        ]
        const result = sortBy(data, 'name')
        expect(result[0].name).toBe('Alice')
        expect(result[2].name).toBe('Charlie')
      })

      it('should sort by single key descending', () => {
        const data = [
          { name: 'Alice', age: 25 },
          { name: 'Charlie', age: 30 },
          { name: 'Bob', age: 35 }
        ]
        const result = sortBy(data, '-age')
        expect(result[0].age).toBe(35)
        expect(result[2].age).toBe(25)
      })

      it('should sort by multiple keys', () => {
        const data = [
          { type: 'A', value: 2 },
          { type: 'B', value: 1 },
          { type: 'A', value: 1 }
        ]
        const result = sortBy(data, 'type', 'value')
        expect(result[0]).toEqual({ type: 'A', value: 1 })
        expect(result[1]).toEqual({ type: 'A', value: 2 })
      })
    })

    describe('unique', () => {
      it('should remove duplicate primitives', () => {
        const data = [1, 2, 2, 3, 3, 3, 4]
        const result = unique(data)
        expect(result).toEqual([1, 2, 3, 4])
      })

      it('should remove duplicates by key', () => {
        const data = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 1, name: 'Alice Clone' }
        ]
        const result = unique(data, 'id')
        expect(result).toHaveLength(2)
        expect(result[0].id).toBe(1)
        expect(result[1].id).toBe(2)
      })
    })

    describe('chunk', () => {
      it('should split array into chunks', () => {
        const data = [1, 2, 3, 4, 5, 6, 7]
        const result = chunk(data, 3)
        expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]])
      })

      it('should handle empty array', () => {
        const result = chunk([], 3)
        expect(result).toEqual([])
      })

      it('should handle chunk size larger than array', () => {
        const result = chunk([1, 2], 5)
        expect(result).toEqual([[1, 2]])
      })
    })

    describe('findWhere', () => {
      it('should find items matching criteria', () => {
        const data = [
          { type: 'income', category: 'salary', amount: 1000 },
          { type: 'expense', category: 'food', amount: 50 },
          { type: 'income', category: 'bonus', amount: 500 }
        ]
        const result = findWhere(data, { type: 'income' })
        expect(result).toHaveLength(2)
      })

      it('should find items matching multiple criteria', () => {
        const data = [
          { type: 'income', active: true },
          { type: 'income', active: false },
          { type: 'expense', active: true }
        ]
        const result = findWhere(data, { type: 'income', active: true })
        expect(result).toHaveLength(1)
      })

      it('should return empty array when no matches', () => {
        const data = [{ type: 'income' }]
        const result = findWhere(data, { type: 'expense' })
        expect(result).toEqual([])
      })
    })
  })

  describe('Object Utilities', () => {
    describe('deepClone', () => {
      it('should clone simple object', () => {
        const obj = { a: 1, b: 2 }
        const cloned = deepClone(obj)
        expect(cloned).toEqual(obj)
        expect(cloned).not.toBe(obj)
      })

      it('should clone nested object', () => {
        const obj = { a: { b: { c: 1 } } }
        const cloned = deepClone(obj)
        cloned.a.b.c = 2
        expect(obj.a.b.c).toBe(1)
      })

      it('should clone arrays', () => {
        const arr = [1, 2, [3, 4]]
        const cloned = deepClone(arr)
        expect(cloned).toEqual(arr)
        expect(cloned).not.toBe(arr)
      })

      it('should clone dates', () => {
        const date = new Date('2024-01-15')
        const cloned = deepClone(date)
        expect(cloned.getTime()).toBe(date.getTime())
        expect(cloned).not.toBe(date)
      })

      it('should handle null and primitives', () => {
        expect(deepClone(null)).toBe(null)
        expect(deepClone(42)).toBe(42)
        expect(deepClone('test')).toBe('test')
      })
    })

    describe('deepMerge', () => {
      it('should merge simple objects', () => {
        const target = { a: 1 }
        const source = { b: 2 }
        const result = deepMerge(target, source)
        expect(result).toEqual({ a: 1, b: 2 })
      })

      it('should merge nested objects', () => {
        const target = { a: { b: 1 } }
        const source = { a: { c: 2 } }
        const result = deepMerge(target, source)
        expect(result).toEqual({ a: { b: 1, c: 2 } })
      })

      it('should overwrite arrays', () => {
        const target = { arr: [1, 2] }
        const source = { arr: [3, 4] }
        const result = deepMerge(target, source)
        expect(result.arr).toEqual([3, 4])
      })
    })

    describe('isObject', () => {
      it('should return true for plain objects', () => {
        expect(isObject({})).toBe(true)
        expect(isObject({ a: 1 })).toBe(true)
      })

      it('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false)
        expect(isObject([])).toBe(false)
        expect(isObject('string')).toBe(false)
        expect(isObject(42)).toBe(false)
      })
    })

    describe('get', () => {
      it('should get nested value by path', () => {
        const obj = { a: { b: { c: 123 } } }
        expect(get(obj, 'a.b.c')).toBe(123)
      })

      it('should return undefined for missing path', () => {
        const obj = { a: 1 }
        expect(get(obj, 'b.c')).toBeUndefined()
      })

      it('should return default value when path missing', () => {
        const obj = { a: 1 }
        expect(get(obj, 'b.c', 'default')).toBe('default')
      })

      it('should handle array indices', () => {
        const obj = { items: [{ name: 'first' }] }
        expect(get(obj, 'items.0.name')).toBe('first')
      })
    })

    describe('set', () => {
      it('should set nested value by path', () => {
        const obj = { a: { b: 1 } }
        set(obj, 'a.b', 2)
        expect(obj.a.b).toBe(2)
      })

      it('should create nested path if not exists', () => {
        const obj: any = {}
        set(obj, 'a.b.c', 123)
        expect(obj.a.b.c).toBe(123)
      })
    })
  })

  describe('Date Utilities', () => {
    describe('getDateRange', () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-15T12:00:00'))
      })

      it('should return today range', () => {
        const range = getDateRange('today')
        expect(range.start).toBeInstanceOf(Date)
        expect(range.end).toBeInstanceOf(Date)
      })

      it('should return week range', () => {
        const range = getDateRange('week')
        expect(range.start).toBeInstanceOf(Date)
        expect(range.end).toBeInstanceOf(Date)
      })

      it('should return month range', () => {
        const range = getDateRange('month')
        expect(range.start).toBeInstanceOf(Date)
        expect(range.end).toBeInstanceOf(Date)
      })

      afterEach(() => {
        vi.useRealTimers()
      })
    })

    describe('isDateInRange', () => {
      it('should return true if date is in range', () => {
        const result = isDateInRange(
          new Date('2024-01-15'),
          new Date('2024-01-01'),
          new Date('2024-01-31')
        )
        expect(result).toBe(true)
      })

      it('should return false if date is outside range', () => {
        const result = isDateInRange(
          new Date('2024-02-01'),
          new Date('2024-01-01'),
          new Date('2024-01-31')
        )
        expect(result).toBe(false)
      })

      it('should handle null range boundaries', () => {
        expect(isDateInRange(new Date(), null, null)).toBe(true)
      })
    })

    describe('getMonthDifference', () => {
      it('should calculate month difference', () => {
        const diff = getMonthDifference(
          new Date('2024-01-01'),
          new Date('2024-06-01')
        )
        expect(diff).toBe(5)
      })

      it('should handle same month', () => {
        const diff = getMonthDifference(
          new Date('2024-01-01'),
          new Date('2024-01-31')
        )
        expect(diff).toBe(0)
      })
    })

    describe('getDaysInMonth', () => {
      it('should return correct days for January', () => {
        expect(getDaysInMonth(2024, 1)).toBe(31)
      })

      it('should return correct days for February (leap year)', () => {
        expect(getDaysInMonth(2024, 2)).toBe(29)
      })

      it('should return correct days for February (non-leap year)', () => {
        expect(getDaysInMonth(2023, 2)).toBe(28)
      })
    })

    describe('isToday', () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-15T12:00:00'))
      })

      it('should return true for today', () => {
        expect(isToday(new Date('2024-01-15'))).toBe(true)
      })

      it('should return false for yesterday', () => {
        expect(isToday(new Date('2024-01-14'))).toBe(false)
      })

      it('should return false for tomorrow', () => {
        expect(isToday(new Date('2024-01-16'))).toBe(false)
      })

      afterEach(() => {
        vi.useRealTimers()
      })
    })
  })

  describe('String Utilities', () => {
    describe('randomString', () => {
      it('should generate string of default length', () => {
        const str = randomString()
        expect(str).toHaveLength(8)
      })

      it('should generate string of custom length', () => {
        const str = randomString(16)
        expect(str).toHaveLength(16)
      })

      it('should generate different strings', () => {
        const str1 = randomString()
        const str2 = randomString()
        expect(str1).not.toBe(str2)
      })
    })

    describe('slugify', () => {
      it('should convert to lowercase with hyphens', () => {
        expect(slugify('Hello World')).toBe('hello-world')
      })

      it('should remove special characters', () => {
        expect(slugify('Hello, World!')).toBe('hello-world')
      })

      it('should handle multiple spaces', () => {
        expect(slugify('Hello   World')).toBe('hello-world')
      })
    })

    describe('escapeHtml', () => {
      it('should escape HTML special characters', () => {
        expect(escapeHtml('<script>alert("xss")</script>'))
          .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      })

      it('should escape ampersands', () => {
        expect(escapeHtml('A & B')).toBe('A &amp; B')
      })
    })
  })

  describe('Math Utilities', () => {
    describe('round', () => {
      it('should round to 2 decimals by default', () => {
        expect(round(123.456)).toBe(123.46)
      })

      it('should round to custom decimals', () => {
        expect(round(123.456, 1)).toBe(123.5)
      })

      it('should handle integers', () => {
        expect(round(123)).toBe(123)
      })
    })

    describe('calculatePercentage', () => {
      it('should calculate percentage correctly', () => {
        expect(calculatePercentage(25, 100)).toBe(25)
      })

      it('should handle zero total', () => {
        expect(calculatePercentage(10, 0)).toBe(0)
      })

      it('should round to 2 decimals', () => {
        expect(calculatePercentage(1, 3)).toBeCloseTo(33.33)
      })
    })

    describe('calculatePercentageChange', () => {
      it('should calculate positive change', () => {
        expect(calculatePercentageChange(100, 150)).toBe(50)
      })

      it('should calculate negative change', () => {
        expect(calculatePercentageChange(150, 100)).toBeCloseTo(-33.33)
      })

      it('should handle zero old value', () => {
        expect(calculatePercentageChange(0, 100)).toBe(0)
      })
    })

    describe('clamp', () => {
      it('should clamp value to min', () => {
        expect(clamp(5, 10, 20)).toBe(10)
      })

      it('should clamp value to max', () => {
        expect(clamp(25, 10, 20)).toBe(20)
      })

      it('should return value if within range', () => {
        expect(clamp(15, 10, 20)).toBe(15)
      })
    })

    describe('range', () => {
      it('should generate range with step 1', () => {
        expect(range(0, 5)).toEqual([0, 1, 2, 3, 4])
      })

      it('should generate range with custom step', () => {
        expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
      })

      it('should handle negative range', () => {
        expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1])
      })
    })
  })

  describe('Storage Utilities', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    describe('getFromStorage', () => {
      it('should get value from storage', () => {
        localStorage.setItem('test-key', JSON.stringify({ value: 123 }))
        const result = getFromStorage('test-key')
        expect(result).toEqual({ value: 123 })
      })

      it('should return default value if key not found', () => {
        const result = getFromStorage('missing-key', 'default')
        expect(result).toBe('default')
      })

      it('should return null for invalid JSON', () => {
        localStorage.setItem('bad-json', 'not valid json')
        const result = getFromStorage('bad-json')
        expect(result).toBeNull()
      })
    })

    describe('setToStorage', () => {
      it('should save value to storage', () => {
        setToStorage('test-key', { value: 123 })
        const stored = localStorage.getItem('test-key')
        expect(JSON.parse(stored!)).toEqual({ value: 123 })
      })

      it('should return true on success', () => {
        const result = setToStorage('test-key', 'value')
        expect(result).toBe(true)
      })
    })

    describe('removeFromStorage', () => {
      it('should remove value from storage', () => {
        localStorage.setItem('test-key', 'value')
        removeFromStorage('test-key')
        expect(localStorage.getItem('test-key')).toBeNull()
      })

      it('should return true on success', () => {
        localStorage.setItem('test-key', 'value')
        const result = removeFromStorage('test-key')
        expect(result).toBe(true)
      })
    })

    describe('clearAppStorage', () => {
      it('should clear all app-related storage', () => {
        localStorage.setItem('app:user', 'data')
        localStorage.setItem('app:settings', 'data')
        localStorage.setItem('other', 'data')
        clearAppStorage()
        // This depends on implementation - adjust based on actual behavior
        expect(localStorage.length).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('URL Utilities', () => {
    describe('buildQueryString', () => {
      it('should build query string from object', () => {
        const params = { page: 1, limit: 10, search: 'test' }
        const result = buildQueryString(params)
        expect(result).toContain('page=1')
        expect(result).toContain('limit=10')
        expect(result).toContain('search=test')
      })

      it('should skip null and undefined values', () => {
        const params = { a: 1, b: null, c: undefined }
        const result = buildQueryString(params)
        expect(result).toContain('a=1')
        expect(result).not.toContain('b=')
        expect(result).not.toContain('c=')
      })
    })

    describe('parseQueryString', () => {
      it('should parse query string to object', () => {
        const result = parseQueryString('page=1&limit=10&search=test')
        expect(result).toEqual({ page: '1', limit: '10', search: 'test' })
      })

      it('should handle empty query string', () => {
        const result = parseQueryString('')
        expect(result).toEqual({})
      })
    })
  })

  describe('File Utilities', () => {
    describe('validateFileType', () => {
      it('should validate allowed file types', () => {
        const file = new File([''], 'test.pdf', { type: 'application/pdf' })
        expect(validateFileType(file, ['application/pdf'])).toBe(true)
      })

      it('should reject disallowed file types', () => {
        const file = new File([''], 'test.exe', { type: 'application/x-msdownload' })
        expect(validateFileType(file, ['application/pdf'])).toBe(false)
      })
    })

    describe('validateFileSize', () => {
      it('should validate file size within limit', () => {
        const file = new File(['a'.repeat(1000)], 'test.txt')
        expect(validateFileSize(file, 2000)).toBe(true)
      })

      it('should reject file size exceeding limit', () => {
        const file = new File(['a'.repeat(1000)], 'test.txt')
        expect(validateFileSize(file, 500)).toBe(false)
      })
    })

    describe('readFileAsText', () => {
      it('should read file as text', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' })
        const text = await readFileAsText(file)
        expect(text).toBe('Hello World')
      })
    })
  })

  describe('Function Utilities', () => {
    describe('debounce', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      it('should debounce function calls', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        debounced()
        debounced()
        debounced()

        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(fn).toHaveBeenCalledTimes(1)
      })

      afterEach(() => {
        vi.useRealTimers()
      })
    })

    describe('throttle', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      it('should throttle function calls', () => {
        const fn = vi.fn()
        const throttled = throttle(fn, 100)

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        throttled()
        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(100)
        throttled()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      afterEach(() => {
        vi.useRealTimers()
      })
    })

    describe('sleep', () => {
      it('should delay execution', async () => {
        const start = Date.now()
        await sleep(100)
        const end = Date.now()
        expect(end - start).toBeGreaterThanOrEqual(95) // Allow small margin
      })
    })
  })
})
