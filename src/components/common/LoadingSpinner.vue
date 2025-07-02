<!-- src/components/common/LoadingSpinner.vue -->
<template>
  <div 
    :class="[
      'inline-flex items-center justify-center',
      fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : '',
      overlay && !fullScreen ? 'absolute inset-0 bg-white bg-opacity-75 z-10' : '',
      !fullScreen && !overlay ? customClass : ''
    ]"
  >
    <div 
      :class="[
        'flex flex-col items-center justify-center',
        fullScreen || overlay ? 'backdrop-blur-sm' : ''
      ]"
    >
      <!-- Spinner -->
      <svg 
        :class="[
          'animate-spin',
          sizeClasses,
          colorClasses
        ]"
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        :aria-hidden="!showText"
      >
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          :stroke-width="strokeWidth"
        ></circle>
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      <!-- Text -->
      <span 
        v-if="showText" 
        :class="[
          'mt-2 text-center',
          textColorClass,
          textSizeClass
        ]"
        role="status"
      >
        <slot>{{ text }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Size options
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  
  // Color options
  color: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 
      'warning', 'info', 'light', 'dark', 'inherit'
    ].includes(value)
  },
  
  // Text to display below spinner
  text: {
    type: String,
    default: 'Loading...'
  },
  
  // Whether to show text
  showText: {
    type: Boolean,
    default: false
  },
  
  // Text size
  textSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Stroke width
  strokeWidth: {
    type: Number,
    default: 4,
    validator: (value) => value >= 1 && value <= 8
  },
  
  // Full screen overlay
  fullScreen: {
    type: Boolean,
    default: false
  },
  
  // Overlay (for container)
  overlay: {
    type: Boolean,
    default: false
  },
  
  // Custom class
  customClass: {
    type: String,
    default: ''
  }
})

// Computed properties for dynamic classes
const sizeClasses = computed(() => {
  const sizes = {
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8',
    'xl': 'w-12 h-12',
    '2xl': 'w-16 h-16'
  }
  
  return sizes[props.size] || sizes.md
})

const colorClasses = computed(() => {
  if (props.color === 'inherit') return 'text-current'
  
  const colors = {
    'primary': 'text-blue-600',
    'secondary': 'text-gray-600',
    'success': 'text-green-600',
    'danger': 'text-red-600',
    'warning': 'text-amber-600',
    'info': 'text-sky-600',
    'light': 'text-gray-300',
    'dark': 'text-gray-800'
  }
  
  return colors[props.color] || colors.primary
})

const textColorClass = computed(() => {
  if (props.color === 'inherit') return 'text-current'
  
  const colors = {
    'primary': 'text-blue-700',
    'secondary': 'text-gray-700',
    'success': 'text-green-700',
    'danger': 'text-red-700',
    'warning': 'text-amber-700',
    'info': 'text-sky-700',
    'light': 'text-gray-400',
    'dark': 'text-gray-900'
  }
  
  return colors[props.color] || colors.primary
})

const textSizeClass = computed(() => {
  const sizes = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  }
  
  return sizes[props.textSize] || sizes.sm
})
</script>

<style scoped>
/* Optional: Add any specific styles here */
</style>