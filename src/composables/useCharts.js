// src/composables/useCharts.js
import { ref, computed, watch, nextTick } from 'vue'
import { 
  COLORS, 
  CHART_COLORS,
  defaultChartOptions,
  lineChartConfig,
  barChartConfig,
  pieChartConfig,
  doughnutChartConfig,
  formatIncomeExpenseData,
  formatCategoryData,
  formatTrendData,
  generateCategoryColors
} from '../utils/chartConfig.js'
import { formatCurrency } from '../utils/formatters.js'
import { groupBy } from '../utils/helpers.js'

export function useCharts() {
  // State
  const chartRefs = ref({})
  const chartInstances = ref({})
  const loading = ref(false)
  const error = ref(null)

  // Chart options
  const defaultOptions = ref(defaultChartOptions)

  // Reactive chart data
  const chartData = ref({})

  // Register chart reference
  const registerChart = (chartId, chartRef) => {
    chartRefs.value[chartId] = chartRef
  }

  // Get chart instance
  const getChartInstance = (chartId) => {
    return chartInstances.value[chartId] || null
  }

  // Update chart data
  const updateChartData = (chartId, newData) => {
    if (chartData.value[chartId]) {
      chartData.value[chartId] = { ...chartData.value[chartId], ...newData }
    } else {
      chartData.value[chartId] = newData
    }
  }

  // Income vs Expenses Chart
  const createIncomeExpenseChart = (transactionData, period = 'month') => {
    try {
      loading.value = true
      
      // Group transactions by period
      const groupedData = groupTransactionsByPeriod(transactionData, period)
      
      // Format data for chart
      const chartData = formatIncomeExpenseData(groupedData)
      
      // Custom options for this chart type
      const options = {
        ...barChartConfig,
        plugins: {
          ...barChartConfig.plugins,
          title: {
            display: true,
            text: `Income vs Expenses (${period})`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        },
        scales: {
          ...barChartConfig.scales,
          y: {
            ...barChartConfig.scales.y,
            beginAtZero: true
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'bar'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Category Breakdown Pie Chart
  const createCategoryBreakdownChart = (transactionData, type = 'expense') => {
    try {
      loading.value = true
      
      // Filter by transaction type
      const filteredTransactions = transactionData.filter(t => t.type === type)
      
      // Group by category and sum amounts
      const categoryData = groupBy(filteredTransactions, 'category')
      const formattedData = Object.entries(categoryData).map(([category, transactions]) => ({
        name: category,
        amount: transactions.reduce((sum, t) => sum + t.amount, 0),
        count: transactions.length
      }))

      // Sort by amount (descending)
      formattedData.sort((a, b) => b.amount - a.amount)

      // Format for pie chart
      const chartData = formatCategoryData(formattedData, type)
      
      const options = {
        ...pieChartConfig,
        plugins: {
          ...pieChartConfig.plugins,
          title: {
            display: true,
            text: `${type === 'income' ? 'Income' : 'Expense'} Categories`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'pie'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Monthly Trend Line Chart
  const createMonthlyTrendChart = (transactionData, months = 6) => {
    try {
      loading.value = true
      
      // Get last N months of data
      const monthlyData = getMonthlyTrendData(transactionData, months)
      
      // Format for line chart
      const datasets = [
        {
          label: 'Income',
          data: monthlyData.map(item => item.income),
          borderColor: CHART_COLORS.income,
          backgroundColor: CHART_COLORS.income + '20',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: monthlyData.map(item => item.expenses),
          borderColor: CHART_COLORS.expense,
          backgroundColor: CHART_COLORS.expense + '20',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Net',
          data: monthlyData.map(item => item.income - item.expenses),
          borderColor: COLORS.info,
          backgroundColor: COLORS.info + '20',
          fill: false,
          tension: 0.4,
          borderDash: [5, 5]
        }
      ]

      const chartData = {
        labels: monthlyData.map(item => item.month),
        datasets
      }
      
      const options = {
        ...lineChartConfig,
        plugins: {
          ...lineChartConfig.plugins,
          title: {
            display: true,
            text: `${months}-Month Financial Trend`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'line'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Savings Rate Chart
  const createSavingsRateChart = (transactionData, period = 'month') => {
    try {
      loading.value = true
      
      const groupedData = groupTransactionsByPeriod(transactionData, period)
      
      const savingsData = groupedData.map(item => {
        const savingsRate = item.income > 0 ? ((item.income - item.expenses) / item.income) * 100 : 0
        return {
          period: item.month || item.period,
          savingsRate: Math.max(0, savingsRate) // Ensure non-negative
        }
      })

      const chartData = {
        labels: savingsData.map(item => item.period),
        datasets: [{
          label: 'Savings Rate (%)',
          data: savingsData.map(item => item.savingsRate),
          backgroundColor: CHART_COLORS.income + '80',
          borderColor: CHART_COLORS.income,
          borderWidth: 2,
          fill: true
        }]
      }
      
      const options = {
        ...lineChartConfig,
        plugins: {
          ...lineChartConfig.plugins,
          title: {
            display: true,
            text: 'Savings Rate Over Time',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        },
        scales: {
          ...lineChartConfig.scales,
          y: {
            ...lineChartConfig.scales.y,
            beginAtZero: true,
            max: 100,
            ticks: {
              ...lineChartConfig.scales.y.ticks,
              callback: function(value) {
                return value + '%'
              }
            }
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'line'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Balance History Chart
  const createBalanceHistoryChart = (transactionData) => {
    try {
      loading.value = true
      
      // Sort transactions by date
      const sortedTransactions = [...transactionData].sort(
        (a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
      )

      let runningBalance = 0
      const balanceHistory = []

      sortedTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
          runningBalance += transaction.amount
        } else {
          runningBalance -= transaction.amount
        }

        balanceHistory.push({
          date: new Date(transaction.createdAt || transaction.date).toLocaleDateString(),
          balance: runningBalance
        })
      })

      const chartData = {
        labels: balanceHistory.map(item => item.date),
        datasets: [{
          label: 'Account Balance',
          data: balanceHistory.map(item => item.balance),
          borderColor: COLORS.info,
          backgroundColor: COLORS.info + '20',
          fill: true,
          tension: 0.4
        }]
      }
      
      const options = {
        ...lineChartConfig,
        plugins: {
          ...lineChartConfig.plugins,
          title: {
            display: true,
            text: 'Balance History',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'line'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Top Categories Chart
  const createTopCategoriesChart = (transactionData, type = 'expense', limit = 5) => {
    try {
      loading.value = true
      
      // Filter and group by category
      const filteredTransactions = transactionData.filter(t => t.type === type)
      const categoryData = groupBy(filteredTransactions, 'category')
      
      // Calculate totals and sort
      const categoryTotals = Object.entries(categoryData)
        .map(([category, transactions]) => ({
          category,
          amount: transactions.reduce((sum, t) => sum + t.amount, 0),
          count: transactions.length
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit)

      const chartData = {
        labels: categoryTotals.map(item => item.category),
        datasets: [{
          label: `Top ${type} Categories`,
          data: categoryTotals.map(item => item.amount),
          backgroundColor: generateCategoryColors(categoryTotals),
          borderColor: COLORS.border,
          borderWidth: 1
        }]
      }
      
      const options = {
        ...barChartConfig,
        indexAxis: 'y', // Horizontal bar chart
        plugins: {
          ...barChartConfig.plugins,
          title: {
            display: true,
            text: `Top ${limit} ${type} Categories`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: COLORS.text
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'bar'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const groupTransactionsByPeriod = (transactions, period) => {
    const grouped = {}
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt || transaction.date)
      let key
      
      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0]
          break
        case 'week':
          // Get start of week
          const startOfWeek = new Date(date)
          startOfWeek.setDate(date.getDate() - date.getDay())
          key = startOfWeek.toISOString().split('T')[0]
          break
        case 'month':
          key = date.toISOString().substring(0, 7) // YYYY-MM
          break
        case 'year':
          key = date.getFullYear().toString()
          break
        default:
          key = date.toISOString().substring(0, 7)
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          month: formatPeriodLabel(key, period),
          income: 0,
          expenses: 0,
          transactions: []
        }
      }
      
      grouped[key].transactions.push(transaction)
      
      if (transaction.type === 'income') {
        grouped[key].income += transaction.amount
      } else {
        grouped[key].expenses += transaction.amount
      }
    })
    
    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period))
  }

  const getMonthlyTrendData = (transactions, months) => {
    const now = new Date()
    const monthlyData = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().substring(0, 7)
      const monthLabel = date.toLocaleDateString('default', { month: 'short', year: 'numeric' })
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.createdAt || t.date)
        return tDate.toISOString().substring(0, 7) === monthKey
      })
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      monthlyData.push({
        month: monthLabel,
        income,
        expenses,
        net: income - expenses
      })
    }
    
    return monthlyData
  }

  const formatPeriodLabel = (key, period) => {
    const date = new Date(key)
    
    switch (period) {
      case 'day':
        return date.toLocaleDateString('default', { month: 'short', day: 'numeric' })
      case 'week':
        return `Week of ${date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
      case 'month':
        return date.toLocaleDateString('default', { month: 'short', year: 'numeric' })
      case 'year':
        return date.getFullYear().toString()
      default:
        return key
    }
  }

  // Chart manipulation methods
  const updateChart = (chartId, newData, newOptions = null) => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.data = newData
      if (newOptions) {
        instance.options = { ...instance.options, ...newOptions }
      }
      instance.update()
    }
  }

  const destroyChart = (chartId) => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.destroy()
      delete chartInstances.value[chartId]
      delete chartRefs.value[chartId]
    }
  }

  const destroyAllCharts = () => {
    Object.keys(chartInstances.value).forEach(chartId => {
      destroyChart(chartId)
    })
  }

  const resizeChart = (chartId) => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.resize()
    }
  }

  const resizeAllCharts = () => {
    Object.keys(chartInstances.value).forEach(chartId => {
      resizeChart(chartId)
    })
  }

  // Export chart as image
  const exportChart = (chartId, format = 'png', filename = 'chart') => {
    const instance = getChartInstance(chartId)
    if (instance) {
      const url = instance.toBase64Image(format, 1)
      const link = document.createElement('a')
      link.download = `${filename}.${format}`
      link.href = url
      link.click()
    }
  }

  // Clear errors
  const clearError = () => {
    error.value = null
  }

  // Chart theme management
  const applyDarkTheme = () => {
    defaultOptions.value = {
      ...defaultOptions.value,
      plugins: {
        ...defaultOptions.value.plugins,
        legend: {
          ...defaultOptions.value.plugins.legend,
          labels: {
            ...defaultOptions.value.plugins.legend.labels,
            color: '#F3F4F6'
          }
        }
      },
      scales: {
        x: {
          ...defaultOptions.value.scales.x,
          ticks: {
            ...defaultOptions.value.scales.x.ticks,
            color: '#F3F4F6'
          }
        },
        y: {
          ...defaultOptions.value.scales.y,
          ticks: {
            ...defaultOptions.value.scales.y.ticks,
            color: '#F3F4F6'
          }
        }
      }
    }
  }

  const applyLightTheme = () => {
    defaultOptions.value = defaultChartOptions
  }

  return {
    // State
    loading,
    error,
    chartData,
    defaultOptions,

    // Chart creation methods
    createIncomeExpenseChart,
    createCategoryBreakdownChart,
    createMonthlyTrendChart,
    createSavingsRateChart,
    createBalanceHistoryChart,
    createTopCategoriesChart,

    // Chart management methods
    registerChart,
    getChartInstance,
    updateChartData,
    updateChart,
    destroyChart,
    destroyAllCharts,
    resizeChart,
    resizeAllCharts,
    exportChart,

    // Utility methods
    groupTransactionsByPeriod,
    getMonthlyTrendData,
    formatPeriodLabel,
    clearError,

    // Theme methods
    applyDarkTheme,
    applyLightTheme
  }
}