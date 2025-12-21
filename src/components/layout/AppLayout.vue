<!-- UPDATED AppLayout.vue - With Transaction Store Integration -->
<template>
  <div class="min-h-screen bg-cream dark:bg-neutral-900 transition-colors duration-200">
    <!-- Skip to main content for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 sm:top-4 sm:left-4 bg-emerald-600 text-white px-3 py-2 sm:px-4 rounded-lg z-50 text-sm"
    >
      Skip to main content
    </a>

    <!-- Header -->
    <TheHeader 
      v-if="showHeader"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="flex">
      <!-- Sidebar with Transaction Store -->
      <TheSidebar 
        v-if="showSidebar"
        :is-open="sidebarOpen"
        :current-route="currentRoute"
        :user="currentUser"
        :transaction-store="transactionStore"
        @close="closeSidebar"
        @show-add-transaction="handleShowAddTransaction"
      />

      <!-- Main Content Area -->
      <main 
        id="main-content"
        class="flex-1 transition-all duration-300 ease-in-out min-h-screen"
        :class="getMainContentClasses"
        role="main"
        :aria-label="currentPageTitle"
      >
        <!-- Breadcrumbs - Responsive -->
        <nav
          v-if="showBreadcrumbs && breadcrumbs.length > 1"
          class="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-3 py-3 sm:px-6 sm:py-4 transition-colors"
          aria-label="Breadcrumb"
        >
          <ol class="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto">
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
              <div class="flex items-center whitespace-nowrap">
                <router-link
                  v-if="!crumb.active"
                  :to="crumb.path"
                  class="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ crumb.title }}
                </router-link>
                <span
                  v-else
                  class="text-slate-700 dark:text-slate-200 font-medium"
                  aria-current="page"
                >
                  {{ crumb.title }}
                </span>
                <svg
                  v-if="index < breadcrumbs.length - 1"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 mx-1 sm:mx-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Page Content -->
        <div class="flex-1 relative">
          <!-- Loading Overlay - Responsive -->
          <div
            v-if="isLoading"
            class="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-40 p-4 transition-colors"
            role="status"
            aria-label="Loading"
          >
            <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
              <div class="loading-spinner"></div>
              <span class="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base">{{ loadingMessage }}</span>
            </div>
          </div>

          <!-- Router View -->
          <router-view 
            v-slot="{ Component, route }" 
            :key="route.fullPath"
          >
            <transition
              :name="pageTransition"
              mode="out-in"
              @enter="onPageEnter"
              @leave="onPageLeave"
            >
              <component 
                :is="Component" 
                :key="route.fullPath"
                class="animate-fade-in"
              />
            </transition>
          </router-view>
        </div>

        <TheFooter v-if="showFooter" />
      </main>
    </div>

    <!-- Toast Notifications - Responsive positioning -->
    <div 
      id="toast-container"
      class="fixed top-16 right-2 sm:top-20 sm:right-6 z-50 space-y-2 max-w-sm"
      aria-live="polite"
      aria-label="Notifications"
    >
      <!-- Toast notifications will be rendered here -->
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
      @click="closeSidebar"
      aria-hidden="true"
    ></div>

    <!-- Keyboard Shortcuts Modal - Responsive -->
    <div
      v-if="showKeyboardShortcuts"
      class="modal-overlay"
      @click="showKeyboardShortcuts = false"
    >
      <div class="modal-content w-full max-w-xs sm:max-w-2xl mx-4 bg-white dark:bg-neutral-800 border dark:border-neutral-700 transition-colors" @click.stop>
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200">Keyboard Shortcuts</h2>
            <button
              @click="showKeyboardShortcuts = false"
              class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 class="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm sm:text-base">Navigation</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Dashboard</span>
                  <kbd class="keyboard-shortcut">Alt + D</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Transactions</span>
                  <kbd class="keyboard-shortcut">Alt + T</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Reports</span>
                  <kbd class="keyboard-shortcut">Alt + R</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Settings</span>
                  <kbd class="keyboard-shortcut">Alt + S</kbd>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm sm:text-base">Actions</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">New Transaction</span>
                  <kbd class="keyboard-shortcut">Ctrl + N</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Search</span>
                  <kbd class="keyboard-shortcut">Ctrl + K</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Help</span>
                  <kbd class="keyboard-shortcut">?</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">This Menu</span>
                  <kbd class="keyboard-shortcut">Ctrl + /</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheHeader from './TheHeader.vue'
import TheSidebar from './TheSidebar.vue'
import TheFooter from './TheFooter.vue'
import authService from '@/services/authService'
import { getBreadcrumbs } from '@/router'
import { useTransactionStore } from '@/stores/transactions'

const route = useRoute()
const router = useRouter()

// Initialize transaction store
const transactionStore = useTransactionStore()

// Reactive state
const sidebarOpen = ref(false)
const isLoading = ref(false)
const loadingMessage = ref('Loading...')
const showKeyboardShortcuts = ref(false)
const notifications = ref([])
const pageTransition = ref('fade')
const windowWidth = ref(window.innerWidth)

// Simple responsive breakpoint detection without @vueuse/core
const isMobile = computed(() => windowWidth.value < 768)

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Current user
const currentUser = computed(() => authService.getCurrentUserData())

// Layout visibility controls
const showHeader = computed(() => {
  const authRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword']
  return !authRoutes.includes(route.name)
})

const showSidebar = computed(() => {
  const authRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword']
  const noSidebarRoutes = ['Profile', 'Settings']
  return !authRoutes.includes(route.name) && !noSidebarRoutes.includes(route.name)
})

const showFooter = computed(() => {
  const authRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword']
  return !authRoutes.includes(route.name)
})

const showBreadcrumbs = computed(() => {
  const noBreadcrumbRoutes = ['Dashboard', 'Login', 'Register']
  return !noBreadcrumbRoutes.includes(route.name)
})

// Current route and breadcrumbs
const currentRoute = computed(() => route.name)
const currentPageTitle = computed(() => route.meta?.title || 'FinanceTracker')

// Simple breadcrumbs without external dependency
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(path => path)
  const breadcrumbArray = []
  
  let currentPath = ''
  pathArray.forEach((path, index) => {
    currentPath += `/${path}`
    breadcrumbArray.push({
      name: path,
      title: path.charAt(0).toUpperCase() + path.slice(1),
      path: currentPath,
      active: index === pathArray.length - 1
    })
  })
  
  return breadcrumbArray
})

// Main content classes based on sidebar state
const getMainContentClasses = computed(() => {
  if (!showSidebar.value) return 'w-full'
  
  return {
    'ml-0': !sidebarOpen.value || isMobile.value,
    'ml-56 sm:ml-64': sidebarOpen.value && !isMobile.value
  }
})

// Methods
const toggleSidebar = () => {
  console.log('📱 Sidebar toggle from layout')
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleLogout = async () => {
  try {
    isLoading.value = true
    loadingMessage.value = 'Signing out...'
    
    await authService.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoading.value = false
  }
}

// Page transition handlers
const onPageEnter = (el) => {
  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Update document title
  document.title = currentPageTitle.value ? 
    `${currentPageTitle.value} | FinanceTracker` : 
    'FinanceTracker'
}

const onPageLeave = (el) => {
  // Clean up any page-specific resources
}

// Keyboard shortcuts
const handleKeyboardShortcuts = (event) => {
  // Don't trigger shortcuts when typing in inputs
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }

  const { ctrlKey, altKey, key } = event

  if (ctrlKey && key === '/') {
    event.preventDefault()
    showKeyboardShortcuts.value = !showKeyboardShortcuts.value
    return
  }

  if (key === '?') {
    event.preventDefault()
    showKeyboardShortcuts.value = true
    return
  }

  if (altKey) {
    event.preventDefault()
    switch (key.toLowerCase()) {
      case 'd':
        router.push('/dashboard')
        break
      case 't':
        router.push('/transactions')
        break
      case 'r':
        router.push('/reports')
        break
      case 's':
        router.push('/settings')
        break
    }
  }

  if (ctrlKey) {
    switch (key.toLowerCase()) {
      case 'n':
        event.preventDefault()
        // Open new transaction modal or navigate to new transaction
        router.push('/transactions/new')
        break
      case 'k':
        event.preventDefault()
        // Focus search input
        const searchInput = document.querySelector('[data-search-input]')
        if (searchInput) searchInput.focus()
        break
    }
  }
}

// Notification management
const addNotification = (notification) => {
  const id = Date.now()
  notifications.value.push({ ...notification, id })
  
  // Auto remove after timeout
  setTimeout(() => {
    removeNotification(id)
  }, notification.timeout || 5000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Handle show add transaction event from sidebar
const handleShowAddTransaction = () => {
  // Navigate to transactions page or open a modal
  router.push('/transactions')
  // Or emit to parent component if needed
  // emit('show-add-transaction')
}

// Initialize sidebar state based on screen size
const initializeSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    // Check localStorage for saved preference
    const savedState = localStorage.getItem('sidebar-open')
    sidebarOpen.value = savedState ? JSON.parse(savedState) : true
  }
}

// Save sidebar state to localStorage
const saveSidebarState = () => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen.value))
  }
}

// Watch for route changes to close mobile sidebar
watch(route, () => {
  if (isMobile.value) {
    closeSidebar()
  }
})

// Watch sidebar state to save preference
watch(sidebarOpen, saveSidebarState)

// Watch for screen size changes
watch(isMobile, (newIsMobile) => {
  if (newIsMobile) {
    sidebarOpen.value = false
  } else {
    initializeSidebar()
  }
})

// Lifecycle
onMounted(() => {
  initializeSidebar()
  document.addEventListener('keydown', handleKeyboardShortcuts)
  window.addEventListener('resize', handleResize)
  
  // Initialize transaction store data
  if (transactionStore && transactionStore.initializeStore) {
    transactionStore.initializeStore()
  }
  
  // Global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'An unexpected error occurred',
      timeout: 5000
    })
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
  window.removeEventListener('resize', handleResize)
})

// Provide methods to child components
defineExpose({
  addNotification,
  removeNotification,
  setLoading: (loading, message = 'Loading...') => {
    isLoading.value = loading
    loadingMessage.value = message
  }
})
</script>

<style scoped>
/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive loading spinner */
.loading-spinner {
  @apply w-5 h-5 sm:w-6 sm:h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin;
}

/* Modal styles */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto;
}

/* Keyboard shortcut styling */
.keyboard-shortcut {
  @apply px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-mono bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded text-slate-700 dark:text-slate-200;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Mobile-specific improvements */
@media (max-width: 768px) {
  /* Ensure touch targets are at least 44px */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>