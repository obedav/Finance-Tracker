<!-- src/views/Profile.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-slate-700">My Profile</h1>
            <p class="text-lg text-slate-500">Manage your personal information and account details</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="xl:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <!-- Avatar Section -->
            <div class="mb-6">
              <div class="relative inline-block">
                <div v-if="userStore.user?.avatar" class="w-32 h-32 rounded-full mx-auto overflow-hidden shadow-lg">
                  <img :src="userStore.user.avatar" :alt="userStore.user?.fullName" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <span class="text-4xl font-bold text-white">{{ userInitials }}</span>
                </div>
                
                <!-- Edit Avatar Button (only show if feature is enabled) -->
                <button
                  v-if="FEATURES.RECEIPT_UPLOAD"
                  @click="showAvatarUpload = true"
                  class="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                >
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
                <!-- Coming Soon Badge -->
                <div
                  v-if="!FEATURES.RECEIPT_UPLOAD"
                  class="absolute bottom-2 right-2 px-2 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-semibold text-amber-700"
                  title="Avatar upload coming soon"
                >
                  <svg class="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- User Info -->
            <h2 class="text-2xl font-bold text-slate-700 mb-2">{{ displayName }}</h2>
            <p class="text-slate-500 mb-4">{{ userEmail }}</p>
            
            <!-- Status Badge -->
            <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-6">
              <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Active Member
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <div class="text-2xl font-bold text-emerald-600">{{ totalTransactions }}</div>
                <div class="text-sm text-emerald-700">Transactions</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div class="text-2xl font-bold text-amber-600">{{ memberSince }}</div>
                <div class="text-sm text-amber-700">Member Since</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Information Form -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                Personal Information
              </h3>
              <button 
                v-if="!isEditing"
                @click="enableEditing"
                class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
            </div>
            
            <form @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">First Name</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    :readonly="!isEditing"
                    :class="{ 'bg-gray-50 cursor-not-allowed': !isEditing }"
                    placeholder="Enter your first name"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    :readonly="!isEditing"
                    :class="{ 'bg-gray-50 cursor-not-allowed': !isEditing }"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  :readonly="!isEditing"
                  :class="{ 'bg-gray-50 cursor-not-allowed': !isEditing }"
                  placeholder="Enter your email"
                />
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  :readonly="!isEditing"
                  :class="{ 'bg-gray-50 cursor-not-allowed': !isEditing }"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div v-if="isEditing" class="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  @click="cancelEditing"
                  class="px-6 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  :disabled="loading.profile"
                >
                  <svg v-if="!loading.profile" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div v-else class="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {{ loading.profile ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Account Security -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              Account Security
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-6-4h2a2 2 0 012 2m0 0V9a2 2 0 012-2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-700">Change Password</div>
                    <div class="text-sm text-slate-500">Update your account password</div>
                  </div>
                </div>
                <router-link to="/settings" class="px-4 py-2 text-sm font-medium text-emerald-600 bg-white border border-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                  Change
                </router-link>
              </div>
              
              <!-- Two-Factor Authentication (only show if feature is enabled) -->
              <div v-if="FEATURES.TWO_FACTOR_AUTH" class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-700">Two-Factor Authentication</div>
                    <div class="text-sm text-slate-500">Add extra security to your account</div>
                  </div>
                </div>
                <router-link to="/settings" class="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  Setup
                </router-link>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              Quick Actions
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <router-link to="/settings" class="flex flex-col items-center p-4 text-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-sm font-medium text-slate-700">Account Settings</span>
              </router-link>
              
              <router-link to="/reports" class="flex flex-col items-center p-4 text-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="text-sm font-medium text-slate-700">View Reports</span>
              </router-link>
              
              <button @click="exportUserData" class="flex flex-col items-center p-4 text-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-sm font-medium text-slate-700">Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarUpload" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-scale-up">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-700 mb-4">Update Profile Photo</h3>
          <div class="text-center">
            <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarUpload" class="hidden">
            <button @click="$refs.fileInput.click()" class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 mb-4">
              Choose Photo
            </button>
            <p class="text-sm text-slate-500">Supported formats: JPG, PNG, GIF (max 5MB)</p>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="showAvatarUpload = false" class="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/stores/transactions'
import { useToast } from '@/composables/useToast'
import authService from '@/services/authService'
import { FEATURES } from '@/utils/constants.js'

// Initialize stores and composables
const userStore = useUserStore()
const transactionStore = useTransactionStore()
const { showToast } = useToast()

// Reactive state
const isEditing = ref(false)
const showAvatarUpload = ref(false)
const loading = ref({
  profile: false,
  avatar: false
})

// Form data
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const originalProfileData = ref({})

// Computed properties
const userInitials = computed(() => {
  const user = userStore.user || authService.getStoredUser()
  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
})

const displayName = computed(() => {
  const user = userStore.user || authService.getStoredUser()
  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const fullName = user?.fullName || user?.full_name || ''
  
  if (fullName) return fullName
  if (firstName || lastName) return `${firstName} ${lastName}`.trim()
  return user?.name || user?.email?.split('@')[0] || 'User'
})

const userEmail = computed(() => {
  const user = userStore.user || authService.getStoredUser()
  return user?.email || 'No email provided'
})

const totalTransactions = computed(() => {
  return transactionStore.transactions?.length || 0
})

const memberSince = computed(() => {
  const user = userStore.user || authService.getStoredUser()
  const createdAt = user?.createdAt || user?.created_at || user?.memberSince
  
  if (createdAt) {
    return new Date(createdAt).getFullYear()
  }
  return new Date().getFullYear()
})

// Methods
const enableEditing = () => {
  isEditing.value = true
  // Store original data for canceling
  originalProfileData.value = { ...profileForm.value }
}

const cancelEditing = () => {
  isEditing.value = false
  // Restore original data
  profileForm.value = { ...originalProfileData.value }
}

const saveProfile = async () => {
  try {
    loading.value.profile = true
    
    // Update user profile through userStore
    if (userStore.updateUserProfile) {
      await userStore.updateUserProfile(profileForm.value)
    } else {
      // Fallback: update through authService if userStore method not available
      const updatedUser = { ...authService.getStoredUser(), ...profileForm.value }
      authService.setStoredUser(updatedUser)
    }
    
    isEditing.value = false
    showToast('Profile updated successfully!', 'success')
  } catch (error) {
    showToast('Failed to update profile. Please try again.', 'error')
  } finally {
    loading.value.profile = false
  }
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be less than 5MB', 'error')
    return
  }

  try {
    loading.value.avatar = true
    // Here you would upload the file to your server
    // For now, we'll just show a placeholder
    showToast('Avatar upload feature coming soon!', 'info')
    showAvatarUpload.value = false
  } catch (error) {
    showToast('Failed to upload avatar', 'error')
  } finally {
    loading.value.avatar = false
  }
}

const exportUserData = async () => {
  try {
    // Get real user data
    const user = userStore.user || authService.getStoredUser()
    const transactions = transactionStore.transactions || []
    
    const userData = {
      profile: {
        ...user,
        // Remove sensitive data
        password: undefined,
        token: undefined
      },
      transactions: transactions,
      categories: transactionStore.categories || [],
      settings: userStore.settings || {},
      exportDate: new Date().toISOString(),
      exportVersion: '1.0'
    }
    
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financetracker-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showToast('Your data has been exported successfully', 'success')
  } catch (error) {
    showToast('Failed to export data. Please try again.', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Load user data if not already loaded
    if (userStore.fetchUserProfile && (!userStore.user || !userStore.isLoaded)) {
      await userStore.fetchUserProfile()
    }

    // Load transactions if not already loaded
    if (transactionStore.fetchTransactions && (!transactionStore.transactions || transactionStore.transactions.length === 0)) {
      await transactionStore.fetchTransactions()
    }

    // Initialize form with user data from store or authService
    const user = userStore.user || authService.getStoredUser()
    if (user) {
      profileForm.value = {
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || ''
      }
    }
  } catch (error) {
    showToast('Failed to load profile data', 'error')
  }
})
</script>

<style scoped>
.gold-400 { 
  color: #fbbf24; 
}
.gold-600 { 
  color: #d97706; 
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  33% { 
    transform: translateY(-10px) rotate(1deg); 
  }
  66% { 
    transform: translateY(-5px) rotate(-1deg); 
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.3s ease-out;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>