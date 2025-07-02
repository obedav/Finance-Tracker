// controllers/reportController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const reportController = {
  // Get monthly report
  async getMonthlyReport(req, res) {
    try {
      const userId = req.user.id
      const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query

      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59)

      // Get transactions for the month
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
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
        },
        orderBy: { date: 'desc' }
      })

      // Calculate totals
      const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      // Group by category
      const categoryBreakdown = {}
      transactions.forEach(transaction => {
        const categoryId = transaction.categoryId
        if (!categoryBreakdown[categoryId]) {
          categoryBreakdown[categoryId] = {
            category: transaction.category,
            transactions: [],
            total: 0,
            count: 0
          }
        }
        categoryBreakdown[categoryId].transactions.push(transaction)
        categoryBreakdown[categoryId].total += transaction.amount
        categoryBreakdown[categoryId].count++
      })

      // Group by day for daily breakdown
      const dailyBreakdown = {}
      for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        dailyBreakdown[dateKey] = {
          date: dateKey,
          income: 0,
          expenses: 0,
          net: 0,
          transactionCount: 0
        }
      }

      transactions.forEach(transaction => {
        const dateKey = transaction.date.toISOString().split('T')[0]
        if (dailyBreakdown[dateKey]) {
          dailyBreakdown[dateKey].transactionCount++
          if (transaction.type === 'INCOME') {
            dailyBreakdown[dateKey].income += transaction.amount
          } else {
            dailyBreakdown[dateKey].expenses += transaction.amount
          }
          dailyBreakdown[dateKey].net = dailyBreakdown[dateKey].income - dailyBreakdown[dateKey].expenses
        }
      })

      // Get top categories
      const sortedCategories = Object.values(categoryBreakdown)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)

      res.json({
        period: {
          year: parseInt(year),
          month: parseInt(month),
          monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        summary: {
          totalIncome: income,
          totalExpenses: expenses,
          netAmount: income - expenses,
          transactionCount: transactions.length,
          savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
        },
        categoryBreakdown: Object.values(categoryBreakdown),
        topCategories: sortedCategories,
        dailyBreakdown: Object.values(dailyBreakdown),
        transactions: transactions.slice(0, 50) // Limit to recent 50
      })
    } catch (error) {
      console.error('Error generating monthly report:', error)
      res.status(500).json({ error: 'Failed to generate monthly report' })
    }
  },

  // Get yearly report
  async getYearlyReport(req, res) {
    try {
      const userId = req.user.id
      const { year = new Date().getFullYear() } = req.query

      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year, 11, 31, 23, 59, 59)

      // Get transactions for the year
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
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
        },
        orderBy: { date: 'desc' }
      })

      // Calculate yearly totals
      const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      // Group by month
      const monthlyBreakdown = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        monthName: new Date(year, index).toLocaleString('default', { month: 'long' }),
        income: 0,
        expenses: 0,
        net: 0,
        transactionCount: 0
      }))

      transactions.forEach(transaction => {
        const month = new Date(transaction.date).getMonth()
        monthlyBreakdown[month].transactionCount++
        
        if (transaction.type === 'INCOME') {
          monthlyBreakdown[month].income += transaction.amount
        } else {
          monthlyBreakdown[month].expenses += transaction.amount
        }
        monthlyBreakdown[month].net = monthlyBreakdown[month].income - monthlyBreakdown[month].expenses
      })

      // Group by quarter
      const quarterlyBreakdown = [
        { quarter: 1, name: 'Q1', income: 0, expenses: 0, net: 0, transactionCount: 0 },
        { quarter: 2, name: 'Q2', income: 0, expenses: 0, net: 0, transactionCount: 0 },
        { quarter: 3, name: 'Q3', income: 0, expenses: 0, net: 0, transactionCount: 0 },
        { quarter: 4, name: 'Q4', income: 0, expenses: 0, net: 0, transactionCount: 0 }
      ]

      monthlyBreakdown.forEach((month, index) => {
        const quarter = Math.floor(index / 3)
        quarterlyBreakdown[quarter].income += month.income
        quarterlyBreakdown[quarter].expenses += month.expenses
        quarterlyBreakdown[quarter].net += month.net
        quarterlyBreakdown[quarter].transactionCount += month.transactionCount
      })

      // Category analysis
      const categoryBreakdown = {}
      transactions.forEach(transaction => {
        const categoryId = transaction.categoryId
        if (!categoryBreakdown[categoryId]) {
          categoryBreakdown[categoryId] = {
            category: transaction.category,
            total: 0,
            count: 0,
            monthlyTotals: Array(12).fill(0)
          }
        }
        categoryBreakdown[categoryId].total += transaction.amount
        categoryBreakdown[categoryId].count++
        
        const month = new Date(transaction.date).getMonth()
        categoryBreakdown[categoryId].monthlyTotals[month] += transaction.amount
      })

      // Top categories
      const topCategories = Object.values(categoryBreakdown)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)

      // Calculate trends
      const trends = {
        averageMonthlyIncome: income / 12,
        averageMonthlyExpenses: expenses / 12,
        highestIncomeMonth: monthlyBreakdown.reduce((max, month) => 
          month.income > max.income ? month : max, monthlyBreakdown[0]),
        highestExpenseMonth: monthlyBreakdown.reduce((max, month) => 
          month.expenses > max.expenses ? month : max, monthlyBreakdown[0]),
        bestSavingsMonth: monthlyBreakdown.reduce((max, month) => 
          month.net > max.net ? month : max, monthlyBreakdown[0])
      }

      res.json({
        period: {
          year: parseInt(year),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        summary: {
          totalIncome: income,
          totalExpenses: expenses,
          netAmount: income - expenses,
          transactionCount: transactions.length,
          savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
          averageMonthlyIncome: income / 12,
          averageMonthlyExpenses: expenses / 12
        },
        monthlyBreakdown,
        quarterlyBreakdown,
        categoryBreakdown: Object.values(categoryBreakdown),
        topCategories,
        trends
      })
    } catch (error) {
      console.error('Error generating yearly report:', error)
      res.status(500).json({ error: 'Failed to generate yearly report' })
    }
  },

  // Get category report
  async getCategoryReport(req, res) {
    try {
      const userId = req.user.id
      const { startDate, endDate, categoryId, type } = req.query

      let whereClause = { userId }

      // Add date filter
      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }

      // Add category filter
      if (categoryId) {
        whereClause.categoryId = categoryId
      }

      // Add type filter
      if (type) {
        whereClause.type = type.toUpperCase()
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
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
        orderBy: { date: 'desc' }
      })

      // Group by category
      const categoryAnalysis = {}
      transactions.forEach(transaction => {
        const catId = transaction.categoryId
        if (!categoryAnalysis[catId]) {
          categoryAnalysis[catId] = {
            category: transaction.category,
            transactions: [],
            total: 0,
            count: 0,
            average: 0,
            min: null,
            max: null,
            monthlyTotals: {}
          }
        }

        const analysis = categoryAnalysis[catId]
        analysis.transactions.push(transaction)
        analysis.total += transaction.amount
        analysis.count++
        
        if (analysis.min === null || transaction.amount < analysis.min) {
          analysis.min = transaction.amount
        }
        if (analysis.max === null || transaction.amount > analysis.max) {
          analysis.max = transaction.amount
        }

        // Monthly breakdown
        const monthKey = transaction.date.toISOString().substring(0, 7) // YYYY-MM
        if (!analysis.monthlyTotals[monthKey]) {
          analysis.monthlyTotals[monthKey] = 0
        }
        analysis.monthlyTotals[monthKey] += transaction.amount
      })

      // Calculate averages and percentages
      const grandTotal = Object.values(categoryAnalysis).reduce((sum, cat) => sum + cat.total, 0)
      
      Object.values(categoryAnalysis).forEach(analysis => {
        analysis.average = analysis.count > 0 ? analysis.total / analysis.count : 0
        analysis.percentage = grandTotal > 0 ? (analysis.total / grandTotal) * 100 : 0
      })

      // Sort by total amount
      const sortedCategories = Object.values(categoryAnalysis)
        .sort((a, b) => b.total - a.total)

      res.json({
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        },
        summary: {
          totalAmount: grandTotal,
          totalTransactions: transactions.length,
          categoriesCount: Object.keys(categoryAnalysis).length,
          averagePerCategory: Object.keys(categoryAnalysis).length > 0 
            ? grandTotal / Object.keys(categoryAnalysis).length 
            : 0
        },
        categories: sortedCategories,
        filters: {
          categoryId: categoryId || null,
          type: type || null
        }
      })
    } catch (error) {
      console.error('Error generating category report:', error)
      res.status(500).json({ error: 'Failed to generate category report' })
    }
  },

  // Export report data
  async exportReport(req, res) {
    try {
      const userId = req.user.id
      const { format = 'csv', reportType, startDate, endDate } = req.body

      let reportData = {}

      // Generate report based on type
      switch (reportType) {
        case 'monthly':
          // Use existing monthly report logic
          const monthlyReq = { 
            user: req.user, 
            query: { startDate, endDate } 
          }
          const monthlyRes = {
            json: (data) => { reportData = data }
          }
          await this.getMonthlyReport(monthlyReq, monthlyRes)
          break

        case 'yearly':
          // Use existing yearly report logic
          const yearlyReq = { 
            user: req.user, 
            query: { year: new Date(startDate).getFullYear() } 
          }
          const yearlyRes = {
            json: (data) => { reportData = data }
          }
          await this.getYearlyReport(yearlyReq, yearlyRes)
          break

        case 'transactions':
          // Export raw transaction data
          const transactions = await prisma.transaction.findMany({
            where: {
              userId,
              ...(startDate && endDate && {
                date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate)
                }
              })
            },
            include: {
              category: {
                select: {
                  name: true,
                  type: true
                }
              }
            },
            orderBy: { date: 'desc' }
          })

          reportData = { transactions }
          break

        default:
          return res.status(400).json({ error: 'Invalid report type' })
      }

      // Format data based on export format
      if (format === 'csv') {
        let csvContent = ''
        
        if (reportType === 'transactions') {
          // CSV headers
          csvContent = 'Date,Type,Category,Description,Amount\n'
          
          // CSV data
          reportData.transactions.forEach(transaction => {
            const date = new Date(transaction.date).toLocaleDateString()
            const type = transaction.type
            const category = transaction.category.name
            const description = (transaction.description || '').replace(/,/g, ';')
            const amount = transaction.amount
            
            csvContent += `${date},${type},${category},"${description}",${amount}\n`
          })
        } else {
          // For other report types, convert summary data to CSV
          csvContent = 'Metric,Value\n'
          if (reportData.summary) {
            Object.entries(reportData.summary).forEach(([key, value]) => {
              csvContent += `${key},${value}\n`
            })
          }
        }

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.csv"`)
        res.send(csvContent)
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.json"`)
        res.json(reportData)
      } else {
        res.status(400).json({ error: 'Unsupported export format' })
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      res.status(500).json({ error: 'Failed to export report' })
    }
  }
}

module.exports = reportController