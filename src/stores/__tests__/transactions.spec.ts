/**
 * Transaction Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from '../transactions'
import transactionService from '@/services/transactionService.js'

// Mock transactionService
vi.mock('@/services/transactionService.js', () => ({
  default: {
    getTransactions: vi.fn(),
    createTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    bulkDeleteTransactions: vi.fn(),
    importTransactions: vi.fn(),
    exportTransactions: vi.fn()
  }
}))

describe('Transaction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State', () => {
    it('should have initial state', () => {
      const store = useTransactionStore()

      expect(store.transactions).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.filters).toEqual({
        type: '',
        category: '',
        dateRange: { start: null, end: null },
        search: '',
        minAmount: null,
        maxAmount: null
      })
    })
  })

  describe('Getters', () => {
    it('should calculate total income', () => {
      const store = useTransactionStore()
      store.transactions = [
        { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' },
        { id: 2, type: 'income', amount: 500, description: 'Bonus', transaction_date: '2025-01-02', user_id: 1, category_id: 1, created_at: '2025-01-02', updated_at: '2025-01-02' },
        { id: 3, type: 'expense', amount: 200, description: 'Groceries', transaction_date: '2025-01-03', user_id: 1, category_id: 2, created_at: '2025-01-03', updated_at: '2025-01-03' }
      ]

      expect(store.totalIncome).toBe(1500)
    })

    it('should calculate total expenses', () => {
      const store = useTransactionStore()
      store.transactions = [
        { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' },
        { id: 2, type: 'expense', amount: 200, description: 'Groceries', transaction_date: '2025-01-02', user_id: 1, category_id: 2, created_at: '2025-01-02', updated_at: '2025-01-02' },
        { id: 3, type: 'expense', amount: 100, description: 'Transport', transaction_date: '2025-01-03', user_id: 1, category_id: 3, created_at: '2025-01-03', updated_at: '2025-01-03' }
      ]

      expect(store.totalExpenses).toBe(300)
    })

    it('should calculate balance', () => {
      const store = useTransactionStore()
      store.transactions = [
        { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' },
        { id: 2, type: 'expense', amount: 300, description: 'Rent', transaction_date: '2025-01-02', user_id: 1, category_id: 2, created_at: '2025-01-02', updated_at: '2025-01-02' }
      ]

      expect(store.balance).toBe(700)
    })

    it('should return recent transactions sorted by date', () => {
      const store = useTransactionStore()
      store.transactions = [
        { id: 1, type: 'income', amount: 100, description: 'Old', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' },
        { id: 2, type: 'expense', amount: 200, description: 'Recent', transaction_date: '2025-01-15', user_id: 1, category_id: 2, created_at: '2025-01-15', updated_at: '2025-01-15' },
        { id: 3, type: 'income', amount: 300, description: 'Newest', transaction_date: '2025-01-20', user_id: 1, category_id: 1, created_at: '2025-01-20', updated_at: '2025-01-20' }
      ]

      const recent = store.recentTransactions

      expect(recent[0].id).toBe(3)
      expect(recent[1].id).toBe(2)
      expect(recent[2].id).toBe(1)
    })
  })

  describe('Actions', () => {
    describe('fetchTransactions', () => {
      it('should fetch transactions successfully', async () => {
        const store = useTransactionStore()
        const mockTransactions = [
          { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' }
        ]

        vi.mocked(transactionService.getTransactions).mockResolvedValue({
          success: true,
          data: mockTransactions
        } as any)

        const result = await store.fetchTransactions()

        expect(result.success).toBe(true)
        expect(store.transactions).toEqual(mockTransactions)
        expect(store.loading).toBe(false)
      })

      it('should handle fetch error', async () => {
        const store = useTransactionStore()

        vi.mocked(transactionService.getTransactions).mockRejectedValue(new Error('Network error'))

        const result = await store.fetchTransactions()

        expect(result.success).toBe(false)
        expect(store.error).toBe('Network error')
        expect(store.transactions).toEqual([])
      })
    })

    describe('addTransaction', () => {
      it('should add transaction successfully', async () => {
        const store = useTransactionStore()
        const newTransaction = {
          category_id: 1,
          type: 'income' as const,
          amount: 1000,
          description: 'Salary',
          transaction_date: '2025-01-01'
        }
        const mockResponse = {
          success: true,
          data: { id: 1, ...newTransaction, user_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' }
        }

        vi.mocked(transactionService.createTransaction).mockResolvedValue(mockResponse as any)

        const result = await store.addTransaction(newTransaction)

        expect(result.success).toBe(true)
        expect(store.transactions).toHaveLength(1)
        expect(store.transactions[0]).toEqual(mockResponse.data)
      })
    })

    describe('updateTransaction', () => {
      it('should update transaction successfully', async () => {
        const store = useTransactionStore()
        store.transactions = [
          { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' }
        ]

        const updatedData = { description: 'Updated Salary' }
        const mockResponse = {
          success: true,
          data: { ...store.transactions[0], ...updatedData }
        }

        vi.mocked(transactionService.updateTransaction).mockResolvedValue(mockResponse as any)

        const result = await store.updateTransaction(1, updatedData)

        expect(result.success).toBe(true)
        expect(store.transactions[0].description).toBe('Updated Salary')
      })
    })

    describe('deleteTransaction', () => {
      it('should delete transaction successfully', async () => {
        const store = useTransactionStore()
        store.transactions = [
          { id: 1, type: 'income', amount: 1000, description: 'Salary', transaction_date: '2025-01-01', user_id: 1, category_id: 1, created_at: '2025-01-01', updated_at: '2025-01-01' },
          { id: 2, type: 'expense', amount: 200, description: 'Groceries', transaction_date: '2025-01-02', user_id: 1, category_id: 2, created_at: '2025-01-02', updated_at: '2025-01-02' }
        ]

        vi.mocked(transactionService.deleteTransaction).mockResolvedValue({ success: true } as any)

        const result = await store.deleteTransaction(1)

        expect(result.success).toBe(true)
        expect(store.transactions).toHaveLength(1)
        expect(store.transactions[0].id).toBe(2)
      })
    })

    describe('updateFilters', () => {
      it('should update filters', () => {
        const store = useTransactionStore()

        store.updateFilters({ type: 'income', search: 'salary' })

        expect(store.filters.type).toBe('income')
        expect(store.filters.search).toBe('salary')
      })
    })

    describe('clearFilters', () => {
      it('should clear all filters', () => {
        const store = useTransactionStore()
        store.filters.type = 'income'
        store.filters.search = 'test'

        store.clearFilters()

        expect(store.filters.type).toBe('')
        expect(store.filters.search).toBe('')
        expect(store.filters.dateRange).toEqual({ start: null, end: null })
      })
    })
  })
})
