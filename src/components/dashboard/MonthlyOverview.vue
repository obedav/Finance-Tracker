I'll create a complete implementation for the MonthlyOverview.vue component that will complement the DashboardSummary.vue component and fit with the overall design of your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\dashboard\MonthlyOverview.vue**
```vue
<!-- src/components/dashboard/MonthlyOverview.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg p-6 border border-[#E5E7EB] mb-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h3 class="text-lg font-semibold text-[#334155]">Monthly Overview</h3>
        <p class="text-sm text-[#334155]/70">{{ currentMonthName }} {{ currentYear }}</p>
      </div>
      
      <div class="flex items-center space-x-2 mt-2 sm:mt-0">
        <button 
          @click="previousMonth"
          class="p-2 rounded-full hover:bg-gray-100 text-[#334155]/70 transition-colors"
          aria-label="Previous month"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button 
          @click="resetToCurrentMonth"
          class="px-3 py-1 text-xs font-medium rounded-md bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors"
        >
          Today
        </button>
        
        <button 
          @click="nextMonth"
          class="p-2 rounded-full hover:bg-gray-100 text-[#334155]/70 transition-colors"
          :disabled="isCurrentMonth"
          :class="{ 'opacity-50 cursor-not-allowed': isCurrentMonth }"
          aria-label="Next month"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="text-center p-4 bg-[#FAF9F6] rounded-lg">
        <p class="text-2xl font-bold text-[#10B981]">{{ overview.incomeCount }}</p>
        <p class="text-sm text-[#334155]/70">Income Transactions</p>
      </div>
      <div class="text-center p-4 bg-[#FAF9F6] rounded-lg">
        <p class="text-2xl font-bold text-[#F59E0B]">{{ overview.expenseCount }}</p>
        <p class="text-sm text-[#334155]/70">Expense Transactions</p>
      </div>
      <div class="text-center p-4 bg-[#FAF9F6] rounded-lg">
        <p class="text-2xl font-bold text-[#334155]">{{ overview.totalTransactions }}</p>
        <p class="text-sm text-[#334155]/70">Total Transactions</p>
      </div>
      <div class="text-center p-4 bg-[#FAF9F6] rounded-lg">
        <p class="text-2xl font-bold" :class="savingsRateColor">{{ overview.savingsRate }}%</p>
        <p class="text-sm text-[#334155]/70">Savings Rate</p>
      </div>
    </div>

    <!-- Progress Bars -->
    <div class="space-y-4">
      <!-- Income Progress -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <div>
            <span class="text-sm font-medium text-[#334155]">Income</span>
            <span class="ml-2 text-xs text-[#334155]/70">vs. Target</span>
          </div>
          <div class="text-sm font-medium text-[#10B981]">
            ${{ formatCurrency(overview.income) }} / ${{ formatCurrency(overview.incomeTarget) }}
          </div>
        </div>
        <div class="w-full bg-[#E5E7EB] rounded-full h-2.5">
          <div 
            class="bg-[#10B981] h-2.5 rounded-full transition-all duration-500"
            :style="{ width: `${incomeProgress}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-[#334155]/70 mt-1">
          <span>{{ incomeProgress }}% of target</span>
          <span>{{ daysLeftInMonth }} days left</span>
        </div>
      </div>

      <!-- Expense Progress -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <div>
            <span class="text-sm font-medium text-[#334155]">Expenses</span>
            <span class="ml-2 text-xs text-[#334155]/70">vs. Budget</span>
          </div>
          <div class="text-sm font-medium text-[#F59E0B]">
            ${{ formatCurrency(overview.expenses) }} / ${{ formatCurrency(overview.expenseBudget) }}
          </div>
        </div>
        <div class="w-full bg-[#E5E7EB] rounded-full h-2.5">
          <div 
            class="h-2.5 rounded-full transition-all duration-500"
            :class="expenseProgressColor"
            :style="{ width: `${expenseProgress}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-[#334155]/70 mt-1">
          <span>{{ expenseProgress }}% of budget</span>
          <span>{{ expenseProgress > 100 ? 'Over budget' : 'Under budget' }}</span>
        </div>
      </div>

      <!-- Savings Progress -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <div>
            <span class="text-sm font-medium text-[#334155]">Savings</span>
            <span class="ml-2 text-xs text-[#334155]/70">vs. Goal</span>
          </div>
          <div class="text-sm font-medium text-[#334155]">
            ${{ formatCurrency(overview.savings) }} / ${{ formatCurrency(overview.savingsGoal) }}
          </div>
        </div>
        <div class="w-full bg-[#E5E7EB] rounded-full h-2.5">
          <div 
            class="bg-[#334155] h-2.5 rounded-full transition-all duration-500"
            :style="{ width: `${savingsProgress}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-[#334155]/70 mt-1">
          <span>{{ savingsProgress }}% of goal</span>
          <span>${{ formatCurrency(overview.savingsGoal - overview.savings) }} to go</span>
        </div>
      </div>
    </div>

    <!-- Daily Spending Chart -->
    <div class="mt-8">
      <h4 class="text-sm font-medium text-[#334155] mb-4">Daily Spending</h4>
      <div class="h-40 flex items-end space-x-1">
        <div 
          v-for="(day, index) in dailySpending" 
          :key="index"
          class="flex-1 flex flex-col items-center group"
        >
          <div class="relative w-full">
            <!-- Tooltip -->
            <div 
              class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-[#334155] text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            >
              ${{ formatCurrency(day.amount) }}
            </div>
            
            <!-- Bar -->
            <div 
              class="w-full bg-[#10B981]/20 hover:bg-[#10B981]/30 transition-colors rounded-t"
              :style="{ height: `${calculateBarHeight(day.amount)}px` }"
            ></div>
          </div>
          <span class="text-xs text-[#334155]/70 mt-1">{{ day.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportService } from '@/composables/useReportService'

// Services
const reportService = useReportService()

// State
const isLoading = ref(false)
const selectedDate = ref(new Date())
const monthlyData = ref(null)

// Computed properties
const currentMonthName = computed(() => {
  return selectedDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return selectedDate.value.getFullYear()
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  return selectedDate.value.getMonth() === now.getMonth() && 
         selectedDate.value.getFullYear() === now.getFullYear()
})

const daysLeftInMonth = computed(() => {
  const now = new Date()
  const lastDay = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0)
  
  // If viewing current month, calculate days remaining
  if (isCurrentMonth.value) {
    return lastDay.getDate() - now.getDate()
  }
  
  // If viewing past month, return 0
  if (selectedDate.value < now) {
    return 0
  }
  
  // If viewing future month, return total days in month
  return lastDay.getDate()
})

// Overview data with defaults
const overview = computed(() => {
  if (!monthlyData.value) {
    return {
      income: 0,
      incomeTarget: 1,
      incomeCount: 0,
      expenses: 0,
      expenseBudget: 1,
      expenseCount: 0,
      savings: 0,
      savingsGoal: 1,
      totalTransactions: 0,
      savingsRate: 0
    }
  }
  
  const data = monthlyData.value
  
  return {
    income: data.income,
    incomeTarget: data.incomeTarget || data.income || 1,
    incomeCount: data.incomeCount,
    expenses: data.expenses,
    expenseBudget: data.expenseBudget || data.expenses || 1,
    expenseCount: data.expenseCount,
    savings: data.income - data.expenses,
    savingsGoal: data.savingsGoal || (data.income - data.expenses) || 1,
    totalTransactions: data.incomeCount + data.expenseCount,
       savingsRate: data.savingsRate || calculateSavingsRate(data.income, data.expenses)
  }
})

// Progress calculations
const incomeProgress = computed(() => {
  if (!overview.value.incomeTarget) return 0
  const progress = (overview.value.income / overview.value.incomeTarget) * 100
  return Math.min(Math.round(progress), 100)
})

const expenseProgress = computed(() => {
  if (!overview.value.expenseBudget) return 0
  const progress = (overview.value.expenses / overview.value.expenseBudget) * 100
  return Math.round(progress)
})

const expenseProgressColor = computed(() => {
  if (expenseProgress.value > 100) return 'bg-[#EF4444]'
  if (expenseProgress.value > 90) return 'bg-[#F59E0B]'
  return 'bg-[#10B981]'
})

const savingsProgress = computed(() => {
  if (!overview.value.savingsGoal) return 0
  const progress = (overview.value.savings / overview.value.savingsGoal) * 100
  return Math.min(Math.round(progress), 100)
})

const savingsRateColor = computed(() => {
  const rate = overview.value.savingsRate
  if (rate >= 20) return 'text-[#10B981]'
  if (rate >= 10) return 'text-[#F59E0B]'
  return 'text-[#EF4444]'
})

// Daily spending data
const dailySpending = computed(() => {
  if (!monthlyData.value || !monthlyData.value.dailySpending) {
    // Generate empty data for the current month
    const daysInMonth = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth() + 1,
      0
    ).getDate()
    
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      label: String(i + 1),
      amount: 0
    }))
  }
  
  return monthlyData.value.dailySpending.map(day => ({
    day: day.day,
    label: String(day.day),
    amount: day.amount
  }))
})

// Methods
const fetchMonthlyOverview = async () => {
  isLoading.value = true
  try {
    const year = selectedDate.value.getFullYear()
    const month = selectedDate.value.getMonth() + 1 // JavaScript months are 0-indexed
    
    const response = await reportService.getMonthlyOverview(year, month)
    monthlyData.value = response
  } catch (error) {
    // You could emit an error event here or use a notification system
  } finally {
    isLoading.value = false
  }
}

const previousMonth = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  selectedDate.value = newDate
}

const nextMonth = () => {
  if (isCurrentMonth.value) return
  
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  selectedDate.value = newDate
}

const resetToCurrentMonth = () => {
  const now = new Date()
  selectedDate.value = new Date(now.getFullYear(), now.getMonth(), 1)
}

const calculateSavingsRate = (income, expenses) => {
  if (!income || income === 0) return 0
  return Math.round(((income - expenses) / income) * 100)
}

const calculateBarHeight = (amount) => {
  // Find the maximum amount in daily spending
  const maxAmount = Math.max(...dailySpending.value.map(day => day.amount), 1)
  
  // Calculate height proportionally (max height is 100px)
  const maxHeight = 100
  return amount > 0 ? Math.max((amount / maxAmount) * maxHeight, 4) : 0
}

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Lifecycle
onMounted(() => {
  fetchMonthlyOverview()
})

// Watch for date changes
watch(selectedDate, () => {
  fetchMonthlyOverview()
})
</script>

<style scoped>
/* Transition effects */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-500 {
  transition-duration: 500ms;
}

/* Tooltip transition */
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects */
.hover\:bg-gray-100:hover {
  background-color: rgba(243, 244, 246, 1);
}

.hover\:bg-\[\#10B981\]\/20:hover {
  background-color: rgba(16, 185, 129, 0.2);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style> 