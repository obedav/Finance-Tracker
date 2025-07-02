<!-- src/components/layout/TheSidebar.vue - Fixed Single Template -->
<template>
  <div>
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-30 w-56 sm:w-64 bg-white border-r border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out backdrop-blur-sm"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="flex flex-col h-full">
        <!-- Enhanced Sidebar Header -->
        <div class="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div class="flex items-center justify-between">
            <router-link to="/dashboard" class="flex items-center space-x-2 sm:space-x-3 group">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="hidden sm:block">
                <span class="text-base sm:text-lg font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">FinanceTracker</span>
                <p class="text-xs text-slate-500">Manage your money</p>
              </div>
            </router-link>
            
            <button 
              @click="$emit('close')"
              class="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 md:hidden focus-ring group"
              aria-label="Close sidebar"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Enhanced Navigation with Real Data -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <!-- Dashboard Section -->
          <div class="space-y-1">
            <button 
              @click="toggleSection('dashboard')"
              class="w-full flex items-center justify-between px-3 mb-3 hover:bg-gray-50 rounded-lg py-2 transition-colors"
            >
              <div class="flex items-center">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Dashboard
                </p>
                <div class="w-6 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full ml-2"></div>
              </div>
              <svg 
                class="w-4 h-4 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedSections.dashboard }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div 
              v-show="expandedSections.dashboard"
              class="space-y-1 transition-all duration-300"
              :class="{ 'animate-slide-down': expandedSections.dashboard }"
            >
              <router-link 
                v-for="(item, index) in dashboardLinks" 
                :key="item.name"
                :to="item.to"
                :class="[
                  isActiveRoute(item.to)
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-r-2 border-emerald-500'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50 hover:text-slate-900',
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm'
                ]"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300"
                     :class="isActiveRoute(item.to) ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-emerald-100'">
                  <svg 
                    class="w-4 h-4 transition-all duration-300" 
                    :class="isActiveRoute(item.to) ? 'text-emerald-600' : 'text-slate-500 group-hover:text-emerald-600'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
                  </svg>
                </div>
                <span class="truncate">{{ item.name }}</span>
                <div v-if="item.badge" class="ml-auto">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {{ item.badge }}
                  </span>
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- Transactions Section with Real Data -->
          <div class="space-y-1">
            <button 
              @click="toggleSection('transactions')"
              class="w-full flex items-center justify-between px-3 mb-3 hover:bg-gray-50 rounded-lg py-2 transition-colors"
            >
              <div class="flex items-center">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Transactions
                </p>
                <div class="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full ml-2"></div>
              </div>
              <svg 
                class="w-4 h-4 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedSections.transactions }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div 
              v-show="expandedSections.transactions"
              class="space-y-1 transition-all duration-300"
              :class="{ 'animate-slide-down': expandedSections.transactions }"
            >
              <router-link 
                v-for="(item, index) in transactionLinks" 
                :key="item.name"
                :to="item.to"
                :class="[
                  isActiveRoute(item.to)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-slate-900',
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm'
                ]"
                :style="{ animationDelay: `${(index + 3) * 50}ms` }"
              >
                <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300"
                     :class="isActiveRoute(item.to) ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-100'">
                  <svg 
                    class="w-4 h-4 transition-all duration-300" 
                    :class="isActiveRoute(item.to) ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
                  </svg>
                </div>
                <span class="truncate">{{ item.name }}</span>
                <div v-if="item.count !== undefined" class="ml-auto">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getCountBadgeClass(item.type)">
                    {{ item.count }}
                  </span>
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- Planning Section -->
          <div class="space-y-1">
            <button 
              @click="toggleSection('planning')"
              class="w-full flex items-center justify-between px-3 mb-3 hover:bg-gray-50 rounded-lg py-2 transition-colors"
            >
              <div class="flex items-center">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Planning
                </p>
                <div class="w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full ml-2"></div>
              </div>
              <svg 
                class="w-4 h-4 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedSections.planning }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div 
              v-show="expandedSections.planning"
              class="space-y-1 transition-all duration-300"
              :class="{ 'animate-slide-down': expandedSections.planning }"
            >
              <router-link 
                v-for="(item, index) in planningLinks" 
                :key="item.name"
                :to="item.to"
                :class="[
                  isActiveRoute(item.to)
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-r-2 border-purple-500'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:text-slate-900',
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm'
                ]"
                :style="{ animationDelay: `${(index + 6) * 50}ms` }"
              >
                <div class="flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300"
                     :class="isActiveRoute(item.to) ? 'bg-purple-100' : 'bg-slate-100 group-hover:bg-purple-100'">
                  <svg 
                    class="w-4 h-4 transition-all duration-300" 
                    :class="isActiveRoute(item.to) ? 'text-purple-600' : 'text-slate-500 group-hover:text-purple-600'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
                  </svg>
                </div>
                <span class="truncate">{{ item.name }}</span>
                <div v-if="item.status" class="ml-auto">
                  <div class="w-2 h-2 rounded-full" :class="item.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'"></div>
                </div>
              </router-link>
            </div>
          </div>
        </nav>
        
        <!-- Enhanced Quick Actions Section with Real Data -->
        <div class="border-t border-gray-200">
          <button 
            @click="toggleSection('quickActions')"
            class="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <h3 class="text-sm font-semibold text-slate-700">Quick Actions</h3>
              <div class="w-4 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full ml-2"></div>
            </div>
            <svg 
              class="w-4 h-4 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': expandedSections.quickActions }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div 
            v-show="expandedSections.quickActions"
            class="p-3 sm:p-4 pt-0 bg-gradient-to-r from-slate-50 to-emerald-50 transition-all duration-300"
            :class="{ 'animate-slide-down': expandedSections.quickActions }"
          >
            <button
              @click="showAddTransactionModal"
              class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 focus-ring text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div class="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mr-2">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <span>Add Transaction</span>
            </button>
            
            <!-- Real Data Quick Stats -->
            <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div class="bg-white rounded-lg p-2 text-center border border-emerald-100 hover:shadow-sm transition-all duration-300 cursor-pointer"
                   @click="navigateToTransactions('income')">
                <p class="text-emerald-600 font-semibold">${{ formatCurrency(realTotalIncome) }}</p>
                <p class="text-slate-500">Income</p>
                <div class="mt-1 text-xs text-emerald-500">{{ incomeTransactionCount }} items</div>
              </div>
              <div class="bg-white rounded-lg p-2 text-center border border-red-100 hover:shadow-sm transition-all duration-300 cursor-pointer"
                   @click="navigateToTransactions('expense')">
                <p class="text-red-600 font-semibold">${{ formatCurrency(realTotalExpenses) }}</p>
                <p class="text-slate-500">Expenses</p>
                <div class="mt-1 text-xs text-red-500">{{ expenseTransactionCount }} items</div>
              </div>
            </div>
            
            <!-- Balance and Transaction Count -->
            <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div class="bg-white rounded-lg p-2 text-center border border-blue-100 hover:shadow-sm transition-all duration-300 cursor-pointer"
                   @click="navigateToTransactions()">
                <p class="text-blue-600 font-semibold">{{ totalTransactionCount }}</p>
                <p class="text-slate-500">Total</p>
              </div>
              <div class="bg-white rounded-lg p-2 text-center border hover:shadow-sm transition-all duration-300" 
                   :class="realBalance >= 0 ? 'border-emerald-100' : 'border-red-100'">
                <p class="font-semibold" :class="realBalance >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  ${{ formatCurrency(Math.abs(realBalance)) }}
                </p>
                <p class="text-slate-500">Balance</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced User Profile -->
        <div class="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-sm font-bold">
                  {{ getUserInitials(user) }}
                </span>
              </div>
            </div>
            <div class="ml-3 min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-700 truncate">
                {{ user?.firstName || 'User' }} {{ user?.lastName || '' }}
              </p>
              <p class="text-xs text-slate-500 truncate">
                {{ user?.email || 'user@example.com' }}
              </p>
              <div class="flex items-center mt-1">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                <span class="text-xs text-green-600">Active</span>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <button
                @click="openSettings"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-ring transition-all duration-300"
                title="Settings"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
              <button
                @click="logout"
                class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 focus-ring transition-all duration-300"
                title="Sign out"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Mobile Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
      @click="$emit('close')"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Props and emits
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentRoute: { type: String, default: '' },
  user: { type: Object, default: () => ({}) },
  transactionStore: { type: Object, default: null }
})

const emit = defineEmits(['close', 'show-add-transaction'])

// Router
const route = useRoute()
const router = useRouter()

// Use the transaction store passed as prop
const transactionStore = props.transactionStore

// Foldable sections state
const expandedSections = ref({
  dashboard: true,
  transactions: true,
  planning: false,
  quickActions: true,
  upgrade: false
})

// Real data computed properties - safely access store data
const realTotalIncome = computed(() => {
  if (!transactionStore) return 0
  return typeof transactionStore.totalIncome === 'function' 
    ? transactionStore.totalIncome() 
    : transactionStore.totalIncome || 0
})

const realTotalExpenses = computed(() => {
  if (!transactionStore) return 0
  return typeof transactionStore.totalExpenses === 'function' 
    ? transactionStore.totalExpenses() 
    : transactionStore.totalExpenses || 0
})

const realBalance = computed(() => {
  if (!transactionStore) return 0
  return typeof transactionStore.balance === 'function' 
    ? transactionStore.balance() 
    : transactionStore.balance || 0
})

const totalTransactionCount = computed(() => {
  if (!transactionStore || !transactionStore.transactions) return 0
  return Array.isArray(transactionStore.transactions) 
    ? transactionStore.transactions.length 
    : 0
})

const incomeTransactionCount = computed(() => {
  if (!transactionStore || !transactionStore.transactions) return 0
  if (!Array.isArray(transactionStore.transactions)) return 0
  return transactionStore.transactions.filter(t => t.type === 'income').length
})

const expenseTransactionCount = computed(() => {
  if (!transactionStore || !transactionStore.transactions) return 0
  if (!Array.isArray(transactionStore.transactions)) return 0
  return transactionStore.transactions.filter(t => t.type === 'expense').length
})

// Navigation links with real counts
const transactionLinks = computed(() => [
  {
    name: 'All Transactions',
    to: '/transactions',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    count: totalTransactionCount.value,
    type: 'all'
  },
  {
    name: 'Income',
    to: { path: '/transactions', query: { type: 'income' } },
    icon: 'M7 11l5-5m0 0l5 5m-5-5v12',
    count: incomeTransactionCount.value,
    type: 'income'
  },
  {
    name: 'Expenses',
    to: { path: '/transactions', query: { type: 'expense' } },
    icon: 'M17 13l-5 5m0 0l-5-5m5 5V6',
    count: expenseTransactionCount.value,
    type: 'expense'
  },
  {
    name: 'Categories',
    to: '/categories',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  }
])

const dashboardLinks = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    badge: 'New'
  },
  {
    name: 'Analytics',
    to: '/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'Reports',
    to: '/reports',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
]

const planningLinks = [
  {
    name: 'Budgets',
    to: '/budgets',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    status: 'active'
  },
  {
    name: 'Goals',
    to: '/goals',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    status: 'pending'
  },
  {
    name: 'Calendar',
    to: '/calendar',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
]

// Methods
const toggleSection = (sectionName) => {
  expandedSections.value[sectionName] = !expandedSections.value[sectionName]
  localStorage.setItem('sidebar-sections', JSON.stringify(expandedSections.value))
}

const isActiveRoute = (to) => {
  if (typeof to === 'string') {
    return route.path === to || route.path.startsWith(`${to}/`)
  } else if (typeof to === 'object' && to.path) {
    if (route.path === to.path) {
      if (to.query) {
        return Object.keys(to.query).every(key => route.query[key] === to.query[key])
      }
      return true
    }
    return route.path.startsWith(`${to.path}/`)
  }
  return false
}

const getCountBadgeClass = (type) => {
  switch (type) {
    case 'income':
      return 'bg-emerald-100 text-emerald-800'
    case 'expense':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getUserInitials = (user) => {
  if (!user || (!user.firstName && !user.lastName)) return 'U'
  const firstInitial = user.firstName ? user.firstName.charAt(0) : ''
  const lastInitial = user.lastName ? user.lastName.charAt(0) : ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(amount || 0))
}

const navigateToTransactions = (filter = null) => {
  if (filter) {
    router.push({ path: '/transactions', query: { type: filter } })
  } else {
    router.push('/transactions')
  }
}

const showAddTransactionModal = () => {
  emit('show-add-transaction')
}

const openSettings = () => {
  router.push('/settings')
}

const logout = () => {
  router.push('/login')
}

// Initialize sections on mount
onMounted(() => {
  const saved = localStorage.getItem('sidebar-sections')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      expandedSections.value = { ...expandedSections.value, ...parsed }
    } catch (e) {
      console.warn('Failed to parse saved sidebar state')
    }
  }
})
</script>

<style scoped>
/* Enhanced animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out forwards;
}

nav > div > a {
  animation: slideInLeft 0.3s ease-out forwards;
  opacity: 0;
}

/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}

nav::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

/* Focus styles */
.focus-ring:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 8px;
}

/* Hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
  
  aside {
    width: 280px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>