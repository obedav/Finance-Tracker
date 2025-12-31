<!-- AddContributionModal.vue - Add Contribution to Goal -->
<template>
  <BaseModal
    v-model="isOpen"
    title="Add Contribution"
    :subtitle="goal ? `Contributing to: ${goal.name}` : 'Add funds to your goal'"
    size="md"
    @close="handleClose"
  >
    <div v-if="goal" class="mb-6">
      <!-- Goal Summary -->
      <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="font-semibold text-slate-700 dark:text-slate-200">{{ goal.name }}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {{ formatCurrency(goal.current_amount) }} / {{ formatCurrency(goal.target_amount) }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {{ progressPercentage }}%
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">Complete</div>
          </div>
        </div>

        <!-- Mini Progress Bar -->
        <div class="w-full bg-emerald-200 dark:bg-emerald-900/50 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
          ></div>
        </div>

        <div class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {{ formatCurrency(remainingAmount) }} remaining to reach your goal
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Contribution Amount -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Contribution Amount <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg">
            $
          </span>
          <input
            v-model.number="formData.amount"
            type="number"
            required
            min="0.01"
            step="0.01"
            class="w-full pl-10 pr-4 py-4 text-lg border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
            placeholder="100.00"
            :disabled="isSubmitting"
            @input="updateNewTotal"
          />
        </div>

        <!-- Quick Amount Buttons -->
        <div class="grid grid-cols-4 gap-2 mt-3">
          <button
            v-for="quickAmount in quickAmounts"
            :key="quickAmount"
            type="button"
            @click="setQuickAmount(quickAmount)"
            class="px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors duration-200"
            :disabled="isSubmitting"
          >
            +${{ quickAmount }}
          </button>
        </div>

        <!-- New Total Preview -->
        <div v-if="formData.amount > 0" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-600 dark:text-slate-400">New total:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">
              {{ formatCurrency(newTotal) }}
            </span>
          </div>
          <div v-if="newTotal >= (goal?.target_amount || 0)" class="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            This will complete your goal!
          </div>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100 resize-none"
          placeholder="Add a note about this contribution (e.g., Monthly savings, Bonus, etc.)"
          :disabled="isSubmitting"
        />
      </div>

      <!-- Contribution Date -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Contribution Date <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.contribution_date"
          type="date"
          required
          class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
          :max="today"
          :disabled="isSubmitting"
        />
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="text-sm text-red-700 dark:text-red-300">{{ validationError }}</p>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="handleClose"
          class="px-6 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-600 rounded-lg transition-colors duration-200"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          class="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
          :disabled="isSubmitting || !formData.amount || formData.amount <= 0"
        >
          <div v-if="isSubmitting" class="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          {{ isSubmitting ? 'Adding...' : 'Add Contribution' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useFormatters } from '@/composables/useFormatters'
import type { Goal } from '@/types/models'

// Props
const props = defineProps<{
  modelValue: boolean
  goal: Goal | null
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { amount: number; description: string; contribution_date: string }]
  close: []
}>()

// Composables
const { formatCurrency } = useFormatters()

// State
const isSubmitting = ref(false)
const validationError = ref('')
const today = new Date().toISOString().split('T')[0]

const formData = ref({
  amount: 0,
  description: '',
  contribution_date: today
})

// Quick amount options
const quickAmounts = [10, 25, 50, 100]

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const progressPercentage = computed(() => {
  if (!props.goal || props.goal.target_amount === 0) return 0
  return Math.round((props.goal.current_amount / props.goal.target_amount) * 100)
})

const remainingAmount = computed(() => {
  if (!props.goal) return 0
  return Math.max(0, props.goal.target_amount - props.goal.current_amount)
})

const newTotal = ref(0)

// Methods
const resetForm = () => {
  formData.value = {
    amount: 0,
    description: '',
    contribution_date: new Date().toISOString().split('T')[0]
  }
  newTotal.value = 0
  validationError.value = ''
}

const setQuickAmount = (amount: number) => {
  formData.value.amount = amount
  updateNewTotal()
}

const updateNewTotal = () => {
  if (props.goal) {
    newTotal.value = props.goal.current_amount + (formData.value.amount || 0)
  }
}

const validateForm = (): boolean => {
  validationError.value = ''

  if (!formData.value.amount || formData.value.amount <= 0) {
    validationError.value = 'Please enter a contribution amount greater than 0'
    return false
  }

  if (!formData.value.contribution_date) {
    validationError.value = 'Please select a contribution date'
    return false
  }

  const contributionDate = new Date(formData.value.contribution_date)
  const todayDate = new Date(today)

  if (contributionDate > todayDate) {
    validationError.value = 'Contribution date cannot be in the future'
    return false
  }

  if (props.goal) {
    const goalStartDate = new Date(props.goal.start_date)
    if (contributionDate < goalStartDate) {
      validationError.value = 'Contribution date cannot be before the goal start date'
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const submitData = {
      amount: formData.value.amount,
      description: formData.value.description.trim() || `Contribution of ${formatCurrency.value(formData.value.amount)}`,
      contribution_date: formData.value.contribution_date
    }

    emit('submit', submitData)
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (!isSubmitting.value) {
    resetForm()
    emit('close')
    emit('update:modelValue', false)
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    resetForm()
    if (props.goal) {
      updateNewTotal()
    }
  }
})

watch(() => props.goal, () => {
  if (props.modelValue && props.goal) {
    updateNewTotal()
  }
})
</script>

<style scoped>
/* Custom date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}

.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Number input - remove spinner arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
