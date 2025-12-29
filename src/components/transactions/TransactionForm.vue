<!-- src/components/transactions/TransactionForm.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-[#334155]">
        {{ transaction ? 'Edit Transaction' : 'Add New Transaction' }}
      </h3>
      <button
        v-if="showCloseButton"
        @click="$emit('close')"
        class="text-[#334155]/60 hover:text-[#334155] transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="generalError" 
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
    >
      <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <h4 class="text-sm font-medium text-red-800">Error</h4>
        <p class="text-sm text-red-700 mt-1">{{ generalError }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Transaction Type -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-3">Transaction Type</label>
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            @click="setTransactionType('income')"
            :class="[
              'py-4 px-6 rounded-lg border-2 font-medium transition-all duration-200 flex items-center justify-center space-x-2',
              form.type === 'income' 
                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] shadow-md' 
                : 'border-[#E5E7EB] text-[#334155]/70 hover:border-[#10B981]/50 hover:bg-[#FAF9F6]'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
            </svg>
            <span>Income</span>
          </button>
          <button
            type="button"
            @click="setTransactionType('expense')"
            :class="[
              'py-4 px-6 rounded-lg border-2 font-medium transition-all duration-200 flex items-center justify-center space-x-2',
              form.type === 'expense' 
                ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B] shadow-md' 
                : 'border-[#E5E7EB] text-[#334155]/70 hover:border-[#F59E0B]/50 hover:bg-[#FAF9F6]'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
            </svg>
            <span>Expense</span>
          </button>
        </div>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">
          Amount *
          <span class="text-xs text-[#334155]/60 font-normal ml-1">(USD)</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="text-[#334155]/70 font-medium">$</span>
          </div>
          <input
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0"
            max="999999999.99"
            required
            :class="[
              'w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 text-[#334155] font-medium',
              errors.amount
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
            ]"
            placeholder="0.00"
            @blur="validateAmount"
            @input="clearAmountError"
          />
        </div>
        <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount }}</p>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Category *</label>
        <div class="relative">
          <select
            v-model="form.category"
            required
            :class="[
              'w-full px-4 py-3 border rounded-lg transition-all duration-200 text-[#334155] appearance-none bg-white',
              errors.category
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
            ]"
            @change="validateCategory"
          >
            <option value="">Select a category</option>
            <option 
              v-for="category in currentCategories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-[#334155]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
        
        <!-- Add Category Button -->
        <button
          v-if="showAddCategory"
          type="button"
          @click="$emit('add-category', form.type)"
          class="mt-2 text-sm text-[#10B981] hover:text-[#10B981]/80 font-medium transition-colors flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Add new {{ form.type }} category</span>
        </button>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">
          Description
          <span class="text-xs text-[#334155]/60 font-normal">(Optional)</span>
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          :class="[
            'w-full px-4 py-3 border rounded-lg transition-all duration-200 text-[#334155] resize-none',
            'border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
          ]"
          placeholder="Optional description for this transaction..."
          maxlength="255"
          @input="updateCharacterCount"
        ></textarea>
        <div class="mt-1 flex justify-between items-center">
          <div class="text-xs text-[#334155]/60">
            {{ characterCount }}/255 characters
          </div>
          <button
            v-if="form.description.length > 0"
            type="button"
            @click="form.description = ''"
            class="text-xs text-[#334155]/60 hover:text-[#334155] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-sm font-medium text-[#334155] mb-2">Date *</label>
        <input
          v-model="form.date"
          type="date"
          required
          :max="maxDate"
          :min="minDate"
          :class="[
            'w-full px-4 py-3 border rounded-lg transition-all duration-200 text-[#334155]',
            errors.date
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
          ]"
          @change="validateDate"
        />
        <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
        
        <!-- Quick Date Options -->
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="dateOption in quickDateOptions"
            :key="dateOption.label"
            type="button"
            @click="setQuickDate(dateOption.days)"
            class="px-2 py-1 text-xs bg-[#FAF9F6] text-[#334155] rounded border border-[#E5E7EB] hover:border-[#10B981]/50 hover:bg-[#10B981]/5 transition-all duration-200"
          >
            {{ dateOption.label }}
          </button>
        </div>
      </div>

      <!-- Quick Amount Buttons -->
      <div v-if="!transaction">
        <label class="block text-sm font-medium text-[#334155] mb-2">Quick Amounts</label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            type="button"
            @click="setQuickAmount(amount)"
            :class="[
              'py-2 px-3 text-sm border rounded-md transition-all duration-200 hover:shadow-sm',
              form.amount == amount.toString()
                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981]/50 hover:bg-[#10B981]/5'
            ]"
          >
            ${{ formatAmount(amount) }}
          </button>
        </div>
      </div>

      <!-- Tags/Labels (Optional Feature) -->
      <div v-if="enableTags">
        <label class="block text-sm font-medium text-[#334155] mb-2">Tags</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="tag in form.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-sm"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(tag)"
              class="ml-1 text-[#10B981]/70 hover:text-[#10B981]"
            >
              ×
            </button>
          </span>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="newTag"
            type="text"
            placeholder="Add a tag..."
            class="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
            @keyup.enter="addTag"
            maxlength="20"
          />
          <button
            type="button"
            @click="addTag"
            :disabled="!newTag.trim()"
            class="px-3 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#10B981]/90 disabled:bg-[#E5E7EB] disabled:text-[#334155]/50 transition-colors text-sm"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#E5E7EB]">
        <button
          type="button"
          @click="resetForm"
          class="flex-1 py-3 px-4 border border-[#E5E7EB] text-[#334155] rounded-lg hover:bg-[#FAF9F6] transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Reset Form</span>
        </button>
        
        <button
          v-if="transaction"
          type="button"
          @click="$emit('cancel')"
          class="flex-1 py-3 px-4 border border-[#E5E7EB] text-[#334155] rounded-lg hover:bg-[#FAF9F6] transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2',
            isFormValid && !isSubmitting
              ? form.type === 'income'
                ? 'bg-[#10B981] hover:bg-[#10B981]/90 text-white shadow-md hover:shadow-lg'
                : 'bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white shadow-md hover:shadow-lg'
              : 'bg-[#E5E7EB] text-[#334155]/50 cursor-not-allowed'
          ]"
        >
          <svg 
            v-if="isSubmitting" 
            class="animate-spin w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Saving...' : (transaction ? 'Update Transaction' : 'Add Transaction') }}</span>
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div 
      v-if="showSuccess" 
      class="mt-4 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg flex items-center space-x-2"
    >
      <svg class="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-[#10B981] font-medium">
        Transaction {{ transaction ? 'updated' : 'added' }} successfully!
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    default: null
  },
  categories: {
    type: Object,
    default: () => ({
      income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
      expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Other']
    })
  },
  showCloseButton: {
    type: Boolean,
    default: false
  },
  showAddCategory: {
    type: Boolean,
    default: true
  },
  enableTags: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel', 'close', 'add-category'])

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  tags: []
})

const errors = ref({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const generalError = ref('')
const newTag = ref('')

const quickAmounts = [10, 25, 50, 100, 250, 500, 1000, 2500]
const quickDateOptions = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: -1 },
  { label: '3 days ago', days: -3 },
  { label: '1 week ago', days: -7 }
]

const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minDate = computed(() => {
  // Allow dates up to 2 years in the past
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
  return twoYearsAgo.toISOString().split('T')[0]
})

const currentCategories = computed(() => {
  return props.categories[form.value.type] || []
})

const isFormValid = computed(() => {
  return form.value.amount && 
         form.value.category && 
         form.value.date && 
         Object.keys(errors.value).length === 0
})

const characterCount = computed(() => {
  return form.value.description.length
})

// Initialize form with transaction data if editing
onMounted(() => {
  if (props.transaction) {
    form.value = {
      type: props.transaction.type,
      amount: props.transaction.amount.toString(),
      category: props.transaction.category,
      description: props.transaction.description || '',
      date: props.transaction.date || new Date(props.transaction.createdAt).toISOString().split('T')[0],
      tags: props.transaction.tags || []
    }
  }
})

// Watch for transaction prop changes
watch(() => props.transaction, (newTransaction) => {
  if (newTransaction) {
    form.value = {
      type: newTransaction.type,
      amount: newTransaction.amount.toString(),
      category: newTransaction.category,
      description: newTransaction.description || '',
      date: newTransaction.date || new Date(newTransaction.createdAt).toISOString().split('T')[0],
      tags: newTransaction.tags || []
    }
    errors.value = {}
  }
}, { deep: true })

// Reset category when type changes
watch(() => form.value.type, (newType, oldType) => {
  if (newType !== oldType && !props.transaction) {
    form.value.category = ''
    delete errors.value.category
  }
})

// Validation functions
const validateAmount = () => {
  const amount = parseFloat(form.value.amount)
  if (!form.value.amount) {
    errors.value.amount = 'Amount is required'
  } else if (isNaN(amount) || amount <= 0) {
    errors.value.amount = 'Amount must be a positive number'
  } else if (amount > 999999999.99) {
    errors.value.amount = 'Amount is too large'
  } else {
    delete errors.value.amount
  }
}

const validateCategory = () => {
  if (!form.value.category) {
    errors.value.category = 'Category is required'
  } else {
    delete errors.value.category
  }
}

const validateDate = () => {
  const selectedDate = new Date(form.value.date)
  const today = new Date()
  const minDateObj = new Date(minDate.value)
  
  if (!form.value.date) {
    errors.value.date = 'Date is required'
  } else if (selectedDate > today) {
    errors.value.date = 'Date cannot be in the future'
  } else if (selectedDate < minDateObj) {
    errors.value.date = 'Date cannot be more than 2 years in the past'
  } else {
    delete errors.value.date
  }
}

const validateForm = () => {
  validateAmount()
  validateCategory()
  validateDate()
  return Object.keys(errors.value).length === 0
}

// Helper functions
const clearAmountError = () => {
  if (errors.value.amount) {
    delete errors.value.amount
  }
}

const updateCharacterCount = () => {
  // This is just for reactivity, the computed property handles the count
}

const formatAmount = (amount) => {
  return amount >= 1000 ? `${(amount / 1000).toFixed(0)}k` : amount.toString()
}

const setTransactionType = (type) => {
  form.value.type = type
  generalError.value = ''
}

const setQuickAmount = (amount) => {
  form.value.amount = amount.toString()
  clearAmountError()
}

const setQuickDate = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  form.value.date = date.toISOString().split('T')[0]
  delete errors.value.date
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tagToRemove) => {
  form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
}

const resetForm = () => {
  if (props.transaction) {
    // Reset to original transaction data
    form.value = {
      type: props.transaction.type,
      amount: props.transaction.amount.toString(),
      category: props.transaction.category,
      description: props.transaction.description || '',
      date: props.transaction.date || new Date(props.transaction.createdAt).toISOString().split('T')[0],
      tags: props.transaction.tags || []
    }
  } else {
    // Reset to default values
    form.value = {
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      tags: []
    }
  }
  errors.value = {}
  showSuccess.value = false
  generalError.value = ''
  newTag.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  generalError.value = ''
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const transactionData = {
      ...form.value,
      amount: parseFloat(form.value.amount)
    }

    emit('submit', transactionData)
    
    showSuccess.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)

    // Reset form if adding new transaction
    if (!props.transaction) {
      setTimeout(() => {
        resetForm()
      }, 1000)
    }
  } catch (error) {
    generalError.value = error.message || 'An error occurred while saving the transaction'
  } finally {
    isSubmitting.value = false
  }
}
</script>