<template>
  <transition name="slide-down">
    <div
      v-if="showBanner && !isVerified"
      class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4"
      role="alert"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-start flex-1">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-yellow-400 dark:text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Email Verification Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                Please verify your email address to access all features. Check your inbox for the verification link.
              </p>
              <p v-if="userEmail" class="mt-1 text-xs">
                Verification email sent to: <span class="font-semibold">{{ userEmail }}</span>
              </p>
            </div>
            <div class="mt-4 flex items-center space-x-4">
              <button
                @click="resendVerification"
                :disabled="resending || cooldown > 0"
                class="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="!resending && cooldown === 0">Resend Verification Email</span>
                <span v-else-if="resending">Sending...</span>
                <span v-else>Resend in {{ cooldown }}s</span>
              </button>
            </div>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            @click="dismissBanner"
            class="inline-flex text-yellow-400 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 focus:outline-none transition-colors"
            aria-label="Dismiss notification"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import authService from '@/services/authService'
import { useToast } from '@/composables/useToast'

const { success: showSuccess, error: showError } = useToast()

const showBanner = ref(true)
const isVerified = ref(true)
const userEmail = ref<string | null>(null)
const resending = ref(false)
const cooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

// Check verification status on mount
const checkVerificationStatus = async () => {
  try {
    const response = await authService.checkVerificationStatus()

    if (response.success) {
      isVerified.value = response.is_verified
      userEmail.value = response.email || null

      // If verified, ensure banner is hidden
      if (response.is_verified) {
        showBanner.value = false
      }
    }
  } catch (error) {
    // If check fails, hide banner to avoid annoyance
    showBanner.value = false
  }
}

// Resend verification email
const resendVerification = async () => {
  if (resending.value || cooldown.value > 0) return

  try {
    resending.value = true
    const response = await authService.resendVerificationEmail()

    if (response.success) {
      showSuccess('Verification email sent! Please check your inbox.')

      // Start 60-second cooldown
      startCooldown()
    } else {
      showError(response.message || 'Failed to resend verification email')
    }
  } catch (error: unknown) {
    showError(error instanceof Error ? error.message : 'Failed to resend verification email')
  } finally {
    resending.value = false
  }
}

// Start cooldown timer
const startCooldown = () => {
  cooldown.value = 60

  cooldownInterval = setInterval(() => {
    cooldown.value--

    if (cooldown.value <= 0) {
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

// Dismiss banner (will show again on next page load if still unverified)
const dismissBanner = () => {
  showBanner.value = false
}

// Cleanup on unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})

onMounted(() => {
  checkVerificationStatus()
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
