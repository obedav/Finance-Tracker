// src/utils/chartConfig.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

// Color palette from your design system
export const COLORS = {
  primary: '#10B981',      // Emerald Green
  secondary: '#F59E0B',    // Gold/Amber
  background: '#FAF9F6',   // Cream White
  text: '#334155',         // Slate Gray
  border: '#E5E7EB',       // Light Gray
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
}

// Chart color variations
export const CHART_COLORS = {
  income: COLORS.primary,
  expense: COLORS.secondary,
  gradient: {
    income: ['#10B981', '#34D399'],
    expense: ['#F59E0B', '#FBBF24'],
    neutral: ['#6B7280', '#9CA3AF']
  }
}

// Common chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        },
        color: COLORS.text
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: COLORS.text,
      bodyColor: COLORS.text,
      borderColor: COLORS.border,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: true,
      callbacks: {
        title: function(context) {
          return context[0].label || ''
        },
        label: function(context) {
          const label = context.dataset.label || ''
          const value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(context.parsed.y || context.parsed)
          return `${label}: ${value}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: COLORS.border,
        borderDash: [2, 2]
      },
      ticks: {
        color: COLORS.text,
        font: {
          family: 'Inter, sans-serif',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: COLORS.border,
        borderDash: [2, 2]
      },
      ticks: {
        color: COLORS.text,
        font: {
          family: 'Inter, sans-serif',
          size: 11
        },
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

// Line chart configuration
export const lineChartConfig = {
  ...defaultChartOptions,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 3
    },
    point: {
      radius: 6,
      hoverRadius: 8,
      borderWidth: 2,
      backgroundColor: '#ffffff'
    }
  }
}

// Bar chart configuration
export const barChartConfig = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      ...defaultChartOptions.plugins.legend,
      display: true
    }
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false
    }
  }
}

// Pie chart configuration
export const pieChartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        },
        color: COLORS.text,
        generateLabels: function(chart) {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const dataset = data.datasets[0]
              const value = dataset.data[i]
              const total = dataset.data.reduce((sum, val) => sum + val, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor[i],
                lineWidth: dataset.borderWidth,
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: COLORS.text,
      bodyColor: COLORS.text,
      borderColor: COLORS.border,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value)
          return `${label}: ${formattedValue} (${percentage}%)`
        }
      }
    }
  },
  elements: {
    arc: {
      borderWidth: 2,
      borderColor: '#ffffff'
    }
  }
}

// Doughnut chart configuration
export const doughnutChartConfig = {
  ...pieChartConfig,
  cutout: '60%',
  plugins: {
    ...pieChartConfig.plugins,
    legend: {
      ...pieChartConfig.plugins.legend,
      position: 'bottom'
    }
  }
}

// Area chart configuration
export const areaChartConfig = {
  ...lineChartConfig,
  plugins: {
    ...lineChartConfig.plugins,
    filler: {
      propagate: false
    }
  },
  elements: {
    ...lineChartConfig.elements,
    line: {
      ...lineChartConfig.elements.line,
      fill: true
    }
  }
}

// Generate gradient for charts
export const createGradient = (ctx, colorStart, colorEnd) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)
  return gradient
}

// Generate chart colors for categories
export const generateCategoryColors = (categories) => {
  const baseColors = [
    COLORS.primary,
    COLORS.secondary,
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EF4444', // Red
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#14B8A6'  // Teal
  ]
  
  return categories.map((_, index) => 
    baseColors[index % baseColors.length]
  )
}

// Income vs Expenses chart data formatter
export const formatIncomeExpenseData = (monthlyData) => {
  return {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(item => item.income),
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Expenses',
        data: monthlyData.map(item => item.expenses),
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  }
}

// Category breakdown pie chart data formatter
export const formatCategoryData = (categoryData, type = 'expense') => {
  const colors = generateCategoryColors(categoryData)
  
  return {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: colors,
        borderColor: colors.map(color => color + '20'),
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  }
}

// Trend line chart data formatter
export const formatTrendData = (trendData, label = 'Amount') => {
  return {
    labels: trendData.map(item => item.date),
    datasets: [
      {
        label: label,
        data: trendData.map(item => item.amount),
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: COLORS.primary,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }
}

// Multi-line chart data formatter
export const formatMultiLineData = (data, datasets) => {
  const colors = [COLORS.primary, COLORS.secondary, '#8B5CF6', '#06B6D4']
  
  return {
    labels: data.labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: colors[index % colors.length],
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }))
  }
}

// Chart animation configurations
export const animations = {
  slow: {
    duration: 2000,
    easing: 'easeInOutQuart'
  },
  normal: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  fast: {
    duration: 500,
    easing: 'easeInOutQuart'
  },
  bounce: {
    duration: 1500,
    easing: 'easeOutBounce'
  }
}

// Export all configurations
export default {
  COLORS,
  CHART_COLORS,
  defaultChartOptions,
  lineChartConfig,
  barChartConfig,
  pieChartConfig,
  doughnutChartConfig,
  areaChartConfig,
  createGradient,
  generateCategoryColors,
  formatIncomeExpenseData,
  formatCategoryData,
  formatTrendData,
  formatMultiLineData,
  animations
}