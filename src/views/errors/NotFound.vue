<!-- src/views/errors/NotFound.vue -->
<template>
  <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="mx-auto w-24 h-24 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-[#334155] mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-[#334155] mb-2">Page not found</h2>
        <p class="text-[#334155]/70 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
        </p>
      </div>

      <div class="space-y-4">
        <router-link
          to="/dashboard"
          class="inline-flex items-center px-6 py-3 bg-[#10B981] text-white font-medium rounded-lg hover:bg-[#10B981]/90 transition-colors space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>Go to Dashboard</span>
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

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-[#E5E7EB]">
        <h3 class="text-sm font-medium text-[#334155] mb-4">Helpful links</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <router-link to="/transactions" class="text-[#10B981] hover:text-[#10B981]/80 transition-colors">
            Transactions
          </router-link>
          <router-link to="/categories" class="text-[#10B981] hover:text-[#10B981]/80 transition-colors">
            Categories
          </router-link>
          <router-link to="/reports" class="text-[#10B981] hover:text-[#10B981]/80 transition-colors">
            Reports
          </router-link>
          <router-link to="/settings" class="text-[#10B981] hover:text-[#10B981]/80 transition-colors">
            Settings
          </router-link>
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