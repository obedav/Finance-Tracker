import { ref } from 'vue'
import { TOAST_SETTINGS } from '@/utils/constants'

// Create a reactive array to store toast notifications
const toasts = ref([])
let toastId = 0

export function useToast() {
  // Create a toast notification
  const showToast = (message, type = 'info', options = {}) => {
    const id = toastId++
    
    // Default options
    const defaultOptions = {
      duration: TOAST_SETTINGS.DURATION.MEDIUM,
      position: TOAST_SETTINGS.POSITION.TOP_RIGHT,
      closable: true,
      onClose: null
    }
    
    // Merge with provided options
    const finalOptions = { ...defaultOptions, ...options }
    
    // Add toast to array
    toasts.value.push({
      id,
      message,
      type,
      show: true,
      ...finalOptions
    })
    
    // Auto-remove toast after duration (if not -1 which means persistent)
    if (finalOptions.duration !== -1) {
      setTimeout(() => {
        removeToast(id)
      }, finalOptions.duration)
    }
    
    return id
  }
  
  // Remove a toast by ID
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      // Get the toast
      const toast = toasts.value[index]
      
      // Mark as hiding first (for animation)
      toast.show = false
      
      // Call onClose callback if provided
      if (typeof toast.onClose === 'function') {
        toast.onClose(toast)
      }
      
      // Remove after animation completes
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }
  
  // Clear all toasts
  const clearToasts = () => {
    toasts.value.forEach(toast => {
      removeToast(toast.id)
    })
  }
  
  // Shorthand methods for different toast types
  const success = (message, options = {}) => showToast(message, 'success', options)
  const error = (message, options = {}) => showToast(message, 'error', options)
  const warning = (message, options = {}) => showToast(message, 'warning', options)
  const info = (message, options = {}) => showToast(message, 'info', options)
  
  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }
}