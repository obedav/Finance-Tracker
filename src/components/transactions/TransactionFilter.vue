<!-- src/components/transactions/TransactionFilter.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-[#334155]">Filters</h3>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="text-sm text-[#F59E0B] hover:text-[#F59E0B]/80 font-medium transition-colors"
      >
        Clear All
      </button>
    </div>

    <div class="space-y-4">
      <!-- Quick Time Filters -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Quick Filters</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="period in quickPeriods"
            :key="period.value"
            @click="setTimePeriod(period.value)"
            :class="[
              'px-3 py-2 text-sm rounded-md border transition-all',
              filters.timePeriod === period.value
                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] font-medium'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981]/50'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Type Filter -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Type</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="updateFilter('type', '')"
            :class="[
              'px-3 py-2 text-sm rounded-md border transition-all',
              filters.type === ''
                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] font-medium'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981]/50'
            ]"
          >
            All
          </button>
          <button
            @click="updateFilter('type', 'income')"
            :class="[
              'px-3 py-2 text-sm rounded-md border transition-all',
              filters.type === 'income'
                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] font-medium'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981]/50'
            ]"
          >
            Income
          </button>
          <button
            @click="updateFilter('type', 'expense')"
            :class="[
              'px-3 py-2 text-sm rounded-md border transition-all',
              filters.type === 'expense'
                ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B] font-medium'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#F59E0B]/50'
            ]"
          >
            Expense
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Category</label>
        <select
          :value="filters.category"
          @change="updateFilter('category', $event.target.value)"
          class="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
        >
          <option value="">All Categories</option>
          <optgroup 
            v-if="filters.type === '' || filters.type === 'income'" 
            label="Income Categories"
          >
            <option 
              v-for="category in incomeCategories" 
              :key="`income-${category}`" 
              :value="category"
            >
              {{ category }}
            </option>
          </optgroup>
          <optgroup 
            v-if="filters.type === '' || filters.type === 'expense'" 
            label="Expense Categories"
          >
            <option 
              v-for="category in expenseCategories" 
              :key="`expense-${category}`" 
              :value="category"
            >
              {{ category }}
            </option>
          </optgroup>
        </select>
      </div>

      <!-- Amount Range -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Amount Range</label>
        <div class="grid grid-cols-2 gap-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-[#334155]/70 text-sm">$</span>
            </div>
            <input
              :value="filters.minAmount"
              @input="updateFilter('minAmount', $event.target.value ? parseFloat($event.target.value) : null)"
              type="number"
              step="0.01"
              min="0"
              placeholder="Min"
              class="w-full pl-8 pr-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
            />
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-[#334155]/70 text-sm">$</span>
            </div>
            <input
              :value="filters.maxAmount"
              @input="updateFilter('maxAmount', $event.target.value ? parseFloat($event.target.value) : null)"
              type="number"
              step="0.01"
              min="0"
              placeholder="Max"
              class="w-full pl-8 pr-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
            />
          </div>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div v-if="filters.timePeriod === 'custom'">
        <label class="block text-sm font-medium text-[#334155] mb-2">Custom Date Range</label>
        <div class="grid grid-cols-2 gap-3">
          <input
            :value="filters.dateRange.start"
            @input="updateFilter('dateRange.start', $event.target.value)"
            type="date"
            class="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
          />
          <input
            :value="filters.dateRange.end"
            @input="updateFilter('dateRange.end', $event.target.value)"
            type="date"
            class="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
          />
        </div>
      </div>

      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-[#334155]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            :value="filters.search"
            @input="updateFilter('search', $event.target.value)"
            type="text"
            placeholder="Search transactions..."
            class="w-full pl-10 pr-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
          />
        </div>
      </div>

      <!-- Sort Options -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Sort By</label>
        <div class="grid grid-cols-2 gap-3">
          <select
            :value="filters.sortBy"
            @change="updateFilter('sortBy', $event.target.value)"
            class="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
            <option value="type">Type</option>
          </select>
          <select
            :value="filters.sortOrder"
            @change="updateFilter('sortOrder', $event.target.value)"
            class="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[#334155]"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-[#E5E7EB]">
      <div class="text-sm text-[#334155]/70 mb-2">Active Filters:</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(filter, index) in activeFiltersList"
          :key="index"
          class="inline-flex items-center px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-xs font-medium"
        >
          {{ filter }}
          <button
            @click="clearSpecificFilter(filter)"
            class="ml-1 text-[#10B981] hover:text-[#10B981]/70"
          >
            ×
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TIME_PERIODS } from '../../utils/constants'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-filter', 'clear-filters', 'set-time-period'])

const quickPeriods = [
  { label: 'Today', value: TIME_PERIODS.TODAY },
  { label: 'This Week', value: TIME_PERIODS.THIS_WEEK },
  { label: 'This Month', value: TIME_PERIODS.THIS_MONTH },
  { label: 'This Year', value: TIME_PERIODS.THIS_YEAR },
  { label: 'Last Month', value: TIME_PERIODS.LAST_MONTH },
  { label: 'Last Year', value: TIME_PERIODS.LAST_YEAR },
  { label: 'All Time', value: TIME_PERIODS.ALL_TIME },
  { label: 'Custom', value: TIME_PERIODS.CUSTOM }
]

const incomeCategories = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'
]

const expenseCategories = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
  'Bills & Utilities', 'Healthcare', 'Education', 'Other'
]

const hasActiveFilters = computed(() => {
  return props.filters.type || 
         props.filters.category || 
         props.filters.search || 
         props.filters.minAmount !== null || 
         props.filters.maxAmount !== null ||
         props.filters.timePeriod !== TIME_PERIODS.ALL_TIME ||
         (props.filters.dateRange.start && props.filters.dateRange.end)
})

const activeFiltersList = computed(() => {
  const filters = []
  if (props.filters.type) filters.push(`Type: ${props.filters.type}`)
  if (props.filters.category) filters.push(`Category: ${props.filters.category}`)
  if (props.filters.search) filters.push(`Search: "${props.filters.search}"`)
  if (props.filters.minAmount !== null) filters.push(`Min: $${props.filters.minAmount}`)
  if (props.filters.maxAmount !== null) filters.push(`Max: $${props.filters.maxAmount}`)
  if (props.filters.timePeriod !== TIME_PERIODS.ALL_TIME) {
    const period = quickPeriods.find(p => p.value === props.filters.timePeriod)
    if (period) filters.push(`Period: ${period.label}`)
  }
  return filters
})

const updateFilter = (key, value) => {
  emit('update-filter', key, value)
}

const clearAllFilters = () => {
  emit('clear-filters')
}

const setTimePeriod = (period) => {
  emit('set-time-period', period)
}

const clearSpecificFilter = (filterText) => {
  if (filterText.startsWith('Type:')) {
    updateFilter('type', '')
  } else if (filterText.startsWith('Category:')) {
    updateFilter('category', '')
  } else if (filterText.startsWith('Search:')) {
    updateFilter('search', '')
  } else if (filterText.startsWith('Min:')) {
    updateFilter('minAmount', null)
  } else if (filterText.startsWith('Max:')) {
    updateFilter('maxAmount', null)
  } else if (filterText.startsWith('Period:')) {
    setTimePeriod(TIME_PERIODS.ALL_TIME)
  }
}
</script>