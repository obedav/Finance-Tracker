I'll create a comprehensive implementation for BaseButton.vue that follows modern Vue 3 practices and provides a flexible, reusable button component for your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\common\BaseButton.vue**
```vue
<!-- src/components/common/BaseButton.vue -->
<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    :aria-busy="loading"
    :aria-disabled="disabled"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="spinner mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <!-- Left Icon -->
    <span v-if="iconLeft && !loading" class="icon-left mr-2">
      <slot name="icon-left">
        <svg v-if="typeof iconLeft === 'string'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path :d="getIconPath(iconLeft)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
        </svg>
      </slot>
    </span>
    
    <!-- Button Content -->
    <span class="button-content">
      <slot>{{ label }}</slot>
    </span>
    
    <!-- Right Icon -->
    <span v-if="iconRight && !loading" class="icon-right ml-2">
      <slot name="icon-right">
        <svg v-if="typeof iconRight === 'string'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path :d="getIconPath(iconRight)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
        </svg>
      </slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Button content
  label: {
    type: String,
    default: ''
  },
  
  // Button type
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // Button variant
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 
      'warning', 'info', 'light', 'dark', 'link',
      'outline-primary', 'outline-secondary', 'outline-success', 
      'outline-danger', 'outline-warning', 'outline-info',
      'text-primary', 'text-secondary', 'text-success',
      'text-danger', 'text-warning', 'text-info'
    ].includes(value)
  },
  
  // Button size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Button state
  disabled: {
    type: Boolean,
    default: false
  },
  
  loading: {
    type: Boolean,
    default: false
  },
  
  // Button shape
  rounded: {
    type: [Boolean, String],
    default: false,
    validator: (value) => [true, false, 'full', 'none', 'sm', 'md', 'lg'].includes(value)
  },
  
  // Button icons
  iconLeft: {
    type: String,
    default: ''
  },
  
  iconRight: {
    type: String,
    default: ''
  },
  
  // Button block (full width)
  block: {
    type: Boolean,
    default: false
  },
  
  // Custom classes
  customClass: {
    type: String,
    default: ''
  },
  
  // Ripple effect
  ripple: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['click'])

// Computed
const buttonClasses = computed(() => {
  const classes = ['base-button', 'inline-flex', 'items-center', 'justify-center', 'transition-all', 'duration-200', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2']
  
  // Add variant classes
  if (props.variant.startsWith('outline-')) {
    const color = props.variant.replace('outline-', '')
    classes.push(`border-2 border-${color}-500 text-${color}-500 hover:bg-${color}-50 focus:ring-${color}-500`)
  } else if (props.variant.startsWith('text-')) {
    const color = props.variant.replace('text-', '')
    classes.push(`text-${color}-500 hover:bg-${color}-50 focus:ring-${color}-500`)
  } else if (props.variant === 'link') {
    classes.push('text-blue-600 hover:text-blue-800 underline')
  } else {
    // Default solid variants
    switch (props.variant) {
      case 'primary':
        classes.push('bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500')
        break
      case 'secondary':
        classes.push('bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500')
        break
      case 'success':
        classes.push('bg-green-600 hover:bg-green-700 text-white focus:ring-green-500')
        break
      case 'danger':
        classes.push('bg-red-600 hover:bg-red-700 text-white focus:ring-red-500')
        break
      case 'warning':
        classes.push('bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500')
        break
      case 'info':
        classes.push('bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500')
        break
      case 'light':
        classes.push('bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300')
        break
      case 'dark':
        classes.push('bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700')
        break
      default:
        classes.push('bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500')
    }
  }
  
  // Add size classes
  switch (props.size) {
    case 'xs':
      classes.push('text-xs px-2 py-1')
      break
    case 'sm':
      classes.push('text-sm px-3 py-1.5')
      break
    case 'md':
      classes.push('text-base px-4 py-2')
      break
    case 'lg':
      classes.push('text-lg px-5 py-2.5')
      break
    case 'xl':
      classes.push('text-xl px-6 py-3')
      break
    default:
      classes.push('text-base px-4 py-2')
  }
  
  // Add rounded classes
  if (props.rounded === true || props.rounded === 'md') {
    classes.push('rounded-md')
  } else if (props.rounded === 'full') {
    classes.push('rounded-full')
  } else if (props.rounded === 'none') {
    // No rounding
  } else if (props.rounded === 'sm') {
    classes.push('rounded-sm')
  } else if (props.rounded === 'lg') {
    classes.push('rounded-lg')
  } else {
    classes.push('rounded-md')
  }
  
  // Add block class
  if (props.block) {
    classes.push('w-full')
  }
  
  // Add disabled class
  if (props.disabled || props.loading) {
    classes.push('opacity-60 cursor-not-allowed')
  }
  
  // Add ripple effect
  if (props.ripple) {
    classes.push('ripple-effect')
  }
  
  // Add custom class
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  return classes.join(' ')
})

// Methods
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const getIconPath = (icon) => {
  // Common icon paths - you can expand this as needed
  const iconPaths = {
    'plus': 'M12 4v16m8-8H4',
    'minus': 'M20 12H4',
    'check': 'M5 13l4 4L19 7',
    'x': 'M6 18L18 6M6 6l12 12',
    'arrow-right': 'M14 5l7 7m0 0l-7 7m7-7H3',
    'arrow-left': 'M10 19l-7-7m0 0l7-7m-7 7h18',
    'arrow-up': 'M5 10l7-7m0 0l7 7m-7-7v18',
    'arrow-down': 'M19 14l-7 7m0 0l-7-7m7 7V3',
    'trash': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'edit': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'save': 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    'refresh': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    'download': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    'upload': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'logout': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    'login': 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  }
  
  return iconPaths[icon] || ''
}
</script>

<style scoped>
.base-button {
  position: relative;
  overflow: hidden;
}

.base-button:disabled {
  pointer-events: none;
}

/* Ripple effect */
.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

.ripple-effect:active::after {
  transform: scale(0, 0);
  opacity: .3;
  transition: 0s;
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>