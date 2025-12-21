<!-- src/App.vue - Using AppLayout System -->
<template>
  <div id="app" class="min-h-screen bg-cream dark:bg-neutral-900 transition-colors duration-200">
    <!-- Use the AppLayout component for authenticated routes -->
    <AppLayout v-if="showLayout" />

    <!-- Show router-view directly for auth pages -->
    <router-view v-else />

    <Toast />

    <!-- Global Loading Overlay -->
    <div v-if="isLoading" class="modal-overlay">
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6 flex items-center space-x-3 border border-gray-200 dark:border-neutral-700">
        <div class="loading-spinner"></div>
        <span class="text-slate-700 dark:text-slate-200 font-medium">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/Layout/AppLayout.vue'
import Toast from '@/components/common/Toast.vue'

const route = useRoute()
const isLoading = ref(false)

// Determine when to show the layout vs direct router-view
const showLayout = computed(() => {
  const authRoutes = ['Login', 'Register', 'ForgotPassword', 'ResetPassword']
  return !authRoutes.includes(route.name)
})
</script>

<style>
/* Global styles only */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center;
}

.loading-spinner {
  @apply w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin;
}
</style>