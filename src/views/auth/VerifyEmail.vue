<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo/Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
          Email Verification
        </h2>
      </div>

      <!-- Verification Status Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">Verifying your email...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationStatus === 'success'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email Verified Successfully!
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Your email address has been verified. You can now access all features.
          </p>
          <button
            @click="goToDashboard"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <!-- Already Verified State -->
        <div v-else-if="verificationStatus === 'already_verified'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email Already Verified
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Your email address was already verified.
          </p>
          <button
            @click="goToDashboard"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationStatus === 'error'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verification Failed
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ errorMessage }}
          </p>
          <div class="space-y-3">
            <button
              @click="resendVerification"
              :disabled="resending"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!resending">Resend Verification Email</span>
              <span v-else>Sending...</span>
            </button>
            <button
              @click="goToLogin"
              class="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Having trouble?
        <a href="/support" class="font-medium text-green-600 hover:text-green-500">
          Contact Support
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/authService'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useToast()

const loading = ref(true)
const verificationStatus = ref<'success' | 'already_verified' | 'error' | null>(null)
const errorMessage = ref('')
const resending = ref(false)

const verifyEmail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const hash = route.params.hash as string

    if (!id || !hash) {
      verificationStatus.value = 'error'
      errorMessage.value = 'Invalid verification link'
      return
    }

    const response = await authService.verifyEmail(id, hash)

    if (response.success) {
      if (response.message?.includes('already')) {
        verificationStatus.value = 'already_verified'
      } else {
        verificationStatus.value = 'success'
        showSuccess('Email verified successfully!')
      }
    } else {
      verificationStatus.value = 'error'
      errorMessage.value = response.message || 'Verification failed'
    }
  } catch (error: unknown) {
    verificationStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during verification'
  } finally {
    loading.value = false
  }
}

const resendVerification = async () => {
  try {
    resending.value = true
    const response = await authService.resendVerificationEmail()

    if (response.success) {
      showSuccess('Verification email sent! Please check your inbox.')
    } else {
      showError(response.message || 'Failed to resend verification email')
    }
  } catch (error: unknown) {
    showError(error instanceof Error ? error.message : 'Failed to resend verification email')
  } finally {
    resending.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  verifyEmail()
})
</script>
