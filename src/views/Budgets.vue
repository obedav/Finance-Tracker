<!-- src/views/Budgets.vue - Real Data Only -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-slate-700">Budget Management</h1>
              <p class="text-lg text-slate-500">Track and manage your spending limits</p>
            </div>
          </div>
          <button 
            @click="showCreateBudget = true"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Budget
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span class="ml-3 text-slate-600">Loading budgets...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="budgetStore.error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-red-800 font-semibold">Error Loading Budgets</h3>
            <p class="text-red-600">{{ budgetStore.error }}</p>
          </div>
        </div>
        <button 
          @click="refreshData"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>

      <!-- Budget Overview Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700">Total Budgets</h3>
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 mb-2">{{ budgets.length }}</div>
          <div class="text-sm text-slate-500">Active budget categories</div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700">Total Allocated</h3>
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 mb-2">${{ totalBudgetAmount.toLocaleString() }}</div>
          <div class="text-sm text-slate-500">This month's budget</div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-700">Total Spent</h3>
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-700 mb-2">${{ totalSpentAmount.toLocaleString() }}</div>
          <div class="text-sm" :class="spentPercentage > 100 ? 'text-red-500' : spentPercentage > 80 ? 'text-yellow-500' : 'text-green-500'">
            {{ spentPercentage.toFixed(1) }}% of budget used
          </div>
        </div>
      </div>

      <!-- Budget Progress Section -->
      <div v-if="!isLoading && !budgetStore.error && budgets.length > 0" class="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300">
        <h3 class="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
          <div class="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          Budget Progress Overview
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Overall Progress -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-700">Overall Budget Progress</span>
              <span class="text-sm text-slate-500">${{ totalSpentAmount.toLocaleString() }} / ${{ totalBudgetAmount.toLocaleString() }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-500"
                :class="spentPercentage > 100 ? 'bg-red-500' : spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
                :style="{ width: Math.min(spentPercentage, 100) + '%' }"
              ></div>
            </div>
            <div class="text-xs text-slate-500">
              {{ spentPercentage > 100 ? 'Over budget' : spentPercentage > 80 ? 'Approaching limit' : 'On track' }}
            </div>
          </div>

          <!-- Budget Health -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-700">Budget Health</span>
              <span class="text-sm px-3 py-1 rounded-full" 
                    :class="budgetHealthColor">
                {{ budgetHealthStatus }}
              </span>
            </div>
            <div class="text-sm text-slate-500">
              <div class="flex justify-between">
                <span>Budgets on track:</span>
                <span>{{ budgetsOnTrack }}/{{ budgets.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Over budget:</span>
                <span>{{ budgetsOverLimit }}/{{ budgets.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget List -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
            <div class="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </div>
            Your Budgets
          </h3>

          <!-- Filter Dropdown (only show if there are budgets) -->
          <div v-if="budgets.length > 0" class="relative">
            <select 
              v-model="selectedFilter"
              class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Budgets</option>
              <option value="on-track">On Track</option>
              <option value="warning">Warning (>80%)</option>
              <option value="over-budget">Over Budget</option>
            </select>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && !budgetStore.error && budgets.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">No Budgets Yet</h3>
          <p class="text-slate-500 mb-6">Create your first budget to start tracking your spending and take control of your finances</p>
          <button 
            @click="showCreateBudget = true"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Create Your First Budget
          </button>
        </div>

        <!-- No Results State -->
        <div v-else-if="!isLoading && !budgetStore.error && filteredBudgets.length === 0 && budgets.length > 0" class="text-center py-12">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">No Budgets Match Filter</h3>
          <p class="text-slate-500 mb-6">Try changing your filter or create a new budget</p>
          <button 
            @click="selectedFilter = 'all'"
            class="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 mr-3"
          >
            Show All Budgets
          </button>
          <button 
            @click="showCreateBudget = true"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Create Budget
          </button>
        </div>

        <!-- Budget Cards -->
        <div v-else-if="!isLoading && !budgetStore.error" class="space-y-4">
          <div 
            v-for="budget in filteredBudgets" 
            :key="budget.id"
            class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :style="{ backgroundColor: (budget.color || '#10B981') + '20', color: budget.color || '#10B981' }"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-slate-700">{{ budget.name }}</h4>
                  <p class="text-sm text-slate-500">{{ budget.category }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="editBudget(budget)"
                  class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  title="Edit budget"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="deleteBudget(budget.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete budget"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Budget Progress -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-slate-700">
                  ${{ getBudgetSpentAmount(budget).toLocaleString() }} / ${{ budget.amount.toLocaleString() }}
                </span>
                <span class="text-sm" 
                      :class="getBudgetStatusColor(budget)">
                  {{ getBudgetPercentage(budget).toFixed(1) }}%
                </span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getBudgetProgressColor(budget)"
                  :style="{ width: Math.min(getBudgetPercentage(budget), 100) + '%' }"
                ></div>
              </div>
              
              <div class="flex justify-between items-center text-xs text-slate-500">
                <span>{{ budget.period }} budget</span>
                <span>{{ getDaysRemaining(budget) }} days remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Budget Modal -->
    <div v-if="showCreateBudget || editingBudget" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-scale-up">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-700 mb-6">
            {{ editingBudget ? 'Edit Budget' : 'Create New Budget' }}
          </h3>
          
          <form @submit.prevent="saveBudget" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Budget Name</label>
              <input
                v-model="budgetForm.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Groceries, Entertainment"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                v-model="budgetForm.category"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option 
                  v-for="category in availableCategories" 
                  :key="category.id || category"
                  :value="category.name || category"
                >
                  {{ category.name || category }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Budget Amount</label>
              <input
                v-model.number="budgetForm.amount"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Period</label>
              <select
                v-model="budgetForm.period"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Color</label>
              <div class="flex gap-2">
                <button
                  v-for="color in budgetColors"
                  :key="color"
                  type="button"
                  @click="budgetForm.color = color"
                  class="w-8 h-8 rounded-full border-2 transition-all duration-200"
                  :style="{ backgroundColor: color }"
                  :class="budgetForm.color === color ? 'border-slate-400 scale-110' : 'border-slate-200'"
                ></button>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button 
                type="button"
                @click="closeBudgetModal"
                class="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                :disabled="loading"
              >
                <div v-if="loading" class="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {{ loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactions'
import { useBudgetStore } from '@/stores/budgets'
import { useToast } from '@/composables/useToast'

// Initialize stores and composables
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const { showToast } = useToast()

// Reactive state
const showCreateBudget = ref(false)
const editingBudget = ref(null)
const loading = ref(false)
const selectedFilter = ref('all')

// Loading state
const isLoading = computed(() => {
  return budgetStore.isLoading || transactionStore.isLoading
})

// Use ONLY real budget data from store (no fallback)
const budgets = computed(() => {
  return budgetStore.budgets || []
})

// Budget form
const budgetForm = ref({
  name: '',
  category: '',
  amount: 0,
  period: 'monthly',
  color: '#10B981'
})

// Budget colors
const budgetColors = [
  '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
]

// Default categories if store categories aren't available
const defaultCategories = [
  'Food & Dining',
  'Transportation', 
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Other'
]

// Available categories
const availableCategories = computed(() => {
  return transactionStore.categories || defaultCategories
})

// Computed properties
const totalBudgetAmount = computed(() => {
  return budgets.value.reduce((total, budget) => total + (budget.amount || 0), 0)
})

const totalSpentAmount = computed(() => {
  return budgets.value.reduce((total, budget) => {
    const categorySpent = calculateCategorySpending(budget.category, budget.period)
    return total + categorySpent
  }, 0)
})

// Calculate spending for a specific category
const calculateCategorySpending = (category, period = 'monthly') => {
  if (!transactionStore.transactions) return 0
  
  const now = new Date()
  let startDate, endDate
  
  switch (period) {
    case 'weekly':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      break
    default: // monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }
  
  return transactionStore.transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date || transaction.created_at)
      const matchesCategory = transaction.category === category || 
                            transaction.category_name === category ||
                            (transaction.category_id && getCategoryName(transaction.category_id) === category)
      const isExpense = transaction.type === 'expense' || transaction.amount < 0
      const inPeriod = transactionDate >= startDate && transactionDate <= endDate
      
      return matchesCategory && isExpense && inPeriod
    })
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
}

// Helper function to get category name by ID
const getCategoryName = (categoryId) => {
  if (!transactionStore.categories) return ''
  const category = transactionStore.categories.find(cat => cat.id === categoryId)
  return category ? category.name : ''
}

const spentPercentage = computed(() => {
  return totalBudgetAmount.value > 0 ? (totalSpentAmount.value / totalBudgetAmount.value) * 100 : 0
})

const budgetsOnTrack = computed(() => {
  return budgets.value.filter(budget => getBudgetPercentage(budget) <= 80).length
})

const budgetsOverLimit = computed(() => {
  return budgets.value.filter(budget => getBudgetPercentage(budget) > 100).length
})

const budgetHealthStatus = computed(() => {
  const overBudgetCount = budgetsOverLimit.value
  const warningCount = budgets.value.filter(budget => {
    const percentage = getBudgetPercentage(budget)
    return percentage > 80 && percentage <= 100
  }).length

  if (overBudgetCount > 0) return 'Critical'
  if (warningCount > 0) return 'Warning'
  return 'Healthy'
})

const budgetHealthColor = computed(() => {
  switch (budgetHealthStatus.value) {
    case 'Critical': return 'bg-red-100 text-red-800'
    case 'Warning': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-green-100 text-green-800'
  }
})

const filteredBudgets = computed(() => {
  switch (selectedFilter.value) {
    case 'on-track':
      return budgets.value.filter(budget => getBudgetPercentage(budget) <= 80)
    case 'warning':
      return budgets.value.filter(budget => {
        const percentage = getBudgetPercentage(budget)
        return percentage > 80 && percentage <= 100
      })
    case 'over-budget':
      return budgets.value.filter(budget => getBudgetPercentage(budget) > 100)
    default:
      return budgets.value
  }
})

// Methods
const getBudgetPercentage = (budget) => {
  const spent = calculateCategorySpending(budget.category, budget.period)
  return budget.amount > 0 ? (spent / budget.amount) * 100 : 0
}

const getBudgetSpentAmount = (budget) => {
  return calculateCategorySpending(budget.category, budget.period)
}

const getBudgetStatusColor = (budget) => {
  const percentage = getBudgetPercentage(budget)
  if (percentage > 100) return 'text-red-600'
  if (percentage > 80) return 'text-yellow-600'
  return 'text-green-600'
}

const getBudgetProgressColor = (budget) => {
  const percentage = getBudgetPercentage(budget)
  if (percentage > 100) return 'bg-red-500'
  if (percentage > 80) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getDaysRemaining = (budget) => {
  const now = new Date()
  let endDate
  
  switch (budget.period) {
    case 'weekly':
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6)
      break
    case 'yearly':
      endDate = new Date(now.getFullYear(), 11, 31)
      break
    default: // monthly
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }
  
  const diffTime = endDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const editBudget = (budget) => {
  editingBudget.value = budget
  budgetForm.value = {
    name: budget.name,
    category: budget.category,
    amount: budget.amount,
    period: budget.period,
    color: budget.color || '#10B981'
  }
}

const deleteBudget = async (budgetId) => {
  if (confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
    try {
      await budgetStore.deleteBudget(budgetId)
      showToast('Budget deleted successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete budget. Please try again.', 'error')
      console.error('Error deleting budget:', error)
    }
  }
}

const saveBudget = async () => {
  try {
    loading.value = true
    
    // Generate period dates automatically
    const periodDates = budgetStore.generatePeriodDates(budgetForm.value.period)
    
    const budgetData = {
      ...budgetForm.value,
      ...periodDates
    }
    
    if (editingBudget.value) {
      // Update existing budget
      await budgetStore.updateBudget(editingBudget.value.id, budgetData)
      showToast('Budget updated successfully!', 'success')
    } else {
      // Create new budget
      await budgetStore.createBudget(budgetData)
      showToast('Budget created successfully!', 'success')
    }
    
    closeBudgetModal()
  } catch (error) {
    showToast(error.message || 'Failed to save budget. Please try again.', 'error')
    console.error('Error saving budget:', error)
  } finally {
    loading.value = false
  }
}

const closeBudgetModal = () => {
  showCreateBudget.value = false
  editingBudget.value = null
  budgetForm.value = {
    name: '',
    category: '',
    amount: 0,
    period: 'monthly',
    color: '#10B981'
  }
}

const refreshData = async () => {
  try {
    budgetStore.clearError()
    await Promise.all([
      budgetStore.refreshBudgets(),
      transactionStore.fetchTransactions?.(),
      transactionStore.fetchCategories?.()
    ])
    showToast('Data refreshed successfully', 'success')
  } catch (error) {
    showToast('Failed to refresh data', 'error')
    console.error('Error refreshing data:', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Load real data from stores
    await Promise.all([
      // Load budgets
      budgetStore.fetchBudgets(),
      
      // Load transactions for spending calculations
      transactionStore.fetchTransactions?.() || Promise.resolve(),
      
      // Load categories
      transactionStore.fetchCategories?.() || Promise.resolve()
    ])
  } catch (error) {
    console.error('Error loading budget data:', error)
    showToast('Failed to load some data. Please refresh the page.', 'error')
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

.animate-scale-up {
  animation: scaleUp 0.3s ease-out;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

/* Hover effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #10b981;
}

/* Utility classes */
.transition-all {
  transition: all 0.3s ease;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}
</style>