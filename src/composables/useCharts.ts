// src/composables/useCharts.ts
import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue'
import type { Chart as ChartJS, ChartConfiguration, ChartType as ChartJSType } from 'chart.js'
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
} from '../utils/chartConfig'
import { formatCurrency } from '../utils/formatters'
import { groupBy } from '../utils/helpers'
import type { Transaction, TransactionType } from '../types'

/**
 * Composable for managing charts
 * Provides comprehensive chart creation, management, and visualization capabilities
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  tension?: number
  fill?: boolean
  borderDash?: number[]
  borderRadius?: number
  borderSkipped?: boolean | string
  hoverOffset?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: Record<string, any>
  scales?: Record<string, any>
  interaction?: Record<string, any>
  elements?: Record<string, any>
  indexAxis?: 'x' | 'y'
  cutout?: string
  [key: string]: any
}

export interface ChartConfig {
  data: ChartData
  options: ChartOptions
  type: ChartJSType
}

export interface MonthlyData {
  month: string
  period: string
  income: number
  expenses: number
  transactions: Transaction[]
}

export interface MonthlyTrendData {
  month: string
  income: number
  expenses: number
  net: number
}

export interface CategoryTotal {
  category: string
  amount: number
  count: number
}

export interface BalanceHistoryPoint {
  date: string
  balance: number
}

export interface SavingsData {
  period: string
  savingsRate: number
}

export interface UseChartsReturn {
  // State
  loading: Ref<boolean>
  error: Ref<string | null>
  chartData: Ref<Record<string, ChartData>>
  defaultOptions: Ref<ChartOptions>

  // Chart creation methods
  createIncomeExpenseChart: (transactionData: Transaction[], period?: string) => ChartConfig
  createCategoryBreakdownChart: (transactionData: Transaction[], type?: TransactionType) => ChartConfig
  createMonthlyTrendChart: (transactionData: Transaction[], months?: number) => ChartConfig
  createSavingsRateChart: (transactionData: Transaction[], period?: string) => ChartConfig
  createBalanceHistoryChart: (transactionData: Transaction[]) => ChartConfig
  createTopCategoriesChart: (transactionData: Transaction[], type?: TransactionType, limit?: number) => ChartConfig

  // Chart management methods
  registerChart: (chartId: string, chartRef: any) => void
  getChartInstance: (chartId: string) => ChartJS | null
  updateChartData: (chartId: string, newData: Partial<ChartData>) => void
  updateChart: (chartId: string, newData: ChartData, newOptions?: ChartOptions | null) => void
  destroyChart: (chartId: string) => void
  destroyAllCharts: () => void
  resizeChart: (chartId: string) => void
  resizeAllCharts: () => void
  exportChart: (chartId: string, format?: string, filename?: string) => void

  // Utility methods
  groupTransactionsByPeriod: (transactions: Transaction[], period: string) => MonthlyData[]
  getMonthlyTrendData: (transactions: Transaction[], months: number) => MonthlyTrendData[]
  formatPeriodLabel: (key: string, period: string) => string
  clearError: () => void

  // Theme methods
  applyDarkTheme: () => void
  applyLightTheme: () => void
}

// ============================================================================
// Main Composable
// ============================================================================

export function useCharts(): UseChartsReturn {
  // State
  const chartRefs = ref<Record<string, any>>({})
  const chartInstances = ref<Record<string, ChartJS>>({})
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Chart options
  const defaultOptions = ref<ChartOptions>(defaultChartOptions)

  // Reactive chart data
  const chartData = ref<Record<string, ChartData>>({})

  // Register chart reference
  const registerChart = (chartId: string, chartRef: any): void => {
    chartRefs.value[chartId] = chartRef
  }

  // Get chart instance
  const getChartInstance = (chartId: string): ChartJS | null => {
    return chartInstances.value[chartId] || null
  }

  // Update chart data
  const updateChartData = (chartId: string, newData: Partial<ChartData>): void => {
    if (chartData.value[chartId]) {
      chartData.value[chartId] = { ...chartData.value[chartId], ...newData }
    } else {
      chartData.value[chartId] = newData as ChartData
    }
  }

  // Income vs Expenses Chart
  const createIncomeExpenseChart = (transactionData: Transaction[], period: string = 'month'): ChartConfig => {
    try {
      loading.value = true

      // Group transactions by period
      const groupedData = groupTransactionsByPeriod(transactionData, period)

      // Format data for chart
      const chartData = formatIncomeExpenseData(groupedData)

      // Custom options for this chart type
      const options: ChartOptions = {
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
            ...barChartConfig.scales?.y,
            beginAtZero: true
          }
        }
      }

      return {
        data: chartData,
        options,
        type: 'bar'
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Category Breakdown Pie Chart
  const createCategoryBreakdownChart = (transactionData: Transaction[], type: TransactionType = 'EXPENSE'): ChartConfig => {
    try {
      loading.value = true

      // Filter by transaction type
      const filteredTransactions = transactionData.filter(t => t.type === type)

      // Group by category and sum amounts
      const categoryData = groupBy(filteredTransactions, 'category.name')
      const formattedData = Object.entries(categoryData).map(([category, transactions]) => ({
        name: category,
        amount: (transactions as Transaction[]).reduce((sum, t) => sum + t.amount, 0),
        count: (transactions as Transaction[]).length
      }))

      // Sort by amount (descending)
      formattedData.sort((a, b) => b.amount - a.amount)

      // Format for pie chart
      const chartData = formatCategoryData(formattedData, type.toLowerCase())

      const options: ChartOptions = {
        ...pieChartConfig,
        plugins: {
          ...pieChartConfig.plugins,
          title: {
            display: true,
            text: `${type === 'INCOME' ? 'Income' : 'Expense'} Categories`,
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
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Monthly Trend Line Chart
  const createMonthlyTrendChart = (transactionData: Transaction[], months: number = 6): ChartConfig => {
    try {
      loading.value = true

      // Get last N months of data
      const monthlyData = getMonthlyTrendData(transactionData, months)

      // Format for line chart
      const datasets: ChartDataset[] = [
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

      const chartData: ChartData = {
        labels: monthlyData.map(item => item.month),
        datasets
      }

      const options: ChartOptions = {
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
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Savings Rate Chart
  const createSavingsRateChart = (transactionData: Transaction[], period: string = 'month'): ChartConfig => {
    try {
      loading.value = true

      const groupedData = groupTransactionsByPeriod(transactionData, period)

      const savingsData: SavingsData[] = groupedData.map(item => {
        const savingsRate = item.income > 0 ? ((item.income - item.expenses) / item.income) * 100 : 0
        return {
          period: item.month || item.period,
          savingsRate: Math.max(0, savingsRate) // Ensure non-negative
        }
      })

      const chartData: ChartData = {
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

      const options: ChartOptions = {
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
            ...lineChartConfig.scales?.y,
            beginAtZero: true,
            max: 100,
            ticks: {
              ...lineChartConfig.scales?.y?.ticks,
              callback: function(value: string | number) {
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
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Balance History Chart
  const createBalanceHistoryChart = (transactionData: Transaction[]): ChartConfig => {
    try {
      loading.value = true

      // Sort transactions by date
      const sortedTransactions = [...transactionData].sort(
        (a, b) => new Date(a.created_at || a.date).getTime() - new Date(b.created_at || b.date).getTime()
      )

      let runningBalance = 0
      const balanceHistory: BalanceHistoryPoint[] = []

      sortedTransactions.forEach(transaction => {
        if (transaction.type === 'INCOME') {
          runningBalance += transaction.amount
        } else {
          runningBalance -= transaction.amount
        }

        balanceHistory.push({
          date: new Date(transaction.created_at || transaction.date).toLocaleDateString(),
          balance: runningBalance
        })
      })

      const chartData: ChartData = {
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

      const options: ChartOptions = {
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
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Top Categories Chart
  const createTopCategoriesChart = (transactionData: Transaction[], type: TransactionType = 'EXPENSE', limit: number = 5): ChartConfig => {
    try {
      loading.value = true

      // Filter and group by category
      const filteredTransactions = transactionData.filter(t => t.type === type)
      const categoryData = groupBy(filteredTransactions, 'category.name')

      // Calculate totals and sort
      const categoryTotals: CategoryTotal[] = Object.entries(categoryData)
        .map(([category, transactions]) => ({
          category,
          amount: (transactions as Transaction[]).reduce((sum, t) => sum + t.amount, 0),
          count: (transactions as Transaction[]).length
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit)

      const chartData: ChartData = {
        labels: categoryTotals.map(item => item.category),
        datasets: [{
          label: `Top ${type} Categories`,
          data: categoryTotals.map(item => item.amount),
          backgroundColor: generateCategoryColors(categoryTotals),
          borderColor: COLORS.border,
          borderWidth: 1
        }]
      }

      const options: ChartOptions = {
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
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const groupTransactionsByPeriod = (transactions: Transaction[], period: string): MonthlyData[] => {
    const grouped: Record<string, MonthlyData> = {}

    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at || transaction.date)
      let key: string

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

      if (transaction.type === 'INCOME') {
        grouped[key].income += transaction.amount
      } else {
        grouped[key].expenses += transaction.amount
      }
    })

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period))
  }

  const getMonthlyTrendData = (transactions: Transaction[], months: number): MonthlyTrendData[] => {
    const now = new Date()
    const monthlyData: MonthlyTrendData[] = []

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().substring(0, 7)
      const monthLabel = date.toLocaleDateString('default', { month: 'short', year: 'numeric' })

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.created_at || t.date)
        return tDate.toISOString().substring(0, 7) === monthKey
      })

      const income = monthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions
        .filter(t => t.type === 'EXPENSE')
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

  const formatPeriodLabel = (key: string, period: string): string => {
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
  const updateChart = (chartId: string, newData: ChartData, newOptions: ChartOptions | null = null): void => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.data = newData
      if (newOptions) {
        instance.options = { ...instance.options, ...newOptions }
      }
      instance.update()
    }
  }

  const destroyChart = (chartId: string): void => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.destroy()
      delete chartInstances.value[chartId]
      delete chartRefs.value[chartId]
    }
  }

  const destroyAllCharts = (): void => {
    Object.keys(chartInstances.value).forEach(chartId => {
      destroyChart(chartId)
    })
  }

  const resizeChart = (chartId: string): void => {
    const instance = getChartInstance(chartId)
    if (instance) {
      instance.resize()
    }
  }

  const resizeAllCharts = (): void => {
    Object.keys(chartInstances.value).forEach(chartId => {
      resizeChart(chartId)
    })
  }

  // Export chart as image
  const exportChart = (chartId: string, format: string = 'png', filename: string = 'chart'): void => {
    const instance = getChartInstance(chartId)
    if (instance) {
      const url = instance.toBase64Image(format as any, 1)
      const link = document.createElement('a')
      link.download = `${filename}.${format}`
      link.href = url
      link.click()
    }
  }

  // Clear errors
  const clearError = (): void => {
    error.value = null
  }

  // Chart theme management
  const applyDarkTheme = (): void => {
    defaultOptions.value = {
      ...defaultOptions.value,
      plugins: {
        ...defaultOptions.value.plugins,
        legend: {
          ...defaultOptions.value.plugins?.legend,
          labels: {
            ...defaultOptions.value.plugins?.legend?.labels,
            color: '#F3F4F6'
          }
        }
      },
      scales: {
        x: {
          ...defaultOptions.value.scales?.x,
          ticks: {
            ...defaultOptions.value.scales?.x?.ticks,
            color: '#F3F4F6'
          }
        },
        y: {
          ...defaultOptions.value.scales?.y,
          ticks: {
            ...defaultOptions.value.scales?.y?.ticks,
            color: '#F3F4F6'
          }
        }
      }
    }
  }

  const applyLightTheme = (): void => {
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
