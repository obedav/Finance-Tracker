<!-- GoalCard.vue - Individual Goal Card Component -->
<template>
  <div
    class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    @click="handleClick"
  >
    <!-- Card Header -->
    <div class="p-6 border-b border-slate-200 dark:border-neutral-700">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center flex-1 min-w-0">
          <!-- Type Icon -->
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
              typeIconBackground
            ]"
          >
            <svg :class="['w-6 h-6', typeIconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="typeIcon"></path>
            </svg>
          </div>

          <!-- Goal Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-700 dark:text-slate-100 text-lg mb-1 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ goal.name }}
            </h3>
            <p v-if="goal.description" class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {{ goal.description }}
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0',
            statusBadgeClass
          ]"
        >
          {{ statusLabel }}
        </div>
      </div>

      <!-- Priority Badge -->
      <div class="flex items-center gap-2 mt-2">
        <div
          :class="[
            'px-2 py-1 rounded-md text-xs font-medium',
            priorityBadgeClass
          ]"
        >
          {{ priorityLabel }}
        </div>
        <div class="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-neutral-700 text-slate-600 dark:text-slate-300">
          {{ typeLabel }}
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6">
      <!-- Amount Progress -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Progress</span>
          <span class="text-sm font-bold text-slate-700 dark:text-slate-200">
            {{ formatCurrency(goal.current_amount) }} / {{ formatCurrency(goal.target_amount) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
          <div
            :class="[
              'h-3 rounded-full transition-all duration-500 relative',
              progressBarColor
            ]"
            :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        <!-- Percentage -->
        <div class="flex justify-between items-center mt-2">
          <span :class="['text-sm font-semibold', progressTextColor]">
            {{ progressPercentage }}% Complete
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ formatCurrency(remainingAmount) }} remaining
          </span>
        </div>
      </div>

      <!-- Target Date -->
      <div v-if="goal.target_date" class="flex items-center justify-between text-sm mb-4">
        <div class="flex items-center text-slate-600 dark:text-slate-300">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Target: {{ formatDate(goal.target_date) }}</span>
        </div>
        <span
          v-if="daysRemaining !== null"
          :class="[
            'text-xs font-medium px-2 py-1 rounded',
            daysRemaining < 0
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : daysRemaining < 30
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          ]"
        >
          {{ daysRemainingText }}
        </span>
      </div>

      <!-- Start Date -->
      <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Started: {{ formatDate(goal.start_date) }}
      </div>
    </div>

    <!-- Card Footer - Action Buttons -->
    <div class="px-6 pb-6 flex items-center justify-between gap-2">
      <button
        v-if="goal.status === 'active'"
        @click.stop="handleAddContribution"
        class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Funds
      </button>

      <button
        @click.stop="handleEdit"
        class="px-4 py-2 bg-slate-100 dark:bg-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors duration-200"
        title="Edit goal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>

      <button
        @click.stop="handleDelete"
        class="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors duration-200"
        title="Delete goal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormatters } from '@/composables/useFormatters'
import type { Goal } from '@/types/models'

// Props
const props = defineProps<{
  goal: Goal
}>()

// Emits
const emit = defineEmits<{
  edit: [goal: Goal]
  delete: [goalId: number]
  addContribution: [goal: Goal]
  viewDetails: [goal: Goal]
}>()

// Composables
const { formatCurrency, formatDate } = useFormatters()

// Computed properties
const progressPercentage = computed(() => {
  if (props.goal.target_amount === 0) return 0
  return Math.round((props.goal.current_amount / props.goal.target_amount) * 100)
})

const remainingAmount = computed(() => {
  return Math.max(0, props.goal.target_amount - props.goal.current_amount)
})

const daysRemaining = computed(() => {
  if (!props.goal.target_date) return null
  const target = new Date(props.goal.target_date)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const daysRemainingText = computed(() => {
  if (daysRemaining.value === null) return ''
  if (daysRemaining.value < 0) return `${Math.abs(daysRemaining.value)} days overdue`
  if (daysRemaining.value === 0) return 'Due today'
  if (daysRemaining.value === 1) return '1 day left'
  return `${daysRemaining.value} days left`
})

// Type icon mapping
const typeIcons: Record<string, string> = {
  savings: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  debt_payoff: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  investment: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  emergency_fund: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z',
  vacation: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
  purchase: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z',
  other: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
}

const typeIcon = computed(() => typeIcons[props.goal.type] || typeIcons.other)

const typeIconBackground = computed(() => {
  const colors: Record<string, string> = {
    savings: 'bg-emerald-100 dark:bg-emerald-900/30',
    debt_payoff: 'bg-red-100 dark:bg-red-900/30',
    investment: 'bg-blue-100 dark:bg-blue-900/30',
    emergency_fund: 'bg-yellow-100 dark:bg-yellow-900/30',
    vacation: 'bg-purple-100 dark:bg-purple-900/30',
    purchase: 'bg-pink-100 dark:bg-pink-900/30',
    other: 'bg-slate-100 dark:bg-slate-900/30'
  }
  return colors[props.goal.type] || colors.other
})

const typeIconColor = computed(() => {
  const colors: Record<string, string> = {
    savings: 'text-emerald-600 dark:text-emerald-400',
    debt_payoff: 'text-red-600 dark:text-red-400',
    investment: 'text-blue-600 dark:text-blue-400',
    emergency_fund: 'text-yellow-600 dark:text-yellow-400',
    vacation: 'text-purple-600 dark:text-purple-400',
    purchase: 'text-pink-600 dark:text-pink-400',
    other: 'text-slate-600 dark:text-slate-400'
  }
  return colors[props.goal.type] || colors.other
})

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    savings: 'Savings',
    debt_payoff: 'Debt Payoff',
    investment: 'Investment',
    emergency_fund: 'Emergency Fund',
    vacation: 'Vacation',
    purchase: 'Purchase',
    other: 'Other'
  }
  return labels[props.goal.type] || 'Other'
})

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    abandoned: 'Abandoned',
    paused: 'Paused'
  }
  return labels[props.goal.status] || props.goal.status
})

const statusBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    abandoned: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  }
  return classes[props.goal.status] || classes.active
})

const priorityLabel = computed(() => {
  const labels: Record<string, string> = {
    high: 'High Priority',
    medium: 'Medium',
    low: 'Low Priority'
  }
  return labels[props.goal.priority] || 'Medium'
})

const priorityBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    low: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
  }
  return classes[props.goal.priority] || classes.medium
})

const progressBarColor = computed(() => {
  if (progressPercentage.value >= 100) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (progressPercentage.value >= 80) return 'bg-gradient-to-r from-emerald-400 to-emerald-600'
  if (progressPercentage.value >= 50) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  return 'bg-gradient-to-r from-slate-400 to-slate-600'
})

const progressTextColor = computed(() => {
  if (progressPercentage.value >= 100) return 'text-green-600 dark:text-green-400'
  if (progressPercentage.value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (progressPercentage.value >= 50) return 'text-blue-600 dark:text-blue-400'
  return 'text-slate-600 dark:text-slate-400'
})

// Methods
const handleClick = () => {
  emit('viewDetails', props.goal)
}

const handleEdit = () => {
  emit('edit', props.goal)
}

const handleDelete = () => {
  emit('delete', props.goal.id)
}

const handleAddContribution = () => {
  emit('addContribution', props.goal)
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
