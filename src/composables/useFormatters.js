// src/composables/useFormatters.js
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export function useFormatters() {
  const settingsStore = useSettingsStore()

  // Currency symbols mapping
  const currencySymbols = {
    USD: '$',
    EUR: '€', 
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥'
  }

  // Reactive currency formatting
  const formatCurrency = computed(() => {
    return (amount, options = {}) => {
      const currency = settingsStore.preferences.currency || 'USD'
      const symbol = currencySymbols[currency] || '$'
      
      // Default formatting options
      const defaultOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options
      }

      try {
        // Use Intl.NumberFormat for proper currency formatting
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          ...defaultOptions
        })
        
        return formatter.format(amount)
      } catch (error) {
        // Fallback if currency is not supported
        const formattedAmount = Number(amount).toFixed(defaultOptions.minimumFractionDigits)
        return `${symbol}${formattedAmount}`
      }
    }
  })

  // Date formatting based on user preference
  const formatDate = computed(() => {
    return (date, options = {}) => {
      const dateFormat = settingsStore.preferences.dateFormat || 'MM/DD/YYYY'
      const dateObj = new Date(date)
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date'
      }

      try {
        // Convert custom format to Intl options
        let intlOptions = {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          ...options
        }

        // Adjust based on user's preferred format
        if (dateFormat === 'DD MMM YYYY') {
          intlOptions.month = 'short'
        } else if (dateFormat === 'MMM DD, YYYY') {
          intlOptions.month = 'short'
        }

        const formatter = new Intl.DateTimeFormat('en-US', intlOptions)
        let formatted = formatter.format(dateObj)

        // Custom formatting for specific patterns
        if (dateFormat === 'YYYY-MM-DD') {
          return dateObj.toISOString().split('T')[0]
        } else if (dateFormat === 'DD/MM/YYYY') {
          const [month, day, year] = formatted.split('/')
          return `${day}/${month}/${year}`
        }

        return formatted
      } catch (error) {
        // Fallback formatting
        return dateObj.toLocaleDateString()
      }
    }
  })

  // Number formatting
  const formatNumber = computed(() => {
    return (number, options = {}) => {
      try {
        const formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          ...options
        })
        return formatter.format(number)
      } catch (error) {
        return Number(number).toLocaleString()
      }
    }
  })

  return {
    formatCurrency,
    formatDate,
    formatNumber,
    currentCurrency: computed(() => settingsStore.preferences.currency || 'USD'),
    currentDateFormat: computed(() => settingsStore.preferences.dateFormat || 'MM/DD/YYYY')
  }
}