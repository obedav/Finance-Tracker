<!-- src/views/auth/ForgotPassword.vue -->
<template>
  <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-[#F59E0B] rounded-xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-[#334155]">Forgot password?</h2>
        <p class="mt-2 text-[#334155]/70">Enter your email to reset your password</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-8">
        <div v-if="!emailSent">
          <form @submit.prevent="handleForgotPassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-[#334155] mb-2">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Sending...' : 'Send reset link' }}</span>
            </button>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-[#334155] mb-2">Check your email</h3>
          <p class="text-[#334155]/70 mb-6">
            We've sent a password reset link to {{ form.email }}
          </p>
          <button
            @click="emailSent = false"
            class="text-[#10B981] hover:text-[#10B981]/80 font-medium"
          >
            Try different email
          </button>
        </div>

        <div class="mt-6 text-center">
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
import { ref } from 'vue'

const form = ref({
  email: ''
})

const isLoading = ref(false)
const emailSent = ref(false)

const handleForgotPassword = async () => {
  isLoading.value = true
  
  try {
    // Simulate forgot password API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emailSent.value = true
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>