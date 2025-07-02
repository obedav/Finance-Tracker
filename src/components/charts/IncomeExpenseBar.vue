<!-- src/components/charts/IncomeExpenseBar.vue -->
<template>
  <div class="income-expense-bar">
    <!-- Enhanced Header Section -->
    <div class="income-expense-header">
      <div>
        <h3 class="text-xl font-bold mb-1">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      
      <!-- Enhanced Period Selector -->
      <div v-if="showPeriodSelector" class="chart-type-selector">
        <button 
          v-for="period in periods" 
          :key="period.value"
          @click="selectedPeriod = period.value; $emit('period-change', period.value)"
          class="chart-type-button"
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
      <div v-if="!loading && (!data || data.length === 0)" class="no-data-state">
        <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p class="no-data-title">No data available</p>
        <p class="no-data-subtitle">{{ emptyStateMessage }}</p>
      </div>
      
      <!-- Enhanced Chart and Stats -->
      <div v-else-if="!loading && data.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Chart -->
        <div class="lg:col-span-8">
          <div class="chart-container" style="position: relative; height: 320px; width: 100%">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
        
        <!-- Enhanced Stats -->
        <div class="lg:col-span-4">
          <div class="income-expense-stats">
            <!-- Enhanced Summary -->
            <div class="income-expense-summary">
              <h4 class="summary-title">Summary</h4>
              <div class="space-y-2">
                <div class="summary-item">
                  <div class="summary-label">
                    <div class="summary-indicator bg-emerald-500"></div>
                    <span>Total Income</span>
                  </div>
                  <span class="summary-value income">{{ formatCurrency(totalIncome) }}</span>
                </div>
                <div class="summary-item">
                  <div class="summary-label">
                    <div class="summary-indicator bg-amber-500"></div>
                    <span>Total Expenses</span>
                  </div>
                  <span class="summary-value expense">{{ formatCurrency(totalExpenses) }}</span>
                </div>
                <div class="summary-item net-balance-divider net-balance-item">
                  <span class="summary-label">Net Balance</span>
                  <span 
                    class="summary-value"
                    :class="netBalance >= 0 ? 'positive' : 'negative'"
                  >
                    {{ formatCurrency(netBalance) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Enhanced Trends -->
            <div class="trends-section">
              <h4 class="summary-title">Trends</h4>
              <div class="space-y-4">
                <div class="trend-item">
                  <span class="trend-label">Highest Income</span>
                  <span class="trend-value">{{ formatCurrency(highestIncome.value) }}</span>
                </div>
                <div class="trend-sublabel">
                  {{ highestIncome.label }}
                </div>
                
                <div class="trend-item">
                  <span class="trend-label">Highest Expense</span>
                  <span class="trend-value">{{ formatCurrency(highestExpense.value) }}</span>
                </div>
                <div class="trend-sublabel">
                  {{ highestExpense.label }}
                </div>
                
                <div class="trend-item">
                  <span class="trend-label">Savings Rate</span>
                  <span 
                    class="trend-value savings-rate"
                    :class="savingsRate >= 0 ? 'positive' : 'negative'"
                  >
                    {{ savingsRate }}%
                  </span>
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
    default: 'Income vs Expenses'
  },
  
  // Optional subtitle
  subtitle: {
    type: String,
    default: ''
  },
  
  // Chart data
  data: {
    type: Array,
    default: () => []
    // Expected format: [{ label: 'Jan', income: 1000, expenses: 800 }, ...]
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
    default: 'Add transactions to see your income and expense comparison'
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
const totalIncome = computed(() => {
  return props.data.reduce((sum, item) => sum + (item.income || 0), 0)
})

const totalExpenses = computed(() => {
  return props.data.reduce((sum, item) => sum + (item.expenses || 0), 0)
})

const netBalance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0
  return Math.round((netBalance.value / totalIncome.value) * 100)
})

const highestIncome = computed(() => {
  if (props.data.length === 0) return { label: 'N/A', value: 0 }
  
  const highest = props.data.reduce((max, item) => {
    return (item.income > max.income) ? item : max
  }, { income: -Infinity })
  
  return { 
    label: highest.label || 'N/A', 
    value: highest.income || 0 
  }
})

const highestExpense = computed(() => {
  if (props.data.length === 0) return { label: 'N/A', value: 0 }
  
  const highest = props.data.reduce((max, item) => {
    return (item.expenses > max.expenses) ? item : max
  }, { expenses: -Infinity })
  
  return { 
    label: highest.label || 'N/A', 
    value: highest.expenses || 0 
  }
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

const createChart = () => {
  if (!chartCanvas.value || props.data.length === 0) return
  
  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Create gradients
  const incomeGradient = ctx.createLinearGradient(0, 0, 0, 300)
  incomeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)')
  incomeGradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)')
  
  const expenseGradient = ctx.createLinearGradient(0, 0, 0, 300)
  expenseGradient.addColorStop(0, 'rgba(245, 158, 11, 0.8)')
  expenseGradient.addColorStop(1, 'rgba(245, 158, 11, 0.4)')
  
  // Prepare chart data
  const chartData = {
    labels: props.data.map(item => item.label),
    datasets: [
      {
        label: 'Income',
        data: props.data.map(item => item.income || 0),
        backgroundColor: incomeGradient,
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      },
      {
        label: 'Expenses',
        data: props.data.map(item => item.expenses || 0),
        backgroundColor: expenseGradient,
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  }
  
  // Enhanced Chart configuration
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            font: {
              size: 12,
              weight: '500'
            },
            padding: 20,
            color: '#334155'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11,
              weight: '500'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11
            },
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      elements: {
        bar: {
          borderWidth: 2
        }
      }
    }
  })
}

// Lifecycle hooks
onMounted(() => {
  if (props.data && props.data.length > 0) {
    nextTick(() => {
      createChart()
    })
  }
})

// Watch for changes
watch(() => props.data, () => {
  nextTick(() => {
    createChart()
  })
}, { deep: true })

watch(() => props.loading, (newValue) => {
  if (!newValue && props.data && props.data.length > 0) {
    nextTick(() => {
      createChart()
    })
  }
})
</script>

<style scoped>
/* Component-specific styles are now handled by the imported chart-components.css */
/* Any additional component-specific overrides can go here */

.income-expense-bar {
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