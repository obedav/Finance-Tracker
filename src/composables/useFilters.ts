import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { TIME_PERIODS, TRANSACTION_TYPES } from '../utils/constants'
import type { Transaction } from '@/types/models'

type TransactionType = 'income' | 'expense'
type TimePeriod = typeof TIME_PERIODS[keyof typeof TIME_PERIODS]
type SortField = 'date' | 'amount' | 'category' | 'type' | 'description'
type SortOrder = 'asc' | 'desc'

interface DateRange {
  start: string | null
  end: string | null
}

interface Filters {
  type: TransactionType | ''
  category: string
  dateRange: DateRange
  timePeriod: TimePeriod
  search: string
  minAmount: number | null
  maxAmount: number | null
  status: string
  sortBy: SortField
  sortOrder: SortOrder
}

interface UseFiltersReturn {
  filters: Ref<Filters>
  activeFiltersCount: ComputedRef<number>
  hasActiveFilters: ComputedRef<boolean>
  filterTransactions: (transactions: Transaction[]) => Transaction[]
  updateFilter: (key: string, value: unknown) => void
  updateFilters: (newFilters: Partial<Filters>) => void
  clearFilters: () => void
  clearFilter: (key: string) => void
  setTimePeriod: (period: TimePeriod) => void
  getFilterSummary: () => string[]
  presetFilters: Record<string, () => void>
  getDateRangeFromPeriod: (period: TimePeriod) => { start: Date | null; end: Date | null }
  sortTransactions: (transactions: Transaction[], sortBy: SortField, sortOrder: SortOrder) => Transaction[]
}

export function useFilters(initialFilters: Partial<Filters> = {}): UseFiltersReturn {
  // Filter state
  const filters: Ref<Filters> = ref({
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
  const activeFiltersCount: ComputedRef<number> = computed(() => {
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
  const hasActiveFilters: ComputedRef<boolean> = computed(() => activeFiltersCount.value > 0)

  // Get date range based on time period
  const getDateRangeFromPeriod = (period: TimePeriod): { start: Date | null; end: Date | null } => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let start: Date | null = null
    let end: Date | null = null

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
  const filterTransactions = (transactions: Transaction[]): Transaction[] => {
    let filtered = [...transactions]

    // Filter by type
    if (filters.value.type) {
      filtered = filtered.filter(t => t.type === filters.value.type)
    }

    // Filter by category
    if (filters.value.category) {
      filtered = filtered.filter(t => t.category?.name === filters.value.category)
    }

    // Filter by status
    if (filters.value.status) {
      filtered = filtered.filter(t => t.status === filters.value.status)
    }

    // Filter by date range or time period
    let dateRange = { start: null as Date | null, end: null as Date | null }

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
        const transactionDate = new Date(t.created_at || t.date)
        return transactionDate >= dateRange.start! && transactionDate <= dateRange.end!
      })
    }

    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        (t.category?.name && t.category.name.toLowerCase().includes(searchTerm)) ||
        t.amount.toString().includes(searchTerm) ||
        t.type.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by amount range
    if (filters.value.minAmount !== null && filters.value.minAmount !== '') {
      filtered = filtered.filter(t => t.amount >= filters.value.minAmount!)
    }

    if (filters.value.maxAmount !== null && filters.value.maxAmount !== '') {
      filtered = filtered.filter(t => t.amount <= filters.value.maxAmount!)
    }

    // Sort transactions
    filtered = sortTransactions(filtered, filters.value.sortBy, filters.value.sortOrder)

    return filtered
  }

  // Sort transactions
  const sortTransactions = (transactions: Transaction[], sortBy: SortField, sortOrder: SortOrder): Transaction[] => {
    const sorted = [...transactions].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at || a.date).getTime()
          bValue = new Date(b.created_at || b.date).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'category':
          aValue = (a.category?.name || '').toLowerCase()
          bValue = (b.category?.name || '').toLowerCase()
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
          aValue = new Date(a.created_at || a.date).getTime()
          bValue = new Date(b.created_at || b.date).getTime()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }

  // Update individual filter
  const updateFilter = (key: string, value: unknown): void => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      ;(filters.value as Record<string, unknown>)[parent] = {
        ...(filters.value as Record<string, unknown>)[parent] as object,
        [child]: value
      }
    } else {
      ;(filters.value as Record<string, unknown>)[key] = value
    }
  }

  // Update multiple filters
  const updateFilters = (newFilters: Partial<Filters>): void => {
    Object.keys(newFilters).forEach(key => {
      updateFilter(key, (newFilters as Record<string, unknown>)[key])
    })
  }

  // Clear all filters
  const clearFilters = (): void => {
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
  const clearFilter = (key: string): void => {
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
  const setTimePeriod = (period: TimePeriod): void => {
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
  const getFilterSummary = (): string[] => {
    const summary: string[] = []

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
