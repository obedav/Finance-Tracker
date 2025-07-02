<!-- src/views/errors/ServerError.vue -->
<template>
  <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-[#334155] mb-4">500</h1>
        <h2 class="text-2xl font-semibold text-[#334155] mb-2">Server error</h2>
        <p class="text-[#334155]/70 mb-8">
          Something went wrong on our end. We're working to fix the issue. Please try again later.
        </p>
      </div>

      <div class="space-y-4">
        <button
          @click="refreshPage"
          class="inline-flex items-center px-6 py-3 bg-[#10B981] text-white font-medium rounded-lg hover:bg-[#10B981]/90 transition-colors space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Try again</span>
        </button>

        <div class="text-center">
          <router-link
            to="/dashboard"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors inline-flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Go to Dashboard</span>
          </router-link>
        </div>
      </div>

      <!-- Error Details -->
      <div class="mt-12 pt-8 border-t border-[#E5E7EB]">
        <details class="text-left">
          <summary class="cursor-pointer text-sm font-medium text-[#334155] mb-2">
            Error details
          </summary>
          <div class="text-xs text-[#334155]/60 bg-[#FAF9F6] p-3 rounded border font-mono">
            <p>Timestamp: {{ new Date().toISOString() }}</p>
            <p>Error Code: 500</p>
            <p>Request ID: {{ generateRequestId() }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
const refreshPage = () => {
  window.location.reload()
}

const generateRequestId = () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase()
}
</script>