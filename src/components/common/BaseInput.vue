I'll create a comprehensive implementation for BaseInput.vue that follows modern Vue 3 practices and provides a flexible, reusable input component for your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\common\BaseInput.vue**
```vue
<!-- src/components/common/BaseInput.vue -->
<template>
  <div :class="['base-input-wrapper', { 'w-full': fullWidth }]">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id" 
      :class="[
        'block text-sm font-medium mb-1',
        disabled ? 'text-gray-400' : 'text-gray-700'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Input Group -->
    <div 
      :class="[
        'relative rounded-md shadow-sm',
        { 'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500': !disabled },
        { 'opacity-60': disabled }
      ]"
    >
      <!-- Prefix / Left Icon -->
      <div 
        v-if="prefixIcon || $slots.prefix" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix">
          <svg 
            v-if="prefixIcon" 
            class="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path :d="getIconPath(prefixIcon)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </slot>
      </div>
      
      <!-- Input Element -->
      <input
        :id="id"
        ref="inputRef"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="[
          'block w-full rounded-md border-gray-300 shadow-sm transition-colors',
          'focus:outline-none focus:ring-0 focus:border-emerald-500',
          { 'pl-10': prefixIcon || $slots.prefix },
          { 'pr-10': suffixIcon || $slots.suffix || clearable },
          { 'border-red-300': error },
          { 'bg-gray-50': readonly },
          { 'cursor-not-allowed bg-gray-100': disabled },
          sizeClasses
        ]"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        @keydown="onKeydown"
        @keyup="onKeyup"
        @keypress="onKeypress"
      />
      
      <!-- Clear Button -->
      <div 
        v-if="clearable && modelValue" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          type="button"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
          @click="clearInput"
          tabindex="-1"
          aria-label="Clear input"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Suffix / Right Icon -->
      <div 
        v-if="(suffixIcon || $slots.suffix) && !(clearable && modelValue)" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <slot name="suffix">
          <svg 
            v-if="suffixIcon" 
            class="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path :d="getIconPath(suffixIcon)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </slot>
      </div>
    </div>
    
    <!-- Helper Text / Error Message -->
    <div v-if="error || helperText" class="mt-1 text-sm">
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <p v-else-if="helperText" class="text-gray-500">{{ helperText }}</p>
    </div>
    
    <!-- Character Counter -->
    <div v-if="maxlength" class="mt-1 text-xs text-right text-gray-500">
      {{ modelValue ? modelValue.length : 0 }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, useAttrs } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Props
const props = defineProps({
  // Input value
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  // Input type
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'password', 'email', 'number', 'tel', 'url', 
      'search', 'date', 'time', 'datetime-local', 'month', 
      'week', 'color'
    ].includes(value)
  },
  
  // Input label
  label: {
    type: String,
    default: ''
  },
  
  // Input placeholder
  placeholder: {
    type: String,
    default: ''
  },
  
  // Input size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Input state
  disabled: {
    type: Boolean,
    default: false
  },
  
  readonly: {
    type: Boolean,
    default: false
  },
  
  required: {
    type: Boolean,
    default: false
  },
  
  // Input validation
  error: {
    type: String,
    default: ''
  },
  
  // Helper text
  helperText: {
    type: String,
    default: ''
  },
  
  // Input icons
  prefixIcon: {
    type: String,
    default: ''
  },
  
  suffixIcon: {
    type: String,
    default: ''
  },
  
  // Input features
  clearable: {
    type: Boolean,
    default: false
  },
  
  autofocus: {
    type: Boolean,
    default: false
  },
  
  fullWidth: {
    type: Boolean,
    default: true
  },
  
  // Character limit
  maxlength: {
    type: Number,
    default: null
  },
  
  // Custom ID
  id: {
    type: String,
    default: () => `input-${uuidv4()}`
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'input',
  'keydown',
  'keyup',
  'keypress',
  'clear'
])

// Refs
const inputRef = ref(null)
const attrs = useAttrs()

// Computed
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'py-1.5 text-sm'
    case 'lg':
      return 'py-3 text-lg'
    default:
      return 'py-2 text-base'
  }
})

// Methods
const onInput = (event) => {
  let value = event.target.value
  
  // Handle number type
  if (props.type === 'number' && value !== '') {
    value = Number(value)
  }
  
  // Handle maxlength
  if (props.maxlength && typeof value === 'string' && value.length > props.maxlength) {
    value = value.slice(0, props.maxlength)
    event.target.value = value
  }
  
  emit('update:modelValue', value)
  emit('input', event)
}

const onBlur = (event) => {
  emit('blur', event)
}

const onFocus = (event) => {
  emit('focus', event)
}

const onKeydown = (event) => {
  emit('keydown', event)
}

const onKeyup = (event) => {
  emit('keyup', event)
}

const onKeypress = (event) => {
  emit('keypress', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  // Focus the input after clearing
  inputRef.value?.focus()
}

const getIconPath = (icon) => {
  // Common icon paths - you can expand this as needed
  const iconPaths = {
    'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    'mail': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'lock': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    'phone': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    'globe': 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'link': 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    'exclamation': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'check': 'M5 13l4 4L19 7',
    'x': 'M6 18L18 6M6 6l12 12',
    'eye': 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    'eye-off': 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
  }
  
  return iconPaths[icon] || ''
}

// Lifecycle hooks
onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
})
</script>

<style scoped>
.base-input-wrapper {
  position: relative;
}

/* Fix for number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Custom styling for date inputs */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator,
input[type="month"]::-webkit-calendar-picker-indicator,
input[type="week"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  filter: invert(0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover,
input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover,
input[type="month"]::-webkit-calendar-picker-indicator:hover,
input[type="week"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Placeholder styling */
input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
</style>