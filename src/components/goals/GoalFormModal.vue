<!-- GoalFormModal.vue - Create/Edit Goal Modal -->
<template>
  <BaseModal
    v-model="isOpen"
    :title="isEditing ? 'Edit Goal' : 'Create New Goal'"
    subtitle="Set your financial goals and track your progress"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Goal Name -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Goal Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          required
          class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
          placeholder="e.g., Emergency Fund, New Car, Vacation"
          :disabled="isSubmitting"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100 resize-none"
          placeholder="Describe your goal and why it's important to you"
          :disabled="isSubmitting"
        />
      </div>

      <!-- Goal Type -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Goal Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.type"
          required
          class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
          :disabled="isSubmitting"
        >
          <option value="">Select goal type</option>
          <option value="savings">Savings</option>
          <option value="debt_payoff">Debt Payoff</option>
          <option value="investment">Investment</option>
          <option value="emergency_fund">Emergency Fund</option>
          <option value="vacation">Vacation</option>
          <option value="purchase">Purchase</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Target Amount & Current Amount -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Amount <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
              $
            </span>
            <input
              v-model.number="formData.target_amount"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
              placeholder="10000.00"
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Current Amount
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
              $
            </span>
            <input
              v-model.number="formData.current_amount"
              type="number"
              min="0"
              step="0.01"
              class="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
              placeholder="0.00"
              :disabled="isSubmitting"
            />
          </div>
        </div>
      </div>

      <!-- Start Date & Target Date -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start Date <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.start_date"
            type="date"
            required
            class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
            :disabled="isSubmitting"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Date
          </label>
          <input
            v-model="formData.target_date"
            type="date"
            class="w-full px-4 py-3 border border-slate-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-700 text-slate-900 dark:text-slate-100"
            :min="formData.start_date"
            :disabled="isSubmitting"
          />
        </div>
      </div>

      <!-- Priority -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Priority
        </label>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="priority in priorities"
            :key="priority.value"
            type="button"
            @click="formData.priority = priority.value"
            :class="[
              'px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2',
              formData.priority === priority.value
                ? priority.activeClass
                : 'border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-neutral-500'
            ]"
            :disabled="isSubmitting"
          >
            {{ priority.label }}
          </button>
        </div>
      </div>

      <!-- Recurring Goal -->
      <div class="flex items-center">
        <input
          v-model="formData.is_recurring"
          type="checkbox"
          id="is_recurring"
          class="w-4 h-4 text-emerald-600 border-slate-300 dark:border-neutral-600 rounded focus:ring-emerald-500"
          :disabled="isSubmitting"
        />
        <label for="is_recurring" class="ml-2 text-sm text-slate-700 dark:text-slate-300">
          This is a recurring goal
        </label>
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
          :disabled="isSubmitting"
        >
          <div v-if="isSubmitting" class="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          {{ isSubmitting ? 'Saving...' : isEditing ? 'Update Goal' : 'Create Goal' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { Goal, GoalFormData } from '@/types/models'

// Props
const props = defineProps<{
  modelValue: boolean
  goal?: Goal | null
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: GoalFormData]
  close: []
}>()

// State
const isSubmitting = ref(false)
const validationError = ref('')

const formData = ref<GoalFormData>({
  name: '',
  description: null,
  type: 'savings',
  target_amount: 0,
  current_amount: 0,
  target_date: null,
  start_date: new Date().toISOString().split('T')[0],
  priority: 'medium',
  is_recurring: false
})

// Priority options
const priorities = [
  {
    value: 'low',
    label: 'Low',
    activeClass: 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
  },
  {
    value: 'medium',
    label: 'Medium',
    activeClass: 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  },
  {
    value: 'high',
    label: 'High',
    activeClass: 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
]

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.goal)

// Methods
const resetForm = () => {
  formData.value = {
    name: '',
    description: null,
    type: 'savings',
    target_amount: 0,
    current_amount: 0,
    target_date: null,
    start_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    is_recurring: false
  }
  validationError.value = ''
}

const loadGoalData = () => {
  if (props.goal) {
    formData.value = {
      name: props.goal.name,
      description: props.goal.description,
      type: props.goal.type,
      target_amount: props.goal.target_amount,
      current_amount: props.goal.current_amount,
      target_date: props.goal.target_date,
      start_date: props.goal.start_date,
      priority: props.goal.priority,
      is_recurring: props.goal.is_recurring
    }
  }
}

const validateForm = (): boolean => {
  validationError.value = ''

  if (!formData.value.name.trim()) {
    validationError.value = 'Please enter a goal name'
    return false
  }

  if (formData.value.target_amount <= 0) {
    validationError.value = 'Target amount must be greater than 0'
    return false
  }

  if (formData.value.current_amount !== undefined && formData.value.current_amount < 0) {
    validationError.value = 'Current amount cannot be negative'
    return false
  }

  if (formData.value.target_date) {
    const startDate = new Date(formData.value.start_date)
    const targetDate = new Date(formData.value.target_date)

    if (targetDate < startDate) {
      validationError.value = 'Target date cannot be before start date'
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Clean up the data before submitting
    const submitData: GoalFormData = {
      ...formData.value,
      description: formData.value.description?.trim() || null,
      target_date: formData.value.target_date || null,
      current_amount: formData.value.current_amount || 0
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
    if (props.goal) {
      loadGoalData()
    } else {
      resetForm()
    }
  }
})

watch(() => props.goal, () => {
  if (props.modelValue && props.goal) {
    loadGoalData()
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
</style>
