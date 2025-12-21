<!-- Enhanced TheFooter.vue with Fixed Container Alignment -->
<template>
  <footer class="mt-6 sm:mt-8">
    <!-- Remove sidebar margin since main content area already handles it -->
    <div class="container-app p-3 sm:p-4 lg:p-6">
      <!-- Footer Card with exact dashboard sizing -->
      <div class="dashboard-card mb-6 sm:mb-8 w-full">
          <!-- Main Footer Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <!-- Brand Section -->
            <div class="text-center md:text-left">
              <div class="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-700">FinanceTracker</h3>
                  <p class="text-xs text-slate-500">Smart money management</p>
                </div>
              </div>
              <p class="text-sm text-slate-600 max-w-xs mx-auto md:mx-0">
                Take control of your finances with our intuitive tracking and analytics platform.
              </p>
            </div>

            <!-- Quick Links -->
            <div class="text-center md:text-left">
              <h4 class="text-sm font-semibold text-slate-700 mb-4">Quick Links</h4>
              <div class="space-y-2">
                <router-link 
                  to="/dashboard" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Dashboard
                </router-link>
                <router-link 
                  to="/transactions" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Transactions
                </router-link>
                <router-link 
                  to="/analytics" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Analytics
                </router-link>
                <router-link 
                  to="/reports" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Reports
                </router-link>
              </div>
            </div>

            <!-- Support & Legal -->
            <div class="text-center md:text-left">
              <h4 class="text-sm font-semibold text-slate-700 mb-4">Support & Legal</h4>
              <div class="space-y-2 mb-6">
                <a 
                  href="/help" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Help Center
                </a>
                <router-link 
                  to="/about" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  About Us
                </router-link>
                <router-link 
                  to="/privacy" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Privacy Policy
                </router-link>
                <router-link 
                  to="/terms" 
                  class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors py-1 hover:bg-emerald-50 rounded-md px-2 -mx-2"
                >
                  Terms of Service
                </router-link>
              </div>

              <!-- Social Links -->
              <div class="flex items-center justify-center md:justify-start space-x-3">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Twitter"
                >
                  <svg class="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="View our GitHub repository"
                >
                  <svg class="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg class="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Footer Bottom -->
          <div class="pt-4 sm:pt-6 border-t border-slate-200/50">
            <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <!-- Copyright and Version -->
              <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-slate-500">
                <p>© {{ currentYear }} FinanceTracker. All rights reserved.</p>
                <div class="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                <p class="flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    v{{ appVersion }}
                  </span>
                </p>
              </div>

              <!-- Theme Toggle and Quick Actions -->
              <div class="flex items-center space-x-3">
                <!-- Dark Mode Toggle -->
                <button 
                  @click="toggleDarkMode" 
                  class="group flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                  :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                >
                  <div class="relative w-5 h-5">
                    <transition name="theme-icon" mode="out-in">
                      <svg 
                        v-if="isDarkMode" 
                        key="sun"
                        class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      <svg 
                        v-else 
                        key="moon"
                        class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>
                    </transition>
                  </div>
                  <span class="hidden sm:inline">
                    {{ isDarkMode ? 'Light' : 'Dark' }}
                  </span>
                </button>

                <!-- Quick Support -->
                <router-link 
                  to="/help"
                  class="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="hidden sm:inline">Help</span>
                </router-link>

                <!-- Status Indicator -->
                <div class="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg">
                  <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span class="text-xs text-emerald-700 font-medium hidden sm:inline">All Systems Operational</span>
                  <span class="text-xs text-emerald-700 font-medium sm:hidden">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

// Get current year for copyright
const currentYear = new Date().getFullYear()

// App version - could be imported from a config file
const appVersion = ref('1.2.0')

// Use the shared dark mode composable
const { isDark: isDarkMode, toggle: toggleDarkMode } = useDarkMode()
</script>

<style scoped>
/* Enhanced Container styles to match dashboard exactly */
.container-app {
  max-width: 80rem; /* Same as dashboard - 1280px */
  margin-left: auto;
  margin-right: auto;
  width: 100%; /* Ensure full width within constraints */
  /* Remove default padding here since we add it explicitly in template */
}

/* Dashboard card styling - matches your main dashboard cards exactly */
.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .dashboard-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-card {
    padding: 2rem;
  }
}

/* Theme transition animations */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

/* Hover effects for better interactivity */
.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Enhanced focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Dark mode styles */
.dark footer {
  background-color: rgba(15, 23, 42, 0.8);
  border-color: rgba(51, 65, 85, 0.5);
}

.dark .text-slate-700 {
  color: #f1f5f9;
}

.dark .text-slate-600 {
  color: #cbd5e1;
}

.dark .text-slate-500 {
  color: #94a3b8;
}

.dark .border-slate-200\/50 {
  border-color: rgba(51, 65, 85, 0.5);
}

.dark .bg-slate-100 {
  background-color: #334155;
}

.dark .hover\:bg-emerald-50:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

/* Backdrop blur enhancement */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  /* Ensure touch targets are at least 44px */
  button, 
  a {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Better spacing for mobile */
  .space-x-3 > * + * {
    margin-left: 0.75rem;
  }
  
  /* Improve readability on small screens */
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .animate-pulse {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-slate-200\/50 {
    border-color: #000;
  }
  
  .text-slate-500 {
    color: #333;
  }
  
  .text-slate-600 {
    color: #222;
  }
}

/* Print styles */
@media print {
  footer {
    background: white !important;
    color: black !important;
    border-top: 1px solid #000;
  }
  
  .backdrop-blur-md {
    backdrop-filter: none;
  }
  
  button,
  .animate-pulse {
    display: none !important;
  }
}
</style>