<!-- src/views/errors/Unauthorized.vue -->
<template>
  <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-[#334155] mb-4">401</h1>
        <h2 class="text-2xl font-semibold text-[#334155] mb-2">Unauthorized access</h2>
        <p class="text-[#334155]/70 mb-8">
          You don't have permission to access this page. Please sign in with an authorized account.
        </p>
      </div>

      <div class="space-y-4">
        <router-link
          to="/login"
          class="inline-flex items-center px-6 py-3 bg-[#10B981] text-white font-medium rounded-lg hover:bg-[#10B981]/90 transition-colors space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          <span>Sign In</span>
        </router-link>

        <div class="text-center">
          <button
            @click="$router.go(-1)"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors inline-flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>Go back</span>
          </button>
        </div>
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