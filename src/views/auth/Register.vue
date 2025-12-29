<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="bg-emerald-500 rounded-full p-3">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Join thousands of users already tracking their finances
        </p>
      </div>

      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="space-y-4">
            <!-- First Name & Last Name -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autocomplete="given-name"
                  required
                  v-model="form.firstName"
                  @blur="validateField('firstName')"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="First name"
                  :class="{ 'border-red-300': errors.firstName }"
                />
                <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autocomplete="family-name"
                  required
                  v-model="form.lastName"
                  @blur="validateField('lastName')"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Last name"
                  :class="{ 'border-red-300': errors.lastName }"
                />
                <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
              </div>
            </div>

            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  v-model="form.email"
                  @blur="validateField('email')"
                  class="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  :class="{ 'border-red-300': errors.email }"
                />
              </div>
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  v-model="form.password"
                  @blur="validateField('password')"
                  class="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Create a password (min 8 chars)"
                  :class="{ 'border-red-300': errors.password }"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
              
              <!-- Password Requirements -->
              <div class="mt-2 text-xs text-gray-500">
                <p>Password must contain:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li :class="{ 'text-green-600': passwordChecks.length }">At least 8 characters</li>
                  <li :class="{ 'text-green-600': passwordChecks.uppercase }">One uppercase letter</li>
                  <li :class="{ 'text-green-600': passwordChecks.lowercase }">One lowercase letter</li>
                  <li :class="{ 'text-green-600': passwordChecks.number }">One number</li>
                  <li :class="{ 'text-green-600': passwordChecks.specialChar }">One special character (@$!%*?&#)</li>
                </ul>
              </div>
              
              <!-- Password Strength Indicator -->
              <div class="mt-2">
                <div class="flex space-x-1">
                  <div 
                    v-for="i in 4" 
                    :key="i"
                    class="h-1 flex-1 rounded"
                    :class="getPasswordStrengthColor(i)"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ passwordStrengthText }}
                </p>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  v-model="form.confirmPassword"
                  @blur="validateField('confirmPassword')"
                  class="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                  :class="{ 'border-red-300': errors.confirmPassword }"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  v-model="form.acceptTerms"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  :class="{ 'border-red-300': errors.acceptTerms }"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="text-gray-700">
                  I agree to the 
                  <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500">Terms and Conditions</a>
                  and 
                  <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
                  *
                </label>
                <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg v-if="!loading" class="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-emerald-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </span>
                {{ loading ? 'Creating account...' : 'Create account' }}
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="errors.general" class="mt-3">
              <div class="bg-red-50 border border-red-200 rounded-md p-3">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ errors.general }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Sign In Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'Register',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      errors: {},
      loading: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  computed: {
    passwordChecks() {
      const password = this.form.password
      return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[@$!%*?&#]/.test(password)
      }
    },

    passwordStrength() {
      const checks = this.passwordChecks
      return Object.values(checks).filter(Boolean).length
    },
    
    passwordStrengthText() {
      const texts = ['Very Weak', 'Weak', 'Weak', 'Fair', 'Good', 'Strong']
      return this.form.password ? texts[this.passwordStrength] || 'Very Weak' : ''
    },

    isFormValid() {
      return this.form.firstName.trim() &&
             this.form.lastName.trim() &&
             this.form.email.trim() &&
             this.form.password &&
             this.form.confirmPassword &&
             this.form.acceptTerms &&
             this.passwordStrength === 5 &&  // All 5 requirements must be met
             this.form.password === this.form.confirmPassword &&
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
    }
  },
  methods: {
    getPasswordStrengthColor(index) {
      if (this.passwordStrength >= index) {
        const colors = ['bg-red-400', 'bg-red-300', 'bg-orange-300', 'bg-yellow-400', 'bg-green-500']
        return colors[this.passwordStrength - 1] || 'bg-red-400'
      }
      return 'bg-gray-200'
    },

    validateField(fieldName) {
      // Clear previous error for this field
      if (this.errors[fieldName]) {
        delete this.errors[fieldName]
      }

      switch (fieldName) {
        case 'firstName':
          if (!this.form.firstName.trim()) {
            this.errors.firstName = 'First name is required'
          } else if (this.form.firstName.trim().length < 2) {
            this.errors.firstName = 'First name must be at least 2 characters'
          }
          break

        case 'lastName':
          if (!this.form.lastName.trim()) {
            this.errors.lastName = 'Last name is required'
          } else if (this.form.lastName.trim().length < 2) {
            this.errors.lastName = 'Last name must be at least 2 characters'
          }
          break

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!this.form.email.trim()) {
            this.errors.email = 'Email is required'
          } else if (!emailRegex.test(this.form.email.trim())) {
            this.errors.email = 'Please enter a valid email address'
          }
          break

        case 'password':
          if (!this.form.password) {
            this.errors.password = 'Password is required'
          } else if (this.form.password.length < 8) {
            this.errors.password = 'Password must be at least 8 characters'
          } else if (this.passwordStrength < 5) {
            this.errors.password = 'Password must include uppercase, lowercase, number, and special character'
          }
          break

        case 'confirmPassword':
          if (!this.form.confirmPassword) {
            this.errors.confirmPassword = 'Please confirm your password'
          } else if (this.form.password !== this.form.confirmPassword) {
            this.errors.confirmPassword = 'Passwords do not match'
          }
          break
      }
    },

    validateForm() {
      this.errors = {}

      // Validate all fields
      this.validateField('firstName')
      this.validateField('lastName')
      this.validateField('email')
      this.validateField('password')
      this.validateField('confirmPassword')

      // Terms acceptance validation
      if (!this.form.acceptTerms) {
        this.errors.acceptTerms = 'You must accept the terms and conditions'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleRegister() {
      
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.errors.general = null

      try {
        // Prepare registration data
        const registrationData = {
          first_name: this.form.firstName.trim(),
          last_name: this.form.lastName.trim(),
          email: this.form.email.trim().toLowerCase(),
          password: this.form.password,
          password_confirmation: this.form.confirmPassword
        }

        // Import the API service
        const { authApi } = await import('@/services/api.js')

        const response = await authApi.register(registrationData)

        // 🚨 CRITICAL: Clear all cached data for new user
        await this.clearAllCachedData()

        // Show success message
        this.toast.success('Account created successfully! Please sign in with your new account.')

        // Clear form
        this.form = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
        }

        // Redirect to login page after a short delay
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)

      } catch (error) {
        this.handleRegistrationError(error)
        this.toast.error(this.errors.general)
      } finally {
        this.loading = false
      }
    },

    // Critical method to clear all cached data for new user
    async clearAllCachedData() {
      
      try {
        // Clear localStorage completely
        const authKeys = [
          'auth_token',
          'user',
          'user_data',
          'refresh_token',
          'transactions',
          'categories',
          'budgets',
          'settings',
          'preferences',
          'intended_route',
          'dashboard_data',
          'financial_data'
        ]
        
        authKeys.forEach(key => {
          localStorage.removeItem(key)
        })
        
        // Clear sessionStorage completely
        sessionStorage.clear()
        
        // Clear auth service data if available
        try {
          const authService = await import('@/services/authService')
          if (authService.default?.clearAuthData) {
            authService.default.clearAuthData()
          }
        } catch (error) {
        }
        
        // Clear Pinia stores if available
        try {
          // Clear user store
          const { useUserStore } = await import('@/stores/userStore')
          const userStore = useUserStore()
          if (userStore.$reset) {
            userStore.$reset()
          }
        } catch (error) {
        }
        
        try {
          // Clear transaction store
          const { useTransactionStore } = await import('@/stores/transactions')
          const transactionStore = useTransactionStore()
          if (transactionStore.$reset) {
            transactionStore.$reset()
          }
        } catch (error) {
        }
        
        try {
          // Clear budget store if it exists
          const { useBudgetStore } = await import('@/stores/budgets')
          const budgetStore = useBudgetStore()
          if (budgetStore.$reset) {
            budgetStore.$reset()
          }
        } catch (error) {
        }
        
        // Clear any cached API responses
        if (window.apiCache) {
          window.apiCache.clear()
        }
        
        // Clear any Vue component caches
        if (this.$parent?.$store) {
          this.$parent.$store.commit('RESET_ALL_STATE')
        }

      } catch (error) {
      }
    },

    // Force fresh data reload helper
    async forceFreshDataReload() {
      
      try {
        // Option 1: Reload the entire page to ensure fresh start
        // window.location.reload()
        
        // Option 2: Navigate to login with forced refresh
        await this.$router.push({ 
          path: '/login', 
          query: { 
            fresh: 'true',
            timestamp: Date.now()
          }
        })
        
      } catch (error) {
      }
    },

    handleRegistrationError(error) {
      
      // Handle network errors
      if (!error.response) {
        this.errors.general = 'Network error. Please check your internet connection and try again.'
        return
      }

      const status = error.response.status
      const errorData = error.response.data


      switch (status) {
        case 400:
          // Bad Request - validation errors
          if (errorData.message) {
            this.errors.general = errorData.message
          } else if (errorData.error) {
            this.errors.general = errorData.error
          } else if (errorData.errors) {
            // Handle field-specific errors
            const fieldErrors = errorData.errors
            Object.keys(fieldErrors).forEach(field => {
              this.errors[field] = fieldErrors[field]
            })
            this.errors.general = 'Please fix the errors above'
          } else {
            this.errors.general = 'Invalid registration data. Please check your information.'
          }
          break

        case 409:
          // Conflict - email already exists
          this.errors.general = 'An account with this email already exists. Please use a different email or try signing in.'
          break

        case 422:
          // Unprocessable Entity - validation errors
          this.errors.general = 'Please check your information and try again.'
          break

        case 500:
          // Server error
          this.errors.general = 'Server error. Please try again later.'
          break

        default:
          this.errors.general = error.message || 'An unexpected error occurred. Please try again.'
      }
    },

    // Emergency reset method (for testing)
    async emergencyReset() {
      
      // Clear everything
      await this.clearAllCachedData()
      
      // Reload page
      window.location.reload()
    }
  },

  mounted() {
    // Focus on first name input when component mounts
    this.$nextTick(() => {
      document.getElementById('firstName')?.focus()
    })

    // Clear any existing auth data when component loads
    this.$nextTick(async () => {
      try {
        // Ensure we start with a clean slate
        const authService = await import('@/services/authService')
        if (authService.default?.isAuthenticated?.()) {
          await this.clearAllCachedData()
        }
      } catch (error) {
      }
    })
  }
}
</script>

<style scoped>
input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>