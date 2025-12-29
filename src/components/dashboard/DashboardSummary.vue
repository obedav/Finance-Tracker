Since the DashboardSummary.vue file exists but has no code, I'll create a complete implementation for it that integrates with the rest of your finance tracker application. Based on the project structure and other components I've seen, this component should display key financial metrics and summary information.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\dashboard\DashboardSummary.vue**
```vue
<!-- src/components/dashboard/DashboardSummary.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Total Income -->
    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#10B981] hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center">
        <div class="flex-1">
          <p class="text-sm font-medium text-[#334155]/70">Total Income</p>
          <p class="text-2xl font-bold text-[#10B981]">
            ${{ formatCurrency(summary.income) }}
          </p>
          <div class="mt-2 flex items-center" v-if="summary.incomeChange !== null">
            <div 
              class="flex items-center text-xs font-medium"
              :class="summary.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="summary.incomeChange >= 0 
                    ? 'M7 11l5-5m0 0l5 5m-5-5v12' 
                    : 'M17 13l-5 5m0 0l-5-5m5 5V6'"
                ></path>
              </svg>
              {{ Math.abs(summary.incomeChange).toFixed(1) }}% from previous period
            </div>
          </div>
        </div>
        <div class="p-3 bg-[#10B981]/10 rounded-full">
          <svg class="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Total Expenses -->
    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#F59E0B] hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center">
        <div class="flex-1">
          <p class="text-sm font-medium text-[#334155]/70">Total Expenses</p>
          <p class="text-2xl font-bold text-[#F59E0B]">
            ${{ formatCurrency(summary.expenses) }}
          </p>
          <div class="mt-2 flex items-center" v-if="summary.expenseChange !== null">
            <div 
              class="flex items-center text-xs font-medium"
              :class="summary.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="summary.expenseChange <= 0 
                    ? 'M7 11l5-5m0 0l5 5m-5-5v12' 
                    : 'M17 13l-5 5m0 0l-5-5m5 5V6'"
                ></path>
              </svg>
              {{ Math.abs(summary.expenseChange).toFixed(1) }}% from previous period
            </div>
          </div>
        </div>
        <div class="p-3 bg-[#F59E0B]/10 rounded-full">
          <svg class="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Balance -->
    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4" 
      :class="summary.balance >= 0 ? 'border-[#10B981]' : 'border-[#EF4444]'"
      hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center">
        <div class="flex-1">
          <p class="text-sm font-medium text-[#334155]/70">Balance</p>
          <p class="text-2xl font-bold" :class="summary.balance >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'">
            ${{ formatCurrency(Math.abs(summary.balance)) }}
          </p>
          <div class="mt-2 flex items-center" v-if="summary.balanceChange !== null">
            <div 
              class="flex items-center text-xs font-medium"
              :class="summary.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="summary.balanceChange >= 0 
                    ? 'M7 11l5-5m0 0l5 5m-5-5v12' 
                    : 'M17 13l-5 5m0 0l-5-5m5 5V6'"
                ></path>
              </svg>
              {{ Math.abs(summary.balanceChange).toFixed(1) }}% from previous period
            </div>
          </div>
        </div>
        <div class="p-3 rounded-full" :class="summary.balance >= 0 ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'">
          <svg 
            class="w-6 h-6" 
            :class="summary.balance >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Additional Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Average Daily Spending -->
    <div class="bg-white rounded-lg shadow p-4 border border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-[#334155]/70">Avg. Daily Spending</p>
        <div class="p-2 bg-blue-50 rounded-full">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      <p class="mt-2 text-xl font-bold text-[#334155]">${{ formatCurrency(summary.avgDailySpending) }}</p>
    </div>

    <!-- Top Category -->
    <div class="bg-white rounded-lg shadow p-4 border border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-[#334155]/70">Top Category</p>
        <div class="p-2 bg-purple-50 rounded-full">
          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
      </div>
      <p class="mt-2 text-xl font-bold text-[#334155]">{{ summary.topCategory }}</p>
    </div>

    <!-- Largest Transaction -->
    <div class="bg-white rounded-lg shadow p-4 border border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-[#334155]/70">Largest Transaction</p>
        <div class="p-2 bg-amber-50 rounded-full">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
      </div>
      <p class="mt-2 text-xl font-bold text-[#334155]">${{ formatCurrency(summary.largestTransaction) }}</p>
    </div>

   <!-- Savings Rate -->
    <div class="bg-white rounded-lg shadow p-4 border border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-[#334155]/70">Savings Rate</p>
        <div class="p-2 bg-emerald-50 rounded-full">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
      <p class="mt-2 text-xl font-bold text-[#334155]">{{ summary.savingsRate.toFixed(1) }}%</p>
    </div>
  </div>

  <!-- Period Selector -->
  <div class="flex justify-end mb-6">
    <div class="inline-flex rounded-md shadow-sm">
      <button
        v-for="(option, index) in periodOptions"
        :key="option.value"
        @click="changePeriod(option.value)"
        :class="[
          'px-4 py-2 text-sm font-medium border',
          selectedPeriod === option.value 
            ? 'bg-[#10B981] text-white border-[#10B981]' 
            : 'bg-white text-[#334155] border-gray-300 hover:bg-gray-50',
          index === 0 ? 'rounded-l-md' : '',
          index === periodOptions.length - 1 ? 'rounded-r-md' : '',
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportService } from '@/composables/useReportService'

// Props
const props = defineProps({
  initialPeriod: {
    type: String,
    default: 'month'
  }
})

// Services
const reportService = useReportService()

// State
const isLoading = ref(false)
const selectedPeriod = ref(props.initialPeriod)
const dashboardData = ref(null)

// Period options
const periodOptions = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' }
]

// Computed summary with defaults
const summary = computed(() => {
  if (!dashboardData.value) {
    return {
      income: 0,
      expenses: 0,
      balance: 0,
      incomeChange: null,
      expenseChange: null,
      balanceChange: null,
      avgDailySpending: 0,
      topCategory: 'N/A',
      largestTransaction: 0,
      savingsRate: 0
    }
  }

  const data = dashboardData.value.summary
  
  // Calculate balance if not provided
  if (data.currentPeriod.balance === null) {
    data.currentPeriod.balance = data.currentPeriod.income - data.currentPeriod.expenses
  }
  
  if (data.previousPeriod.balance === null) {
    data.previousPeriod.balance = data.previousPeriod.income - data.previousPeriod.expenses
  }
  
  // Calculate percentage changes if not provided
  if (data.changes.incomeChange === null) {
    data.changes.incomeChange = calculatePercentageChange(
      data.previousPeriod.income,
      data.currentPeriod.income
    )
  }
  
  if (data.changes.expenseChange === null) {
    data.changes.expenseChange = calculatePercentageChange(
      data.previousPeriod.expenses,
      data.currentPeriod.expenses
    )
  }
  
  if (data.changes.balanceChange === null) {
    data.changes.balanceChange = calculatePercentageChange(
      data.previousPeriod.balance,
      data.currentPeriod.balance
    )
  }
  
  return {
    income: data.currentPeriod.income,
    expenses: data.currentPeriod.expenses,
    balance: data.currentPeriod.balance,
    incomeChange: data.changes.incomeChange,
    expenseChange: data.changes.expenseChange,
    balanceChange: data.changes.balanceChange,
    avgDailySpending: data.quickStats.avgDailySpending,
    topCategory: data.quickStats.topCategory,
    largestTransaction: data.quickStats.largestTransaction,
    savingsRate: data.quickStats.savingsRate
  }
})

// Methods
const fetchDashboardSummary = async () => {
  isLoading.value = true
  try {
    const response = await reportService.getDashboardSummary(selectedPeriod.value)
    dashboardData.value = response
  } catch (error) {
    // You could emit an error event here or use a notification system
  } finally {
    isLoading.value = false
  }
}

const changePeriod = (period) => {
  selectedPeriod.value = period
}

const calculatePercentageChange = (previous, current) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / Math.abs(previous)) * 100
}

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Lifecycle
onMounted(() => {
  fetchDashboardSummary()
})

// Watch for period changes
watch(selectedPeriod, () => {
  fetchDashboardSummary()
})
</script>

<style scoped>
/* Transition effects */
.transition-shadow {
  transition: box-shadow 0.3s ease;
}

/* Hover effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>