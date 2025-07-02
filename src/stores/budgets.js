// src/stores/budgets.js
import { defineStore } from 'pinia'

export const useBudgetStore = defineStore('budgets', {
  state: () => ({
    budgets: [
      // Sample data - replace with API calls
      {
        id: 1,
        name: 'Groceries',
        category: 'Food & Dining',
        amount: 800,
        period: 'monthly',
        color: '#10B981',
        startDate: new Date(2025, 5, 1).toISOString(),
        endDate: new Date(2025, 5, 30).toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Entertainment',
        category: 'Entertainment',
        amount: 300,
        period: 'monthly',
        color: '#8B5CF6',
        startDate: new Date(2025, 5, 1).toISOString(),
        endDate: new Date(2025, 5, 30).toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Transportation',
        category: 'Transportation',
        amount: 200,
        period: 'monthly',
        color: '#F59E0B',
        startDate: new Date(2025, 5, 1).toISOString(),
        endDate: new Date(2025, 5, 30).toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Shopping',
        category: 'Shopping',
        amount: 400,
        period: 'monthly',
        color: '#EF4444',
        startDate: new Date(2025, 5, 1).toISOString(),
        endDate: new Date(2025, 5, 30).toISOString(),
        created_at: new Date().toISOString()
      }
    ],
    isLoading: false,
    error: null,
    lastFetched: null
  }),

  getters: {
    // Get budget by ID
    getBudgetById: (state) => (id) => {
      return state.budgets.find(budget => budget.id === id)
    },

    // Get budgets by category
    getBudgetsByCategory: (state) => (category) => {
      return state.budgets.filter(budget => budget.category === category)
    },

    // Get budgets by period
    getBudgetsByPeriod: (state) => (period) => {
      return state.budgets.filter(budget => budget.period === period)
    },

    // Total budget amount
    totalBudgetAmount: (state) => {
      return state.budgets.reduce((total, budget) => total + (budget.amount || 0), 0)
    },

    // Get active budgets (current period)
    activeBudgets: (state) => {
      const now = new Date()
      return state.budgets.filter(budget => {
        const endDate = new Date(budget.endDate)
        return endDate >= now
      })
    },

    // Budget count by status
    budgetStats: (state) => {
      return {
        total: state.budgets.length,
        active: state.budgets.filter(b => new Date(b.endDate) >= new Date()).length,
        expired: state.budgets.filter(b => new Date(b.endDate) < new Date()).length
      }
    },

    // Check if data is stale (older than 5 minutes)
    isDataStale: (state) => {
      if (!state.lastFetched) return true
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return new Date(state.lastFetched) < fiveMinutesAgo
    }
  },

  actions: {
    // Fetch all budgets
    async fetchBudgets(force = false) {
      // Skip if data is fresh and not forced
      if (!force && !this.isDataStale) {
        console.log('Using cached budget data')
        return this.budgets
      }

      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API call
        // const response = await budgetService.getAllBudgets()
        // this.budgets = response.data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // For now, use the sample data already in state
        this.lastFetched = new Date().toISOString()
        console.log('Budgets loaded:', this.budgets.length)
        
        return this.budgets
      } catch (error) {
        this.error = error.message
        console.error('Error fetching budgets:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Create new budget
    async createBudget(budgetData) {
      this.isLoading = true
      this.error = null

      try {
        // Validate required fields
        if (!budgetData.name || !budgetData.category || !budgetData.amount) {
          throw new Error('Name, category, and amount are required')
        }

        if (budgetData.amount <= 0) {
          throw new Error('Budget amount must be greater than 0')
        }

        // Check for duplicate budget names
        const existingBudget = this.budgets.find(b => 
          b.name.toLowerCase() === budgetData.name.toLowerCase()
        )
        if (existingBudget) {
          throw new Error('A budget with this name already exists')
        }

        // TODO: Replace with actual API call
        // const response = await budgetService.createBudget(budgetData)
        // const newBudget = response.data

        // For now, create a mock budget
        const newBudget = {
          id: Date.now(), // Simple ID generation for demo
          name: budgetData.name.trim(),
          category: budgetData.category,
          amount: Number(budgetData.amount),
          period: budgetData.period || 'monthly',
          color: budgetData.color || '#10B981',
          startDate: budgetData.startDate || new Date().toISOString(),
          endDate: budgetData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        this.budgets.push(newBudget)
        console.log('Budget created:', newBudget.name)
        
        return newBudget
      } catch (error) {
        this.error = error.message
        console.error('Error creating budget:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Update existing budget
    async updateBudget(id, budgetData) {
      this.isLoading = true
      this.error = null

      try {
        // Find the budget
        const index = this.budgets.findIndex(budget => budget.id === id)
        if (index === -1) {
          throw new Error('Budget not found')
        }

        // Validate data
        if (budgetData.amount !== undefined && budgetData.amount <= 0) {
          throw new Error('Budget amount must be greater than 0')
        }

        // Check for duplicate names (excluding current budget)
        if (budgetData.name) {
          const existingBudget = this.budgets.find(b => 
            b.id !== id && b.name.toLowerCase() === budgetData.name.toLowerCase()
          )
          if (existingBudget) {
            throw new Error('A budget with this name already exists')
          }
        }

        // TODO: Replace with actual API call
        // const response = await budgetService.updateBudget(id, budgetData)
        // const updatedBudget = response.data

        // For now, update the budget in the array
        const updatedBudget = {
          ...this.budgets[index],
          ...budgetData,
          id, // Ensure ID doesn't change
          updated_at: new Date().toISOString()
        }

        this.budgets[index] = updatedBudget
        console.log('Budget updated:', updatedBudget.name)
        
        return updatedBudget
      } catch (error) {
        this.error = error.message
        console.error('Error updating budget:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete budget
    async deleteBudget(id) {
      this.isLoading = true
      this.error = null

      try {
        const index = this.budgets.findIndex(budget => budget.id === id)
        if (index === -1) {
          throw new Error('Budget not found')
        }

        const budgetName = this.budgets[index].name

        // TODO: Replace with actual API call
        // await budgetService.deleteBudget(id)

        // For now, remove from array
        this.budgets.splice(index, 1)
        console.log('Budget deleted:', budgetName)
        
      } catch (error) {
        this.error = error.message
        console.error('Error deleting budget:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Helper method to reset error state
    clearError() {
      this.error = null
    },

    // Method to refresh budgets
    async refreshBudgets() {
      return await this.fetchBudgets(true)
    },

    // Reset store to initial state
    resetStore() {
      this.budgets = []
      this.isLoading = false
      this.error = null
      this.lastFetched = null
    },

    // Get budget summary
    getBudgetSummary() {
      const total = this.budgets.length
      const totalAmount = this.totalBudgetAmount
      const byPeriod = this.budgets.reduce((acc, budget) => {
        acc[budget.period] = (acc[budget.period] || 0) + 1
        return acc
      }, {})

      return {
        total,
        totalAmount,
        byPeriod,
        lastUpdated: this.lastFetched
      }
    },

    // Generate period dates for a budget
    generatePeriodDates(period) {
      const now = new Date()
      let startDate, endDate

      switch (period) {
        case 'weekly':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
          endDate = new Date(startDate)
          endDate.setDate(startDate.getDate() + 6)
          break
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear(), 11, 31)
          break
        default: // monthly
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }

      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
  }
})