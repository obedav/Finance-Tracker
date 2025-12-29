<!-- src/views/auth/ResetPassword.vue -->
<template>
  <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-[#10B981] rounded-xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-[#334155]">Reset password</h2>
        <p class="mt-2 text-[#334155]/70">Enter your new password</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-8">
        <div v-if="!passwordReset">
          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-[#334155] mb-2">New Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] mb-2">Confirm New Password</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
                placeholder="Confirm new password"
              />
            </div>

            <div class="bg-[#FAF9F6] rounded-lg p-4">
              <h4 class="text-sm font-medium text-[#334155] mb-2">Password requirements:</h4>
              <ul class="text-sm text-[#334155]/70 space-y-1">
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>At least 8 characters</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>One uppercase letter</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>One number or special character</span>
                </li>
              </ul>
            </div>

            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="w-full py-3 px-4 bg-[#10B981] hover:bg-[#10B981]/90 disabled:bg-[#E5E7EB] disabled:text-[#334155]/50 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Resetting...' : 'Reset password' }}</span>
            </button>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-[#334155] mb-2">Password reset successful</h3>
          <p class="text-[#334155]/70 mb-6">
            Your password has been reset successfully.
          </p>
          <router-link
            to="/login"
            class="inline-flex items-center px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors"
          >
            Sign in to your account
          </router-link>
        </div>

        <div v-if="!passwordReset" class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>Back to sign in</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const passwordReset = ref(false)

const isFormValid = computed(() => {
  return form.value.password && 
         form.value.confirmPassword && 
         form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 8
})

const handleResetPassword = async () => {
  isLoading.value = true
  
  try {
    // Simulate reset password API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordReset.value = true
    // If you want to redirect after reset, uncomment the next line:
    // router.push('/dashboard')
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>