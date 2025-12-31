<!-- Goals.vue - Goal Tracking Management -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-slate-700 dark:text-slate-100">Financial Goals</h1>
              <p class="text-lg text-slate-500 dark:text-slate-400">Track and achieve your financial milestones</p>
            </div>
          </div>
          <button
            @click="openCreateGoalModal"
            class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Goal
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <span class="ml-3 text-slate-600 dark:text-slate-300">Loading goals...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="goalsStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-red-800 dark:text-red-200 font-semibold">Error Loading Goals</h3>
            <p class="text-red-600 dark:text-red-300">{{ goalsStore.error }}</p>
          </div>
        </div>
        <button
          @click="refreshData"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>

      <!-- Stats Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200">Total Goals</h3>
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">{{ goals.length }}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">All financial goals</div>
        </div>

        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200">Active Goals</h3>
            <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">{{ activeGoalsCount }}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">Currently in progress</div>
        </div>

        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200">Completed Goals</h3>
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">{{ completedGoalsCount }}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">Goals achieved</div>
        </div>

        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200">Overall Progress</h3>
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">{{ overallProgress }}%</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">Across all goals</div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            @click="selectedFilter = tab.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              selectedFilter === tab.value
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-600'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Goals Grid -->
      <div v-if="!isLoading && !goalsStore.error && filteredGoals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <GoalCard
          v-for="goal in filteredGoals"
          :key="goal.id"
          :goal="goal"
          @edit="openEditGoalModal"
          @delete="handleDeleteGoal"
          @add-contribution="openContributionModal"
          @view-details="handleViewDetails"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && !goalsStore.error && filteredGoals.length === 0" class="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-12 text-center">
        <div class="w-20 h-20 bg-slate-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
          {{ selectedFilter === 'all' ? 'No Goals Yet' : `No ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Goals` }}
        </h3>
        <p class="text-slate-500 dark:text-slate-400 mb-6">
          {{ selectedFilter === 'all'
            ? 'Start setting financial goals to track your progress and achieve your dreams'
            : `You don't have any ${selectedFilter} goals at the moment`
          }}
        </p>
        <button
          @click="selectedFilter === 'all' ? openCreateGoalModal() : selectedFilter = 'all'"
          class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          {{ selectedFilter === 'all' ? 'Create Your First Goal' : 'View All Goals' }}
        </button>
      </div>
    </div>

    <!-- Goal Form Modal -->
    <GoalFormModal
      v-model="showGoalFormModal"
      :goal="editingGoal"
      @submit="handleGoalSubmit"
      @close="closeGoalFormModal"
    />

    <!-- Add Contribution Modal -->
    <AddContributionModal
      v-model="showContributionModal"
      :goal="selectedGoalForContribution"
      @submit="handleContributionSubmit"
      @close="closeContributionModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { useToast } from '@/composables/useToast'
import GoalCard from '@/components/goals/GoalCard.vue'
import GoalFormModal from '@/components/goals/GoalFormModal.vue'
import AddContributionModal from '@/components/goals/AddContributionModal.vue'
import type { Goal, GoalFormData } from '@/types/models'

// Stores and composables
const goalsStore = useGoalsStore()
const { showToast } = useToast()

// State
const showGoalFormModal = ref(false)
const showContributionModal = ref(false)
const editingGoal = ref<Goal | null>(null)
const selectedGoalForContribution = ref<Goal | null>(null)
const selectedFilter = ref<'all' | 'active' | 'completed' | 'by-type'>('all')

// Filter tabs
const filterTabs = [
  { label: 'All Goals', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'By Type', value: 'by-type' }
]

// Computed
const isLoading = computed(() => goalsStore.isLoading)
const goals = computed(() => goalsStore.goals)

const filteredGoals = computed(() => {
  switch (selectedFilter.value) {
    case 'active':
      return goals.value.filter(g => g.status === 'active')
    case 'completed':
      return goals.value.filter(g => g.status === 'completed')
    case 'by-type':
      // For now, show all goals - can be enhanced to filter by type
      return goals.value
    default:
      return goals.value
  }
})

const activeGoalsCount = computed(() => {
  return goals.value.filter(g => g.status === 'active').length
})

const completedGoalsCount = computed(() => {
  return goals.value.filter(g => g.status === 'completed').length
})

const overallProgress = computed(() => {
  if (goals.value.length === 0) return 0
  const totalTarget = goals.value.reduce((sum, g) => sum + g.target_amount, 0)
  const totalCurrent = goals.value.reduce((sum, g) => sum + g.current_amount, 0)
  return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
})

// Methods
const openCreateGoalModal = () => {
  editingGoal.value = null
  showGoalFormModal.value = true
}

const openEditGoalModal = (goal: Goal) => {
  editingGoal.value = goal
  showGoalFormModal.value = true
}

const closeGoalFormModal = () => {
  showGoalFormModal.value = false
  editingGoal.value = null
}

const openContributionModal = (goal: Goal) => {
  selectedGoalForContribution.value = goal
  showContributionModal.value = true
}

const closeContributionModal = () => {
  showContributionModal.value = false
  selectedGoalForContribution.value = null
}

const handleGoalSubmit = async (goalData: GoalFormData) => {
  try {
    if (editingGoal.value) {
      await goalsStore.updateGoal(editingGoal.value.id, goalData)
      showToast('Goal updated successfully!', 'success')
    } else {
      await goalsStore.createGoal(goalData)
      showToast('Goal created successfully!', 'success')
    }
    closeGoalFormModal()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save goal'
    showToast(message, 'error')
  }
}

const handleContributionSubmit = async (contributionData: { amount: number; description: string; contribution_date: string }) => {
  if (!selectedGoalForContribution.value) return

  try {
    await goalsStore.addContribution({
      goal_id: selectedGoalForContribution.value.id,
      ...contributionData
    })
    showToast('Contribution added successfully!', 'success')
    closeContributionModal()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add contribution'
    showToast(message, 'error')
  }
}

const handleDeleteGoal = async (goalId: number) => {
  if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
    return
  }

  try {
    await goalsStore.deleteGoal(goalId)
    showToast('Goal deleted successfully', 'success')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete goal'
    showToast(message, 'error')
  }
}

const handleViewDetails = (goal: Goal) => {
  // Can be enhanced to show a detailed modal or navigate to a details page
  console.log('View details for goal:', goal)
}

const refreshData = async () => {
  try {
    goalsStore.clearError()
    await goalsStore.fetchGoals(true)
    showToast('Data refreshed successfully', 'success')
  } catch (error) {
    showToast('Failed to refresh data', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await goalsStore.fetchGoals()
  } catch (error) {
    // Error is already set in the store
    console.error('Failed to load goals:', error)
  }
})
</script>

<style scoped>
/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(-5px) rotate(-1deg);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
  }
}
</style>
