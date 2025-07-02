I'll create a comprehensive implementation for ConfirmDialog.vue that follows modern Vue 3 practices and provides a reusable confirmation dialog component for your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\common\ConfirmDialog.vue**
```vue
<!-- src/components/common/ConfirmDialog.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="modelValue" 
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click="closeOnBackdrop ? close('backdrop') : null"
        aria-modal="true"
        role="dialog"
        :aria-labelledby="`confirm-dialog-title-${id}`"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div 
            v-if="modelValue"
            class="relative bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-4"
            :class="[customClass]"
            @click.stop
            ref="dialogRef"
          >
            <!-- Icon Header -->
            <div v-if="showIcon" class="pt-6 pb-2 flex justify-center">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="iconBackgroundClass"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    :d="getIconPath()"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Dialog Header -->
            <div class="px-6 pt-4 pb-0 text-center">
              <h3 
                :id="`confirm-dialog-title-${id}`" 
                class="text-lg font-semibold text-gray-900"
              >
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                  <slot></slot>
                </p>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="px-6 py-4 flex flex-col sm:flex-row-reverse gap-2 mt-2">
              <!-- Confirm Button -->
              <button
                @click="confirm"
                :class="[
                  'w-full sm:w-auto px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  confirmButtonClass
                ]"
                :disabled="loading"
                ref="confirmButtonRef"
              >
                <div class="flex items-center justify-center">
                  <svg 
                    v-if="loading" 
                    class="animate-spin -ml-1 mr-2 h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ confirmText }}
                </div>
              </button>
              
              <!-- Cancel Button -->
              <button
                @click="close('cancel')"
                :class="[
                  'w-full sm:w-auto px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  cancelButtonClass
                ]"
                :disabled="loading"
              >
                {{ cancelText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Props
const props = defineProps({
  // Control dialog visibility
  modelValue: {
    type: Boolean,
    default: false
  },
  
  // Dialog title
  title: {
    type: String,
    default: 'Confirm Action'
  },
  
  // Dialog message
  message: {
    type: String,
    default: 'Are you sure you want to perform this action?'
  },
  
  // Button text
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  
  // Dialog type
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'warning', 'info', 'success'].includes(value)
  },
  
  // Close on backdrop click
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  
  // Close on escape key
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  
  // Loading state
  loading: {
    type: Boolean,
    default: false
  },
  
  // Show icon
  showIcon: {
    type: Boolean,
    default: true
  },
  
  // Custom classes
  customClass: {
    type: String,
    default: ''
  },
  
  // Custom ID
  id: {
    type: String,
    default: () => `confirm-dialog-${uuidv4()}`
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

// Refs
const dialogRef = ref(null)
const confirmButtonRef = ref(null)

// Computed
const iconBackgroundClass = computed(() => {
  const classes = {
    'primary': 'bg-blue-100 text-blue-600',
    'danger': 'bg-red-100 text-red-600',
    'warning': 'bg-amber-100 text-amber-600',
    'info': 'bg-sky-100 text-sky-600',
    'success': 'bg-emerald-100 text-emerald-600'
  }
  
  return classes[props.type] || classes.primary
})

const confirmButtonClass = computed(() => {
  const classes = {
    'primary': 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    'danger': 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    'warning': 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
    'info': 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500',
    'success': 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500'
  }
  
  return classes[props.type] || classes.primary
})

const cancelButtonClass = computed(() => {
  return 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500'
})

// Methods
const getIconPath = () => {
  const iconPaths = {
    'primary': 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'danger': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'warning': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'info': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'success': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  
  return iconPaths[props.type] || iconPaths.primary
}

const close = (reason = 'close') => {
  emit('update:modelValue', false)
  
  if (reason === 'cancel') {
    emit('cancel')
  }
  
  emit('close', reason)
}

const confirm = () => {
  emit('confirm')
  
  // If not in loading state, close the dialog
  if (!props.loading) {
    emit('update:modelValue', false)
  }
}

const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue && !props.loading) {
    close('escape')
  }
}

const lockScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
}

const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Focus trap
const handleTabKey = (event) => {
  if (!props.modelValue || !dialogRef.value) return
  
  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
 if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  } else if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }
}

// Event listeners
const setupEventListeners = () => {
  document.addEventListener('keydown', handleEscKey)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') handleTabKey(e)
  })
}

const removeEventListeners = () => {
  document.removeEventListener('keydown', handleEscKey)
  document.removeEventListener('keydown', (e) => {
    if (e.key === 'Tab') handleTabKey(e)
  })
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    lockScroll()
    nextTick(() => {
      confirmButtonRef.value?.focus()
    })
  } else {
    unlockScroll()
  }
})

// Lifecycle hooks
onMounted(() => {
  setupEventListeners()
})

onBeforeUnmount(() => {
  removeEventListeners()
  if (props.modelValue) {
    unlockScroll()
  }
})
</script>

<style scoped>
/* Optional: Add any specific styles here */
</style>
    