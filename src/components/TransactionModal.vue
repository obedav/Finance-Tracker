<!-- FIXED src/components/TransactionModal.vue - Proper attribute inheritance -->
<template>
  <Teleport to="body">
    <div 
      v-if="isVisible"
      class="transaction-modal-overlay"
      :class="$attrs.class"
      @click.self="$emit('close')"
    >
      <div class="transaction-modal-content">
        <div class="transaction-modal-header">
          <!-- Enhanced Header -->
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-700">
              {{ transaction ? 'Edit Transaction' : 'Add Transaction' }}
            </h2>
          </div>
          <button 
            @click="$emit('close')"
            class="transaction-modal-close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="transaction-modal-body space-y-4">
          <!-- Enhanced Transaction Type Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Transaction Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.type = 'income'"
                :class="[
                  'p-3 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:transform hover:scale-105',
                  form.type === 'income'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50'
                ]"
              >
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-emerald-500 rounded-lg mr-3 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-700 text-sm">Income</div>
                    <div class="text-xs text-gray-500">Money coming in</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                @click="form.type = 'expense'"
                :class="[
                  'p-3 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 hover:transform hover:scale-105',
                  form.type === 'expense'
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50'
                ]"
              >
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-amber-500 rounded-lg mr-3 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-700 text-sm">Expense</div>
                    <div class="text-xs text-gray-500">Money going out</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Enhanced Amount Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 font-semibold hover:border-gray-300 focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Enhanced Category Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <div class="relative">
              <select
                v-model="form.category"
                required
                class="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 appearance-none bg-white hover:border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in availableCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Enhanced Description Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 resize-none hover:border-gray-300 focus:ring-2 focus:ring-emerald-500"
              placeholder="Add a note about this transaction..."
            ></textarea>
          </div>

          <!-- Enhanced Date Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 hover:border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="btn-primary flex-1"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ transaction ? 'Update' : 'Add' }} Transaction
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

// FIXED: Define inheritAttrs to handle class and other attributes properly
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  transaction: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  type: 'expense',
  amount: null,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const defaultCategories = {
  income: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other'
  ],
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Other'
  ]
}

const availableCategories = computed(() => {
  return defaultCategories[form.value.type] || []
})

const isFormValid = computed(() => {
  return form.value.type && 
         form.value.amount && 
         form.value.amount > 0 && 
         form.value.category && 
         form.value.date
})

// Watch for type changes to reset category
watch(() => form.value.type, () => {
  form.value.category = ''
}, { immediate: false })

// Watch for transaction prop changes
watch(() => props.transaction, (newTransaction) => {
  if (newTransaction) {
    form.value = {
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.category,
      description: newTransaction.description || '',
      date: new Date(newTransaction.createdAt || newTransaction.date).toISOString().split('T')[0]
    }
  } else {
    // Reset form for new transaction
    form.value = {
      type: 'expense',
      amount: null,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!isFormValid.value) return

  const transactionData = {
    ...form.value,
    amount: parseFloat(form.value.amount),
    createdAt: form.value.date + 'T' + new Date().toTimeString().split(' ')[0],
    id: props.transaction?.id || Date.now().toString()
  }

  emit('submit', transactionData)
}

// Focus management for accessibility
onMounted(() => {
  nextTick(() => {
    const firstInput = document.querySelector('.transaction-modal-content input, .transaction-modal-content button')
    if (firstInput) {
      firstInput.focus()
    }
  })
})

// Escape key handler
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Modal CSS Override */
.transaction-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
  padding: 1rem !important;
  animation: fadeIn 0.3s ease-out !important;
}

.transaction-modal-content {
  background: white !important;
  border-radius: 1.5rem !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  width: 100% !important;
  max-width: 32rem !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  position: relative !important;
  z-index: 10000 !important;
  animation: slideUp 0.3s ease-out !important;
}

.transaction-modal-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.transaction-modal-body {
  padding: 1.5rem !important;
}

.transaction-modal-close {
  background: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  cursor: pointer !important;
  padding: 0.5rem !important;
  border-radius: 0.5rem !important;
  transition: all 0.2s ease !important;
}

.transaction-modal-close:hover {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 0.75rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px) !important;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3) !important;
}

.btn-secondary {
  background: transparent !important;
  color: #6b7280 !important;
  border: 2px solid #d1d5db !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 0.75rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.btn-secondary:hover {
  background: #f9fafb !important;
  border-color: #9ca3af !important;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Focus improvements for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #10b981 !important;
  outline-offset: 2px !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .transaction-modal-content {
    margin: 1rem !important;
    max-width: calc(100vw - 2rem) !important;
  }
  
  .transaction-modal-header,
  .transaction-modal-body {
    padding: 1rem !important;
  }
}
</style>