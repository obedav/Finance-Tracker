<!-- src/components/charts/ExpensePieChart.vue -->
<template>
  <div class="expense-pie-chart">
    <!-- Enhanced Header Section -->
    <div class="expense-chart-header">
      <div>
        <h3 class="text-xl font-bold mb-1">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      
      <!-- Enhanced Period Selector -->
      <div v-if="showPeriodSelector" class="expense-period-selector">
        <button 
          v-for="period in periods" 
          :key="period.value"
          @click="selectedPeriod = period.value; $emit('period-change', period.value)"
          class="expense-period-button"
          :class="{ active: selectedPeriod === period.value }"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Enhanced Chart Container -->
    <div class="relative">
      <!-- Enhanced Loading State -->
      <div v-if="loading" class="chart-loading">
        <div class="chart-loading-spinner"></div>
      </div>
      
      <!-- Enhanced Empty State -->
      <div v-if="!loading && (!expenses || expenses.length === 0)" class="no-data-state">
        <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p class="no-data-title">No expense data available</p>
        <p class="no-data-subtitle">{{ emptyStateMessage }}</p>
      </div>
      
      <!-- Enhanced Chart and Legend -->
      <div v-else-if="!loading && expenses.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Chart -->
        <div class="lg:col-span-7 flex items-center justify-center">
          <div class="chart-container" style="position: relative; height: 300px; width: 100%">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
        
        <!-- Enhanced Legend and Top Expenses -->
        <div class="lg:col-span-5">
          <div class="top-expenses-container">
            <h4 class="top-expenses-title">Top Expenses</h4>
            <div class="expense-legend-list">
              <div 
                v-for="(expense, index) in sortedExpenses.slice(0, 5)" 
                :key="expense.category"
                class="expense-item"
                @mouseenter="highlightSegment(index)"
                @mouseleave="resetHighlight()"
              >
                <div 
                  class="expense-color-indicator"
                  :style="{ backgroundColor: getColor(index) }"
                ></div>
                
                <div class="expense-details">
                  <div class="flex justify-between items-center">
                    <span class="expense-category-name">{{ expense.category }}</span>
                    <span class="expense-amount">{{ formatCurrency(expense.amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Enhanced Summary Stats -->
            <div class="expense-summary-stats">
              <div class="expense-stats-grid">
                <div class="expense-stat-item">
                  <p class="expense-stat-label">Total Expenses</p>
                  <p class="expense-stat-value">{{ formatCurrency(totalExpenses) }}</p>
                </div>
                <div class="expense-stat-item">
                  <p class="expense-stat-label">Categories</p>
                  <p class="expense-stat-value">{{ expenses.length }}</p>
                </div>
                <div class="expense-stat-item">
                  <p class="expense-stat-label">Largest Expense</p>
                  <p class="expense-stat-value">{{ formatCurrency(largestExpense) }}</p>
                </div>
                <div class="expense-stat-item">
                  <p class="expense-stat-label">Average</p>
                  <p class="expense-stat-value">{{ formatCurrency(averageExpense) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// Props
const props = defineProps({
  // Chart title
  title: {
    type: String,
    default: 'Expense Breakdown'
  },
  
  // Optional subtitle
  subtitle: {
    type: String,
    default: ''
  },
  
  // Expenses data
  expenses: {
    type: Array,
    default: () => []
  },
  
  // Loading state
  loading: {
    type: Boolean,
    default: false
  },
  
  // Show period selector
  showPeriodSelector: {
    type: Boolean,
    default: true
  },
  
  // Default period
  defaultPeriod: {
    type: String,
    default: 'month'
  },
  
  // Empty state message
  emptyStateMessage: {
    type: String,
    default: 'Add expenses to see your spending breakdown'
  },
  
  // Color palette
  colorPalette: {
    type: Array,
    default: () => [
      '#F59E0B', '#EF4444', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
      '#6366F1', '#F97316', '#14B8A6', '#D946EF'
    ]
  },
  
  // Currency formatting options
  currencyOptions: {
    type: Object,
    default: () => ({
      currency: 'USD',
      locale: 'en-US'
    })
  }
})

// Emits
const emit = defineEmits(['period-change'])

// Refs
const chartCanvas = ref(null)
const chartInstance = ref(null)
const selectedPeriod = ref(props.defaultPeriod)

// Available periods
const periods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' }
]

// Computed properties
const sortedExpenses = computed(() => {
  return [...props.expenses].sort((a, b) => b.amount - a.amount)
})

const totalExpenses = computed(() => {
  return props.expenses.reduce((sum, expense) => sum + expense.amount, 0)
})

const largestExpense = computed(() => {
  if (props.expenses.length === 0) return 0
  return Math.max(...props.expenses.map(expense => expense.amount))
})

const averageExpense = computed(() => {
  if (props.expenses.length === 0) return 0
  return totalExpenses.value / props.expenses.length
})

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat(props.currencyOptions.locale, {
    style: 'currency',
    currency: props.currencyOptions.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const getColor = (index) => {
  return props.colorPalette[index % props.colorPalette.length]
}

const createChart = () => {
  if (!chartCanvas.value || props.expenses.length === 0) return
  
  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Prepare chart data
  const data = {
    labels: props.expenses.map(expense => expense.category),
    datasets: [{
      data: props.expenses.map(expense => expense.amount),
      backgroundColor: props.expenses.map((_, index) => getColor(index)),
      borderColor: '#FFFFFF',
      borderWidth: 2,
      hoverOffset: 20,
      hoverBorderWidth: 3
    }]
  }
  
      // Enhanced Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.raw
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      arc: {
        borderAlign: 'center'
      }
    }
  }
  
  // Create chart
  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
  })
}

const highlightSegment = (index) => {
  if (!chartInstance.value) return
  
  const activeSegments = chartInstance.value.getActiveElements()
  if (activeSegments.length > 0) {
    chartInstance.value.setActiveElements([])
  }
  
  // Find the actual index in the chart data
  const chartIndex = props.expenses.findIndex(
    expense => expense.category === sortedExpenses.value[index].category
  )
  
  if (chartIndex !== -1) {
    chartInstance.value.setActiveElements([{
      datasetIndex: 0,
      index: chartIndex
    }])
    
    chartInstance.value.update('none')
  }
}

const resetHighlight = () => {
  if (!chartInstance.value) return
  
  chartInstance.value.setActiveElements([])
  chartInstance.value.update('none')
}

// Lifecycle hooks
onMounted(() => {
  if (props.expenses && props.expenses.length > 0) {
    nextTick(() => {
      createChart()
    })
  }
})

// Watch for changes
watch(() => props.expenses, () => {
  nextTick(() => {
    createChart()
  })
}, { deep: true })

watch(() => props.loading, (newValue) => {
  if (!newValue && props.expenses && props.expenses.length > 0) {
    nextTick(() => {
      createChart()
    })
  }
})
</script>

<style scoped>
/* Component-specific styles are now handled by the imported chart-components.css */
/* Any additional component-specific overrides can go here */

.expense-pie-chart {
  /* Additional component-specific styles if needed */
}

/* Ensure proper animation keyframes are available */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}
</style>