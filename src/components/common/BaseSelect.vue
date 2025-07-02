<!-- src/components/common/BaseSelect.vue -->
<template>
  <div :class="['base-select-wrapper', { 'w-full': fullWidth }]">
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
    
    <!-- Select Group -->
    <div class="relative">
      <!-- Select Element -->
      <select
        :id="id"
        ref="selectRef"
        v-bind="$attrs"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        :class="[
          'block w-full rounded-md border-gray-300 shadow-sm transition-colors appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
          { 'pl-10': prefixIcon || $slots.prefix },
          { 'border-red-300': error },
          { 'cursor-not-allowed bg-gray-100': disabled },
          { 'pr-10': !multiple },
          { 'text-gray-500': !modelValue && placeholder },
          sizeClasses
        ]"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
      >
        <!-- Placeholder Option -->
        <option v-if="placeholder && !multiple" value="" disabled selected hidden>
          {{ placeholder }}
        </option>
        
        <!-- Option Groups -->
        <optgroup 
          v-for="(group, groupIndex) in optionGroups" 
          :key="`group-${groupIndex}`"
          :label="group.label"
        >
          <option 
            v-for="option in group.options" 
            :key="getOptionKey(option)"
            :value="getOptionValue(option)"
            :disabled="option.disabled"
          >
            {{ getOptionLabel(option) }}
          </option>
        </optgroup>
        
        <!-- Regular Options -->
        <option 
          v-for="option in normalizedOptions" 
          :key="getOptionKey(option)"
          :value="getOptionValue(option)"
          :disabled="option.disabled"
        >
          {{ getOptionLabel(option) }}
        </option>
        
        <!-- Default Slot for Custom Options -->
        <slot></slot>
      </select>
      
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
      
      <!-- Dropdown Arrow (for single select) -->
      <div 
        v-if="!multiple"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
        </svg>
      </div>
    </div>
    
    <!-- Helper Text / Error Message -->
    <div v-if="error || helperText" class="mt-1 text-sm">
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <p v-else-if="helperText" class="text-gray-500">{{ helperText }}</p>
    </div>
    
    <!-- Selected Count (for multiple select) -->
    <div v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0" class="mt-1 text-xs text-right text-gray-500">
      {{ modelValue.length }} {{ modelValue.length === 1 ? 'item' : 'items' }} selected
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Props
const props = defineProps({
  // Select value
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  
  // Options array
  options: {
    type: Array,
    default: () => []
  },
  
  // Option groups
  optionGroups: {
    type: Array,
    default: () => []
  },
  
  // Option configuration
  valueKey: {
    type: String,
    default: 'value'
  },
  
  labelKey: {
    type: String,
    default: 'label'
  },
  
  // Select label
  label: {
    type: String,
    default: ''
  },
  
  // Placeholder text
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  
  // Select size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Select state
  disabled: {
    type: Boolean,
    default: false
  },
  
  required: {
    type: Boolean,
    default: false
  },
  
  // Multiple select
  multiple: {
    type: Boolean,
    default: false
  },
  
  // Validation
  error: {
    type: String,
    default: ''
  },
  
  // Helper text
  helperText: {
    type: String,
    default: ''
  },
  
  // Prefix icon
  prefixIcon: {
    type: String,
    default: ''
  },
  
  // Full width
  fullWidth: {
    type: Boolean,
    default: true
  },
  
  // Autofocus
  autofocus: {
    type: Boolean,
    default: false
  },
  
  // Custom ID
  id: {
    type: String,
    default: () => `select-${uuidv4()}`
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

// Refs
const selectRef = ref(null)

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

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
      return {
        [props.valueKey]: option,
        [props.labelKey]: String(option),
        disabled: false
      }
    }
    return {
      ...option,
      disabled: option.disabled || false
    }
  })
})

// Methods
const getOptionValue = (option) => {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
    return option
  }
  return option[props.valueKey]
}

const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
    return String(option)
  }
  return option[props.labelKey] || String(option[props.valueKey])
}

const getOptionKey = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option.id || getOptionValue(option)
  }
  return getOptionValue(option)
}

const onChange = (event) => {
  let value
  
  if (props.multiple) {
    value = Array.from(event.target.selectedOptions).map(option => {
      // Try to find the original option object
      const selectedValue = option.value
      const originalOption = [...normalizedOptions.value, ...props.optionGroups.flatMap(g => g.options)]
        .find(opt => String(getOptionValue(opt)) === selectedValue)
      
      return originalOption ? getOptionValue(originalOption) : selectedValue
    })
  } else {
    const selectedValue = event.target.value
    // Try to find the original option object
    const originalOption = [...normalizedOptions.value, ...props.optionGroups.flatMap(g => g.options)]
      .find(opt => String(getOptionValue(opt)) === selectedValue)
    
    value = originalOption ? getOptionValue(originalOption) : selectedValue
  }
  
  emit('update:modelValue', value)
  emit('change', value)
}

const onBlur = (event) => {
  emit('blur', event)
}

const onFocus = (event) => {
  emit('focus', event)
}

const getIconPath = (icon) => {
  // Common icon paths - you can expand this as needed
  const iconPaths = {
    'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    'tag': 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        'globe': 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'currency-dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'filter': 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
    'sort': 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12',
    'location': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
  
  return iconPaths[icon] || ''
}

// Lifecycle hooks
onMounted(() => {
  if (props.autofocus) {
    selectRef.value?.focus()
  }
})
</script>

<style scoped>
.base-select-wrapper {
  position: relative;
}

/* Custom styling for select element */
select {
  text-overflow: ellipsis;
}

/* For multiple select */
select[multiple] {
  padding-right: 0.75rem;
  background-image: none;
}

/* Hide default select arrow in IE */
select::-ms-expand {
  display: none;
}

/* Firefox specific styling */
@-moz-document url-prefix() {
  select {
    text-indent: 0.01px;
    text-overflow: '';
    padding-right: 1rem;
  }
}
</style>