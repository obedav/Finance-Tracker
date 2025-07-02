// models/Transaction.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Transaction {
  constructor(data) {
    Object.assign(this, data)
  }

  // Static methods for transaction operations
  static async findById(id, userId = null) {
    try {
      const where = { id }
      if (userId) {
        where.userId = userId
      }

      const transaction = await prisma.transaction.findFirst({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      return transaction ? new Transaction(transaction) : null
    } catch (error) {
      throw new Error(`Error finding transaction: ${error.message}`)
    }
  }

  static async findByUser(userId, options = {}) {
    try {
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
      } = options

      const skip = (page - 1) * limit

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

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.transaction.count({ where })
      ])

      return {
        transactions: transactions.map(t => new Transaction(t)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    } catch (error) {
      throw new Error(`Error finding user transactions: ${error.message}`)
    }
  }

  static async create(transactionData) {
    try {
      const { amount, type, description, categoryId, userId, date } = transactionData

      // Validate category belongs to user or is default
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
        throw new Error('Invalid category')
      }

      // Validate transaction type matches category type
      if (category.type !== type.toUpperCase()) {
        throw new Error('Transaction type must match category type')
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
              color: true,
              icon: true
            }
          }
        }
      })

      return new Transaction(transaction)
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Invalid user or category reference')
      }
      throw new Error(`Error creating transaction: ${error.message}`)
    }
  }

  static async update(id, userId, updateData) {
    try {
      // Check if transaction exists and belongs to user
      const existingTransaction = await this.findById(id, userId)
      if (!existingTransaction) {
        throw new Error('Transaction not found')
      }

      // If categoryId is being updated, verify it
      if (updateData.categoryId) {
        const category = await prisma.category.findFirst({
          where: {
            id: updateData.categoryId,
            OR: [
              { userId },
              { isDefault: true }
            ]
          }
        })

        if (!category) {
          throw new Error('Invalid category')
        }

        // Validate transaction type matches category type
        const transactionType = updateData.type ? updateData.type.toUpperCase() : existingTransaction.type
        if (category.type !== transactionType) {
          throw new Error('Transaction type must match category type')
        }
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...(updateData.amount && { amount: parseFloat(updateData.amount) }),
          ...(updateData.type && { type: updateData.type.toUpperCase() }),
          ...(updateData.description !== undefined && { description: updateData.description }),
          ...(updateData.categoryId && { categoryId: updateData.categoryId }),
          ...(updateData.date && { date: new Date(updateData.date) })
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true
            }
          }
        }
      })

      return new Transaction(transaction)
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Transaction not found')
      }
      throw new Error(`Error updating transaction: ${error.message}`)
    }
  }

  static async delete(id, userId) {
    try {
      const transaction = await this.findById(id, userId)
      if (!transaction) {
        throw new Error('Transaction not found')
      }

      await prisma.transaction.delete({
        where: { id }
      })

      return true
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Transaction not found')
      }
      throw new Error(`Error deleting transaction: ${error.message}`)
    }
  }

  static async deleteMultiple(ids, userId) {
    try {
      // Verify all transactions belong to the user
      const transactions = await prisma.transaction.findMany({
        where: {
          id: { in: ids },
          userId
        },
        select: { id: true }
      })

      if (transactions.length !== ids.length) {
        throw new Error('Some transactions not found or do not belong to you')
      }

      const result = await prisma.transaction.deleteMany({
        where: {
          id: { in: ids },
          userId
        }
      })

      return result.count
    } catch (error) {
      throw new Error(`Error deleting transactions: ${error.message}`)
    }
  }

  static async getStatistics(userId, dateRange = null) {
    try {
      const where = {
        userId,
        ...(dateRange?.start && dateRange?.end && {
          date: {
            gte: new Date(dateRange.start),
            lte: new Date(dateRange.end)
          }
        })
      }

      const [
        totalCount,
        incomeStats,
        expenseStats,
        categoryBreakdown
      ] = await Promise.all([
        prisma.transaction.count({ where }),
        
        prisma.transaction.aggregate({
          where: { ...where, type: 'INCOME' },
          _sum: { amount: true },
          _count: true,
          _avg: { amount: true }
        }),
        
        prisma.transaction.aggregate({
          where: { ...where, type: 'EXPENSE' },
          _sum: { amount: true },
          _count: true,
          _avg: { amount: true }
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
        count: item._count,
        percentage: totalIncome + totalExpenses > 0 
          ? (item._sum.amount / (totalIncome + totalExpenses)) * 100 
          : 0
      }))

      return {
        totalTransactions: totalCount,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        incomeTransactions: incomeStats._count,
        expenseTransactions: expenseStats._count,
        averageIncome: incomeStats._avg.amount || 0,
        averageExpense: expenseStats._avg.amount || 0,
        averageTransaction: totalCount > 0 
          ? (totalIncome + totalExpenses) / totalCount 
          : 0,
        savingsRate: totalIncome > 0 
          ? ((totalIncome - totalExpenses) / totalIncome) * 100 
          : 0,
        categoryBreakdown: enhancedCategoryBreakdown
      }
    } catch (error) {
      throw new Error(`Error getting transaction statistics: ${error.message}`)
    }
  }

  static async getMonthlyTrends(userId, year = new Date().getFullYear()) {
    try {
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

      return monthlyData
    } catch (error) {
      throw new Error(`Error getting monthly trends: ${error.message}`)
    }
  }

  static async importFromCSV(csvData, userId) {
    try {
      const validTransactions = []
      const errors = []

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i]
        
        try {
          // Validate required fields
          if (!row.amount || !row.type || !row.categoryId) {
            errors.push(`Row ${i + 1}: Missing required fields`)
            continue
          }

          // Verify category exists
          const category = await prisma.category.findFirst({
            where: {
              id: row.categoryId,
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
            amount: parseFloat(row.amount),
            type: row.type.toUpperCase(),
            description: row.description || null,
            categoryId: row.categoryId,
            userId,
            date: row.date ? new Date(row.date) : new Date()
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

      return {
        imported: result.count,
        total: csvData.length,
        errors: errors.length > 0 ? errors : null
      }
    } catch (error) {
      throw new Error(`Error importing transactions: ${error.message}`)
    }
  }

  // Instance methods
  async update(updateData) {
    return Transaction.update(this.id, this.userId, updateData)
  }

  async delete() {
    return Transaction.delete(this.id, this.userId)
  }

  // Computed properties
  get formattedAmount() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount)
  }

  get formattedDate() {
    return new Date(this.date).toLocaleDateString()
  }

  get isIncome() {
    return this.type === 'INCOME'
  }

  get isExpense() {
    return this.type === 'EXPENSE'
  }

  get displayType() {
    return this.type.toLowerCase()
  }

  get categoryName() {
    return this.category?.name || 'Unknown'
  }

  get categoryColor() {
    return this.category?.color || '#6B7280'
  }

  // Validation methods
  static validateTransactionData(data) {
    const errors = []

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be a positive number')
    }

    if (!data.type || !['INCOME', 'EXPENSE'].includes(data.type.toUpperCase())) {
      errors.push('Type must be either INCOME or EXPENSE')
    }

    if (!data.categoryId) {
      errors.push('Category ID is required')
    }

    if (!data.userId) {
      errors.push('User ID is required')
    }

    if (data.description && data.description.length > 500) {
      errors.push('Description must not exceed 500 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      type: this.type,
      description: this.description,
      date: this.date,
      category: this.category,
      formattedAmount: this.formattedAmount,
      formattedDate: this.formattedDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

module.exports = Transaction