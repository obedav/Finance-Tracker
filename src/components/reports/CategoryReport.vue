<!-- src/views/reports/CategoryReport.vue -->
<template>
  <div class="min-h-screen bg-cream p-6">
    <div class="container-app">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold text-slate-700">Category Report</h1>
        <p class="text-slate-500">Analyze spending and income by category</p>
      </div>

      <!-- Filters -->
      <div class="card mb-8">
        <h3 class="text-lg font-semibold text-slate-700 mb-4">Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Period</label>
            <select v-model="filters.period" @change="loadData" class="form-input">
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label class="form-label">Type</label>
            <select v-model="filters.type" @change="loadData" class="form-input">
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div v-if="filters.period === 'custom'">
            <label class="form-label">Start Date</label>
            <input 
              v-model="filters.startDate" 
              @change="loadData"
              type="date" 
              class="form-input"
            >
          </div>
          <div v-if="filters.period === 'custom'">
            <label class="form-label">End Date</label>
            <input 
              v-model="filters.endDate" 
              @change="loadData"
              type="date" 
              class="form-input"
            >
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="loading-spinner"></div>
        <span class="ml-3 text-slate-600">Loading report...</span>
      </div>

      <!-- Report Content -->
      <div v-else-if="reportData" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Categories</p>
                <p class="text-2xl font-bold text-slate-700">{{ reportData.categories.length }}</p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Top Category</p>
                <p class="text-lg font-bold text-emerald-600">{{ reportData.insights?.topCategory || 'N/A' }}</p>
                <p class="text-sm text-slate-500">{{ formatCurrency(reportData.insights?.topCategoryAmount || 0) }}</p>
              </div>
              <div class="category-icon category-icon-expense group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="dashboard-card hover-lift group">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Fastest Growing</p>
                <p class="text-lg font-bold text-gold-600">{{ reportData.insights?.fastestGrowing || 'N/A' }}</p>
                <p class="text-sm text-emerald-500">+{{ reportData.insights?.growthRate || 0 }}%</p>
              </div>
              <div class="category-icon category-icon-income group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Category Breakdown Chart -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-slate-700">Category Breakdown</h3>
              <div class="flex space-x-2">
                <button 
                  @click="chartType = 'pie'"
                  :class="chartType === 'pie' ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'"
                >
                  Pie
                </button>
                <button 
                  @click="chartType = 'doughnut'"
                  :class="chartType === 'doughnut' ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'"
                >
                  Doughnut
                </button>
              </div>
            </div>
            <div class="h-80">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>

          <!-- Category Trends Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-slate-700 mb-6">Category Trends</h3>
            <div class="h-80">
              <canvas ref="trendsChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Category Details Table -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-700">Category Details</h3>
            <div class="flex space-x-2">
              <button @click="exportData('csv')" class="btn-outline btn-sm">
                Export CSV
              </button>
              <button @click="exportData('pdf')" class="btn-primary btn-sm">
                Export PDF
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Percentage</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Trend</th>
                  <th class="text-right py-3 px-4 font-semibold text-slate-700">Transactions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="category in sortedCategories" 
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
                  <td class="py-4 px-4 text-right">
                    <span 
                      :class="category.trend === 'increasing' ? 'text-emerald-600' : 'text-gold-600'"
                      class="flex items-center justify-end"
                    >
                      <svg 
                        class="w-4 h-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          v-if="category.trend === 'increasing'"
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
                      {{ category.trendPercentage?.toFixed(1) || 0 }}%
                    </span>
                  </td>
                  <td class="py-4 px-4 text-right text-slate-600">
                    {{ category.transactionCount || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Insights Section -->
        <div class="card" v-if="reportData.insights?.recommendations">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Insights & Recommendations</h3>
          <div class="space-y-4">
            <div 
              v-for="(recommendation, index) in reportData.insights.recommendations"
              :key="index"
              class="flex items-start p-4 bg-blue-50 rounded-lg"
            >
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p class="text-slate-700">{{ recommendation }}</p>
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
import { pieChartConfig, doughnutChartConfig, lineChartConfig, generateCategoryColors } from '@/utils/chartConfig'

const loading = ref(false)
const error = ref(null)
const reportData = ref(null)
const chartType = ref('pie')

const filters = ref({
  period: 'month',
  type: '',
  startDate: '',
  endDate: ''
})

const categoryChart = ref(null)
const trendsChart = ref(null)
let categoryChartInstance = null
let trendsChartInstance = null

const sortedCategories = computed(() => {
  if (!reportData.value?.categories) return []
  return [...reportData.value.categories].sort((a, b) => b.amount - a.amount)
})

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await reportService.getCategoryReport(filters.value.period, filters.value.type)
    reportData.value = response.report
    
    await nextTick()
    initializeCharts()
  } catch (err) {
    error.value = err.message || 'Failed to load category report'
  } finally {
    loading.value = false
  }
}

const initializeCharts = () => {
  if (categoryChartInstance) {
    categoryChartInstance.destroy()
  }
  if (trendsChartInstance) {
    trendsChartInstance.destroy()
  }
  
  createCategoryChart()
  createTrendsChart()
}

const createCategoryChart = () => {
  if (!categoryChart.value || !reportData.value?.categories) return
  
  const ctx = categoryChart.value.getContext('2d')
  const categories = reportData.value.categories
  const colors = generateCategoryColors(categories)
  
  const config = chartType.value === 'pie' ? pieChartConfig : doughnutChartConfig
  
  categoryChartInstance = new Chart(ctx, {
    type: chartType.value,
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
    options: config
  })
}

const createTrendsChart = () => {
  if (!trendsChart.value || !reportData.value?.trends) return
  
  const ctx = trendsChart.value.getContext('2d')
  const trends = reportData.value.trends
  const categories = Object.keys(trends[0]).filter(key => key !== 'month')
  const colors = generateCategoryColors(categories)
  
  trendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trends.map(trend => trend.month),
      datasets: categories.map((category, index) => ({
        label: category,
        data: trends.map(trend => trend[category] || 0),
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: colors[index],
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    },
    options: lineChartConfig
  })
}

const getCategoryColor = (categoryName) => {
  if (!reportData.value?.categories) return '#10B981'
  
  const index = reportData.value.categories.findIndex(cat => cat.category === categoryName)
  const colors = generateCategoryColors(reportData.value.categories)
  return colors[index] || '#10B981'
}

const exportData = async (format) => {
  try {
    if (format === 'csv') {
      await reportService.exportReportExcel('category', filters.value)
    } else if (format === 'pdf') {
      await reportService.exportReportPDF('category', filters.value)
    }
  } catch (err) {
  }
}

watch(chartType, () => {
  if (reportData.value) {
    createCategoryChart()
  }
})

onMounted(() => {
  loadData()
})
</script>