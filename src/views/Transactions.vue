<!-- Transactions.vue - Complete and Fixed -->
<template>
  <div class="min-h-screen bg-cream dark:bg-neutral-900 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/10 to-gold-600/10 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container-app relative z-10 p-6">
      <!-- Enhanced Header with Dynamic Title -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-fade-in">
        <div>
          <h1 class="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-2 flex items-center gap-3 transition-colors">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            {{ pageTitle }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-lg transition-colors">{{ pageDescription }}</p>
          
          <!-- Breadcrumb for filtered views -->
          <div v-if="currentFilter" class="mt-2 flex items-center gap-2 text-sm">
            <router-link to="/transactions" class="text-slate-400 hover:text-emerald-600 transition-colors">
              All Transactions
            </router-link>
            <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span class="text-emerald-600 font-medium capitalize">{{ currentFilter }}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Filter Pills for Quick Access -->
          <div class="hidden md:flex items-center gap-2">
            <button 
              @click="clearTypeFilter"
              :class="filterPillClass(!currentFilter)"
            >
              All
            </button>
            <button 
              @click="setTypeFilter('income')"
              :class="filterPillClass(currentFilter === 'income', 'emerald')"
            >
              Income
            </button>
            <button 
              @click="setTypeFilter('expense')"
              :class="filterPillClass(currentFilter === 'expense', 'red')"
            >
              Expenses
            </button>
          </div>

          <!-- Export Button -->
          <button 
            @click="exportTransactions"
            class="glass-strong px-4 py-2 rounded-xl text-slate-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export
          </button>

          <!-- Add Transaction Button -->
          <button 
            @click="showTransactionModal = true"
            class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-3 group"
          >
            <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            Add Transaction
          </button>
        </div>
      </div>

      <!-- Enhanced Quick Stats with Real Data -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Income -->
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
             @click="setTypeFilter('income')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Income</p>
              <p class="text-2xl font-bold text-emerald-600">${{ formatCurrency(realTotalIncome) }}</p>
              <p class="text-xs text-slate-500">{{ incomeTransactionsCount }} transactions</p>
            </div>
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
             @click="setTypeFilter('expense')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Expenses</p>
              <p class="text-2xl font-bold text-red-600">${{ formatCurrency(realTotalExpenses) }}</p>
              <p class="text-xs text-slate-500">{{ expenseTransactionsCount }} transactions</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Filtered Results Count -->
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
             @click="clearFilters">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">
                {{ currentFilter ? `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Results` : 'Total Transactions' }}
              </p>
              <p class="text-2xl font-bold text-blue-600">{{ filteredTransactions.length }}</p>
              <p class="text-xs text-slate-500">{{ currentFilter ? `Filtered from ${allTransactions.length}` : 'All time' }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Real Balance -->
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Net Balance</p>
              <p class="text-2xl font-bold" :class="realBalance >= 0 ? 'text-emerald-600' : 'text-red-600'">
                ${{ formatCurrency(Math.abs(realBalance)) }}
              </p>
              <p class="text-xs text-slate-500">{{ realBalance >= 0 ? 'Positive' : 'Negative' }} balance</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                 :class="realBalance >= 0 ? 'bg-emerald-100' : 'bg-red-100'">
              <svg class="w-6 h-6" :class="realBalance >= 0 ? 'text-emerald-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters - Simplified -->
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-700">Filters</h3>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option v-for="category in realCategories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input v-model="filters.fromDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input v-model="filters.toDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>
        </div>

        <!-- Search -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input v-model="filters.search" type="text" placeholder="Search descriptions..." class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>
        </div>

        <!-- Quick Filter Buttons -->
        <div class="flex flex-wrap gap-2">
          <button @click="setQuickFilter('today')" class="px-3 py-1 text-sm bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-md transition-colors">Today</button>
          <button @click="setQuickFilter('week')" class="px-3 py-1 text-sm bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-md transition-colors">This Week</button>
          <button @click="setQuickFilter('month')" class="px-3 py-1 text-sm bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-md transition-colors">This Month</button>
          <button @click="setQuickFilter('year')" class="px-3 py-1 text-sm bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-md transition-colors">This Year</button>
        </div>
      </div>

      <!-- Real Transaction List -->
      <div class="bg-white rounded-lg shadow-lg border border-gray-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-slate-700">
            Transactions 
            <span v-if="filteredTransactions.length > 0" class="text-sm font-normal text-slate-500">
              ({{ filteredTransactions.length }} {{ filteredTransactions.length === 1 ? 'item' : 'items' }})
            </span>
          </h3>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTransactions.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-slate-700 mb-2">No transactions found</h4>
          <p class="text-slate-500 mb-4">
            {{ hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'Start by adding your first transaction.' }}
          </p>
          <button
            v-if="!hasActiveFilters"
            @click="showTransactionModal = true"
            class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Transaction
          </button>
        </div>

        <!-- Transaction List -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <!-- Desktop View -->
            <div class="hidden lg:flex lg:items-center lg:justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                     :class="transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          :d="transaction.type === 'income' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'">
                    </path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-slate-900">{{ transaction.category }}</p>
                  <p class="text-sm text-slate-500">{{ formatDate(transaction.createdAt || transaction.date) }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                    {{ transaction.type }}
                  </span>
                </div>
                
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-slate-600 truncate">{{ transaction.description || 'No description' }}</p>
                </div>
                
                <div class="text-right">
                  <p class="font-semibold" :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'">
                    {{ transaction.type === 'income' ? '+' : '-' }}${{ formatCurrency(transaction.amount) }}
                  </p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button @click="editTransaction(transaction)" class="p-1 text-gray-400 hover:text-emerald-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="duplicateTransaction(transaction)" class="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                  <button @click="deleteTransaction(transaction.id)" class="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile View -->
            <div class="lg:hidden">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                       :class="transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            :d="transaction.type === 'income' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'">
                      </path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-slate-900">{{ transaction.category }}</p>
                    <p class="text-sm text-slate-500">{{ formatDate(transaction.createdAt || transaction.date) }}</p>
                  </div>
                </div>
                
                <div class="text-right">
                  <p class="font-semibold" :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'">
                    {{ transaction.type === 'income' ? '+' : '-' }}${{ formatCurrency(transaction.amount) }}
                  </p>
                  <div class="flex items-center space-x-1 mt-1">
                    <button @click="editTransaction(transaction)" class="p-1 text-gray-400 hover:text-emerald-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button @click="duplicateTransaction(transaction)" class="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                    <button @click="deleteTransaction(transaction.id)" class="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="transaction.description" class="mt-2 text-sm text-slate-600 bg-gray-50 p-2 rounded">
                {{ transaction.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} 
              of {{ filteredTransactions.length }} transactions
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border rounded-md transition-all"
                :class="currentPage === 1 ? 'border-gray-200 text-slate-400 cursor-not-allowed' : 'border-gray-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'"
              >
                Previous
              </button>
              
              <div class="flex space-x-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  class="px-3 py-1 text-sm rounded-md transition-all"
                  :class="page === currentPage ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border rounded-md transition-all"
                :class="currentPage === totalPages ? 'border-gray-200 text-slate-400 cursor-not-allowed' : 'border-gray-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Form Modal using your existing TransactionModal -->
      <TransactionModal
        v-if="showTransactionModal"
        :isVisible="showTransactionModal"
        :transaction="editingTransaction"
        @close="closeTransactionModal"
        @submit="handleTransactionSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore } from '../stores/transactions'
import TransactionModal from '../components/TransactionModal.vue'

const route = useRoute()
const router = useRouter()
const transactionStore = useTransactionStore()

// Reactive state
const showTransactionModal = ref(false)
const editingTransaction = ref(null)
const currentPage = ref(1)
const itemsPerPage = 15

const filters = ref({
  type: '',
  category: '',
  fromDate: '',
  toDate: '',
  search: ''
})

// Initialize on mount
onMounted(() => {
  if (transactionStore.initializeStore) {
    transactionStore.initializeStore()
  } else if (transactionStore.initializeTransactions) {
    transactionStore.initializeTransactions()
  }
  
  // Initialize filters from route query
  if (route.query.type) {
    filters.value.type = route.query.type
  }
})

// Computed properties for real data
const allTransactions = computed(() => transactionStore.transactions || [])

const realTotalIncome = computed(() => 
  allTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
)

const realTotalExpenses = computed(() => 
  allTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
)

const realBalance = computed(() => realTotalIncome.value - realTotalExpenses.value)

const realCategories = computed(() => {
  const categories = new Set()
  allTransactions.value.forEach(t => {
    if (t.category) categories.add(t.category)
  })
  return Array.from(categories).sort()
})

const currentFilter = computed(() => route.query.type || filters.value.type || null)

const pageTitle = computed(() => {
  if (currentFilter.value === 'income') return 'Income Transactions'
  if (currentFilter.value === 'expense') return 'Expense Transactions'
  return 'Transactions'
})

const pageDescription = computed(() => {
  if (currentFilter.value === 'income') return 'Track and manage your income sources'
  if (currentFilter.value === 'expense') return 'Monitor and categorize your expenses'
  return 'Manage your income and expenses'
})

const incomeTransactionsCount = computed(() => 
  allTransactions.value.filter(t => t.type === 'income').length
)

const expenseTransactionsCount = computed(() => 
  allTransactions.value.filter(t => t.type === 'expense').length
)

// Filter logic
const hasActiveFilters = computed(() => 
  Object.values(filters.value).some(value => value !== '') || currentFilter.value
)

const filteredTransactions = computed(() => {
  let transactions = [...allTransactions.value]
  
  // Apply type filter from route query or filters
  const typeFilter = currentFilter.value || filters.value.type
  if (typeFilter) {
    transactions = transactions.filter(t => t.type === typeFilter)
  }
  
  if (filters.value.category) {
    transactions = transactions.filter(t => t.category === filters.value.category)
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    transactions = transactions.filter(t => 
      (t.description && t.description.toLowerCase().includes(searchTerm)) ||
      (t.category && t.category.toLowerCase().includes(searchTerm))
    )
  }
  
  if (filters.value.fromDate) {
    transactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt || t.date)
      return transactionDate >= new Date(filters.value.fromDate)
    })
  }
  
  if (filters.value.toDate) {
    transactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt || t.date)
      return transactionDate <= new Date(filters.value.toDate)
    })
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date)
    const dateB = new Date(b.createdAt || b.date)
    return dateB - dateA
  })
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransactions.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount || 0))
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const filterPillClass = (isActive, color = 'emerald') => {
  const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300'
  if (isActive) {
    return `${baseClass} bg-${color}-500 text-white`
  }
  return `${baseClass} bg-white text-slate-600 hover:bg-${color}-50`
}

// Filter functions
const setTypeFilter = (type) => {
  router.push({ 
    path: '/transactions', 
    query: { ...route.query, type: type } 
  })
}

const clearTypeFilter = () => {
  const query = { ...route.query }
  delete query.type
  router.push({ path: '/transactions', query })
}

const setQuickFilter = (type) => {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  
  switch (type) {
    case 'today':
      filters.value.fromDate = new Date().toISOString().split('T')[0]
      filters.value.toDate = new Date().toISOString().split('T')[0]
      break
    case 'week':
      filters.value.fromDate = startOfWeek.toISOString().split('T')[0]
      filters.value.toDate = new Date().toISOString().split('T')[0]
      break
    case 'month':
      filters.value.fromDate = startOfMonth.toISOString().split('T')[0]
      filters.value.toDate = new Date().toISOString().split('T')[0]
      break
    case 'year':
      filters.value.fromDate = startOfYear.toISOString().split('T')[0]
      filters.value.toDate = new Date().toISOString().split('T')[0]
      break
  }
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    type: '',
    category: '',
    fromDate: '',
    toDate: '',
    search: ''
  }
  const query = { ...route.query }
  delete query.type
  router.push({ path: '/transactions', query })
  currentPage.value = 1
}

// Transaction actions
const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  showTransactionModal.value = true
}

const duplicateTransaction = (transaction) => {
  const duplicatedTransaction = {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: `${transaction.description || ''} (Copy)`.trim(),
    date: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
  transactionStore.addTransaction(duplicatedTransaction)
  showNotification('Transaction duplicated successfully!', 'success')
}

const deleteTransaction = (id) => {
  if (confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
    transactionStore.deleteTransaction(id)
    showNotification('Transaction deleted successfully!', 'success')
  }
}

const exportTransactions = () => {
  const dataToExport = filteredTransactions.value.map(t => ({
    Date: formatDate(t.createdAt || t.date),
    Type: t.type,
    Category: t.category,
    Description: t.description || '',
    Amount: t.amount
  }))
  
  const csv = [
    Object.keys(dataToExport[0]).join(','),
    ...dataToExport.map(row => Object.values(row).join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  
  const filterSuffix = currentFilter.value ? `-${currentFilter.value}` : ''
  a.download = `transactions${filterSuffix}-${new Date().toISOString().split('T')[0]}.csv`
  
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  showNotification(`${currentFilter.value ? currentFilter.value.charAt(0).toUpperCase() + currentFilter.value.slice(1) + ' ' : ''}Transactions exported successfully!`, 'success')
}

// Modal functions
const closeTransactionModal = () => {
  showTransactionModal.value = false
  editingTransaction.value = null
}

const handleTransactionSubmit = (transactionData) => {
  if (editingTransaction.value) {
    transactionStore.updateTransaction(editingTransaction.value.id, transactionData)
    showNotification('Transaction updated successfully!', 'success')
  } else {
    transactionStore.addTransaction(transactionData)
    showNotification('Transaction added successfully!', 'success')
  }
  closeTransactionModal()
}

const showNotification = (message, type = 'info') => {
  // You can replace this with your preferred notification system
  console.log(`${type.toUpperCase()}: ${message}`)
}

// Watchers
watch(() => route.query.type, (newType) => {
  if (newType !== filters.value.type) {
    filters.value.type = newType || ''
  }
  currentPage.value = 1
})

watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
/* Container and basic styles */
.container-app {
  max-width: 80rem;
  margin: 0 auto;
}

/* Color utilities */
.bg-cream {
  background-color: #fefcf3;
}

/* Glass morphism enhancement */
.glass-strong {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Custom animations */
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Focus improvements for keyboard navigation */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .container-app {
    padding: 1rem;
  }
}

/* Print styles */
@media print {
  .animate-float {
    transform: none !important;
    animation: none !important;
  }
  
  .glass-strong {
    background: white !important;
    backdrop-filter: none !important;
  }
  
  button {
    display: none !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-float {
    animation: none !important;
    transition: none !important;
  }
}
</style>