<!-- Analytics.vue - Fixed Category Chart Display -->
<template>
  <div class="min-h-screen bg-cream relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-600/10 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container-app relative z-10 p-6">
      <!-- Enhanced Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-fade-in">
        <div>
          <h1 class="text-4xl font-bold text-slate-700 mb-2 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            Analytics Dashboard
          </h1>
          <p class="text-slate-500 text-lg">Deep insights into your financial patterns</p>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Time Range Selector -->
          <select 
            v-model="selectedTimeRange"
            class="form-input min-w-[150px]"
            @change="updateAnalytics"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>

          <!-- Export Button -->
          <button 
            @click="exportAnalytics"
            class="glass-strong px-4 py-2 rounded-xl text-slate-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <!-- Key Metrics Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Balance -->
        <div class="dashboard-card hover-lift group cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="text-sm font-medium text-slate-500">Total Balance</p>
                <div class="w-2 h-2 rounded-full animate-pulse" :class="realAnalytics.totalBalance >= 0 ? 'bg-emerald-500' : 'bg-red-500'"></div>
              </div>
              <p class="text-2xl font-bold mb-1" :class="realAnalytics.totalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'">
                ${{ formatCurrency(Math.abs(realAnalytics.totalBalance)) }}
              </p>
              <p class="text-xs flex items-center gap-1" :class="realAnalytics.balanceChange >= 0 ? 'text-emerald-600' : 'text-red-600'">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        :d="realAnalytics.balanceChange >= 0 ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'"></path>
                </svg>
                {{ realAnalytics.balanceChange >= 0 ? '+' : '' }}{{ realAnalytics.balanceChange.toFixed(1) }}% from last period
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                 :class="realAnalytics.totalBalance >= 0 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' : 'bg-gradient-to-br from-red-100 to-red-200'">
              <svg class="w-6 h-6" :class="realAnalytics.totalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out"
                 :class="realAnalytics.totalBalance >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'"
                 :style="{ width: `${Math.min(Math.abs(realAnalytics.totalBalance / 1000) * 10, 100)}%` }"></div>
          </div>
        </div>

        <!-- Average Transaction -->
        <div class="dashboard-card hover-lift group cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="text-sm font-medium text-slate-500">Avg. Transaction</p>
                <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <p class="text-2xl font-bold text-blue-600 mb-1">
                ${{ formatCurrency(realAnalytics.averageTransaction) }}
              </p>
              <p class="text-xs text-blue-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                {{ realAnalytics.totalTransactions }} transactions
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-blue-100 rounded-full h-2 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                 :style="{ width: `${Math.min((realAnalytics.averageTransaction / 500) * 100, 100)}%` }"></div>
          </div>
        </div>

        <!-- Top Category -->
        <div class="dashboard-card hover-lift group cursor-pointer" @click="navigateToTopCategory">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="text-sm font-medium text-slate-500">Top Category</p>
                <div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              </div>
              <p class="text-lg font-bold text-purple-600 mb-1 truncate">
                {{ realAnalytics.topCategory.name }}
              </p>
              <p class="text-xs text-purple-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                ${{ formatCurrency(realAnalytics.topCategory.amount) }} ({{ realAnalytics.topCategory.percentage }}%)
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-purple-100 rounded-full h-2 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                 :style="{ width: `${realAnalytics.topCategory.percentage}%` }"></div>
          </div>
        </div>

        <!-- Monthly Growth -->
        <div class="dashboard-card hover-lift group cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="text-sm font-medium text-slate-500">Monthly Growth</p>
                <div class="w-2 h-2 rounded-full animate-pulse" :class="realAnalytics.monthlyGrowth >= 0 ? 'bg-emerald-500' : 'bg-red-500'"></div>
              </div>
              <p class="text-2xl font-bold mb-1" :class="realAnalytics.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ realAnalytics.monthlyGrowth >= 0 ? '+' : '' }}{{ realAnalytics.monthlyGrowth.toFixed(1) }}%
              </p>
              <p class="text-xs flex items-center gap-1" :class="realAnalytics.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        :d="realAnalytics.monthlyGrowth >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path>
                </svg>
                vs. previous period
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                 :class="realAnalytics.monthlyGrowth >= 0 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' : 'bg-gradient-to-br from-red-100 to-red-200'">
              <svg class="w-6 h-6" :class="realAnalytics.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out"
                 :class="realAnalytics.monthlyGrowth >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'"
                 :style="{ width: `${Math.min(Math.abs(realAnalytics.monthlyGrowth), 100)}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Income vs Expenses Chart -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              Income vs Expenses
            </h3>
            <div class="text-sm text-slate-500">{{ getTimeRangeText() }}</div>
          </div>
          
          <div class="h-80 relative">
            <canvas ref="incomeExpensesChart" class="w-full h-full"></canvas>
          </div>
          
          <div class="mt-4 flex items-center justify-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span class="text-sm text-slate-600">Income (${{ formatCurrency(realAnalytics.totalIncome) }})</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm text-slate-600">Expenses (${{ formatCurrency(realAnalytics.totalExpenses) }})</span>
            </div>
          </div>
        </div>

        <!-- Category Breakdown - Updated to show all categories -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              Transaction Categories
            </h3>
            <div class="flex items-center gap-2">
              <button 
                @click="categoryViewType = 'expense'"
                :class="categoryViewType === 'expense' ? 'bg-red-100 text-red-600' : 'text-slate-600 hover:bg-slate-100'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Expenses
              </button>
              <button 
                @click="categoryViewType = 'income'"
                :class="categoryViewType === 'income' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-600 hover:bg-slate-100'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Income
              </button>
              <button 
                @click="toggleChartType"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium ml-2"
              >
                {{ chartType === 'doughnut' ? 'Bar View' : 'Pie View' }}
              </button>
            </div>
          </div>
          
          <!-- Show chart if data exists, otherwise show helpful message -->
          <div v-if="displayCategoryData.length > 0" class="h-80 relative">
            <canvas ref="categoryChart" class="w-full h-full"></canvas>
          </div>
          
          <div v-else class="h-80 flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-slate-600 mb-2">No {{ categoryViewType }} Categories</h4>
              <p class="text-slate-500 text-sm mb-4">Add transactions with categories to see the breakdown</p>
              <button 
                @click="navigateToTransactions"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Add Transactions
              </button>
            </div>
          </div>
          
          <!-- Category breakdown list -->
          <div v-if="displayCategoryData.length > 0" class="mt-4 grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            <div v-for="(category, index) in displayCategoryData" :key="category.name" 
                 class="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                 @click="navigateToCategory(category.name, categoryViewType)">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: getCategoryColor(index) }"></div>
              <span class="text-slate-600 truncate flex-1">{{ category.name }}</span>
              <span class="text-slate-400 font-semibold">${{ formatCurrency(category.amount) }}</span>
              <span class="text-xs text-slate-500 bg-slate-100 px-1 rounded">{{ category.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Monthly Trend -->
        <div class="lg:col-span-2 dashboard-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              Financial Trend
            </h3>
            <div class="flex items-center gap-2">
              <button 
                @click="trendView = 'balance'"
                :class="trendView === 'balance' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Balance
              </button>
              <button 
                @click="trendView = 'flow'"
                :class="trendView === 'flow' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Cash Flow
              </button>
            </div>
          </div>
          
          <div class="h-80 relative">
            <canvas ref="trendChart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Quick Insights -->
        <div class="dashboard-card">
          <h3 class="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <div class="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            Quick Insights
          </h3>
          
          <div class="space-y-4">
            <div v-for="insight in realAnalytics.insights" :key="insight.id" 
                 class="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                     :class="getInsightIconClass(insight.type)">
                  <svg class="w-4 h-4" :class="getInsightTextClass(insight.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getInsightIcon(insight.type)"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-slate-700 text-sm mb-1">{{ insight.title }}</h4>
                  <p class="text-xs text-slate-500">{{ insight.description }}</p>
                  <div v-if="insight.action" class="mt-2">
                    <button class="text-xs font-medium text-blue-600 hover:text-blue-700">
                      {{ insight.action }} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Suggestion Card -->
          <div class="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-purple-800 text-sm mb-1">AI Recommendation</h4>
                <p class="text-xs text-purple-700">Based on your spending pattern, consider setting a budget of ${{ Math.round(realAnalytics.totalExpenses * 0.9) }} for next month to improve your savings.</p>
                <button class="mt-2 text-xs font-medium text-purple-700 hover:text-purple-800">
                  Create Budget →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Summary -->
      <div class="dashboard-card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-slate-700 flex items-center gap-2">
            <div class="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            Recent Activity Summary
          </h3>
          <router-link to="/transactions" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Transactions →
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Today's Activity -->
          <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-slate-700 mb-1">Today</h4>
            <p class="text-2xl font-bold text-blue-600 mb-1">${{ formatCurrency(realAnalytics.todayTotal) }}</p>
            <p class="text-sm text-slate-500">{{ realAnalytics.todayTransactions }} transactions</p>
          </div>

          <!-- This Week -->
          <div class="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-slate-700 mb-1">This Week</h4>
            <p class="text-2xl font-bold text-emerald-600 mb-1">${{ formatCurrency(realAnalytics.weekTotal) }}</p>
            <p class="text-sm text-slate-500">{{ realAnalytics.weekTransactions }} transactions</p>
          </div>

          <!-- This Month -->
          <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-slate-700 mb-1">This Month</h4>
            <p class="text-2xl font-bold text-purple-600 mb-1">${{ formatCurrency(realAnalytics.monthTotal) }}</p>
            <p class="text-sm text-slate-500">{{ realAnalytics.monthTransactions }} transactions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '../stores/transactions'

const router = useRouter()
const transactionStore = useTransactionStore()

// Reactive state
const selectedTimeRange = ref('30')
const chartType = ref('doughnut')
const trendView = ref('balance')
const categoryViewType = ref('expense') // New: Toggle between income/expense categories

// Chart references
const incomeExpensesChart = ref(null)
const categoryChart = ref(null)
const trendChart = ref(null)

// Chart instances
let incomeExpensesChartInstance = null
let categoryChartInstance = null
let trendChartInstance = null

// Initialize store
onMounted(() => {
  if (transactionStore.initializeStore) {
    transactionStore.initializeStore()
  } else if (transactionStore.initializeTransactions) {
    transactionStore.initializeTransactions()
  }
  
  nextTick(() => {
    createIncomeExpensesChart()
    createCategoryChart()
    createTrendChart()
  })
})

// Filtered transactions based on time range
const filteredTransactions = computed(() => {
  if (!transactionStore.transactions) return []
  
  const now = new Date()
  let cutoffDate = new Date()
  
  switch (selectedTimeRange.value) {
    case '7':
      cutoffDate.setDate(now.getDate() - 7)
      break
    case '30':
      cutoffDate.setDate(now.getDate() - 30)
      break
    case '90':
      cutoffDate.setDate(now.getDate() - 90)
      break
    case '365':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
    default:
      return transactionStore.transactions
  }
  
  return transactionStore.transactions.filter(t => {
    const transactionDate = new Date(t.createdAt || t.date)
    return transactionDate >= cutoffDate
  })
})

// Real analytics data computed from store
const realAnalytics = computed(() => {
  const transactions = filteredTransactions.value
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  
  const totalBalance = totalIncome - totalExpenses
  
  // Calculate balance change based on real data
  const now = new Date()
  let previousPeriodStart, previousPeriodEnd, currentPeriodStart
  switch (selectedTimeRange.value) {
    case '7':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setDate(now.getDate() - 7)
      previousPeriodStart = new Date(currentPeriodStart)
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 7)
      break
    case '30':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setDate(now.getDate() - 30)
      previousPeriodStart = new Date(currentPeriodStart)
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)
      break
    case '90':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setDate(now.getDate() - 90)
      previousPeriodStart = new Date(currentPeriodStart)
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 90)
      break
    case '365':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setFullYear(now.getFullYear() - 1)
      previousPeriodStart = new Date(currentPeriodStart)
      previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1)
      break
    case 'all':
    default:
      // For 'all', compare the most recent half with the older half
      const allTransactions = [...transactionStore.transactions].sort(
        (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      )
      if (allTransactions.length > 1) {
        const midPoint = Math.floor(allTransactions.length / 2)
        const midDate = new Date(allTransactions[midPoint].createdAt || allTransactions[midPoint].date)
        currentPeriodStart = midDate
        previousPeriodStart = new Date(0) // Beginning of time
      } else {
        currentPeriodStart = new Date(0)
        previousPeriodStart = new Date(0)
      }
  }
  
  previousPeriodEnd = new Date(currentPeriodStart)
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1)
  
  // Get transactions for previous period
  const previousPeriodTransactions = transactionStore.transactions.filter(t => {
    const date = new Date(t.createdAt || t.date)
    return date >= previousPeriodStart && date <= previousPeriodEnd
  })
  
  // Calculate previous period balance
  const previousPeriodIncome = previousPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  const previousPeriodExpenses = previousPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  const previousPeriodBalance = previousPeriodIncome - previousPeriodExpenses
  
  // Calculate balance change
  const balanceChange = previousPeriodBalance !== 0 ? 
    ((totalBalance - previousPeriodBalance) / Math.abs(previousPeriodBalance)) * 100 : 
    (totalBalance > 0 ? 100 : totalBalance < 0 ? -100 : 0)
  
  // Average transaction
  const averageTransaction = transactions.length > 0 ? 
    transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) / transactions.length : 0
  
  // Category breakdown - for both income and expense
  const categoryTotals = {}
  transactions.forEach(t => {
    if (!t.category) return
    const key = `${t.type}-${t.category}`
    if (!categoryTotals[key]) {
      categoryTotals[key] = { name: t.category, type: t.type, amount: 0, count: 0 }
    }
    categoryTotals[key].amount += parseFloat(t.amount) || 0
    categoryTotals[key].count += 1
  })
  
  const allCategoryBreakdown = Object.values(categoryTotals)
    .sort((a, b) => b.amount - a.amount)
  
  // Separate income and expense categories
  const expenseCategoryBreakdown = allCategoryBreakdown
    .filter(cat => cat.type === 'expense')
    .slice(0, 8)
  
  const incomeCategoryBreakdown = allCategoryBreakdown
    .filter(cat => cat.type === 'income')
    .slice(0, 8)
  
  // Top category (highest amount across all categories)
  const topCategory = allCategoryBreakdown.length > 0 ? {
    name: allCategoryBreakdown[0].name,
    amount: allCategoryBreakdown[0].amount,
    percentage: Math.round((allCategoryBreakdown[0].amount / (totalIncome + totalExpenses)) * 100)
  } : { name: 'No data', amount: 0, percentage: 0 }
  
  // Calculate monthly growth based on real data
  const monthlyGrowth = balanceChange
  
  // Time-based totals
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)
  
  const todayTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.createdAt || t.date).toISOString().split('T')[0]
    return transactionDate === today
  })
  
  const weekTransactions = transactions.filter(t => 
    new Date(t.createdAt || t.date) >= weekAgo
  )
  
  const monthTransactions = transactions.filter(t => 
    new Date(t.createdAt || t.date) >= monthAgo
  )
  
  // Generate insights based on real data
  const insights = []
  
  if (totalExpenses > totalIncome * 0.8 && totalIncome > 0) {
    insights.push({
      id: 1,
      type: 'warning',
      title: 'High Spending Alert',
      description: `Expenses are ${Math.round((totalExpenses / totalIncome) * 100)}% of your income.`,
      action: 'Review Budget'
    })
  }
  
  if (totalBalance > 0) {
    insights.push({
      id: 2,
      type: 'success',
      title: 'Positive Balance',
      description: `You have a positive balance of ${formatCurrency(totalBalance)}.`,
      action: 'View Goals'
    })
  }
  
  if (transactions.length > 0) {
    insights.push({
      id: 3,
      type: 'info',
      title: 'Transaction Activity',
      description: `You've made ${transactions.length} transactions in this period.`,
      action: 'View Details'
    })
  }
  
  if (allCategoryBreakdown.length > 0) {
    const topCat = allCategoryBreakdown[0]
    const percentage = Math.round((topCat.amount / (totalIncome + totalExpenses)) * 100)
    if (percentage > 30) {
      insights.push({
        id: 4,
        type: 'tip',
        title: 'Category Concentration',
        description: `${topCat.name} represents ${percentage}% of your transactions.`,
        action: 'Optimize Spending'
      })
    }
  }
  
  return {
    totalBalance,
    balanceChange,
    averageTransaction,
    totalTransactions: transactions.length,
    topCategory,
    monthlyGrowth,
    totalIncome,
    totalExpenses,
    expenseCategoryBreakdown,
    incomeCategoryBreakdown,
    allCategoryBreakdown,
    todayTotal: todayTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
    todayTransactions: todayTransactions.length,
    weekTotal: weekTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
    weekTransactions: weekTransactions.length,
    monthTotal: monthTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
    monthTransactions: monthTransactions.length,
    insights: insights.slice(0, 4)
  }
})

// Display category data based on current view type
const displayCategoryData = computed(() => {
  return categoryViewType.value === 'expense' 
    ? realAnalytics.value.expenseCategoryBreakdown 
    : realAnalytics.value.incomeCategoryBreakdown
})

// Chart data generators using real data
const getIncomeExpensesData = () => {
  const transactions = filteredTransactions.value
  const labels = []
  const incomeData = []
  const expenseData = []
  
  const days = selectedTimeRange.value === 'all' ? 30 : parseInt(selectedTimeRange.value)
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    const dayIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.createdAt || t.date).toISOString().split('T')[0] === dateStr)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
    
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.createdAt || t.date).toISOString().split('T')[0] === dateStr)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
    
    incomeData.push(dayIncome)
    expenseData.push(dayExpenses)
  }
  
  return { labels, incomeData, expenseData }
}

const getTrendData = () => {
  const transactions = filteredTransactions.value
  const labels = []
  const data = []
  
  const months = 12
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt || t.date)
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })
    
    if (trendView.value === 'balance') {
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      data.push(monthIncome - monthExpenses)
    } else {
      const monthTotal = monthTransactions
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      data.push(monthTotal)
    }
  }
  
  return { labels, data }
}

// AI Recommendation function
const getAIRecommendation = () => {
  const { totalIncome, totalExpenses } = realAnalytics.value
  
  // If spending more than earning
  if (totalExpenses > totalIncome && totalIncome > 0) {
    const reduction = Math.round((totalExpenses - totalIncome) + (totalIncome * 0.1))
    return `Based on your spending pattern, consider reducing expenses by $${formatCurrency(reduction)} to achieve a 10% savings rate.`
  }
  
  // If saving less than 20% of income
  else if (totalIncome > 0 && (totalIncome - totalExpenses) / totalIncome < 0.2) {
    const targetSavings = totalIncome * 0.2
    const currentSavings = totalIncome - totalExpenses
    const additionalSavings = targetSavings - currentSavings
    return `To reach a 20% savings rate, consider reducing monthly expenses by $${formatCurrency(additionalSavings)}.`
  }
  
  // If already saving well
  else if (totalIncome > 0) {
    const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    return `Great job! You're saving ${savingsRate}% of your income. Consider investing your surplus for long-term growth.`
  }
  
  // Default recommendation
  else {
    return `Consider setting a budget of $${formatCurrency(totalExpenses * 0.9)} for next month to improve your savings.`
  }
}

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount || 0))
}

const getTimeRangeText = () => {
  switch (selectedTimeRange.value) {
    case '7': return 'Last 7 days'
    case '30': return 'Last 30 days'
    case '90': return 'Last 3 months'
    case '365': return 'Last year'
    case 'all': return 'All time'
    default: return 'Selected period'
  }
}

const getInsightIconClass = (type) => {
  switch (type) {
    case 'warning': return 'bg-amber-100'
    case 'success': return 'bg-emerald-100'
    case 'info': return 'bg-blue-100'
    case 'tip': return 'bg-purple-100'
    default: return 'bg-slate-100'
  }
}

const getInsightTextClass = (type) => {
  switch (type) {
    case 'warning': return 'text-amber-600'
    case 'success': return 'text-emerald-600'
    case 'info': return 'text-blue-600'
    case 'tip': return 'text-purple-600'
    default: return 'text-slate-600'
  }
}

const getInsightIcon = (type) => {
  switch (type) {
    case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'tip': return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

// Chart colors
const getCategoryColors = () => [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
  '#ef4444', '#06b6d4', '#84cc16', '#f97316'
]

const getCategoryColor = (index) => {
  const colors = getCategoryColors()
  return colors[index % colors.length]
}

// Navigation functions
const navigateToTopCategory = () => {
  if (realAnalytics.value.topCategory.name !== 'No data') {
    const topCat = realAnalytics.value.allCategoryBreakdown[0]
    router.push(`/transactions?type=${topCat.type}&category=${encodeURIComponent(topCat.name)}`)
  }
}

const navigateToCategory = (categoryName, type) => {
  router.push(`/transactions?type=${type}&category=${encodeURIComponent(categoryName)}`)
}

const navigateToTransactions = () => {
  router.push('/transactions')
}

// Chart creation functions
const createIncomeExpensesChart = async () => {
  if (!incomeExpensesChart.value) return
  
  try {
    const Chart = (await import('chart.js/auto')).default
    
    if (incomeExpensesChartInstance) {
      incomeExpensesChartInstance.destroy()
    }
    
    const { labels, incomeData, expenseData } = getIncomeExpensesData()
    
    incomeExpensesChartInstance = new Chart(incomeExpensesChart.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating income/expenses chart:', error)
  }
}

const createCategoryChart = async () => {
  if (!categoryChart.value || displayCategoryData.value.length === 0) return
  
  try {
    const Chart = (await import('chart.js/auto')).default
    
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
    }
    
    const data = displayCategoryData.value.map(cat => cat.amount)
    const labels = displayCategoryData.value.map(cat => cat.name)
    const colors = getCategoryColors()
    
    categoryChartInstance = new Chart(categoryChart.value, {
      type: chartType.value,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0
                return `${label}: ${formatCurrency(value)} (${percentage}%)`
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating category chart:', error)
  }
}

const createTrendChart = async () => {
  if (!trendChart.value) return
  
  try {
    const Chart = (await import('chart.js/auto')).default
    
    if (trendChartInstance) {
      trendChartInstance.destroy()
    }
    
    const { labels, data } = getTrendData()
    
    trendChartInstance = new Chart(trendChart.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: trendView.value === 'balance' ? 'Balance' : 'Cash Flow',
          data,
          borderColor: trendView.value === 'balance' ? '#3b82f6' : '#8b5cf6',
          backgroundColor: trendView.value === 'balance' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: trendView.value !== 'balance',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating trend chart:', error)
  }
}

// Methods
const updateAnalytics = () => {
  nextTick(() => {
    createIncomeExpensesChart()
    createCategoryChart()
    createTrendChart()
  })
}

const toggleChartType = () => {
  chartType.value = chartType.value === 'doughnut' ? 'bar' : 'doughnut'
  nextTick(() => {
    createCategoryChart()
  })
}

const exportAnalytics = () => {
  const report = {
    generatedAt: new Date().toISOString(),
    timeRange: selectedTimeRange.value,
    summary: realAnalytics.value,
    transactions: filteredTransactions.value
  }
  
  const dataStr = JSON.stringify(report, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Watchers
watch(selectedTimeRange, updateAnalytics)
watch(trendView, () => {
  nextTick(() => {
    createTrendChart()
  })
})

// Watch for category view type changes and update chart
watch(categoryViewType, () => {
  nextTick(() => {
    createCategoryChart()
  })
})

// Watch for category data changes and update chart
watch(() => realAnalytics.value.expenseCategoryBreakdown, () => {
  nextTick(() => {
    createCategoryChart()
  })
}, { deep: true })

watch(() => realAnalytics.value.incomeCategoryBreakdown, () => {
  nextTick(() => {
    createCategoryChart()
  })
}, { deep: true })
</script>

<style scoped>
/* Container and card styles */
.container-app {
  max-width: 80rem;
  margin: 0 auto;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

/* Form input styles */
.form-input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

/* Enhanced hover effects */
.hover-scale:hover {
  transform: scale(1.02);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

/* Chart container styling */
canvas {
  max-height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-card {
    padding: 1rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .h-80 {
    height: 250px;
  }
}

/* Focus improvements for keyboard navigation */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
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
  
  button {
    display: none !important;
  }
}
</style>