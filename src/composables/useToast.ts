import { ref, type Ref } from 'vue'
import { TOAST_SETTINGS } from '@/utils/constants'

// Toast types
type ToastType = 'info' | 'success' | 'error' | 'warning'

interface ToastOptions {
  duration?: number
  position?: string
  closable?: boolean
  onClose?: ((toast: Toast) => void) | null
}

interface Toast {
  id: number
  message: string
  type: ToastType
  show: boolean
  duration: number
  position: string
  closable: boolean
  onClose: ((toast: Toast) => void) | null
}

// Create a reactive array to store toast notifications
const toasts: Ref<Toast[]> = ref([])
let toastId = 0

export function useToast() {
  // Create a toast notification
  const showToast = (message: string, type: ToastType = 'info', options: ToastOptions = {}): number => {
    const id = toastId++

    // Default options
    const defaultOptions: Required<ToastOptions> = {
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
  const removeToast = (id: number): void => {
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
  const clearToasts = (): void => {
    toasts.value.forEach(toast => {
      removeToast(toast.id)
    })
  }

  // Shorthand methods for different toast types
  const success = (message: string, options: ToastOptions = {}): number => showToast(message, 'success', options)
  const error = (message: string, options: ToastOptions = {}): number => showToast(message, 'error', options)
  const warning = (message: string, options: ToastOptions = {}): number => showToast(message, 'warning', options)
  const info = (message: string, options: ToastOptions = {}): number => showToast(message, 'info', options)

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
