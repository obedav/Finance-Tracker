Based on the project structure and existing components, I'll create a CategoryForm.vue component that complements your finance tracker application's design and functionality:

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\forms\CategoryForm.vue**
```vue
<!-- src/components/forms/CategoryForm.vue -->
<template>
  <div class="category-form">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-5">
        <!-- Category Name -->
        <div>
          <label for="categoryName" class="block text-sm font-medium text-slate-700 mb-1">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            id="categoryName"
            v-model="form.name"
            type="text"
            required
            class="form-input"
            placeholder="e.g., Groceries, Salary, Rent"
            :class="{ 'border-red-300 focus:ring-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Category Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Category Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.type = 'income'"
              :class="[
                'py-3 px-4 rounded-lg border-2 font-medium transition-all',
                form.type === 'income' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-gray-200 text-gray-500 hover:border-emerald-200'
              ]"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Income
              </div>
            </button>
            <button
              type="button"
              @click="form.type = 'expense'"
              :class="[
                'py-3 px-4 rounded-lg border-2 font-medium transition-all',
                form.type === 'expense' 
                  ? 'border-amber-500 bg-amber-50 text-amber-700' 
                  : 'border-gray-200 text-gray-500 hover:border-amber-200'
              ]"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Expense
              </div>
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="form-input resize-none"
            placeholder="Add a brief description of this category"
          ></textarea>
        </div>

        <!-- Icon Selection -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Icon <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-6 gap-3">
            <button
              v-for="icon in availableIcons"
              :key="icon.name"
              type="button"
              @click="form.icon = icon.path"
              :class="[
                'p-3 rounded-lg border-2 transition-all',
                form.icon === icon.path
                  ? form.type === 'income' 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
              :title="icon.name"
            >
              <svg 
                class="w-5 h-5 mx-auto" 
                :class="form.icon === icon.path 
                  ? form.type === 'income' ? 'text-emerald-600' : 'text-amber-600'
                  : 'text-gray-500'"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon.path"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.icon" class="mt-1 text-sm text-red-600">{{ errors.icon }}</p>
        </div>

        <!-- Color Selection -->
        <div v-if="showColorPicker">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Color
          </label>
          <div class="grid grid-cols-8 gap-3">
            <button
              v-for="(color, index) in availableColors"
              :key="index"
              type="button"
              @click="form.color = color"
              :class="[
                'w-8 h-8 rounded-full transition-all border-2',
                form.color === color ? 'border-gray-700 scale-110' : 'border-transparent hover:scale-105'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>

        <!-- Budget Limit (for expense categories) -->
        <div v-if="form.type === 'expense' && showBudgetField">
          <label for="budgetLimit" class="block text-sm font-medium text-slate-700 mb-1">
            Monthly Budget Limit
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">$</span>
            </div>
            <input
              id="budgetLimit"
              v-model="form.budgetLimit"
              type="number"
              min="0"
              step="0.01"
              class="form-input pl-8"
              placeholder="0.00"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Set a monthly spending limit for this category (optional)
          </p>
        </div>

        <!-- Target Goal (for income categories) -->
        <div v-if="form.type === 'income' && showTargetField">
          <label for="targetGoal" class="block text-sm font-medium text-slate-700 mb-1">
            Monthly Target Goal
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">$</span>
            </div>
            <input
              id="targetGoal"
              v-model="form.targetGoal"
              type="number"
              min="0"
              step="0.01"
              class="form-input pl-8"
              placeholder="0.00"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Set a monthly income target for this category (optional)
          </p>
        </div>

        <!-- Advanced Options Toggle -->
        <div v-if="showAdvancedToggle">
          <button 
            type="button" 
            @click="showAdvanced = !showAdvanced"
            class="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg 
              class="w-4 h-4 mr-1 transition-transform" 
              :class="{ 'rotate-90': showAdvanced }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            {{ showAdvanced ? 'Hide advanced options' : 'Show advanced options' }}
          </button>
        </div>

        <!-- Advanced Options -->
        <div v-if="showAdvanced" class="space-y-5 pt-2 border-t border-gray-200">
          <!-- Is Active -->
          <div class="flex items-center">
            <input
              id="isActive"
              v-model="form.isActive"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-700">
              Active category
            </label>
            <p class="ml-auto text-xs text-gray-500">
              Inactive categories won't appear in transaction forms
            </p>
          </div>

          <!-- Is Default -->
          <div class="flex items-center">
            <input
              id="isDefault"
              v-model="form.isDefault"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isDefault" class="ml-2 block text-sm text-gray-700">
              Set as default for {{ form.type }} transactions
            </label>
          </div>

          <!-- Parent Category (for subcategories) -->
          <div v-if="showParentCategoryField && parentCategories.length > 0">
            <label for="parentCategory" class="block text-sm font-medium text-slate-700 mb-1">
              Parent Category
            </label>
            <select
              id="parentCategory"
              v-model="form.parentId"
              class="form-input"
            >
              <option value="">None (top-level category)</option>
              <option 
                v-for="category in parentCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Optionally nest this under a parent category
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-5">
          <button 
            type="button" 
            @click="$emit('cancel')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            :class="[
              'btn-primary',
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            ]"
          >
            <svg 
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                            fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitButtonText }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  defaultType: {
    type: String,
    default: 'expense',
    validator: (value) => ['income', 'expense'].includes(value)
  },
  submitButtonText: {
    type: String,
    default: 'Save Category'
  },
  showColorPicker: {
    type: Boolean,
    default: true
  },
  showBudgetField: {
    type: Boolean,
    default: true
  },
  showTargetField: {
    type: Boolean,
    default: true
  },
  showAdvancedToggle: {
    type: Boolean,
    default: true
  },
  showParentCategoryField: {
    type: Boolean,
    default: false
  },
  parentCategories: {
    type: Array,
    default: () => []
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Form state
const form = ref({
  name: '',
  type: props.defaultType,
  description: '',
  icon: '',
  color: '#10B981', // Default to emerald-500
  budgetLimit: '',
  targetGoal: '',
  isActive: true,
  isDefault: false,
  parentId: ''
})

// UI state
const showAdvanced = ref(false)
const errors = ref({})

// Available icons for categories
const availableIcons = [
  { name: 'Home', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Shopping', path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Food', path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { name: 'Transport', path: 'M8 7h8m0 0l-4-4m4 4l-4 4m0 6h8m0 0l-4 4m4-4l-4-4' },
  { name: 'Entertainment', path: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
  { name: 'Health', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: 'Education', path: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' },
  { name: 'Bills', path: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
  { name: 'Salary', path: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { name: 'Investments', path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { name: 'Gifts', path: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { name: 'Savings', path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Travel', path: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Clothing', path: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' },
  { name: 'Pets', path: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z' },
  { name: 'Charity', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: 'Other', path: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z' }
]

// Available colors
const availableColors = [
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#3B82F6', // blue-500
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
  '#EF4444', // red-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#84CC16', // lime-500
  '#06B6D4', // cyan-500
  '#D946EF', // fuchsia-500
  '#64748B', // slate-500
  '#0EA5E9'  // sky-500
]

// Computed properties
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.icon !== ''
})

// Initialize form with category data if editing
onMounted(() => {
  if (props.category) {
    form.value = {
      name: props.category.name || '',
      type: props.category.type || props.defaultType,
      description: props.category.description || '',
      icon: props.category.icon || '',
      color: props.category.color || (props.category.type === 'income' ? '#10B981' : '#F59E0B'),
            budgetLimit: props.category.budgetLimit || '',
      targetGoal: props.category.targetGoal || '',
      isActive: props.category.isActive !== undefined ? props.category.isActive : true,
      isDefault: props.category.isDefault || false,
      parentId: props.category.parentId || ''
    }
  }
})

// Update type when prop changes
watch(() => props.defaultType, (newType) => {
  if (!props.category) {
    form.value.type = newType
  }
})

// Validate form before submission
const validateForm = () => {
  const newErrors = {}
  
  if (!form.value.name.trim()) {
    newErrors.name = 'Category name is required'
  }
  
  if (!form.value.icon) {
    newErrors.icon = 'Please select an icon'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) return
  
  // Format numeric values
  const formData = { ...form.value }
  if (formData.budgetLimit) {
    formData.budgetLimit = parseFloat(formData.budgetLimit)
  }
  if (formData.targetGoal) {
    formData.targetGoal = parseFloat(formData.targetGoal)
  }
  
  emit('submit', formData)
}
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>