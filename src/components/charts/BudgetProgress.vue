<!-- src/components/charts/BudgetProgress.vue -->
<template>
  <div class="budget-progress">
    <!-- Enhanced Title and Info Section -->
    <div class="budget-header flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold mb-1">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="showLegend" class="budget-legend">
        <div class="budget-legend-item">
          <div class="budget-legend-dot bg-emerald-500"></div>
          <span>Spent</span>
        </div>
        <div class="budget-legend-item">
          <div class="budget-legend-dot bg-gray-200"></div>
          <span>Remaining</span>
        </div>
      </div>
    </div>

    <!-- Enhanced Progress Bars -->
    <div class="space-y-4">
      <template v-if="Array.isArray(budgets)">
        <!-- Multiple Budgets -->
        <div 
          v-for="(budget, index) in budgets" 
          :key="index"
          class="budget-item"
        >
          <div class="budget-item-header">
            <div class="budget-item-title">
              <div 
                v-if="budget.icon" 
                class="budget-item-icon"
                :class="getBudgetIconClass(budget)"
              >
                <i :class="budget.icon"></i>
              </div>
              <span class="budget-item-name">{{ budget.name }}</span>
            </div>
            <div class="budget-item-amounts">
              <span class="budget-item-spent">
                {{ formatCurrency(budget.spent) }}
              </span>
              <span class="budget-item-limit"> / {{ formatCurrency(budget.limit) }}</span>
            </div>
          </div>
          
          <div class="budget-progress-bar">
            <div 
              class="budget-progress-fill"
              :class="getBudgetProgressClass(budget)"
              :style="{ width: `${calculatePercentage(budget.spent, budget.limit)}%` }"
            ></div>
          </div>
          
          <div class="budget-item-footer">
            <span class="budget-percentage">{{ calculatePercentage(budget.spent, budget.limit) }}% used</span>
            <span class="budget-remaining" :class="getBudgetStatusClass(budget)">
              {{ getRemainingText(budget) }}
            </span>
          </div>
        </div>
      </template>
      
      <template v-else>
        <!-- Single Budget -->
        <div class="budget-item">
          <div class="budget-item-header">
            <div class="budget-item-amounts">
              <span class="budget-item-spent">{{ formatCurrency(spent) }}</span>
              <span class="budget-item-limit"> of {{ formatCurrency(limit) }}</span>
            </div>
            <div 
              class="budget-remaining font-medium"
              :class="getStatusClass()"
            >
              {{ getStatusText() }}
            </div>
          </div>
          
          <div class="budget-progress-bar">
            <div 
              class="budget-progress-fill"
              :class="getProgressClass()"
              :style="{ width: `${percentage}%` }"
            ></div>
          </div>
          
          <div class="budget-item-footer">
            <div class="budget-percentage">
              {{ percentage }}% used
            </div>
            <div class="budget-remaining" :class="getStatusClass()">
              {{ formatCurrency(remaining) }} remaining
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="loading" class="chart-loading">
      <div class="chart-loading-spinner"></div>
    </div>

    <!-- Enhanced Empty State -->
    <div v-if="!loading && !hasData" class="no-data-state">
      <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <p class="no-data-title">No budget data available</p>
      <p class="no-data-subtitle">Set up your budget to track spending progress</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Title for the budget progress component
  title: {
    type: String,
    default: 'Budget Progress'
  },
  
  // Optional subtitle
  subtitle: {
    type: String,
    default: ''
  },
  
  // Show legend
  showLegend: {
    type: Boolean,
    default: false
  },
  
  // Loading state
  loading: {
    type: Boolean,
    default: false
  },
  
  // Single budget mode
  spent: {
    type: Number,
    default: 0
  },
  
  limit: {
    type: Number,
    default: 100
  },
  
  // Multiple budgets mode
  budgets: {
    type: Array,
    default: null
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

// Computed properties
const percentage = computed(() => {
  return calculatePercentage(props.spent, props.limit)
})

const remaining = computed(() => {
  return Math.max(0, props.limit - props.spent)
})

const hasData = computed(() => {
  if (Array.isArray(props.budgets)) {
    return props.budgets.length > 0
  }
  return props.limit > 0
})

// Methods
const calculatePercentage = (spent, limit) => {
  if (limit <= 0) return 0
  const percentage = (spent / limit) * 100
  return Math.min(Math.round(percentage), 100)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat(props.currencyOptions.locale, {
    style: 'currency',
    currency: props.currencyOptions.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Single budget methods
const getProgressClass = () => {
  const percent = percentage.value
  if (percent >= 100) return 'status-danger'
  if (percent >= 85) return 'status-warning'
  return 'status-safe'
}

const getStatusClass = () => {
  const percent = percentage.value
  if (percent >= 100) return 'status-danger'
  if (percent >= 85) return 'status-warning'
  return 'status-safe'
}

const getStatusText = () => {
  const percent = percentage.value
  if (percent >= 100) return 'Over budget'
  if (percent >= 85) return 'Near limit'
  return 'On track'
}

// Multiple budgets methods
const getBudgetProgressClass = (budget) => {
  const percent = calculatePercentage(budget.spent, budget.limit)
  if (percent >= 100) return 'status-danger'
  if (percent >= 85) return 'status-warning'
  return 'status-safe'
}

const getBudgetStatusClass = (budget) => {
  const percent = calculatePercentage(budget.spent, budget.limit)
  if (percent >= 100) return 'status-danger'
  if (percent >= 85) return 'status-warning'
  return 'status-safe'
}

const getBudgetIconClass = (budget) => {
  const percent = calculatePercentage(budget.spent, budget.limit)
  if (percent >= 100) return 'bg-red-100 text-red-600'
  if (percent >= 85) return 'bg-amber-100 text-amber-600'
  return 'bg-emerald-100 text-emerald-600'
}

const getRemainingText = (budget) => {
  const remaining = Math.max(0, budget.limit - budget.spent)
  return `${formatCurrency(remaining)} left`
}
</script>

<style scoped>
/* Component-specific styles are now handled by the imported chart-components.css */
/* Any additional component-specific overrides can go here */

.budget-progress {
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
</style>