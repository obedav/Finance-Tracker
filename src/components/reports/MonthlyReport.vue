<!-- src/views/reports/MonthlyReport.vue -->
<template>
  <div class="min-h-screen bg-cream p-6">
    <div class="container-app">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-700">Monthly Report</h1>
            <p class="text-slate-500">{{ currentMonthYear }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button 
                @click="previousMonth"
                class="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div class="px-4 py-2 text-sm font-medium text-slate-700 min-w-32 text-center">
                {{ formatDate(selectedDate, 'MMM YYYY') }}
              </div>
              <button 
                @click="nextMonth"
                :disabled="isCurrentMonth"
                class="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <button @click="exportReport" class="btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="loading-spinner"></div>
        <span class="ml-3 text-slate-600">Loading monthly report...</span>
      </div>

      <!-- Report Content -->
      <div v-else-if="reportData" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Income</p>
                <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(reportData.summary.totalIncome) }}</p>
                <p class="text-sm text-slate-500 mt-1">{{ reportData.summary.incomeTransactions || 0 }} transactions</p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Expenses</p>
                <p class="text-2xl font-bold text-gold-600">{{ formatCurrency(reportData.summary.totalExpenses) }}</p>
                <p class="text-sm text-slate-500 mt-1">{{ reportData.summary.expenseTransactions || 0 }} transactions</p>
              </div>
              <div class="category-icon category-icon-expense group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Net Amount</p>
                <p 
                  class="text-2xl font-bold"
                  :class="netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ formatCurrency(Math.abs(netAmount)) }}
                </p>
                <p class="text-sm" :class="netAmount >= 0 ? 'text-emerald-500' : 'text-red-500'">
                  {{ netAmount >= 0 ? 'Surplus' : 'Deficit' }}
                </p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Savings Rate</p>
                <p class="text-2xl font-bold text-slate-700">{{ savingsRate }}%</p>
                <p class="text-sm text-slate-500 mt-1">{{ savingsRateText }}</p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Daily Trends Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-slate-700 mb-6">Daily Trends</h3>
            <div class="h-80">
              <canvas ref="dailyTrendsChart"></canvas>
            </div>
          </div>

          <!-- Category Breakdown Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-slate-700 mb-6">Expense Breakdown</h3>
            <div class="h-80">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Category Analysis -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Category Analysis</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">% of Total</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Transactions</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Avg per Transaction</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="category in reportData.categoryBreakdown" 
                  :key="category.category"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div 
                        class="w-4 h-4 rounded-full mr-3"
                        :style="{ backgroundColor: getCategoryColor(category.category) }"
                      ></div>
                      <span class="font-medium text-slate-700">{{ category.category }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-right font-semibold text-slate-700">
                    {{ formatCurrency(category.amount) }}
                  </td>
                  <td class="py-4 px-4 text-right">
                    <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                      {{ category.percentage.toFixed(1) }}%
                    </span>
                  </td>
                  <td class="py-4 px-4 text-right text-slate-600">
                    {{ category.transactionCount }}
                  </td>
                  <td class="py-4 px-4 text-right text-slate-600">
                    {{ formatCurrency(category.amount / category.transactionCount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Expenses -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Top Expenses This Month</h3>
          <div class="space-y-3">
            <div 
              v-for="expense in reportData.topExpenses" 
              :key="expense.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-slate-700">{{ expense.description }}</h4>
                  <p class="text-sm text-slate-500">{{ expense.category }} • {{ formatDate(expense.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gold-600">{{ formatCurrency(expense.amount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Insights -->
        <div class="card" v-if="reportData.insights">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Monthly Insights</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-slate-700 mb-3">Key Highlights</h4>
              <div class="space-y-3">
                <div 
                  v-for="(insight, index) in reportData.insights" 
                  :key="index"
                  class="flex items-start p-3 bg-blue-50 rounded-lg"
                >
                  <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-slate-700 text-sm">{{ insight }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-slate-700 mb-3">Comparison with Last Month</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-slate-600">Income Change</span>
                  <span 
                    :class="incomeChange >= 0 ? 'text-emerald-600' : 'text-red-600'"
                    class="font-semibold"
                  >
                    {{ incomeChange >= 0 ? '+' : '' }}{{ incomeChange.toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-slate-600">Expense Change</span>
                  <span 
                    :class="expenseChange <= 0 ? 'text-emerald-600' : 'text-red-600'"
                    class="font-semibold"
                  >
                    {{ expenseChange >= 0 ? '+' : '' }}{{ expenseChange.toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-slate-600">Savings Change</span>
                  <span 
                    :class="savingsChange >= 0 ? 'text-emerald-600' : 'text-red-600'"
                    class="font-semibold"
                  >
                    {{ savingsChange >= 0 ? '+' : '' }}{{ savingsChange.toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-700 mb-2">Error Loading Report</h3>
        <p class="text-slate-500 mb-4">{{ error }}</p>
        <button @click="loadData" class="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart } from 'chart.js'
import reportService from '@/services/reportService'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { lineChartConfig, doughnutChartConfig, generateCategoryColors } from '@/utils/chartConfig'

const loading = ref(false)
const error = ref(null)
const reportData = ref(null)
const selectedDate = ref(new Date())

const dailyTrendsChart = ref(null)
const categoryChart = ref(null)
let dailyTrendsChartInstance = null
let categoryChartInstance = null

const currentMonthYear = computed(() => {
  return formatDate(selectedDate.value, 'MMMM YYYY')
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  const selected = selectedDate.value
  return now.getMonth() === selected.getMonth() && now.getFullYear() === selected.getFullYear()
})

const netAmount = computed(() => {
  if (!reportData.value) return 0
  return reportData.value.summary.totalIncome - reportData.value.summary.totalExpenses
})

const savingsRate = computed(() => {
  if (!reportData.value || reportData.value.summary.totalIncome === 0) return 0
  return Math.round((netAmount.value / reportData.value.summary.totalIncome) * 100)
})

const savingsRateText = computed(() => {
  const rate = savingsRate.value
  if (rate >= 20) return 'Excellent'
  if (rate >= 10) return 'Good'
  if (rate >= 0) return 'Fair'
  return 'Needs improvement'
})

const incomeChange = computed(() => {
  // Mock calculation - in real app, compare with previous month
  return Math.random() * 20 - 10 // -10% to +10%
})

const expenseChange = computed(() => {
  // Mock calculation - in real app, compare with previous month
  return Math.random() * 20 - 10 // -10% to +10%
})

const savingsChange = computed(() => {
  // Mock calculation - in real app, compare with previous month
  return Math.random() * 30 - 15 // -15% to +15%
})

const previousMonth = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  selectedDate.value = newDate
}

const nextMonth = () => {
  if (!isCurrentMonth.value) {
    const newDate = new Date(selectedDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    selectedDate.value = newDate
  }
}

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const year = selectedDate.value.getFullYear()
    const month = selectedDate.value.getMonth() + 1
    
    const response = await reportService.getMonthlyReport(year, month)
    reportData.value = response.report
    
    // Calculate net amount and savings rate
    const income = reportData.value.summary.totalIncome
    const expenses = reportData.value.summary.totalExpenses
    reportData.value.summary.netAmount = income - expenses
    reportData.value.summary.savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    
    await nextTick()
    initializeCharts()
  } catch (err) {
    error.value = err.message || 'Failed to load monthly report'
  } finally {
    loading.value = false
  }
}

const initializeCharts = () => {
  if (dailyTrendsChartInstance) {
    dailyTrendsChartInstance.destroy()
  }
  if (categoryChartInstance) {
    categoryChartInstance.destroy()
  }
  
  createDailyTrendsChart()
  createCategoryChart()
}

const createDailyTrendsChart = () => {
  if (!dailyTrendsChart.value || !reportData.value?.dailyTrends) return
  
  const ctx = dailyTrendsChart.value.getContext('2d')
  const trends = reportData.value.dailyTrends
  
  dailyTrendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trends.map(trend => new Date(trend.date).getDate()),
      datasets: [
        {
          label: 'Income',
          data: trends.map(trend => trend.income),
          borderColor: '#10B981',
          backgroundColor: '#10B98120',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#10B981',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Expenses',
          data: trends.map(trend => trend.expenses),
          borderColor: '#F59E0B',
          backgroundColor: '#F59E0B20',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#F59E0B',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      ...lineChartConfig,
      scales: {
        ...lineChartConfig.scales,
        x: {
          ...lineChartConfig.scales.x,
          title: {
            display: true,
            text: 'Day of Month'
          }
        }
      }
    }
  })
}

const createCategoryChart = () => {
  if (!categoryChart.value || !reportData.value?.categoryBreakdown) return
  
  const ctx = categoryChart.value.getContext('2d')
  const categories = reportData.value.categoryBreakdown
  const colors = generateCategoryColors(categories)
  
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(cat => cat.category),
      datasets: [{
        data: categories.map(cat => cat.amount),
        backgroundColor: colors,
        borderColor: colors.map(color => color + '20'),
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: doughnutChartConfig
  })
}

const getCategoryColor = (categoryName) => {
  if (!reportData.value?.categoryBreakdown) return '#10B981'
  
  const index = reportData.value.categoryBreakdown.findIndex(cat => cat.category === categoryName)
  const colors = generateCategoryColors(reportData.value.categoryBreakdown)
  return colors[index] || '#10B981'
}

const exportReport = async () => {
  try {
    const year = selectedDate.value.getFullYear()
    const month = selectedDate.value.getMonth() + 1
    
    await reportService.exportReportPDF('monthly', { year, month })
  } catch (err) {
  }
}

watch(selectedDate, () => {
  loadData()
}, { deep: true })

onMounted(() => {
  loadData()
})
</script>