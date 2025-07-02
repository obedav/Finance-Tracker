// src/composables/useFilters.js
import { ref, computed, watch } from 'vue'
import { TIME_PERIODS, TRANSACTION_TYPES } from '../utils/constants'

export function useFilters(initialFilters = {}) {
  // Filter state
  const filters = ref({
    type: '',
    category: '',
    dateRange: {
      start: null,
      end: null
    },
    timePeriod: TIME_PERIODS.ALL_TIME,
    search: '',
    minAmount: null,
    maxAmount: null,
    status: '',
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters
  })

  // Active filters count
  const activeFiltersCount = computed(() => {
    let count = 0
    
    if (filters.value.type) count++
    if (filters.value.category) count++
    if (filters.value.dateRange.start && filters.value.dateRange.end) count++
    if (filters.value.search) count++
    if (filters.value.minAmount !== null && filters.value.minAmount !== '') count++
    if (filters.value.maxAmount !== null && filters.value.maxAmount !== '') count++
    if (filters.value.status) count++
    if (filters.value.timePeriod !== TIME_PERIODS.ALL_TIME) count++
    
    return count
  })

  // Check if any filters are active
  const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

  // Get date range based on time period
  const getDateRangeFromPeriod = (period) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let start, end

    switch (period) {
      case TIME_PERIODS.TODAY:
        start = new Date(today)
        end = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        break
        
      case TIME_PERIODS.YESTERDAY:
        start = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        end = new Date(today.getTime() - 1)
        break
        
      case TIME_PERIODS.THIS_WEEK:
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        start = startOfWeek
        end = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
        break
        
      case TIME_PERIODS.LAST_WEEK:
        const lastWeekEnd = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000 - 1)
        const lastWeekStart = new Date(lastWeekEnd.getTime() - 6 * 24 * 60 * 60 * 1000)
        start = lastWeekStart
        end = lastWeekEnd
        break
        
      case TIME_PERIODS.THIS_MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        break
        
      case TIME_PERIODS.LAST_MONTH:
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        break
        
      case TIME_PERIODS.THIS_QUARTER:
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
        start = new Date(now.getFullYear(), quarterStartMonth, 1)
        end = new Date(now.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59, 999)
        break
        
      case TIME_PERIODS.LAST_QUARTER:
        const lastQuarterStartMonth = Math.floor(now.getMonth() / 3) * 3 - 3
        const lastQuarterYear = lastQuarterStartMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
        const adjustedStartMonth = lastQuarterStartMonth < 0 ? 9 : lastQuarterStartMonth
        start = new Date(lastQuarterYear, adjustedStartMonth, 1)
        end = new Date(lastQuarterYear, adjustedStartMonth + 3, 0, 23, 59, 59, 999)
        break
        
      case TIME_PERIODS.THIS_YEAR:
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
        break
        
      case TIME_PERIODS.LAST_YEAR:
        start = new Date(now.getFullYear() - 1, 0, 1)
        end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
        break
        
      default:
        return { start: null, end: null }
    }

    return { start, end }
  }

  // Filter transactions based on current filters
  const filterTransactions = (transactions) => {
    let filtered = [...transactions]

    // Filter by type
    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }

    // Filter by category
    if (filters.value.category) {
      filtered = filtered.filter(t => t.category === filters.value.category)
    }

    // Filter by status
    if (filters.value.status) {
      filtered = filtered.filter(t => t.status === filters.value.status)
    }

    // Filter by date range or time period
    let dateRange = { start: null, end: null }
    
    if (filters.value.timePeriod !== TIME_PERIODS.ALL_TIME && filters.value.timePeriod !== TIME_PERIODS.CUSTOM) {
      dateRange = getDateRangeFromPeriod(filters.value.timePeriod)
    } else if (filters.value.dateRange.start && filters.value.dateRange.end) {
      dateRange = {
        start: new Date(filters.value.dateRange.start),
        end: new Date(filters.value.dateRange.end)
      }
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt || t.date)
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end
      })
    }

    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t => 
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        t.category.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm) ||
        t.type.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by amount range
    if (filters.value.minAmount !== null && filters.value.minAmount !== '') {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.value.minAmount))
    }

    if (filters.value.maxAmount !== null && filters.value.maxAmount !== '') {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.value.maxAmount))
    }

    // Sort transactions
    filtered = sortTransactions(filtered, filters.value.sortBy, filters.value.sortOrder)

    return filtered
  }

  // Sort transactions
  const sortTransactions = (transactions, sortBy, sortOrder) => {
    const sorted = [...transactions].sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.date).getTime()
          bValue = new Date(b.createdAt || b.date).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'description':
          aValue = (a.description || '').toLowerCase()
          bValue = (b.description || '').toLowerCase()
          break
        default:
          aValue = new Date(a.createdAt || a.date).getTime()
          bValue = new Date(b.createdAt || b.date).getTime()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }

  // Update individual filter
  const updateFilter = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      filters.value[parent][child] = value
    } else {
      filters.value[key] = value
    }
  }

  // Update multiple filters
  const updateFilters = (newFilters) => {
    Object.keys(newFilters).forEach(key => {
      updateFilter(key, newFilters[key])
    })
  }

  // Clear all filters
  const clearFilters = () => {
    filters.value = {
      type: '',
      category: '',
      dateRange: {
        start: null,
        end: null
      },
      timePeriod: TIME_PERIODS.ALL_TIME,
      search: '',
      minAmount: null,
      maxAmount: null,
      status: '',
      sortBy: 'date',
      sortOrder: 'desc'
    }
  }

  // Clear specific filter
  const clearFilter = (key) => {
    if (key === 'dateRange') {
      filters.value.dateRange = { start: null, end: null }
      filters.value.timePeriod = TIME_PERIODS.ALL_TIME
    } else if (key === 'amount') {
      filters.value.minAmount = null
      filters.value.maxAmount = null
    } else {
      updateFilter(key, key === 'sortBy' ? 'date' : key === 'sortOrder' ? 'desc' : '')
    }
  }

  // Set time period and update date range accordingly
  const setTimePeriod = (period) => {
    filters.value.timePeriod = period
    
    if (period === TIME_PERIODS.CUSTOM) {
      // Keep existing date range for custom
      return
    } else if (period === TIME_PERIODS.ALL_TIME) {
      filters.value.dateRange = { start: null, end: null }
    } else {
      const dateRange = getDateRangeFromPeriod(period)
      filters.value.dateRange = {
        start: dateRange.start ? dateRange.start.toISOString().split('T')[0] : null,
        end: dateRange.end ? dateRange.end.toISOString().split('T')[0] : null
      }
    }
  }

  // Watch for time period changes
  watch(() => filters.value.timePeriod, (newPeriod) => {
    if (newPeriod !== TIME_PERIODS.CUSTOM && newPeriod !== TIME_PERIODS.ALL_TIME) {
      const dateRange = getDateRangeFromPeriod(newPeriod)
      filters.value.dateRange = {
        start: dateRange.start ? dateRange.start.toISOString().split('T')[0] : null,
        end: dateRange.end ? dateRange.end.toISOString().split('T')[0] : null
      }
    }
  })

  // Watch for manual date range changes
  watch(() => [filters.value.dateRange.start, filters.value.dateRange.end], 
    ([start, end]) => {
      if (start && end) {
        filters.value.timePeriod = TIME_PERIODS.CUSTOM
      }
    }
  )

  // Get filter summary for display
  const getFilterSummary = () => {
    const summary = []
    
    if (filters.value.type) {
      summary.push(`Type: ${filters.value.type}`)
    }
    
    if (filters.value.category) {
      summary.push(`Category: ${filters.value.category}`)
    }
    
    if (filters.value.timePeriod !== TIME_PERIODS.ALL_TIME) {
      summary.push(`Period: ${filters.value.timePeriod.replace('_', ' ')}`)
    }
    
    if (filters.value.search) {
      summary.push(`Search: "${filters.value.search}"`)
    }
    
    if (filters.value.minAmount !== null || filters.value.maxAmount !== null) {
      const min = filters.value.minAmount || 0
      const max = filters.value.maxAmount || '∞'
      summary.push(`Amount: $${min} - $${max}`)
    }
    
    if (filters.value.status) {
      summary.push(`Status: ${filters.value.status}`)
    }
    
    return summary
  }

  // Preset filter configurations
  const presetFilters = {
    thisMonth: () => setTimePeriod(TIME_PERIODS.THIS_MONTH),
    lastMonth: () => setTimePeriod(TIME_PERIODS.LAST_MONTH),
    thisYear: () => setTimePeriod(TIME_PERIODS.THIS_YEAR),
    incomeOnly: () => updateFilter('type', TRANSACTION_TYPES.INCOME),
    expensesOnly: () => updateFilter('type', TRANSACTION_TYPES.EXPENSE),
    highValue: () => updateFilter('minAmount', 1000),
    recent: () => setTimePeriod(TIME_PERIODS.THIS_WEEK)
  }

  return {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    filterTransactions,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    setTimePeriod,
    getFilterSummary,
    presetFilters,
    getDateRangeFromPeriod,
    sortTransactions
  }
}