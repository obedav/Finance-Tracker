<!-- UPDATED TheHeader.vue - Mobile-First Design -->
<template>
  <header class="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg border-b border-gray-200 dark:border-neutral-700 shadow-sm sticky top-0 z-40 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Left: Mobile Menu + Logo -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Mobile Hamburger Menu -->
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors md:hidden focus-ring"
            aria-label="Toggle sidebar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <router-link to="/dashboard" class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <!-- Show abbreviated logo on mobile, full on larger screens -->
            <span class="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 transition-colors">
              <span class="sm:hidden">FT</span>
              <span class="hidden sm:block">FinanceTracker</span>
            </span>
          </router-link>
        </div>

        <!-- Right: Notifications + Dark Mode + User Menu -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Debug Info - Hidden on mobile -->
          <div class="text-xs text-gray-500 hidden lg:block">
            User: {{ currentUser?.firstName || 'None' }} | Auth: {{ isAuthenticated ? 'Yes' : 'No' }}
          </div>

          <!-- Notifications Button -->
          <button
            @click="toggleNotifications"
            class="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20 transition-colors relative"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-4-4V8a6 6 0 10-12 0v5l-4 4h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          <!-- Dark Mode Toggle -->
          <DarkModeToggle />

          <!-- User Dropdown - Responsive -->
          <div class="relative" ref="userDropdownRef">
            <!-- User Button - Simplified for mobile -->
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              type="button"
            >
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs sm:text-sm font-medium">{{ userInitials }}</span>
              </div>
              <!-- Hide user name on mobile -->
              <span class="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-32 truncate">{{ userDisplayName }}</span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu - Responsive positioning -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 py-1 transition-colors"
            >
              <!-- User Info Header -->
              <div class="px-4 py-3 border-b border-gray-100 dark:border-neutral-700">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{{ userDisplayName }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ currentUser?.email || 'user@example.com' }}</p>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <router-link
                  to="/profile"
                  @click="closeUserMenu"
                  class="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile
                </router-link>

                <router-link
                  to="/settings"
                  @click="closeUserMenu"
                  class="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Settings
                </router-link>

                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-red-400 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Panel (temporary) - Hidden on mobile -->
    <div v-if="showDebug" class="bg-yellow-100 border-t border-yellow-200 p-2 text-xs hidden sm:block">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div>
          <span class="font-bold">DEBUG:</span>
          showUserMenu: {{ showUserMenu }} | 
          isAuthenticated: {{ isAuthenticated }} | 
          user: {{ currentUser?.firstName || 'null' }}
        </div>
        <button @click="showDebug = false" class="text-yellow-700 hover:text-yellow-900">×</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService.js'
import { STORAGE_KEYS } from '@/utils/constants.js'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'

// Define emits
const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()

// Template refs
const userDropdownRef = ref(null)

// Local state
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showDebug = ref(true) // Temporary debug panel

// Get auth data directly from authService
const isAuthenticated = computed(() => {
  return authService.isAuthenticated()
})

const currentUser = computed(() => {
  return authService.getCurrentUserData()
})

const userInitials = computed(() => {
  const user = currentUser.value
  if (!user) return 'JD'
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

const userDisplayName = computed(() => {
  const user = currentUser.value
  if (!user) return 'John Doe'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim()
})

// Methods
const toggleUserMenu = (event) => {
  console.log('🔽 User menu toggle clicked!')
  console.log('Event:', event)
  console.log('Before:', showUserMenu.value)
  showUserMenu.value = !showUserMenu.value
  console.log('After:', showUserMenu.value)
  
  // Prevent event propagation
  event.stopPropagation()
  
  // Close notifications if open
  if (showNotifications.value) {
    showNotifications.value = false
  }
}

const closeUserMenu = () => {
  console.log('🔒 Closing user menu')
  showUserMenu.value = false
}

const toggleNotifications = () => {
  console.log('🔔 Notifications toggle clicked!')
  showNotifications.value = !showNotifications.value
  
  // Close user menu if open
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
}

const testLogout = () => {
  alert('TEST LOGOUT CLICKED!')
  console.log('🧪 Test logout function called')
  showUserMenu.value = false
}

const handleLogout = async () => {
  console.log('🚪 Real logout clicked!')
  
  try {
    closeUserMenu()
    await authService.logout()
    console.log('✅ Logout successful')
    router.push('/login')
  } catch (error) {
    console.error('❌ Logout error:', error)
    // Force logout even if API fails
    authService.clearAuthData()
    router.push('/login')
  }
}

// Click outside handler - Fixed to use template ref
const handleClickOutside = (event) => {
  // Check if click is outside the user dropdown
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    if (showUserMenu.value) {
      console.log('👆 Clicked outside user menu, closing...')
      closeUserMenu()
    }
  }
  
  // Handle notifications separately if you have a ref for it
  if (showNotifications.value && !event.target.closest('.notifications-container')) {
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('🏗️ Header mounted')
  console.log('Auth state:', { 
    isAuthenticated: isAuthenticated.value, 
    user: currentUser.value,
    userInitials: userInitials.value,
    userDisplayName: userDisplayName.value
  })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('🏗️ Header unmounted')
  document.removeEventListener('click', handleClickOutside)
})

// Debug function for testing
if (typeof window !== 'undefined') {
  window.headerDebug = () => {
    console.log('=== HEADER DEBUG ===')
    console.log('showUserMenu:', showUserMenu.value)
    console.log('isAuthenticated:', isAuthenticated.value)
    console.log('currentUser:', currentUser.value)
    console.log('userInitials:', userInitials.value)
    console.log('userDisplayName:', userDisplayName.value)
    console.log('authService data:', {
      token: authService.getStoredToken(),
      user: authService.getStoredUser(),
      authenticated: authService.isAuthenticated()
    })
    console.log('Storage check:', {
      finance_token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      finance_user: localStorage.getItem(STORAGE_KEYS.USER),
      allKeys: Object.keys(localStorage)
    })
  }

  // Add authService to window for debugging
  window.authService = authService

  // Add manual toggle function for testing
  window.testToggle = () => {
    console.log('Manual toggle test')
    showUserMenu.value = !showUserMenu.value
    console.log('showUserMenu after manual toggle:', showUserMenu.value)
  }

  // Add clear function for debugging
  window.clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    authService.clearAuthData()
    console.log('Auth data cleared')
    window.location.href = '/login'
  }
}
</script>

<style scoped>
/* Simple styles for better visibility */
.relative {
  position: relative;
}

/* Ensure dropdown appears above other content */
.z-50 {
  z-index: 50;
}

/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

/* Debug panel */
.bg-yellow-100 {
  background-color: #fef3c7;
}

.border-yellow-200 {
  border-color: #fde68a;
}

.text-yellow-700 {
  color: #a16207;
}

.text-yellow-900 {
  color: #78350f;
}

/* Dropdown animation */
.dropdown-menu {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus ring utility */
.focus-ring:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Mobile-specific improvements */
@media (max-width: 768px) {
  /* Ensure touch targets are at least 44px */
  button {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Better spacing for mobile */
  .space-x-1 > * + * {
    margin-left: 0.25rem;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
}

/* Tablet and desktop improvements */
@media (min-width: 769px) {
  /* Hover effects only on non-touch devices */
  @media (hover: hover) {
    button:hover {
      transform: translateY(-1px);
    }
  }
}
</style>