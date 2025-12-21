<template>
  <button
    @click="handleToggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="dark-mode-toggle p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20 transition-all duration-300 relative overflow-hidden group"
    type="button"
  >
    <!-- Sun Icon (visible in dark mode) -->
    <transition name="icon-rotate">
      <svg
        v-if="isDark"
        key="sun"
        class="w-4 h-4 sm:w-5 sm:h-5 icon-sun"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </transition>

    <!-- Moon Icon (visible in light mode) -->
    <transition name="icon-rotate">
      <svg
        v-if="!isDark"
        key="moon"
        class="w-4 h-4 sm:w-5 sm:h-5 icon-moon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </transition>

    <!-- Glow effect on hover -->
    <span class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"></span>
  </button>
</template>

<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggle } = useDarkMode()

const handleToggle = () => {
  toggle()

  // Optional: Add haptic feedback on supported devices
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10)
  }
}
</script>

<style scoped>
/* Icon transition animations */
.icon-rotate-enter-active,
.icon-rotate-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.icon-rotate-enter-to,
.icon-rotate-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* Icon positioning */
.icon-sun,
.icon-moon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Glow effect */
.glow-effect {
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
}

/* Dark mode button hover glow */
.dark .dark-mode-toggle:hover .glow-effect {
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
}

/* Ensure icons don't cause layout shift */
.dark-mode-toggle {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

@media (min-width: 640px) {
  .dark-mode-toggle {
    width: 2.75rem;
    height: 2.75rem;
  }
}

/* Accessibility: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .icon-rotate-enter-active,
  .icon-rotate-leave-active,
  .dark-mode-toggle,
  .glow-effect {
    transition: none !important;
    animation: none !important;
  }

  .icon-rotate-enter-from,
  .icon-rotate-leave-to {
    transform: none;
  }
}

/* Focus ring for keyboard navigation */
.dark-mode-toggle:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.dark .dark-mode-toggle:focus {
  outline-color: #34d399;
}
</style>
