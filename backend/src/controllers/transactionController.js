// controllers/transactionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const transactionController = {
  // Get all transactions for a user
  async getTransactions(req, res) {
    try {
      const userId = req.user.id
      const {
        page = 1,
        limit = 10,
        type,
        categoryId,
        search,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const skip = (parseInt(page) - 1) * parseInt(limit)
      const take = parseInt(limit)

      // Build where clause
      const where = {
        userId,
        ...(type && { type: type.toUpperCase() }),
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { description: { contains: search, mode: 'insensitive' } },
            { category: { name: { contains: search, mode: 'insensitive' } } }
          ]
        }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }),
        ...(minAmount && { amount: { gte: parseFloat(minAmount) } }),
        ...(maxAmount && { amount: { lte: parseFloat(maxAmount) } })
      }

      // Get transactions with pagination
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                icon: true,
                color: true
              }
            }
          },
          orderBy: {
            [sortBy]: sortOrder
          },
          skip,
          take
        }),
        prisma.transaction.count({ where })
      ])

      res.json({
        data: transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error fetching transactions:', error)
      res.status(500).json({ error: 'Failed to fetch transactions' })
    }
  },

  // Get single transaction
  async getTransaction(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              icon: true,
              color: true
            }
          }
        }
      })

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' })
      }

      res.json(transaction)
    } catch (error) {
      console.error('Error fetching transaction:', error)
      res.status(500).json({ error: 'Failed to fetch transaction' })
    }
  },

  // Create new transaction
  async createTransaction(req, res) {
    try {
      const userId = req.user.id
      const { amount, type, description, categoryId, date } = req.body

      // Validate required fields
      if (!amount || !type || !categoryId) {
        return res.status(400).json({ 
          error: 'Amount, type, and category are required' 
        })
      }

      // Verify category belongs to user or is default
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          OR: [
            { userId },
            { isDefault: true }
          ]
        }
      })

      if (!category) {
        return res.status(400).json({ error: 'Invalid category' })
      }

      // Validate transaction type matches category type
      if (category.type !== type.toUpperCase()) {
        return res.status(400).json({ 
          error: 'Transaction type must match category type' 
        })
      }

      const transaction = await prisma.transaction.create({
        data: {
          amount: parseFloat(amount),
          type: type.toUpperCase(),
          description,
          categoryId,
          userId,
          date: date ? new Date(date) : new Date()
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              icon: true,
              color: true
            }
          }
        }
      })

      res.status(201).json(transaction)
    } catch (error) {
      console.error('Error creating transaction:', error)
      res.status(500).json({ error: 'Failed to create transaction' })
    }
  },

  // Update transaction
  async updateTransaction(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { amount, type, description, categoryId, date } = req.body

      // Check if transaction exists and belongs to user
      const existingTransaction = await prisma.transaction.findFirst({
        where: { id, userId }
      })

      if (!existingTransaction) {
        return res.status(404).json({ error: 'Transaction not found' })
      }

      // If categoryId is being updated, verify it
      if (categoryId) {
        const category = await prisma.category.findFirst({
          where: {
            id: categoryId,
            OR: [
              { userId },
              { isDefault: true }
            ]
          }
        })

        if (!category) {
          return res.status(400).json({ error: 'Invalid category' })
        }

        // Validate transaction type matches category type
        const transactionType = type ? type.toUpperCase() : existingTransaction.type
        if (category.type !== transactionType) {
          return res.status(400).json({ 
            error: 'Transaction type must match category type' 
          })
        }
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...(amount && { amount: parseFloat(amount) }),
          ...(type && { type: type.toUpperCase() }),
          ...(description !== undefined && { description }),
          ...(categoryId && { categoryId }),
          ...(date && { date: new Date(date) })
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              icon: true,
              color: true
            }
          }
        }
      })

      res.json(transaction)
    } catch (error) {
      console.error('Error updating transaction:', error)
      res.status(500).json({ error: 'Failed to update transaction' })
    }
  },

  // Delete transaction
  async deleteTransaction(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const transaction = await prisma.transaction.findFirst({
        where: { id, userId }
      })

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' })
      }

      await prisma.transaction.delete({
        where: { id }
      })

      res.json({ message: 'Transaction deleted successfully' })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      res.status(500).json({ error: 'Failed to delete transaction' })
    }
  },

  // Delete multiple transactions
  async deleteMultipleTransactions(req, res) {
    try {
      const { ids } = req.body
      const userId = req.user.id

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid transaction IDs' })
      }

      // Verify all transactions belong to the user
      const transactions = await prisma.transaction.findMany({
        where: {
          id: { in: ids },
          userId
        },
        select: { id: true }
      })

      if (transactions.length !== ids.length) {
        return res.status(400).json({ 
          error: 'Some transactions not found or do not belong to you' 
        })
      }

      const result = await prisma.transaction.deleteMany({
        where: {
          id: { in: ids },
          userId
        }
      })

      res.json({ 
        message: `${result.count} transactions deleted successfully`,
        deletedCount: result.count
      })
    } catch (error) {
      console.error('Error deleting transactions:', error)
      res.status(500).json({ error: 'Failed to delete transactions' })
    }
  },

  // Get transaction statistics
  async getStatistics(req, res) {
    try {
      const userId = req.user.id
      const { startDate, endDate } = req.query

      const where = {
        userId,
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      }

      // Get basic statistics
      const [
        totalTransactions,
        incomeStats,
        expenseStats,
        categoryBreakdown
      ] = await Promise.all([
        prisma.transaction.count({ where }),
        
        prisma.transaction.aggregate({
          where: { ...where, type: 'INCOME' },
          _sum: { amount: true },
          _count: true
        }),
        
        prisma.transaction.aggregate({
          where: { ...where, type: 'EXPENSE' },
          _sum: { amount: true },
          _count: true
        }),
        
        prisma.transaction.groupBy({
          by: ['categoryId'],
          where,
          _sum: { amount: true },
          _count: true
        })
      ])

      const totalIncome = incomeStats._sum.amount || 0
      const totalExpenses = expenseStats._sum.amount || 0
      const balance = totalIncome - totalExpenses

      // Get category details for breakdown
      const categoryIds = categoryBreakdown.map(item => item.categoryId)
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, type: true, color: true }
      })

      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat
        return acc
      }, {})

      const enhancedCategoryBreakdown = categoryBreakdown.map(item => ({
        category: categoryMap[item.categoryId],
        total: item._sum.amount,
        count: item._count
      }))

      res.json({
        totalTransactions,
        totalIncome,
        totalExpenses,
        balance,
        incomeTransactions: incomeStats._count,
        expenseTransactions: expenseStats._count,
        averageTransaction: totalTransactions > 0 
          ? (totalIncome + totalExpenses) / totalTransactions 
          : 0,
        categoryBreakdown: enhancedCategoryBreakdown
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      res.status(500).json({ error: 'Failed to fetch statistics' })
    }
  },

  // Get monthly trends
  async getMonthlyTrends(req, res) {
    try {
      const userId = req.user.id
      const { year = new Date().getFullYear() } = req.query

      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year, 11, 31, 23, 59, 59)

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          amount: true,
          type: true,
          date: true
        }
      })

      // Group by month
      const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        monthName: new Date(year, index).toLocaleString('default', { month: 'long' }),
        income: 0,
        expenses: 0,
        net: 0,
        transactionCount: 0
      }))

      transactions.forEach(transaction => {
        const month = new Date(transaction.date).getMonth()
        monthlyData[month].transactionCount++
        
        if (transaction.type === 'INCOME') {
          monthlyData[month].income += transaction.amount
        } else {
          monthlyData[month].expenses += transaction.amount
        }
      })

      // Calculate net for each month
      monthlyData.forEach(month => {
        month.net = month.income - month.expenses
      })

      res.json(monthlyData)
    } catch (error) {
      console.error('Error fetching monthly trends:', error)
      res.status(500).json({ error: 'Failed to fetch monthly trends' })
    }
  },

  // Import transactions from CSV
  async importTransactions(req, res) {
    try {
      const userId = req.user.id
      const { transactions } = req.body

      if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ error: 'No transactions to import' })
      }

      // Validate and prepare transactions
      const validTransactions = []
      const errors = []

      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i]
        
        try {
          // Validate required fields
          if (!tx.amount || !tx.type || !tx.categoryId) {
            errors.push(`Row ${i + 1}: Missing required fields`)
            continue
          }

          // Verify category exists
          const category = await prisma.category.findFirst({
            where: {
              id: tx.categoryId,
              OR: [
                { userId },
                { isDefault: true }
              ]
            }
          })

          if (!category) {
            errors.push(`Row ${i + 1}: Invalid category`)
            continue
          }

          validTransactions.push({
            amount: parseFloat(tx.amount),
            type: tx.type.toUpperCase(),
            description: tx.description || null,
            categoryId: tx.categoryId,
            userId,
            date: tx.date ? new Date(tx.date) : new Date()
          })
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`)
        }
      }

      // Import valid transactions
      const result = await prisma.transaction.createMany({
        data: validTransactions,
        skipDuplicates: true
      })

      res.json({
        imported: result.count,
        total: transactions.length,
        errors: errors.length > 0 ? errors : null
      })
    } catch (error) {
      console.error('Error importing transactions:', error)
      res.status(500).json({ error: 'Failed to import transactions' })
    }
  }
}

module.exports = transactionController