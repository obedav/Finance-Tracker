<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Authentication Debug Panel</h1>

      <!-- Auth Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Authentication Status</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">Is Authenticated:</span>
            <span :class="isAuth ? 'text-green-600' : 'text-red-600'">
              {{ isAuth ? 'YES ✅' : 'NO ❌' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Has User Data:</span>
            <span :class="hasUser ? 'text-green-600' : 'text-red-600'">
              {{ hasUser ? 'YES ✅' : 'NO ❌' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Current User:</span>
            <span class="text-gray-700">{{ currentUserEmail || 'None' }}</span>
          </div>
        </div>
      </div>

      <!-- LocalStorage -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">LocalStorage</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto text-sm">{{ localStorageData }}</pre>
      </div>

      <!-- Cookies -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Cookies</h2>
        <pre class="bg-gray-50 p-4 rounded overflow-x-auto text-sm">{{ cookiesData }}</pre>
      </div>

      <!-- API Test -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">API Request Test</h2>
        <button
          @click="testAPI"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          :disabled="testing"
        >
          {{ testing ? 'Testing...' : 'Test API Request' }}
        </button>
        <div v-if="apiResult" class="mt-4">
          <h3 class="font-medium mb-2">Result:</h3>
          <pre class="bg-gray-50 p-4 rounded overflow-x-auto text-sm">{{ apiResult }}</pre>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Actions</h2>
        <div class="space-x-4">
          <button
            @click="refreshData"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh Data
          </button>
          <button
            @click="clearAll"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All (Logout)
          </button>
          <router-link
            to="/login"
            class="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go to Login
          </router-link>
          <router-link
            to="/dashboard"
            class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import authService from '@/services/authService.js'
import { apiHelpers } from '@/services/api.ts'
import { API_ENDPOINTS } from '@/utils/constants.js'

const isAuth = ref(false)
const hasUser = ref(false)
const currentUserEmail = ref('')
const localStorageData = ref({})
const cookiesData = ref('')
const apiResult = ref(null)
const testing = ref(false)

const loadData = () => {
  // Check auth status
  isAuth.value = authService.isAuthenticated()
  const user = authService.getStoredUser()
  hasUser.value = !!user
  currentUserEmail.value = user?.email || ''

  // Get localStorage
  const storage = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    try {
      storage[key] = JSON.parse(localStorage.getItem(key))
    } catch {
      storage[key] = localStorage.getItem(key)
    }
  }
  localStorageData.value = storage

  // Get cookies
  cookiesData.value = document.cookie || 'No cookies found'
}

const testAPI = async () => {
  testing.value = true
  apiResult.value = null

  try {
    const response = await apiHelpers.get(API_ENDPOINTS.AUTH.PROFILE)
    apiResult.value = {
      status: 'SUCCESS',
      data: response
    }
  } catch (error) {
    apiResult.value = {
      status: 'ERROR',
      message: error.message,
      details: error
    }
  } finally {
    testing.value = false
  }
}

const refreshData = () => {
  loadData()
  apiResult.value = null
}

const clearAll = async () => {
  await authService.logout()
  localStorage.clear()
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
