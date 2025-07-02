// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Import CSS for styling
// Import CSS for styling - IN CORRECT ORDER
import './style.css'
import './styles/variables.css'      // ← Add this first
import './styles/utilities.css'      // ← Add this second  
import './styles/components.css'     // ← Add this third
import './styles/chart-components.css' // ← Keep this last

// Create the Vue app
const app = createApp(App)

// Setup Pinia store
app.use(createPinia())

// Setup Vue Router
app.use(router)

// Function to setup toast notifications
async function setupToastNotifications() {
  try {
    // Try to import vue-toastification (Vue 3 version)
    const Toast = await import('vue-toastification')
    await import('vue-toastification/dist/index.css')
    
    app.use(Toast.default, {
      position: "top-right",
      timeout: 4000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: true,
      rtl: false,
      transition: "Vue-Toastification__bounce",
      maxToasts: 5,
      newestOnTop: true,
      // Custom styling to match our color scheme
      toastDefaults: {
        [Toast.TYPE.SUCCESS]: {
          toastClassName: "toast-success-custom",
          bodyClassName: ["toast-body-custom"],
          hideProgressBar: false,
          timeout: 3000,
          closeButton: "button",
          icon: true,
        },
        [Toast.TYPE.ERROR]: {
          toastClassName: "toast-error-custom",
          bodyClassName: ["toast-body-custom"],
          hideProgressBar: false,
          timeout: 5000,
          closeButton: "button", 
          icon: true,
        },
        [Toast.TYPE.WARNING]: {
          toastClassName: "toast-warning-custom",
          bodyClassName: ["toast-body-custom"],
          hideProgressBar: false,
          timeout: 4000,
          closeButton: "button",
          icon: true,
        },
        [Toast.TYPE.INFO]: {
          toastClassName: "toast-info-custom",
          bodyClassName: ["toast-body-custom"],
          hideProgressBar: false,
          timeout: 3000,
          closeButton: "button",
          icon: true,
        }
      }
    })
    
    console.log('✅ Vue Toastification (Vue 3) loaded successfully')
  } catch (error) {
    console.warn('Vue Toastification not available. Using fallback toast service.')
    console.warn('Install with: npm install vue-toastification@next')
    
    // Provide a comprehensive fallback toast service
    const fallbackToast = {
      success: (message, options = {}) => {
        console.log('✅ Success:', message)
        showFallbackNotification('success', message, options)
      },
      error: (message, options = {}) => {
        console.error('❌ Error:', message)
        showFallbackNotification('error', message, options)
      },
      warning: (message, options = {}) => {
        console.warn('⚠️ Warning:', message)
        showFallbackNotification('warning', message, options)
      },
      info: (message, options = {}) => {
        console.info('ℹ️ Info:', message)
        showFallbackNotification('info', message, options)
      },
      // Additional methods for compatibility
      clear: () => {
        document.querySelectorAll('.fallback-toast').forEach(toast => toast.remove())
      },
      dismiss: (id) => {
        const toast = document.querySelector(`[data-toast-id="${id}"]`)
        if (toast) toast.remove()
      }
    }
    
    app.config.globalProperties.$toast = fallbackToast
    app.provide('toast', fallbackToast)
  }
}

// Enhanced fallback notification system
function showFallbackNotification(type, message, options = {}) {
  const {
    timeout = type === 'error' ? 5000 : 3000,
    position = 'top-right',
    closeButton = true
  } = options
  
  // Create notification container if it doesn't exist
  let container = document.querySelector('.toast-container')
  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    container.style.cssText = `
      position: fixed;
      ${position.includes('top') ? 'top: 1rem' : 'bottom: 1rem'};
      ${position.includes('right') ? 'right: 1rem' : 'left: 1rem'};
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(container)
  }
  
  // Create notification element
  const notification = document.createElement('div')
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Set styles based on type using your color scheme
  const typeStyles = {
    success: {
      bg: '#10B981',
      border: '#10B981',
      icon: '✓'
    },
    error: {
      bg: '#EF4444', 
      border: '#EF4444',
      icon: '✕'
    },
    warning: {
      bg: '#F59E0B',
      border: '#F59E0B', 
      icon: '⚠'
    },
    info: {
      bg: '#3B82F6',
      border: '#3B82F6',
      icon: 'ℹ'
    }
  }
  
  const style = typeStyles[type] || typeStyles.info
  
  notification.className = 'fallback-toast'
  notification.setAttribute('data-toast-id', toastId)
  notification.style.cssText = `
    background: white;
    border-left: 4px solid ${style.border};
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    margin-bottom: 0.5rem;
    max-width: 20rem;
    padding: 1rem;
    pointer-events: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  `
  
  notification.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
      <div style="
        color: ${style.bg}; 
        font-weight: bold; 
        font-size: 1.125rem;
        flex-shrink: 0;
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${style.icon}
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="
          color: #334155; 
          font-weight: 500; 
          font-size: 0.875rem;
          line-height: 1.25rem;
        ">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
        <div style="
          color: #64748B; 
          font-size: 0.875rem; 
          line-height: 1.25rem;
          margin-top: 0.25rem;
          word-wrap: break-word;
        ">
          ${message}
        </div>
      </div>
      ${closeButton ? `
        <button 
          onclick="this.closest('.fallback-toast').remove()" 
          style="
            color: #9CA3AF; 
            background: none; 
            border: none; 
            cursor: pointer; 
            font-size: 1.25rem;
            line-height: 1;
            padding: 0;
            width: 1.25rem;
            height: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.25rem;
            transition: color 0.2s ease;
            flex-shrink: 0;
          "
          onmouseover="this.style.color='#6B7280'"
          onmouseout="this.style.color='#9CA3AF'"
        >
          ×
        </button>
      ` : ''}
    </div>
  `
  
  container.appendChild(notification)
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)'
    notification.style.opacity = '1'
  })
  
  // Auto remove
  if (timeout > 0) {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(100%)'
        notification.style.opacity = '0'
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove()
          }
        }, 300)
      }
    }, timeout)
  }
  
  return toastId
}

// Global error handler with toast integration
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // Show user-friendly error message
  const toast = app.config.globalProperties.$toast
  if (toast && typeof toast.error === 'function') {
    // Don't show toast for certain types of errors
    const skipToastErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Script error'
    ]
    
    const shouldShowToast = !skipToastErrors.some(skipError => 
      error.message?.includes(skipError)
    )
    
    if (shouldShowToast) {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }
  
  // You can integrate with error reporting services here
  // Example for Sentry, LogRocket, or similar:
  // if (typeof window !== 'undefined' && window.errorReportingService) {
  //   window.errorReportingService.captureException(error, {
  //     tags: { source: 'vue-error-handler' },
  //     extra: { 
  //       info, 
  //       componentName: instance?.$options.name || instance?.$?.type?.name,
  //       route: router.currentRoute.value.fullPath
  //     }
  //   })
  // }
}

// Global warning handler  
app.config.warnHandler = (msg, instance, trace) => {
  // Only log warnings in development
  if (import.meta.env.DEV) {
    console.warn('Vue warning:', msg)
    if (trace) {
      console.warn('Component trace:', trace)
    }
  }
}

// Performance tracking (only in development)
if (import.meta.env.DEV) {
  app.config.performance = true
}

// Development helpers
if (import.meta.env.DEV) {
  // Make app and router available globally for debugging
  window.__VUE_APP__ = app
  window.__VUE_ROUTER__ = router
  
  // Add helpful console styling
  const style = 'color: #10B981; font-weight: bold; font-size: 14px;'
  console.log('%c🚀 FinanceTracker App Initializing...', style)
  console.log('%c📦 Environment:', 'color: #F59E0B; font-weight: bold;', import.meta.env.MODE)
  console.log('%c🎯 Vue version:', 'color: #3B82F6; font-weight: bold;', app.version)
}

// Add custom CSS for toast styling
function addCustomToastStyles() {
  const style = document.createElement('style')
  style.textContent = `
    /* Custom toast styles to match your color scheme */
    .toast-success-custom {
      background-color: #10B981 !important;
    }
    
    .toast-error-custom {
      background-color: #EF4444 !important;
    }
    
    .toast-warning-custom {
      background-color: #F59E0B !important;
    }
    
    .toast-info-custom {
      background-color: #3B82F6 !important;
    }
    
    .toast-body-custom {
      color: white !important;
      font-weight: 500 !important;
    }
    
    /* Override default toast container positioning */
    .Vue-Toastification__container {
      z-index: 9999 !important;
    }
    
    /* Custom toast transitions */
    .Vue-Toastification__bounce-enter-active {
      animation: Vue-Toastification__bounceIn 0.5s;
    }
    
    .Vue-Toastification__bounce-leave-active {
      animation: Vue-Toastification__bounceOut 0.5s;
    }
    
    @keyframes Vue-Toastification__bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3) translate3d(0, 0, 0);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1) translate3d(0, 0, 0);
      }
    }
    
    @keyframes Vue-Toastification__bounceOut {
      20% {
        transform: scale(0.9);
      }
      50%, 55% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 0;
        transform: scale(0.3) translate3d(0, 0, 0);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .Vue-Toastification__container {
        width: 100% !important;
        padding: 0 1rem !important;
      }
      
      .Vue-Toastification__toast {
        margin-bottom: 0.5rem !important;
        border-radius: 0.5rem !important;
      }
    }
  `
  document.head.appendChild(style)
}

// Initialize the app
async function initApp() {
  try {
    console.log('%c⚡ Initializing FinanceTracker...', 'color: #10B981; font-weight: bold;')
    
    // Add custom toast styles
    addCustomToastStyles()
    
    // Setup toast notifications
    await setupToastNotifications()
    
    // Mount the app
    app.mount('#app')
    
    if (import.meta.env.DEV) {
      console.log('%c✅ FinanceTracker app mounted successfully!', 'color: #10B981; font-weight: bold;')
      console.log('%c🎉 Ready to track your finances!', 'color: #F59E0B; font-weight: bold;')
    }
    
    // Add a welcome toast in development
    if (import.meta.env.DEV && app.config.globalProperties.$toast) {
      setTimeout(() => {
        app.config.globalProperties.$toast.success('Welcome to FinanceTracker! 🎉')
      }, 1000)
    }
    
  } catch (error) {
    console.error('Failed to initialize app:', error)
    
    // Show fallback error message
    document.body.innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 100vh; 
        background-color: #FAF9F6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        padding: 1rem;
      ">
        <div style="
          text-align: center; 
          padding: 2rem; 
          background: white; 
          border-radius: 1rem; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB;
          max-width: 28rem;
          width: 100%;
        ">
          <div style="
            width: 4rem;
            height: 4rem;
            background-color: #FEE2E2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          ">
            <svg style="width: 2rem; height: 2rem; color: #EF4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 style="
            color: #EF4444; 
            margin-bottom: 1rem; 
            font-size: 1.5rem; 
            font-weight: 600;
          ">
            App Initialization Failed
          </h1>
          <p style="
            color: #6B7280; 
            margin-bottom: 1.5rem; 
            line-height: 1.6;
          ">
            There was an error starting FinanceTracker. This might be due to a missing dependency or browser compatibility issue.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button 
              onclick="window.location.reload()" 
              style="
                background-color: #10B981; 
                color: white; 
                padding: 0.75rem 1.5rem; 
                border: none; 
                border-radius: 0.5rem; 
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#059669'"
              onmouseout="this.style.backgroundColor='#10B981'"
            >
              🔄 Refresh Page
            </button>
            <button 
              onclick="console.log('Error details:', ${JSON.stringify(error?.message || 'Unknown error')})" 
              style="
                background-color: transparent; 
                color: #6B7280; 
                padding: 0.75rem 1.5rem; 
                border: 1px solid #D1D5DB; 
                border-radius: 0.5rem; 
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
              "
              onmouseover="this.style.backgroundColor='#F9FAFB'; this.style.color='#374151'"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6B7280'"
            >
              🐛 View Details
            </button>
          </div>
          <p style="
            color: #9CA3AF; 
            font-size: 0.875rem; 
            margin-top: 1.5rem;
          ">
            If the problem persists, please check the browser console for more details.
          </p>
        </div>
      </div>
    `
  }
}

// Start the app
initApp()