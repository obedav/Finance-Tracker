<!-- src/components/common/BaseModal.vue -->
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
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 overflow-y-auto"
        :class="{ 'flex items-center justify-center': centered }"
        @click="closeOnBackdrop ? close() : null"
        aria-modal="true"
        role="dialog"
        :aria-labelledby="`modal-title-${id}`"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          :enter-from-class="centered ? 'opacity-0 transform scale-95' : 'opacity-0 transform translate-y-4'"
          :enter-to-class="centered ? 'opacity-100 transform scale-100' : 'opacity-100 transform translate-y-0'"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="modelValue"
            class="relative bg-white rounded-xl shadow-xl overflow-hidden max-h-full"
            :class="[
              sizeClasses,
              { 'mx-auto my-8': !centered },
              { 'max-h-[90vh]': !fullscreen },
              { 'w-full h-full max-w-full rounded-none': fullscreen },
              customClass
            ]"
            @click.stop
            ref="modalRef"
          >
            <!-- Close button (if not hidden) -->
            <button
              v-if="!hideCloseButton"
              @click="close"
              type="button"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full p-1 z-10"
              aria-label="Close modal"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Modal Header -->
            <div 
              v-if="title || $slots.header" 
              class="px-6 py-4 border-b border-gray-200"
              :class="{ 'pr-12': !hideCloseButton }"
            >
              <slot name="header">
                <h3 
                  :id="`modal-title-${id}`" 
                  class="text-lg font-semibold text-gray-900"
                >
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
                  {{ subtitle }}
                </p>
              </slot>
            </div>

            <!-- Modal Body -->
            <div 
              class="relative"
              :class="[
                { 'overflow-y-auto': scrollable && !fullscreen },
                { 'p-6': !noPadding },
                bodyClass
              ]"
              :style="scrollable && !fullscreen ? `max-height: ${maxBodyHeight}` : ''"
            >
              <slot></slot>
            </div>

            <!-- Modal Footer -->
            <div 
              v-if="$slots.footer" 
              class="px-6 py-4 border-t border-gray-200 bg-gray-50"
            >
              <slot name="footer"></slot>
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
  // Control modal visibility
  modelValue: {
    type: Boolean,
    default: false
  },
  
  // Modal title
  title: {
    type: String,
    default: ''
  },
  
  // Modal subtitle
  subtitle: {
    type: String,
    default: ''
  },
  
  // Modal size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'].includes(value)
  },
  
  // Modal position
  centered: {
    type: Boolean,
    default: true
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
  
  // Hide close button
  hideCloseButton: {
    type: Boolean,
    default: false
  },
  
  // Scrollable content
  scrollable: {
    type: Boolean,
    default: true
  },
  
  // Max height for scrollable content
  maxBodyHeight: {
    type: String,
    default: '60vh'
  },
  
  // No padding in body
  noPadding: {
    type: Boolean,
    default: false
  },
  
  // Fullscreen modal
  fullscreen: {
    type: Boolean,
    default: false
  },
  
  // Custom classes
  customClass: {
    type: String,
    default: ''
  },
  
  // Body class
  bodyClass: {
    type: String,
    default: ''
  },
  
  // Persistent modal (can't close by clicking outside)
  persistent: {
    type: Boolean,
    default: false
  },
  
  // Custom ID
  id: {
    type: String,
    default: () => `modal-${uuidv4()}`
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'open'])

// Refs
const modalRef = ref(null)

// Computed
const sizeClasses = computed(() => {
  if (props.fullscreen) return 'w-screen h-screen'
  
  const sizes = {
    'xs': 'max-w-xs',
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }
  
  return `w-full ${sizes[props.size] || sizes.md}`
})

// Methods
const close = () => {
  if (props.persistent) return
  
  emit('update:modelValue', false)
  emit('close')
}

const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue && !props.persistent) {
    close()
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
  if (!props.modelValue || !modalRef.value) return
  
  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  // If pressing Tab and the active element is the last focusable element,
  // move focus to the first focusable element
  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
  
  // If pressing Shift+Tab and the active element is the first focusable element,
  // move focus to the last focusable element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleEscKey(event)
  } else if (event.key === 'Tab') {
    handleTabKey(event)
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Modal opened
    nextTick(() => {
      lockScroll()
      
      // Focus first focusable element
      if (modalRef.value) {
        const focusableElement = modalRef.value.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElement) {
          focusableElement.focus()
        }
      }
      
      emit('open')
    })
  } else {
    // Modal closed
    unlockScroll()
  }
})

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  if (props.modelValue) {
    lockScroll()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockScroll()
})
</script>

<style scoped>
/* Custom scrollbar for modal body */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

div::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 8px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>