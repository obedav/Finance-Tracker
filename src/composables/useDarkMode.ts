// src/composables/useDarkMode.ts
import { ref, watch, onMounted } from 'vue'

const DARK_MODE_KEY = 'finance-tracker-dark-mode'

export type DarkModePreference = 'light' | 'dark' | 'system'

// Shared state across all instances
const isDark = ref<boolean>(false)
const preference = ref<DarkModePreference>('system')
const isInitialized = ref<boolean>(false)

/**
 * Dark mode composable with localStorage persistence
 * Supports three modes: light, dark, and system preference
 */
export function useDarkMode() {
  /**
   * Get system preference for dark mode
   */
  const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Update the DOM with dark mode class
   */
  const updateDOM = (dark: boolean): void => {
    if (typeof document === 'undefined') return

    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * Load preference from localStorage
   */
  const loadPreference = (): DarkModePreference => {
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored as DarkModePreference
      }
    } catch (error) {
    }
    return 'system'
  }

  /**
   * Save preference to localStorage
   */
  const savePreference = (pref: DarkModePreference): void => {
    try {
      localStorage.setItem(DARK_MODE_KEY, pref)
    } catch (error) {
    }
  }

  /**
   * Calculate if dark mode should be active based on preference
   */
  const calculateIsDark = (pref: DarkModePreference): boolean => {
    if (pref === 'system') {
      return getSystemPreference()
    }
    return pref === 'dark'
  }

  /**
   * Initialize dark mode
   */
  const initialize = (): void => {
    if (isInitialized.value) return

    // Load saved preference
    preference.value = loadPreference()

    // Calculate initial dark mode state
    isDark.value = calculateIsDark(preference.value)

    // Update DOM
    updateDOM(isDark.value)

    // Listen for system preference changes (only when in system mode)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        if (preference.value === 'system') {
          isDark.value = e.matches
        }
      }

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler)
      }
    }

    isInitialized.value = true
  }

  /**
   * Toggle between light and dark mode
   */
  const toggle = (): void => {
    if (preference.value === 'system') {
      // When toggling from system, switch to explicit light/dark
      preference.value = isDark.value ? 'light' : 'dark'
    } else {
      // Toggle between light and dark
      preference.value = preference.value === 'dark' ? 'light' : 'dark'
    }

    isDark.value = calculateIsDark(preference.value)
    savePreference(preference.value)
    updateDOM(isDark.value)
  }

  /**
   * Set specific preference
   */
  const setPreference = (pref: DarkModePreference): void => {
    preference.value = pref
    isDark.value = calculateIsDark(pref)
    savePreference(pref)
    updateDOM(isDark.value)
  }

  /**
   * Set dark mode directly
   */
  const setDark = (dark: boolean): void => {
    preference.value = dark ? 'dark' : 'light'
    isDark.value = dark
    savePreference(preference.value)
    updateDOM(isDark.value)
  }

  // Initialize immediately if not already initialized (don't wait for mount)
  if (!isInitialized.value && typeof window !== 'undefined') {
    initialize()
  }

  // Initialize on mount as backup
  onMounted(() => {
    if (!isInitialized.value) {
      initialize()
    }
  })

  // Watch for preference changes
  watch(() => preference.value, (newPref) => {
    isDark.value = calculateIsDark(newPref)
    updateDOM(isDark.value)
  })

  return {
    isDark,
    preference,
    toggle,
    setPreference,
    setDark,
    initialize
  }
}
