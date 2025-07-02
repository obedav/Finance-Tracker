<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" height="300"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Monthly Trend'
  },
  chartColor: {
    type: String,
    default: '#3b82f6' // Blue
  }
})

const chartCanvas = ref(null)
const chartInstance = ref(null)

// Calculate forecast based on the last 3 data points
const forecast = computed(() => {
  if (!props.data || props.data.length < 3) return null
  
  // Get the last 3 values
  const lastValues = props.data.slice(-3).map(item => item.value || 0)
  
  // Simple linear regression for forecasting
  // Using weighted average with more weight on recent data
  const weightedSum = lastValues[0] * 0.2 + lastValues[1] * 0.3 + lastValues[2] * 0.5
  
  // Add a small growth factor based on the trend
  const trend = (lastValues[2] - lastValues[0]) / 2
  return weightedSum + trend
})

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })

watch(() => props.chartColor, () => {
  createChart()
})

const createChart = () => {
  if (!chartCanvas.value) return
  
  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
  
  // Check if we have valid data
  if (!props.data || props.data.length === 0) {
    console.log('No data provided to MonthlyTrendLine')
    return
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Generate gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 300)
  gradient.addColorStop(0, `${props.chartColor}40`) // 40% opacity
  gradient.addColorStop(1, `${props.chartColor}10`) // 10% opacity
  
  // Prepare chart data
  const chartData = {
    labels: props.data.map(item => item.label || ''),
    datasets: [
      {
        label: props.title,
        data: props.data.map(item => item.value || 0),
        borderColor: props.chartColor,
        backgroundColor: gradient,
        borderWidth: 3,
        pointBackgroundColor: props.chartColor,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  }
  
  // Add forecast point if we have enough data
  if (props.data.length >= 3 && forecast.value !== null) {
    const lastLabel = props.data[props.data.length - 1].label || ''
    let nextLabel = 'Next'
    
    // Try to determine the next month label
    if (lastLabel.length >= 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const lastMonthIndex = months.findIndex(m => lastLabel.includes(m))
      if (lastMonthIndex !== -1) {
        nextLabel = months[(lastMonthIndex + 1) % 12]
        // Add year if December -> January
        if (lastMonthIndex === 11) {
          const yearMatch = lastLabel.match(/\d{2}/)
          if (yearMatch) {
            const currentYear = parseInt(yearMatch[0])
            const nextYear = (currentYear + 1) % 100
            nextLabel += ` ${nextYear.toString().padStart(2, '0')}`
          }
        }
      }
    }
    
    // Add forecast dataset
    chartData.labels.push(nextLabel)
    chartData.datasets.push({
      label: 'Forecast',
      data: [...props.data.map(() => null), forecast.value],
      borderColor: '#9333EA', // Purple
      backgroundColor: '#9333EA',
      borderWidth: 3,
      borderDash: [8, 4],
      pointBackgroundColor: '#9333EA',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 9,
      fill: false
    })
  }
  
  // Chart configuration
  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                }).format(context.parsed.y)
              }
              return label
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)
            }
          }
        }
      }
    }
  }
  
  // Create chart
  try {
    chartInstance.value = new Chart(ctx, config)
    console.log('MonthlyTrendLine chart created successfully')
  } catch (error) {
    console.error('Error creating MonthlyTrendLine chart:', error)
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>