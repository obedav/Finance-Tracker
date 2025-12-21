<!-- Categories.vue - Mobile-First Responsive Design -->
<template>
  <div class="min-h-screen bg-cream dark:bg-neutral-900 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container-app relative z-10 p-3 sm:p-4 lg:p-6">
      <!-- Mobile-First Enhanced Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in">
        <div class="flex items-center">
          <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 lg:mr-6 shadow-glow-primary animate-float">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 mb-1 sm:mb-2">Categories</h1>
            <p class="text-sm sm:text-base lg:text-lg text-slate-500">Organize your financial transactions efficiently</p>
          </div>
        </div>
        <button 
          @click="openCategoryModal()"
          class="btn btn-primary hover-lift shadow-glow-primary group w-full sm:w-auto"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Category
        </button>
      </div>

      <!-- Mobile-First Category Type Tabs -->
      <div class="dashboard-card mb-6 sm:mb-8">
        <div class="flex space-x-1 sm:space-x-2 bg-cream/60 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
          <button
            @click="activeTab = 'income'"
            :class="[
              'flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-md sm:rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group text-sm sm:text-base',
              activeTab === 'income' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow-primary transform scale-105' 
                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
            ]"
          >
            <div class="flex items-center justify-center relative z-10">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
              <span class="hidden sm:inline">Income Categories</span>
              <span class="sm:hidden">Income</span>
            </div>
            <div v-if="activeTab !== 'income'" class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            @click="activeTab = 'expense'"
            :class="[
              'flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-md sm:rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group text-sm sm:text-base',
              activeTab === 'expense' 
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-glow-secondary transform scale-105' 
                : 'text-slate-500 hover:text-gold-600 hover:bg-gold-50'
            ]"
          >
            <div class="flex items-center justify-center relative z-10">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
              <span class="hidden sm:inline">Expense Categories</span>
              <span class="sm:hidden">Expenses</span>
            </div>
            <div v-if="activeTab !== 'expense'" class="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-gold-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      <!-- Mobile-First Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
        <div 
          v-for="(category, index) in filteredCategories" 
          :key="category.name"
          class="dashboard-card card-interactive group cursor-pointer"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex items-start justify-between mb-4 sm:mb-6">
            <div class="flex items-center flex-1 min-w-0">
              <div 
                :class="[
                  'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 transition-all duration-500 flex-shrink-0',
                  activeTab === 'income' 
                    ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300' 
                    : 'bg-gradient-to-br from-gold-100 to-gold-200 group-hover:from-gold-200 group-hover:to-gold-300'
                ]"
              >
                <svg 
                  :class="[
                    'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12',
                    activeTab === 'income' ? 'text-emerald-600' : 'text-gold-600'
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    :d="category.icon"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-slate-700 text-base sm:text-lg mb-1 group-hover:text-emerald-600 transition-colors truncate">{{ category.name }}</h3>
                <p class="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">{{ category.description }}</p>
              </div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-1 sm:gap-2 ml-2">
              <button 
                @click.stop="editCategory(category)"
                class="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110"
                title="Edit Category"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                @click.stop="deleteCategory(category)"
                class="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110"
                title="Delete Category"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <div class="text-center p-2 sm:p-3 bg-cream/60 rounded-md sm:rounded-lg group-hover:bg-white transition-colors">
                <div class="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 mb-1">{{ category.transactionCount }}</div>
                <div class="text-xs text-slate-500 font-medium">Transactions</div>
              </div>
              <div class="text-center p-2 sm:p-3 bg-cream/60 rounded-md sm:rounded-lg group-hover:bg-white transition-colors">
                <div 
                  :class="[
                    'text-lg sm:text-xl lg:text-2xl font-bold mb-1 truncate',
                    activeTab === 'income' ? 'text-emerald-600' : 'text-gold-600'
                  ]"
                >
                  ${{ formatCurrency(category.totalAmount) }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Total Amount</div>
              </div>
            </div>
            
            <!-- Mobile-First Progress Bar -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm font-medium text-slate-600">Usage</span>
                <span class="text-xs sm:text-sm font-bold text-slate-700">{{ category.percentage }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  :class="[
                    'h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden',
                    activeTab === 'income' 
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                      : 'bg-gradient-to-r from-gold-400 to-gold-600'
                  ]"
                  :style="`width: ${category.percentage}%`"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile-First Usage Statistics -->
      <div class="dashboard-card">
        <div class="flex items-center mb-6 sm:mb-8">
          <div class="category-icon category-icon-income mr-3 sm:mr-4">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-700">Category Analytics</h3>
            <p class="text-slate-500 text-sm sm:text-base">Insights into your category usage and spending patterns</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <!-- Most Used Categories -->
          <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between">
              <h4 class="text-base sm:text-lg font-bold text-slate-700">Most Active Categories</h4>
              <span class="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 rounded-full">Top 5</span>
            </div>
            <div class="space-y-3 sm:space-y-4">
              <div 
                v-for="(category, index) in topCategories" 
                :key="category.name"
                class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg sm:rounded-xl hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 hover:shadow-md group cursor-pointer"
              >
                <div class="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-md sm:rounded-lg mr-3 sm:mr-4 font-bold text-xs sm:text-sm group-hover:scale-110 transition-transform">
                  {{ index + 1 }}
                </div>
                <div class="flex items-center flex-1 min-w-0">
                  <div 
                    :class="[
                      'w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 transition-all duration-300 group-hover:scale-125 flex-shrink-0',
                      category.type === 'income' ? 'bg-emerald-500' : 'bg-gold-500'
                    ]"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <span class="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors text-sm sm:text-base truncate block">{{ category.name }}</span>
                    <div class="text-xs sm:text-sm text-slate-500">{{ category.type }} category</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-slate-700 text-sm sm:text-base">{{ category.transactionCount }}</div>
                  <div class="text-xs text-slate-500">transactions</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Breakdown Stats -->
          <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between">
              <h4 class="text-base sm:text-lg font-bold text-slate-700">Category Overview</h4>
              <span class="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 rounded-full">Summary</span>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:gap-4">
              <div class="stat-card group">
                <div class="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm text-slate-600 font-medium">Income Categories</div>
                      <div class="text-xl sm:text-2xl font-bold text-emerald-600">{{ incomeCategories.length }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card group">
                <div class="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg sm:rounded-xl border border-gold-200 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm text-slate-600 font-medium">Expense Categories</div>
                      <div class="text-xl sm:text-2xl font-bold text-gold-600">{{ expenseCategories.length }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card group">
                <div class="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm text-slate-600 font-medium">Most Active</div>
                      <div class="text-base sm:text-lg font-bold text-blue-600 truncate">{{ mostActiveCategory?.name || 'None' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card group">
                <div class="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg sm:rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs sm:text-sm text-slate-600 font-medium">Average per Category</div>
                      <div class="text-base sm:text-lg font-bold text-purple-600">${{ formatCurrency(averagePerCategory) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal Component -->
    <CategoryModal
      :isVisible="showCategoryModal"
      :category="editingCategory"
      :type="categoryModalType"
      @close="closeCategoryModal"
      @submit="handleCategorySubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transactions'
import CategoryModal from '../components/CategoryModal.vue'

const transactionStore = useTransactionStore()
const showCategoryModal = ref(false)
const activeTab = ref('expense')
const editingCategory = ref(null)
const categoryModalType = ref('expense')

// Default categories with enhanced data
const defaultCategories = {
  income: [
    { 
      name: 'Salary', 
      description: 'Regular employment income and wages', 
      icon: 'M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z' 
    },
    { 
      name: 'Freelance', 
      description: 'Freelance projects and contract work', 
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' 
    },
    { 
      name: 'Business', 
      description: 'Business revenue and profits', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' 
    },
    { 
      name: 'Investment', 
      description: 'Investment returns, dividends, and capital gains', 
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' 
    },
    { 
      name: 'Gift', 
      description: 'Gifts and monetary presents received', 
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' 
    },
    { 
      name: 'Other', 
      description: 'Miscellaneous income sources', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' 
    }
  ],
  expense: [
    { 
      name: 'Food & Dining', 
      description: 'Restaurants, groceries, and food delivery', 
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' 
    },
    { 
      name: 'Transportation', 
      description: 'Gas, public transport, car maintenance', 
      icon: 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h3m10 0h3m-17 3h18' 
    },
    { 
      name: 'Shopping', 
      description: 'Clothing, electronics, personal items', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z' 
    },
    { 
      name: 'Entertainment', 
      description: 'Movies, games, subscriptions, hobbies', 
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      name: 'Bills & Utilities', 
      description: 'Rent, electricity, internet, phone bills', 
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' 
    },
    { 
      name: 'Healthcare', 
      description: 'Medical expenses, insurance, pharmacy', 
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' 
    },
    { 
      name: 'Education', 
      description: 'Books, courses, training, tuition', 
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' 
    },
    { 
      name: 'Other', 
      description: 'Miscellaneous and uncategorized expenses', 
      icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z' 
    }
  ]
}

const incomeCategories = computed(() => {
  return defaultCategories.income.map(cat => ({
    ...cat,
    type: 'income',
    transactionCount: getTransactionCount(cat.name, 'income'),
    totalAmount: getTotalAmount(cat.name, 'income'),
    percentage: getPercentage(cat.name, 'income')
  }))
})

const expenseCategories = computed(() => {
  return defaultCategories.expense.map(cat => ({
    ...cat,
    type: 'expense',
    transactionCount: getTransactionCount(cat.name, 'expense'),
    totalAmount: getTotalAmount(cat.name, 'expense'),
    percentage: getPercentage(cat.name, 'expense')
  }))
})

const filteredCategories = computed(() => {
  return activeTab.value === 'income' ? incomeCategories.value : expenseCategories.value
})

const topCategories = computed(() => {
  const allCategories = [...incomeCategories.value, ...expenseCategories.value]
  return allCategories
    .filter(cat => cat.transactionCount > 0)
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, 5)
})

const mostActiveCategory = computed(() => {
  const allCategories = [...incomeCategories.value, ...expenseCategories.value]
  return allCategories.reduce((max, cat) => 
    cat.transactionCount > (max?.transactionCount || 0) ? cat : max, null
  )
})

const averagePerCategory = computed(() => {
  const allCategories = [...incomeCategories.value, ...expenseCategories.value]
  const activeCategories = allCategories.filter(cat => cat.transactionCount > 0)
  
  if (activeCategories.length === 0) return 0
  
  const totalAmount = activeCategories.reduce((sum, cat) => sum + cat.totalAmount, 0)
  return totalAmount / activeCategories.length
})

// Utility functions
const getTransactionCount = (categoryName, type) => {
  return transactionStore.transactions.filter(t => 
    t.category === categoryName && t.type === type
  ).length
}

const getTotalAmount = (categoryName, type) => {
  return transactionStore.transactions
    .filter(t => t.category === categoryName && t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)
}

const getPercentage = (categoryName, type) => {
  const categoryTotal = getTotalAmount(categoryName, type)
  const typeTotal = type === 'income' ? transactionStore.totalIncome : transactionStore.totalExpenses
  
  if (typeTotal === 0) return 0
  return Math.round((categoryTotal / typeTotal) * 100)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

// Modal management functions
const openCategoryModal = (type = null) => {
  editingCategory.value = null
  categoryModalType.value = type || activeTab.value
  showCategoryModal.value = true
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryModalType.value = category.type
  showCategoryModal.value = true
}

const deleteCategory = (category) => {
  if (confirm(`Are you sure you want to delete the "${category.name}" category? This action cannot be undone.`)) {
    console.log('Deleting category:', category.name)
    // In a real app, you would delete from the backend and update the store
    // transactionStore.deleteCategory(category.id)
    // toast.success('Category deleted successfully!')
  }
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
  categoryModalType.value = 'expense'
}

const handleCategorySubmit = (categoryData) => {
  console.log('Category submitted:', categoryData)
  
  // In a real app, you would:
  // 1. Save to backend/store
  // 2. Update the categories list
  // 3. Show success message
  
  if (editingCategory.value) {
    // Update existing category
    console.log('Updating category:', editingCategory.value.name, 'with new data:', categoryData)
    // transactionStore.updateCategory(editingCategory.value.id, categoryData)
    // toast.success('Category updated successfully!')
  } else {
    // Create new category
    console.log('Creating new category:', categoryData)
    // transactionStore.addCategory(categoryData)
    // toast.success('Category created successfully!')
  }
  
  closeCategoryModal()
}
</script>

<style scoped>
/* Mobile-First Responsive Styles */

/* Animation keyframes */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animation classes */
.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}

/* Utility classes - Mobile-first */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-scale {
  transition: transform 0.2s ease;
}

/* Only apply hover effects on devices that support hover */
@media (hover: hover) {
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
}

/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Container responsive styles */
.container-app {
  max-width: 80rem;
  margin: 0 auto;
}

/* Dashboard card responsive styles */
.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .dashboard-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-card {
    padding: 2rem;
  }
}

.card-interactive {
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fade-in 0.6s ease-out forwards;
}

.card-interactive:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* Category icon responsive styles */
.category-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .category-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
  }
}

.category-icon-income {
  background: linear-gradient(135deg, #10b981, #059669);
}

.category-icon-expense {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

/* Button styles - Mobile-first */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
  }
}

@media (min-width: 1024px) {
  .btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

/* Color utilities */
.bg-cream {
  background-color: #fefcf3;
}

.text-gradient-emerald {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gold color utilities for Tailwind compatibility */
.text-gold-600 {
  color: #d97706;
}

.bg-gold-50 {
  background-color: #fffbeb;
}

.bg-gold-100 {
  background-color: #fef3c7;
}

.bg-gold-200 {
  background-color: #fde68a;
}

.bg-gold-500 {
  background-color: #f59e0b;
}

.from-gold-50 {
  --tw-gradient-from: #fffbeb;
}

.to-gold-100 {
  --tw-gradient-to: #fef3c7;
}

.from-gold-100 {
  --tw-gradient-from: #fef3c7;
}

.to-gold-200 {
  --tw-gradient-to: #fde68a;
}

.from-gold-200 {
  --tw-gradient-from: #fde68a;
}

.to-gold-300 {
  --tw-gradient-to: #fcd34d;
}

.from-gold-400 {
  --tw-gradient-from: #fbbf24;
}

.to-gold-600 {
  --tw-gradient-to: #d97706;
}

.from-gold-500 {
  --tw-gradient-from: #f59e0b;
}

.border-gold-200 {
  border-color: #fde68a;
}

.text-gold-700 {
  color: #b45309;
}

.hover\:text-gold-600:hover {
  color: #d97706;
}

.hover\:bg-gold-50:hover {
  background-color: #fffbeb;
}

/* Shadow utilities */
.shadow-glow-primary {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.shadow-glow-secondary {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

/* Focus improvements for keyboard navigation */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Enhanced button states */
button:active {
  transform: scale(0.98);
}

/* Print styles */
@media print {
  .hover-lift,
  .hover-scale,
  .animate-float {
    transform: none !important;
    animation: none !important;
  }
  
  .dashboard-card::before {
    display: none !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  .animate-float,
  .hover-lift,
  .hover-scale {
    animation: none !important;
    transition: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .dashboard-card {
    border: 2px solid #000;
  }
  
  .text-slate-400 {
    color: #666;
  }
  
  .text-slate-500 {
    color: #555;
  }
  
  .text-slate-600 {
    color: #333;
  }
}

/* Extra small screens (320px and up) */
@media (min-width: 320px) {
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* Large screens optimization */
@media (min-width: 1024px) {
  .card-interactive:hover {
    transform: translateY(-5px);
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
  }
}
</style>