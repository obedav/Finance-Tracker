<!-- Enhanced Dashboard.vue with Mobile-First Responsive Design -->
<template>
  <div class="min-h-screen bg-cream relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container-app relative z-10 p-3 sm:p-4 lg:p-6">
      <!-- Mobile-First Enhanced Header -->
      <div class="mb-6 sm:mb-8 animate-fade-in">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 mb-1 sm:mb-2">
              Welcome back! 👋
            </h1>
            <p class="text-slate-500 text-sm sm:text-base lg:text-lg">Here's your financial overview</p>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div class="glass-strong px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <span class="text-xs sm:text-sm text-slate-600">Last updated: {{ lastUpdated }}</span>
            </div>
            <button 
              @click="refreshData"
              class="btn btn-outline btn-sm hover-scale w-full sm:w-auto"
              :class="{ 'animate-spin': isRefreshing }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span class="ml-2">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile-First Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <!-- Total Income Card -->
        <div class="dashboard-card hover-lift group cursor-pointer" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-xs sm:text-sm font-medium text-slate-500">Total Income</p>
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <p class="text-gradient-emerald text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">
                {{ formatCurrency(transactionStore.totalIncome) }}
              </p>
              <p class="text-xs text-emerald-600 flex items-center gap-1">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                <span class="truncate">+{{ incomePercentageChange }}% this month</span>
              </p>
            </div>
            <div class="category-icon category-icon-income group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 flex-shrink-0 ml-2 sm:ml-4">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="mt-3 sm:mt-4 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${Math.min((transactionStore.totalIncome / 10000) * 100, 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Total Expenses Card -->
        <div class="dashboard-card hover-lift group cursor-pointer" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-xs sm:text-sm font-medium text-slate-500">Total Expenses</p>
                <div class="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
              </div>
              <p class="text-gradient-gold text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">
                {{ formatCurrency(transactionStore.totalExpenses) }}
              </p>
              <p class="text-xs text-gold-600 flex items-center gap-1">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
                <span class="truncate">{{ expensePercentageChange }}% this month</span>
              </p>
            </div>
            <div class="category-icon category-icon-expense group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 flex-shrink-0 ml-2 sm:ml-4">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="mt-3 sm:mt-4 w-full bg-gold-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${Math.min((transactionStore.totalExpenses / 10000) * 100, 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Balance Card -->
        <div class="dashboard-card hover-lift group cursor-pointer sm:col-span-2 lg:col-span-1" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-xs sm:text-sm font-medium text-slate-500">Net Balance</p>
                <div class="w-2 h-2 rounded-full animate-pulse" :class="balanceColor.replace('text-', 'bg-')"></div>
              </div>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate" :class="balanceColor">
                {{ formatCurrency(Math.abs(transactionStore.balance)) }}
              </p>
              <p class="text-xs flex items-center gap-1" :class="balanceColor">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="truncate">{{ transactionStore.balance >= 0 ? 'Positive' : 'Negative' }} balance</span>
              </p>
            </div>
            <div class="category-icon category-icon-income group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 flex-shrink-0 ml-2 sm:ml-4">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <!-- Dynamic Progress Bar -->
          <div class="mt-3 sm:mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :class="transactionStore.balance >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'"
              :style="{ width: `${Math.min(Math.abs(transactionStore.balance / 1000) * 10, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Mobile-First Quick Actions & Recent Transactions -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Mobile-Optimized Quick Actions -->
        <div class="dashboard-card xl:col-span-1">
          <h3 class="text-lg sm:text-xl font-semibold text-slate-700 mb-4 sm:mb-6 flex items-center gap-2">
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="truncate">Quick Actions</span>
          </h3>
          <div class="space-y-2 sm:space-y-3">
            <button 
              @click="showTransactionModal = true"
              class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex items-center justify-center gap-2 sm:gap-3"
            >
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <span class="text-sm sm:text-base">Add Transaction</span>
            </button>
            
            <button 
              @click="$router.push('/reports')"
              class="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex items-center justify-center gap-2 sm:gap-3"
            >
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <span class="text-sm sm:text-base">View Reports</span>
            </button>
            
            <button 
              @click="$router.push('/transactions')"
              class="w-full bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex items-center justify-center gap-2 sm:gap-3"
            >
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span class="text-sm sm:text-base">View All Transactions</span>
            </button>
          </div>
        </div>

        <!-- Mobile-Optimized Recent Transactions -->
        <div class="dashboard-card xl:col-span-2">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-semibold text-slate-700 flex items-center gap-2">
              <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span class="truncate">Recent Transactions</span>
            </h3>
            <router-link 
              to="/transactions"
              class="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm font-medium transition-colors hover:scale-105 flex items-center gap-1"
            >
              <span class="hidden sm:inline">View all</span>
              <span class="sm:hidden">All</span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <div v-if="recentTransactions.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-slate-500 font-semibold text-base sm:text-lg">No transactions yet</p>
            <p class="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">Add your first transaction to get started</p>
            <button 
              @click="showTransactionModal = true"
              class="mt-3 sm:mt-4 btn btn-primary btn-sm hover-scale"
            >
              Add Transaction
            </button>
          </div>
          
          <div v-else class="space-y-2 sm:space-y-3 max-h-72 sm:max-h-96 overflow-y-auto">
            <div 
              v-for="(transaction, index) in recentTransactions" 
              :key="transaction.id"
              class="transaction-item hover-scale group relative overflow-hidden p-3 sm:p-4"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <!-- Animated background effect -->
              <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   :class="transaction.type === 'income' ? 'from-emerald-50 to-emerald-100' : 'from-gold-50 to-gold-100'">
              </div>
              
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div 
                    class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    :class="transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-gold-100 text-gold-600'"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            :d="transaction.type === 'income' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'">
                      </path>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors text-sm sm:text-base truncate">
                      {{ transaction.category }}
                    </p>
                    <p class="text-xs sm:text-sm text-slate-500 truncate">
                      {{ transaction.description || 'No description' }}
                    </p>
                    <p class="text-xs text-slate-400 mt-1">{{ formatDate(transaction.createdAt) }}</p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <p 
                    class="font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 group-hover:scale-105"
                    :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-gold-600'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile-First Monthly Overview -->
      <div class="dashboard-card">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-semibold text-slate-700 flex items-center gap-2">
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="truncate">This Month Overview</span>
          </h3>
          <span class="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 rounded-full">
            {{ currentMonth }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover-lift group cursor-pointer border border-emerald-200">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
            </div>
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">
              {{ currentMonthTransactions.filter(t => t.type === 'income').length }}
            </div>
            <p class="text-xs sm:text-sm text-emerald-700 font-medium">Income Transactions</p>
          </div>
          
          <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl hover-lift group cursor-pointer border border-gold-200">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
            </div>
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-gold-600 group-hover:scale-110 transition-transform">
              {{ currentMonthTransactions.filter(t => t.type === 'expense').length }}
            </div>
            <p class="text-xs sm:text-sm text-gold-700 font-medium">Expense Transactions</p>
          </div>
          
          <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover-lift group cursor-pointer border border-blue-200">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
              {{ currentMonthTransactions.length }}
            </div>
            <p class="text-xs sm:text-sm text-blue-700 font-medium">Total Transactions</p>
          </div>
          
          <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover-lift group cursor-pointer border border-purple-200">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform">
              {{ savingsRate }}%
            </div>
            <p class="text-xs sm:text-sm text-purple-700 font-medium">Savings Rate</p>
          </div>
        </div>
      </div>
    </div>

    <!-- DashboardModal Component -->
    <DashboardModal 
      :is-open="showTransactionModal" 
      @close="showTransactionModal = false"
      @submit="handleTransactionSubmit"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '../stores/transactions'
import DashboardModal from '../components/DashboardModal.vue'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const transactionStore = useTransactionStore()
const showTransactionModal = ref(false)
const isRefreshing = ref(false)
const lastUpdated = ref(new Date().toLocaleTimeString())
const { formatCurrency: formatCurrencyFromSettings } = useFormatters()

// Computed properties for enhanced features
const balanceColor = computed(() => {
  return transactionStore.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
})

const recentTransactions = computed(() => {
  return transactionStore.transactions
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
})

const currentMonthTransactions = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return transactionStore.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt || transaction.date)
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })
})

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const savingsRate = computed(() => {
  const income = transactionStore.totalIncome
  const expenses = transactionStore.totalExpenses
  
  if (income === 0) return 0
  
  return Math.round(((income - expenses) / income) * 100)
})

// Mock percentage changes for demo purposes
const incomePercentageChange = computed(() => {
  // In a real app, this would compare with previous month
  return Math.floor(Math.random() * 20) + 5
})

const expensePercentageChange = computed(() => {
  // In a real app, this would compare with previous month
  return Math.floor(Math.random() * 15) + 2
})

// Helper functions
const formatCurrency = (amount) => {
  // Use the settings-aware formatter
  return formatCurrencyFromSettings.value(Math.abs(amount))
}

const formatDate = (date) => {
  const transactionDate = new Date(date)
  const now = new Date()
  const diffInDays = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return transactionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
}

// Interactive functions
const animateCard = (event) => {
  const card = event.currentTarget
  card.style.transform = 'scale(0.98)'
  setTimeout(() => {
    card.style.transform = ''
  }, 150)
}

const refreshData = async () => {
  isRefreshing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  lastUpdated.value = new Date().toLocaleTimeString()
  isRefreshing.value = false
  
  // Show success feedback
  showNotification('Data refreshed successfully!', 'success')
}

const handleTransactionSubmit = (transactionData) => {
  try {
    // Add transaction to store
    transactionStore.addTransaction(transactionData)
    
    // Close modal
    showTransactionModal.value = false
    
    // Show success notification
    showNotification('Transaction added successfully!', 'success')
    
    // Update last updated time
    lastUpdated.value = new Date().toLocaleTimeString()
    
    console.log('Transaction added:', transactionData)
  } catch (error) {
    console.error('Error adding transaction:', error)
    showNotification('Failed to add transaction. Please try again.', 'error')
  }
}

const showNotification = (message, type = 'info') => {
  // In a real app, you'd integrate with a toast notification system
  console.log(`${type.toUpperCase()}: ${message}`)
  
  // For now, you can add a simple toast notification here
  // or integrate with vue-toastification if available
}

// Lifecycle hooks
onMounted(async () => {
  console.log('Enhanced Dashboard mounted with DashboardModal!')
  
  // Initialize transaction store if needed
  await transactionStore.initializeStore()
  
  // Set initial last updated time
  lastUpdated.value = new Date().toLocaleTimeString()
})
</script>

<style scoped>
/* Mobile-First Responsive Styles */

/* Custom animations for this component */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.animate-fade-in {
  animation: fadeInScale 0.6s ease-out;
}

.animate-slide-up {
  animation: slideInUp 0.5s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Enhanced hover effects - Mobile-first */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Only apply hover effects on devices that support hover */
@media (hover: hover) {
  .hover-scale:hover {
    transform: scale(1.02);
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
  }
}

/* Glass morphism enhancement */
.glass-strong {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
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

/* Category icon responsive sizing */
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

/* Transaction item mobile-first */
.transaction-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .transaction-item {
    border-radius: 1rem;
  }
}

.transaction-item:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button styles - Mobile-first */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
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

.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: #64748b;
  border: 2px solid rgba(100, 116, 139, 0.2);
}

.btn-outline:hover {
  background: rgba(100, 116, 139, 0.1);
  border-color: rgba(100, 116, 139, 0.3);
  color: #475569;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* Custom scrollbar for transaction list */
.transaction-item::-webkit-scrollbar {
  width: 4px;
}

.transaction-item::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.transaction-item::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 2px;
}

.transaction-item::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

/* Gold color utilities for Tailwind compatibility */
.text-gold-600 {
  color: #d97706;
}

.bg-gold-500 {
  background-color: #f59e0b;
}

.bg-gold-100 {
  background-color: #fef3c7;
}

.from-gold-400 {
  --tw-gradient-from: #fbbf24;
}

.to-gold-600 {
  --tw-gradient-to: #d97706;
}

.from-gold-50 {
  --tw-gradient-from: #fffbeb;
}

.to-gold-100 {
  --tw-gradient-to: #fef3c7;
}

.from-gold-500 {
  --tw-gradient-from: #f59e0b;
}

.to-gold-600 {
  --tw-gradient-to: #d97706;
}

.hover\:from-gold-600:hover {
  --tw-gradient-from: #d97706;
}

.hover\:to-gold-700:hover {
  --tw-gradient-to: #b45309;
}

.border-gold-200 {
  border-color: #fde68a;
}

.text-gold-700 {
  color: #b45309;
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

/* Container responsive styles */
.container-app {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
}

/* Focus improvements for keyboard navigation */
button:focus,
.router-link:focus {
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
  
  .glass-strong {
    background: white !important;
    backdrop-filter: none !important;
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
  .hover-lift:hover {
    transform: translateY(-4px);
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
  }
}
</style>