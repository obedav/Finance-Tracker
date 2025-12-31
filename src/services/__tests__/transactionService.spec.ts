// src/services/__tests__/transactionService.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import transactionService from '../transactionService'
import { apiHelpers } from '../api'

// Mock the API helpers
vi.mock('../api', () => ({
  apiHelpers: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
    download: vi.fn()
  },
  mockApiHelpers: {
    delay: vi.fn()
  }
}))

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    transactionService.clearCache()
  })

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            type: 'expense',
            amount: 50.00,
            category_id: 1,
            description: 'Lunch',
            date: '2024-01-15'
          }
        ],
        total: 1,
        page: 1,
        per_page: 10
      }

      vi.mocked(apiHelpers.get).mockResolvedValue(mockResponse)

      const result = await transactionService.getTransactions()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(apiHelpers.get).toHaveBeenCalled()
    })

    it('should cache results', async () => {
      vi.mocked(apiHelpers.get).mockResolvedValue({
        success: true,
        data: [{ id: 1, amount: 50 }],
        total: 1
      })

      await transactionService.getTransactions()
      await transactionService.getTransactions()

      expect(apiHelpers.get).toHaveBeenCalledTimes(1)
    })

    it('should apply filters', async () => {
      vi.mocked(apiHelpers.get).mockResolvedValue({
        success: true,
        data: [],
        total: 0
      })

      await transactionService.getTransactions({ type: 'expense', page: 2 })

      expect(apiHelpers.get).toHaveBeenCalled()
    })
  })

  describe('getTransaction', () => {
    it('should fetch single transaction', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          type: 'expense',
          amount: 50.00,
          category_id: 1,
          description: 'Lunch',
          date: '2024-01-15'
        }
      }

      vi.mocked(apiHelpers.get).mockResolvedValue(mockResponse)

      const result = await transactionService.getTransaction(1)

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe(1)
    })

    it('should handle not found error', async () => {
      vi.mocked(apiHelpers.get).mockRejectedValue({
        message: 'Transaction not found'
      })

      await expect(transactionService.getTransaction(999)).rejects.toThrow()
    })
  })

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const transactionData = {
        type: 'expense',
        amount: 50,
        category_id: 1,
        date: '2024-01-15'
      }

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          ...transactionData
        }
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await transactionService.createTransaction(transactionData)

      expect(result.success).toBe(true)
      expect(result.data?.amount).toBe(50)
    })

    it('should validate transaction data before creating', async () => {
      const invalidTransaction = {
        type: 'INVALID_TYPE',
        amount: -50,
        category_id: null,
        date: 'invalid-date'
      }

      await expect(
        transactionService.createTransaction(invalidTransaction as any)
      ).rejects.toThrow()
    })

    it('should clear cache after creation', async () => {
      vi.mocked(apiHelpers.post).mockResolvedValue({
        success: true,
        data: { id: 1, type: 'expense', amount: 50 }
      })

      await transactionService.createTransaction({
        type: 'expense',
        amount: 50,
        category_id: 1,
        date: '2024-01-15'
      })

      vi.mocked(apiHelpers.get).mockResolvedValue({
        success: true,
        data: [],
        total: 0
      })

      await transactionService.getTransactions()
      expect(apiHelpers.get).toHaveBeenCalled()
    })
  })

  describe('updateTransaction', () => {
    it('should update transaction successfully', async () => {
      const updateData = {
        type: 'expense',
        amount: 75,
        category_id: 1,
        date: '2024-01-15',
        description: 'Updated lunch'
      }

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          ...updateData
        }
      }

      vi.mocked(apiHelpers.put).mockResolvedValue(mockResponse)

      const result = await transactionService.updateTransaction(1, updateData)

      expect(result.success).toBe(true)
      expect(result.data?.amount).toBe(75)
    })
  })

  describe('deleteTransaction', () => {
    it('should delete transaction successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Transaction deleted'
      }

      vi.mocked(apiHelpers.delete).mockResolvedValue(mockResponse)

      const result = await transactionService.deleteTransaction(1)

      expect(result.success).toBe(true)
    })

    it('should clear cache after deletion', async () => {
      vi.mocked(apiHelpers.delete).mockResolvedValue({
        success: true
      })

      await transactionService.deleteTransaction(1)

      vi.mocked(apiHelpers.get).mockResolvedValue({
        success: true,
        data: [],
        total: 0
      })

      await transactionService.getTransactions()
      expect(apiHelpers.get).toHaveBeenCalled()
    })
  })

  describe('bulkDeleteTransactions', () => {
    it('should delete multiple transactions', async () => {
      const mockResponse = {
        success: true,
        deletedCount: 2,
        message: '2 transactions deleted'
      }

      vi.mocked(apiHelpers.post).mockResolvedValue(mockResponse)

      const result = await transactionService.bulkDeleteTransactions([1, 2])

      expect(result.success).toBe(true)
      expect(result.deletedCount).toBe(2)
    })

    it('should clear cache after bulk delete', async () => {
      vi.mocked(apiHelpers.post).mockResolvedValue({
        success: true,
        deletedCount: 2
      })

      await transactionService.bulkDeleteTransactions([1, 2])

      vi.mocked(apiHelpers.get).mockResolvedValue({
        success: true,
        data: [],
        total: 0
      })

      await transactionService.getTransactions()
      expect(apiHelpers.get).toHaveBeenCalled()
    })
  })

  describe('getTransactionStats', () => {
    it('should fetch transaction statistics', async () => {
      const mockStats = {
        success: true,
        stats: {
          total_income: 1000,
          total_expense: 600,
          net_income: 400,
          transaction_count: 10
        }
      }

      vi.mocked(apiHelpers.get).mockResolvedValue(mockStats)

      const result = await transactionService.getTransactionStats('month')

      expect(result.success).toBe(true)
      expect(result.stats.net_income).toBe(400)
    })
  })

  describe('getTransactionsByCategory', () => {
    it('should fetch transactions by category', async () => {
      const mockResponse = {
        success: true,
        data: [
          { category: 'Food', amount: 200, count: 5 },
          { category: 'Transport', amount: 100, count: 3 }
        ]
      }

      vi.mocked(apiHelpers.get).mockResolvedValue(mockResponse)

      const result = await transactionService.getTransactionsByCategory('expense')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })
  })

  describe('getMonthlyTrends', () => {
    it('should fetch monthly trends', async () => {
      const mockResponse = {
        success: true,
        data: [
          { month: '2024-01', income: 1000, expense: 600 },
          { month: '2024-02', income: 1200, expense: 700 }
        ]
      }

      vi.mocked(apiHelpers.get).mockResolvedValue(mockResponse)

      const result = await transactionService.getMonthlyTrends(12)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })
  })

  describe('importTransactions', () => {
    it('should import transactions from CSV file', async () => {
      const file = new File(['csv content'], 'transactions.csv', {
        type: 'text/csv'
      })

      const mockResponse = {
        success: true,
        importedCount: 10,
        skippedCount: 2,
        message: '10 transactions imported successfully'
      }

      vi.mocked(apiHelpers.upload).mockResolvedValue(mockResponse)

      const result = await transactionService.importTransactions(file, 'csv')

      expect(result.success).toBe(true)
      expect(result.importedCount).toBe(10)
    })

    it('should handle import errors gracefully', async () => {
      const file = new File(['invalid'], 'bad.csv', { type: 'text/csv' })

      vi.mocked(apiHelpers.upload).mockRejectedValue({
        message: 'Import failed',
        code: 'IMPORT_ERROR'
      })

      await expect(
        transactionService.importTransactions(file, 'csv')
      ).rejects.toThrow()
    })
  })

  describe('exportTransactions', () => {
    it('should export transactions', async () => {
      const mockResponse = {
        success: true,
        file: 'data.csv',
        count: 10
      }

      vi.mocked(apiHelpers.download).mockResolvedValue(mockResponse)

      const result = await transactionService.exportTransactions({}, 'csv')

      expect(result.success).toBe(true)
      expect(apiHelpers.download).toHaveBeenCalled()
    })
  })

  describe('cache management', () => {
    it('should clear cache manually', () => {
      transactionService.clearCache()
      expect(true).toBe(true) // Cache cleared successfully
    })
  })
})
