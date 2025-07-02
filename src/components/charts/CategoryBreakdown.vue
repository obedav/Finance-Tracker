<!-- src/components/charts/CategoryBreakdown.vue -->
<template>
  <div class="category-breakdown">
    <!-- Enhanced Header Section -->
    <div class="category-breakdown-header">
      <div>
        <h3 class="text-xl font-bold mb-1">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      
      <!-- Enhanced Chart Type Selector -->
      <div v-if="showChartTypeSelector" class="chart-type-selector">
        <button 
          v-for="type in chartTypes" 
          :key="type.value"
          @click="selectedChartType = type.value"
          class="chart-type-button"
          :class="{ active: selectedChartType === type.value }"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Enhanced Chart Container -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Chart -->
      <div class="lg:col-span-3 flex items-center justify-center">
        <div class="chart-container" style="position: relative; height: 280px; width: 100%">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
      
      <!-- Enhanced Legend and Details -->
      <div class="lg:col-span-2">
        <!-- Enhanced Loading State -->
        <div v-if="loading" class="chart-loading">
          <div class="chart-loading-spinner"></div>
        </div>
        
        <!-- Enhanced Empty State -->
        <div v-else-if="!hasData" class="no-data-state">
          <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="no-data-title">No category data available</p>
          <p class="no-data-subtitle">Add transactions to see your category breakdown</p>
        </div>
        
        <!-- Enhanced Category Legend -->
        <div v-else class="category-legend">
          <div 
            v-for="(category, index) in sortedCategories" 
            :key="category.name"
            class="category-item"
            @mouseenter="highlightSegment(index)"
            @mouseleave="resetHighlight()"
          >
            <div 
              class="category-color-dot"
              :style="{ backgroundColor: category.color }"
            ></div>
            
            <div class="category-details">
              <div class="flex justify-between items-center mb-1">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-amount">{{ formatCurrency(category.amount) }}</span>
              </div>
              
              <div class="category-progress-container">
                <div class="category-progress-bar">
                  <div 
                    class="category-progress-fill" 
                    :style="{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }"
                  ></div>
                </div>
                <span class="category-percentage">{{ category.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Summary Section -->
    <div v-if="showSummary && hasData" class="category-summary">
      <div class="summary-grid">
        <div class="summary-stat">
          <div class="summary-stat-label">Total</div>
          <div class="summary-stat-value">{{ formatCurrency(totalAmount) }}</div>
        </div>
        
        <div class="summary-stat">
          <div class="summary-stat-label">Top Category</div>
          <div class="summary-stat-value">{{ topCategory?.name || 'N/A' }}</div>
        </div>
        
        <div class="summary-stat">
          <div class="summary-stat-label">Categories</div>
          <div class="summary-stat-value">{{ categories.length }}</div>
        </div>
        
        <div class="summary-stat">
          <div class="summary-stat-label">Average</div>
          <div class="summary-stat-value">{{ formatCurrency(averageAmount) }}</div>
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
    default: 'Category Breakdown'
  },
  
  // Optional subtitle
  subtitle: {
    type: String,
    default: ''
  },
  
  // Categories data
  categories: {
    type: Array,
    default: () => []
  },
  
  // Loading state
  loading: {
    type: Boolean,
    default: false
  },
  
  // Show chart type selector
  showChartTypeSelector: {
    type: Boolean,
    default: true
  },
  
  // Show summary section
  showSummary: {
    type: Boolean,
    default: true
  },
  
  // Default chart type
  defaultChartType: {
    type: String,
    default: 'doughnut',
    validator: (value) => ['doughnut', 'pie', 'polarArea'].includes(value)
  },
  
  // Color palette
  colorPalette: {
    type: Array,
    default: () => [
      '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
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

// Refs
const chartCanvas = ref(null)
const chartInstance = ref(null)
const selectedChartType = ref(props.defaultChartType)

// Available chart types
const chartTypes = [
  { label: 'Doughnut', value: 'doughnut' },
  { label: 'Pie', value: 'pie' },
  { label: 'Polar', value: 'polarArea' }
]

// Computed properties
const hasData = computed(() => {
  return props.categories && props.categories.length > 0
})

const processedCategories = computed(() => {
  if (!props.categories || props.categories.length === 0) return []
  
  const total = props.categories.reduce((sum, category) => sum + category.amount, 0)
  
  return props.categories.map((category, index) => {
    const colorIndex = index % props.colorPalette.length
    const percentage = total > 0 ? (category.amount / total) * 100 : 0
    
    return {
      ...category,
      color: category.color || props.colorPalette[colorIndex],
      percentage: percentage
    }
  })
})

const sortedCategories = computed(() => {
  return [...processedCategories.value].sort((a, b) => b.amount - a.amount)
})

const totalAmount = computed(() => {
  return props.categories.reduce((sum, category) => sum + category.amount, 0)
})

const averageAmount = computed(() => {
  if (props.categories.length === 0) return 0
  return totalAmount.value / props.categories.length
})

const topCategory = computed(() => {
  if (props.categories.length === 0) return null
  return sortedCategories.value[0]
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
  if (!chartCanvas.value || !hasData.value) return
  
  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Prepare chart data
  const data = {
    labels: processedCategories.value.map(cat => cat.name),
    datasets: [{
      data: processedCategories.value.map(cat => cat.amount),
      backgroundColor: processedCategories.value.map(cat => cat.color),
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
    type: selectedChartType.value,
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
  
  chartInstance.value.setActiveElements([{
    datasetIndex: 0,
    index: index
  }])
  
  chartInstance.value.update('none')
}

const resetHighlight = () => {
  if (!chartInstance.value) return
  
  chartInstance.value.setActiveElements([])
  chartInstance.value.update('none')
}

// Lifecycle hooks
onMounted(() => {
  if (hasData.value) {
    nextTick(() => {
      createChart()
    })
  }
})

// Watch for changes
watch(() => props.categories, () => {
  nextTick(() => {
    createChart()
  })
}, { deep: true })

watch(selectedChartType, () => {
  nextTick(() => {
    createChart()
  })
})

watch(() => props.loading, (newLoading) => {
  if (!newLoading && hasData.value) {
    nextTick(() => {
      createChart()
    })
  }
})
</script>

<style scoped>
/* Component-specific styles are now handled by the imported chart-components.css */
/* Any additional component-specific overrides can go here */

.category-breakdown {
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