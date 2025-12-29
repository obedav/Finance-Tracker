<!-- src/views/reports/YearlyReport.vue -->
<template>
  <div class="min-h-screen bg-cream p-6">
    <div class="container-app">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-700">Yearly Report</h1>
            <p class="text-slate-500">Annual financial overview for {{ selectedYear }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button 
                @click="previousYear"
                class="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div class="px-4 py-2 text-sm font-medium text-slate-700 min-w-20 text-center">
                {{ selectedYear }}
              </div>
              <button 
                @click="nextYear"
                :disabled="isCurrentYear"
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
        <span class="ml-3 text-slate-600">Loading yearly report...</span>
      </div>

      <!-- Report Content -->
      <div v-else-if="reportData" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Income</p>
                <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(reportData.summary.totalIncome) }}</p>
                <p class="text-sm text-emerald-500 mt-1">+{{ yearOverYearIncome }}% YoY</p>
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
                <p class="text-sm text-gold-500 mt-1">+{{ yearOverYearExpenses }}% YoY</p>
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
                <p class="text-sm font-medium text-slate-500">Net Savings</p>
                <p 
                  class="text-2xl font-bold"
                  :class="netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ formatCurrency(Math.abs(netAmount)) }}
                </p>
                <p class="text-sm" :class="netAmount >= 0 ? 'text-emerald-500' : 'text-red-500'">
                  {{ netAmount >= 0 ? 'Saved' : 'Overspent' }}
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
                <p class="text-sm font-medium text-slate-500">Monthly Average</p>
                <p class="text-2xl font-bold text-slate-700">{{ formatCurrency(monthlyAverage) }}</p>
                <p class="text-sm text-slate-500 mt-1">{{ reportData.summary.transactionCount }} total</p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Savings Rate</p>
                <p class="text-2xl font-bold text-slate-700">{{ savingsRate }}%</p>
                <p class="text-sm" :class="getSavingsRateColor()">{{ savingsRateText }}</p>
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
          <!-- Monthly Breakdown Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-slate-700 mb-6">Monthly Breakdown</h3>
            <div class="h-80">
              <canvas ref="monthlyChart"></canvas>
            </div>
          </div>

          <!-- Category Totals Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-slate-700 mb-6">Category Distribution</h3>
            <div class="h-80">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Quarterly Comparison -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Quarterly Performance</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div 
              v-for="quarter in reportData.quarterlyComparison" 
              :key="quarter.quarter"
              class="text-center p-4 bg-gray-50 rounded-lg hover-lift"
            >
              <h4 class="text-lg font-semibold text-slate-700 mb-2">{{ quarter.quarter }}</h4>
              <div class="space-y-2">
                <div>
                  <p class="text-sm text-slate-500">Income</p>
                  <p class="text-lg font-bold text-emerald-600">{{ formatCurrency(quarter.income) }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500">Expenses</p>
                  <p class="text-lg font-bold text-gold-600">{{ formatCurrency(quarter.expenses) }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500">Net</p>
                  <p 
                    class="text-lg font-bold"
                    :class="(quarter.income - quarter.expenses) >= 0 ? 'text-emerald-600' : 'text-red-600'"
                  >
                    {{ formatCurrency(Math.abs(quarter.income - quarter.expenses)) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Year-over-Year Comparison -->
        <div class="card" v-if="reportData.yearOverYear">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Year-over-Year Comparison</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-slate-700">Year</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Income</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Expenses</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Net</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="year in reportData.yearOverYear" 
                  :key="year.year"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-4 px-4 font-medium text-slate-700">{{ year.year }}</td>
                  <td class="py-4 px-4 text-right font-semibold text-emerald-600">
                    {{ formatCurrency(year.income) }}
                  </td>
                  <td class="py-4 px-4 text-right font-semibold text-gold-600">
                    {{ formatCurrency(year.expenses) }}
                  </td>
                  <td class="py-4 px-4 text-right font-semibold text-slate-700">
                    {{ formatCurrency(year.income - year.expenses) }}
                  </td>
                  <td class="py-4 px-4 text-right">
                    <span 
                      v-if="year.growth !== 0"
                      :class="year.growth >= 0 ? 'text-emerald-600' : 'text-red-600'"
                      class="flex items-center justify-end"
                    >
                      <svg 
                        class="w-4 h-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          v-if="year.growth >= 0"
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        ></path>
                        <path 
                          v-else
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        ></path>
                      </svg>
                      {{ Math.abs(year.growth).toFixed(1) }}%
                    </span>
                    <span v-else class="text-slate-500">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Categories -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Top Categories by Amount</h3>
          <div class="space-y-4">
            <div 
              v-for="(category, index) in reportData.categoryTotals.slice(0, 5)" 
              :key="category.category"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                </div>
                <div>
                  <h4 class="font-medium text-slate-700">{{ category.category }}</h4>
                  <p class="text-sm text-slate-500">{{ category.transactionCount }} transactions • Avg: {{ formatCurrency(category.average) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-slate-700">{{ formatCurrency(category.total) }}</p>
                <div class="flex items-center justify-end mt-1">
                  <div class="w-20 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      class="h-full bg-emerald-500 rounded-full"
                      :style="{ width: (category.total / reportData.categoryTotals[0].total * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm text-slate-500">
                    {{ ((category.total / reportData.summary.totalExpenses) * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Goals Progress -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Financial Health Metrics</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-emerald-50 rounded-lg">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-slate-700 mb-2">Emergency Fund</h4>
              <p class="text-2xl font-bold text-emerald-600 mb-1">{{ emergencyFundMonths }} months</p>
              <p class="text-sm text-slate-500">of expenses covered</p>
            </div>

            <div class="text-center p-6 bg-blue-50 rounded-lg">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-slate-700 mb-2">Income Growth</h4>
              <p class="text-2xl font-bold text-blue-600 mb-1">{{ yearOverYearIncome }}%</p>
              <p class="text-sm text-slate-500">year-over-year</p>
            </div>

            <div class="text-center p-6 bg-gold-50 rounded-lg">
              <div class="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-slate-700 mb-2">Budget Efficiency</h4>
              <p class="text-2xl font-bold text-gold-600 mb-1">{{ budgetEfficiency }}%</p>
              <p class="text-sm text-slate-500">spending control</p>
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
import { formatCurrency } from '@/utils/formatters'
import { barChartConfig, doughnutChartConfig, generateCategoryColors } from '@/utils/chartConfig'

const loading = ref(false)
const error = ref(null)
const reportData = ref(null)
const selectedYear = ref(new Date().getFullYear())

const monthlyChart = ref(null)
const categoryChart = ref(null)
let monthlyChartInstance = null
let categoryChartInstance = null

const isCurrentYear = computed(() => {
  return selectedYear.value === new Date().getFullYear()
})

const netAmount = computed(() => {
  if (!reportData.value) return 0
  return reportData.value.summary.totalIncome - reportData.value.summary.totalExpenses
})

const monthlyAverage = computed(() => {
  if (!reportData.value) return 0
  return (reportData.value.summary.totalIncome - reportData.value.summary.totalExpenses) / 12
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

const getSavingsRateColor = () => {
  const rate = savingsRate.value
  if (rate >= 20) return 'text-emerald-500'
  if (rate >= 10) return 'text-blue-500'
  if (rate >= 0) return 'text-gold-500'
  return 'text-red-500'
}

const yearOverYearIncome = computed(() => {
  if (!reportData.value?.yearOverYear || reportData.value.yearOverYear.length < 2) return 0
  const currentYear = reportData.value.yearOverYear.find(y => y.year === selectedYear.value)
  const previousYear = reportData.value.yearOverYear.find(y => y.year === selectedYear.value - 1)
  
  if (!currentYear || !previousYear || previousYear.income === 0) return 0
  
  return Math.round(((currentYear.income - previousYear.income) / previousYear.income) * 100)
})

const yearOverYearExpenses = computed(() => {
  if (!reportData.value?.yearOverYear || reportData.value.yearOverYear.length < 2) return 0
  const currentYear = reportData.value.yearOverYear.find(y => y.year === selectedYear.value)
  const previousYear = reportData.value.yearOverYear.find(y => y.year === selectedYear.value - 1)
  
  if (!currentYear || !previousYear || previousYear.expenses === 0) return 0
  
  return Math.round(((currentYear.expenses - previousYear.expenses) / previousYear.expenses) * 100)
})

const emergencyFundMonths = computed(() => {
  if (!reportData.value) return 0
  const monthlyExpenses = reportData.value.summary.totalExpenses / 12
  const emergencyFund = netAmount.value > 0 ? netAmount.value : 0
  return monthlyExpenses > 0 ? Math.round((emergencyFund / monthlyExpenses) * 10) / 10 : 0
})

const budgetEfficiency = computed(() => {
  // Mock calculation - in real app, this would be based on actual budget vs spending
  return Math.min(100, Math.max(0, 100 - Math.abs(yearOverYearExpenses.value)))
})

const previousYear = () => {
  selectedYear.value -= 1
}

const nextYear = () => {
  if (!isCurrentYear.value) {
    selectedYear.value += 1
  }
}

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await reportService.getYearlyReport(selectedYear.value)
    reportData.value = response.report
    
    // Calculate additional metrics
    const income = reportData.value.summary.totalIncome
    const expenses = reportData.value.summary.totalExpenses
    reportData.value.summary.netAmount = income - expenses
    reportData.value.summary.monthlyAverage = (income - expenses) / 12
    
    await nextTick()
    initializeCharts()
  } catch (err) {
    error.value = err.message || 'Failed to load yearly report'
  } finally {
    loading.value = false
  }
}

const initializeCharts = () => {
  if (monthlyChartInstance) {
    monthlyChartInstance.destroy()
  }
  if (categoryChartInstance) {
    categoryChartInstance.destroy()
  }
  
  createMonthlyChart()
  createCategoryChart()
}

const createMonthlyChart = () => {
  if (!monthlyChart.value || !reportData.value?.monthlyBreakdown) return
  
  const ctx = monthlyChart.value.getContext('2d')
  const monthlyData = reportData.value.monthlyBreakdown
  
  monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthlyData.map(month => month.month),
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(month => month.income),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: 'Expenses',
          data: monthlyData.map(month => month.expenses),
          backgroundColor: '#F59E0B',
          borderColor: '#F59E0B',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    },
    options: {
      ...barChartConfig,
      scales: {
        ...barChartConfig.scales,
        x: {
          ...barChartConfig.scales.x,
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    }
  })
}

const createCategoryChart = () => {
  if (!categoryChart.value || !reportData.value?.categoryTotals) return
  
  const ctx = categoryChart.value.getContext('2d')
  const categories = reportData.value.categoryTotals.slice(0, 8) // Top 8 categories
  const colors = generateCategoryColors(categories)
  
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(cat => cat.category),
      datasets: [{
        data: categories.map(cat => cat.total),
        backgroundColor: colors,
        borderColor: colors.map(color => color + '20'),
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: doughnutChartConfig
  })
}

const exportReport = async () => {
  try {
    await reportService.exportReportPDF('yearly', { year: selectedYear.value })
  } catch (err) {
  }
}

watch(selectedYear, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>