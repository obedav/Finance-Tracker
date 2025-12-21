<!-- Complete Updated Reports.vue Template -->
<template>
  <div class="min-h-screen bg-cream dark:bg-neutral-900 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl animate-float" style="animation-delay: -6s;"></div>
    </div>

    <div class="container-app relative z-10 p-6 pt-16">
      <!-- Enhanced Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-fade-in">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-glow-primary animate-float">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-slate-700 mb-2">Financial Reports</h1>
            <p class="text-lg text-slate-500">Comprehensive analysis of your financial data and trends</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="exportReport('pdf')" class="btn btn-primary hover-lift shadow-glow-primary group">
            <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export PDF
          </button>
          <button @click="exportReport('csv')" class="btn btn-ghost hover-lift group">
            <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <!-- Enhanced Time Period Filter -->
      <div class="dashboard-card mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <label class="text-sm font-semibold text-slate-700">Time Period:</label>
            </div>
            <div class="flex space-x-2 bg-cream/60 p-2 rounded-xl">
              <button
                v-for="period in timePeriods"
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group',
                  selectedPeriod === period.value 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow-primary transform scale-105' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                ]"
              >
                <span class="relative z-10">{{ period.label }}</span>
                <div v-if="selectedPeriod !== period.value" class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="form-group">
              <label class="block text-xs text-slate-500 mb-1 font-medium">From</label>
              <input 
                v-model="customDateRange.from"
                type="date"
                class="form-input text-sm hover-lift focus:scale-102 transition-all duration-300"
              />
            </div>
            <div class="form-group">
              <label class="block text-xs text-slate-500 mb-1 font-medium">To</label>
              <input 
                v-model="customDateRange.to"
                type="date"
                class="form-input text-sm hover-lift focus:scale-102 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="dashboard-card card-interactive group cursor-pointer hover-lift" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-500">Total Income</p>
                  <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
                </div>
              </div>
              <p class="text-3xl font-bold text-gradient-emerald mb-2">
                ${{ formatCurrency(filteredData.totalIncome) }}
              </p>
              <p class="text-xs text-emerald-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                {{ filteredData.incomeTransactions }} transactions
              </p>
            </div>
          </div>
          <!-- Progress Indicator -->
          <div class="mt-4 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :style="{ width: `${Math.min((filteredData.totalIncome / 10000) * 100, 100)}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        <div class="dashboard-card card-interactive group cursor-pointer hover-lift" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-500">Total Expenses</p>
                  <div class="w-2 h-2 rounded-full bg-gold-500 animate-pulse mt-1"></div>
                </div>
              </div>
              <p class="text-3xl font-bold text-gradient-gold mb-2">
                ${{ formatCurrency(filteredData.totalExpenses) }}
              </p>
              <p class="text-xs text-gold-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
                {{ filteredData.expenseTransactions }} transactions
              </p>
            </div>
          </div>
          <!-- Progress Indicator -->
          <div class="mt-4 w-full bg-gold-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :style="{ width: `${Math.min((filteredData.totalExpenses / 10000) * 100, 100)}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        <div class="dashboard-card card-interactive group cursor-pointer hover-lift" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-500">Net Amount</p>
                  <div :class="['w-2 h-2 rounded-full animate-pulse mt-1', filteredData.netAmount >= 0 ? 'bg-emerald-500' : 'bg-red-500']"></div>
                </div>
              </div>
              <p class="text-3xl font-bold mb-2" :class="filteredData.netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ filteredData.netAmount >= 0 ? '+' : '-' }}${{ formatCurrency(Math.abs(filteredData.netAmount)) }}
              </p>
              <p class="text-xs flex items-center gap-1" :class="filteredData.netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                {{ filteredData.netAmount >= 0 ? 'Surplus' : 'Deficit' }}
              </p>
            </div>
          </div>
          <!-- Dynamic Progress Indicator -->
          <div class="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :class="filteredData.netAmount >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'"
              :style="{ width: `${Math.min(Math.abs(filteredData.netAmount / 1000) * 10, 100)}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        <div class="dashboard-card card-interactive group cursor-pointer hover-lift" @click="animateCard($event)">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-500">Avg Transaction</p>
                  <div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse mt-1"></div>
                </div>
              </div>
              <p class="text-3xl font-bold text-purple-600 mb-2">
                ${{ formatCurrency(filteredData.avgTransaction) }}
              </p>
              <p class="text-xs text-purple-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Per transaction
              </p>
            </div>
          </div>
          <!-- Progress Indicator -->
          <div class="mt-4 w-full bg-purple-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :style="{ width: `${Math.min((filteredData.avgTransaction / 500) * 100, 100)}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- UPDATED: Enhanced Charts Section with Real Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Income vs Expenses Trend Chart -->
        <div class="dashboard-card hover-lift">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="category-icon category-icon-income mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-700">Income vs Expenses Trend</h3>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span class="text-sm text-slate-500 font-medium">Income</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-gold-500 rounded-full mr-2 animate-pulse"></div>
                <span class="text-sm text-slate-500 font-medium">Expenses</span>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Trend Visualization -->
          <div class="h-64">
            <div v-if="trendChartData.length === 0" class="h-full flex items-center justify-center">
              <div class="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-300 transition-colors group">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <p class="font-bold text-slate-700 mb-2">No Trend Data</p>
                <p class="text-sm text-slate-500">Add more transactions to see trends</p>
              </div>
            </div>
            
            <!-- Simple Bar Chart Visualization -->
            <div v-else class="h-full flex items-end justify-between p-4 bg-gradient-to-t from-slate-50 to-transparent rounded-lg">
              <div v-for="(data) in trendChartData.slice(-6)" :key="data.month" class="flex flex-col items-center space-y-2 group">
                <div class="text-xs text-slate-500 font-medium">{{ data.month }}</div>
                <div class="flex space-x-1">
                  <!-- Income bar -->
                  <div 
                    class="w-4 bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-600 cursor-pointer group-hover:shadow-lg"
                    :style="{ height: `${Math.max((data.income / Math.max(...trendChartData.map(d => Math.max(d.income, d.expenses))) * 150), 8)}px` }"
                    :title="`Income: $${formatCurrency(data.income)}`"
                  ></div>
                  <!-- Expense bar -->
                  <div 
                    class="w-4 bg-gold-500 rounded-t transition-all duration-500 hover:bg-gold-600 cursor-pointer group-hover:shadow-lg"
                    :style="{ height: `${Math.max((data.expenses / Math.max(...trendChartData.map(d => Math.max(d.income, d.expenses))) * 150), 8)}px` }"
                    :title="`Expenses: $${formatCurrency(data.expenses)}`"
                  ></div>
                </div>
                <!-- Tooltip on hover -->
                <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-slate-800 text-white text-xs p-2 rounded mt-2 z-10 pointer-events-none">
                  <div>Income: ${{ formatCurrency(data.income) }}</div>
                  <div>Expenses: ${{ formatCurrency(data.expenses) }}</div>
                  <div class="font-semibold">Net: ${{ formatCurrency(data.income - data.expenses) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Distribution with Real Pie Chart -->
        <div class="dashboard-card hover-lift">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="category-icon category-icon-expense mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-700">Category Distribution</h3>
            </div>
          </div>
          
          <!-- Real Pie Chart Component -->
          <div class="h-64">
            <ExpensePieChart
              :expenses="analysisType === 'expense' ? expenseChartData : incomeChartData"
              :title="analysisType === 'expense' ? 'Expense Categories' : 'Income Categories'"
              :loading="chartLoading"
              :show-period-selector="false"
              :empty-state-message="analysisType === 'expense' ? 'Add expenses to see breakdown' : 'Add income sources to see breakdown'"
              @period-change="handleChartPeriodChange"
              class="h-full"
            />
          </div>
        </div>
      </div>

      <!-- Enhanced Category Analysis -->
      <div class="dashboard-card mb-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center">
            <div class="category-icon category-icon-income mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Category Analysis</h3>
              <p class="text-slate-500">Detailed breakdown of your spending and income patterns</p>
            </div>
          </div>
          
          <!-- Enhanced Toggle between Income/Expense -->
          <div class="flex space-x-2 bg-cream/60 p-2 rounded-xl">
            <button
              @click="analysisType = 'expense'"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group',
                analysisType === 'expense' 
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-glow-secondary transform scale-105' 
                  : 'text-slate-500 hover:text-gold-600 hover:bg-gold-50'
              ]"
            >
              <span class="relative z-10 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
                Expense Analysis
              </span>
            </button>
            <button
              @click="analysisType = 'income'"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group',
                analysisType === 'income' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow-primary transform scale-105' 
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
              ]"
            >
              <span class="relative z-10 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                Income Analysis
              </span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(category, index) in categoryAnalysis" 
            :key="category.name"
            class="category-analysis-card group hover-lift"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <!-- Animated background effect -->
              <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   :class="analysisType === 'income' ? 'from-emerald-50 to-emerald-100' : 'from-gold-50 to-gold-100'">
              </div>
              
              <div class="relative flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-12 h-12 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform',
                      analysisType === 'income' 
                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' 
                        : 'bg-gradient-to-br from-gold-100 to-gold-200'
                    ]"
                  >
                    <svg 
                      :class="[
                        'w-6 h-6',
                        analysisType === 'income' ? 'text-emerald-600' : 'text-gold-600'
                      ]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <h4 class="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{{ category.name }}</h4>
                </div>
                <span 
                  :class="[
                    'text-sm font-bold px-3 py-1 rounded-full',
                    analysisType === 'income' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gold-100 text-gold-700'
                  ]"
                >
                  {{ category.percentage }}%
                </span>
              </div>
              
              <div class="relative space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500 font-medium">Amount</span>
                  <span class="font-bold text-slate-700">${{ formatCurrency(category.amount) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500 font-medium">Transactions</span>
                  <span class="font-bold text-slate-700">{{ category.count }}</span>
                </div>
                
                <!-- Enhanced Progress Bar -->
                <div class="space-y-2">
                  <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      :class="analysisType === 'income' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-gold-400 to-gold-600'"
                      :style="`width: ${category.percentage}%`"
                    >
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Monthly Comparison -->
      <div class="dashboard-card mb-8">
        <div class="flex items-center mb-8">
          <div class="category-icon category-icon-expense mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-slate-700">Monthly Comparison</h3>
            <p class="text-slate-500">Track your financial performance over time</p>
          </div>
        </div>
        
        <div class="overflow-hidden rounded-xl border border-slate-200">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th class="text-left py-4 px-6 font-bold text-slate-700 border-b border-slate-200">Month</th>
                  <th class="text-right py-4 px-6 font-bold text-slate-700 border-b border-slate-200">Income</th>
                  <th class="text-right py-4 px-6 font-bold text-slate-700 border-b border-slate-200">Expenses</th>
                  <th class="text-right py-4 px-6 font-bold text-slate-700 border-b border-slate-200">Net</th>
                  <th class="text-right py-4 px-6 font-bold text-slate-700 border-b border-slate-200">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(month, index) in monthlyComparison" 
                  :key="month.month"
                  class="border-b border-slate-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 group"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <td class="py-4 px-6 text-slate-700 font-semibold group-hover:text-emerald-600 transition-colors">{{ month.month }}</td>
                  <td class="py-4 px-6 text-right">
                    <span class="text-emerald-600 font-bold text-lg">${{ formatCurrency(month.income) }}</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <span class="text-gold-600 font-bold text-lg">${{ formatCurrency(month.expenses) }}</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <span 
                      class="font-bold text-lg flex items-center justify-end gap-1"
                      :class="month.net >= 0 ? 'text-emerald-600' : 'text-red-600'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="month.net >= 0 ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'"></path>
                      </svg>
                      {{ month.net >= 0 ? '+' : '' }}${{ formatCurrency(Math.abs(month.net)) }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <div class="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-500"
                          :class="month.savingsRate >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'"
                          :style="`width: ${Math.min(Math.abs(month.savingsRate), 100)}%`"
                        ></div>
                      </div>
                      <span class="text-slate-700 font-bold min-w-[3rem]">{{ month.savingsRate }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Enhanced Key Insights -->
      <div class="dashboard-card">
        <div class="flex items-center mb-8">
          <div class="category-icon category-icon-income mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M17.66 7.05l-.707.707M16.47 12l-.707.707M17.66 16.95l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-slate-700">Financial Insights</h3>
            <p class="text-slate-500">AI-powered analysis of your financial patterns and trends</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="insight-card group hover-lift">
              <div class="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <!-- Animated background effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="relative flex items-start">
                  <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 mb-2 text-lg">Best Performing Month</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      <span class="font-semibold text-emerald-600">{{ insights.bestMonth }}</span> was your strongest month with 
                      <span class="font-bold">${{ formatCurrency(insights.bestMonthAmount) }}</span> net income
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="insight-card group hover-lift">
              <div class="p-6 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl border border-gold-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <!-- Animated background effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-gold-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="relative flex items-start">
                  <div class="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 mb-2 text-lg">Top Expense Category</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      <span class="font-semibold text-gold-600">{{ insights.topExpenseCategory }}</span> accounts for 
                      <span class="font-bold">${{ formatCurrency(insights.topExpenseAmount) }}</span> of your spending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="insight-card group hover-lift">
              <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <!-- Animated background effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="relative flex items-start">
                  <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 mb-2 text-lg">Average Monthly Savings</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      You save an average of <span class="font-bold text-blue-600">${{ formatCurrency(insights.avgMonthlySavings) }}</span> 
                      per month with a <span class="font-semibold">{{ insights.avgSavingsRate }}%</span> savings rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="insight-card group hover-lift">
              <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <!-- Animated background effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="relative flex items-start">
                  <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 mb-2 text-lg">Financial Trend</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      Your financial health shows <span class="font-semibold text-purple-600">{{ insights.trend }}</span> 
                      patterns over the selected period with consistent growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '../stores/transactions'
import { readFileAsText } from '../utils/helpers'
// ADDED: Import the chart component
import ExpensePieChart from '../components/charts/ExpensePieChart.vue'

const router = useRouter()
const transactionStore = useTransactionStore()

// Time period options
const timePeriods = [
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'All Time', value: 'allTime' },
  { label: 'Custom', value: 'custom' }
]

// Changed default to 'allTime' to show sample data immediately
const selectedPeriod = ref('allTime')
const customDateRange = ref({
  from: new Date().toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})
const analysisType = ref('expense')

// ADDED: Chart-specific state
const chartLoading = ref(false)
const chartPeriod = ref('month')

// Computed property to check if there are any transactions
const hasTransactions = computed(() => transactionStore.transactions.length > 0)

// Enhanced filtered transactions with better logging and date handling
const filteredTransactions = computed(() => {
  if (selectedPeriod.value === 'allTime') {
    return transactionStore.transactions
  }

  const now = new Date()
  let startDate, endDate
  
  switch (selectedPeriod.value) {
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      break
    case 'last3Months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      endDate = now
      break
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = now
      break
    case 'custom':
      if (customDateRange.value.from && customDateRange.value.to) {
        startDate = new Date(customDateRange.value.from)
        endDate = new Date(customDateRange.value.to)
        endDate.setHours(23, 59, 59, 999) // End of day
      } else {
        return []
      }
      break
    default:
      return []
  }
  
  return transactionStore.transactions.filter(t => {
    const transactionDate = new Date(t.createdAt || t.date)
    return transactionDate >= startDate && transactionDate <= endDate
  })
})

// Calculate summary data from filtered transactions
const filteredData = computed(() => {
  const incomeTransactions = filteredTransactions.value.filter(t => t.type === 'income')
  const expenseTransactions = filteredTransactions.value.filter(t => t.type === 'expense')
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  
  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
    incomeTransactions: incomeTransactions.length,
    expenseTransactions: expenseTransactions.length,
    avgTransaction: filteredTransactions.value.length > 0 
      ? filteredTransactions.value.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.value.length 
      : 0
  }
})

// Calculate category analysis
const categoryAnalysis = computed(() => {
  const transactions = filteredTransactions.value.filter(t => t.type === analysisType.value)
  const categories = {}
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  
  transactions.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = {
        name: t.category,
        amount: 0,
        count: 0
      }
    }
    
    categories[t.category].amount += t.amount
    categories[t.category].count += 1
  })
  
  // Convert to array and calculate percentages
  return Object.values(categories).map(category => ({
    ...category,
    percentage: totalAmount > 0 ? Math.round((category.amount / totalAmount) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)
})

// ADDED: Chart data computed properties
const expenseChartData = computed(() => {
  const expenseTransactions = filteredTransactions.value.filter(t => t.type === 'expense')
  const categories = {}
  
  expenseTransactions.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = {
        category: t.category,
        amount: 0,
        count: 0
      }
    }
    categories[t.category].amount += t.amount
    categories[t.category].count += 1
  })
  
  return Object.values(categories).sort((a, b) => b.amount - a.amount)
})

const incomeChartData = computed(() => {
  const incomeTransactions = filteredTransactions.value.filter(t => t.type === 'income')
  const categories = {}
  
  incomeTransactions.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = {
        category: t.category,
        amount: 0,
        count: 0
      }
    }
    categories[t.category].amount += t.amount
    categories[t.category].count += 1
  })
  
  return Object.values(categories).sort((a, b) => b.amount - a.amount)
})

// ADDED: Income vs Expenses trend data for line chart
const trendChartData = computed(() => {
  const months = {}
  const now = new Date()
  
  // Create last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    months[monthKey] = {
      month: monthKey,
      income: 0,
      expenses: 0
    }
  }
  
  // Fill with transaction data
  transactionStore.transactions.forEach(t => {
    const date = new Date(t.createdAt || t.date)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    if (months[monthKey]) {
      if (t.type === 'income') {
        months[monthKey].income += t.amount
      } else {
        months[monthKey].expenses += t.amount
      }
    }
  })
  
  return Object.values(months)
})

// Enhanced monthly comparison with better date handling
const monthlyComparison = computed(() => {
  const months = {}
  const now = new Date()
  
  // Create last 6 months
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    
    months[monthKey] = {
      month: monthName,
      income: 0,
      expenses: 0,
      net: 0,
      savingsRate: 0
    }
  }
  
  // Fill with transaction data - using all transactions, not just filtered
  transactionStore.transactions.forEach(t => {
    const date = new Date(t.createdAt || t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (months[monthKey]) {
      if (t.type === 'income') {
        months[monthKey].income += t.amount
      } else {
        months[monthKey].expenses += t.amount
      }
    }
  })
  
  // Calculate net and savings rate
  Object.values(months).forEach(month => {
    month.net = month.income - month.expenses
    month.savingsRate = month.income > 0 ? Math.round((month.net / month.income) * 100) : 0
  })
  
  return Object.values(months).sort((a, b) => {
    const aDate = new Date(a.month)
    const bDate = new Date(b.month)
    return bDate - aDate
  })
})

// Enhanced insights computation with better error handling
const insights = computed(() => {
  if (!hasTransactions.value || transactionStore.transactions.length === 0) {
    return {
      bestMonth: 'No data available',
      bestMonthAmount: 0,
      topExpenseCategory: 'No expenses recorded',
      topExpenseAmount: 0,
      avgMonthlySavings: 0,
      avgSavingsRate: 0,
      trend: 'stable'
    }
  }

  // Find best performing month from monthly comparison
  const monthlyData = monthlyComparison.value
  const bestMonth = monthlyData.reduce((best, current) => 
    current.net > best.net ? current : best, 
    monthlyData[0] || { month: 'No data', net: 0 }
  )

  // Get expense categories for top expense analysis
  const expenseTransactions = transactionStore.transactions.filter(t => t.type === 'expense')
  const expenseCategories = {}
  
  expenseTransactions.forEach(t => {
    if (!expenseCategories[t.category]) {
      expenseCategories[t.category] = { name: t.category, amount: 0 }
    }
    expenseCategories[t.category].amount += t.amount
  })
  
  const topExpenseCategory = Object.values(expenseCategories)
    .sort((a, b) => b.amount - a.amount)[0] || { name: 'No expenses', amount: 0 }

  // Calculate average monthly savings
  const totalMonths = monthlyData.length || 1
  const totalSavings = monthlyData.reduce((sum, month) => sum + month.net, 0)
  const avgMonthlySavings = totalSavings / totalMonths

  // Calculate average savings rate
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0)
  const avgSavingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0

  // Determine trend from recent months
  const recentMonths = monthlyData.slice(0, 3)
  const avgRecentNet = recentMonths.reduce((sum, month) => sum + month.net, 0) / (recentMonths.length || 1)
  const trend = avgRecentNet > 0 ? 'positive' : avgRecentNet < 0 ? 'negative' : 'stable'

  return {
    bestMonth: bestMonth.month,
    bestMonthAmount: Math.abs(bestMonth.net),
    topExpenseCategory: topExpenseCategory.name,
    topExpenseAmount: topExpenseCategory.amount,
    avgMonthlySavings: Math.abs(avgMonthlySavings),
    avgSavingsRate: Math.abs(avgSavingsRate),
    trend
  }
})

// Format currency helper - IMPROVED with null checking
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0)
  return numValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

// Animation helper
const animateCard = (event) => {
  const card = event.currentTarget
  card.classList.add('animate-pulse')
  setTimeout(() => {
    card.classList.remove('animate-pulse')
  }, 1000)
}

// IMPROVED: Export report with better error handling
const exportReport = (format) => {
  try {
    const data = transactionStore.exportTransactions(format)
    
    if (format === 'csv') {
      const blob = new Blob([data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `finance-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // For PDF, we'd typically use a library like jsPDF
      alert('PDF export functionality coming soon!')
    }
  } catch (error) {
    console.error('Export failed:', error)
    alert('Export failed. Please try again.')
  }
}

// Navigation helper
const goToTransactions = () => {
  router.push('/transactions')
}

// ADDED: Chart event handlers
const handleChartPeriodChange = (period) => {
  chartPeriod.value = period
  console.log('Chart period changed to:', period)
}

// Debug function for troubleshooting
const debugStore = () => {
  console.log('=== REPORTS DEBUG INFO ===')
  console.log('Total transactions:', transactionStore.transactions.length)
  console.log('Filtered transactions:', filteredTransactions.value.length)
  console.log('Selected period:', selectedPeriod.value)
  console.log('Has transactions:', hasTransactions.value)
  console.log('Expense chart data:', expenseChartData.value)
  console.log('Income chart data:', incomeChartData.value)
  console.log('Trend chart data:', trendChartData.value)
  console.log('Sample transaction dates:', transactionStore.transactions.slice(0, 3).map(t => ({
    id: t.id,
    date: new Date(t.createdAt || t.date).toLocaleDateString(),
    amount: t.amount
  })))
  console.log('Monthly comparison:', monthlyComparison.value.length)
  console.log('Insights:', insights.value)
  console.log('=== END DEBUG ===')
}

// Better initialization with sample data updating
const updateSampleDataToCurrent = () => {
  const now = new Date()
  let updated = false
  
  transactionStore.transactions.forEach((transaction, index) => {
    const transactionDate = new Date(transaction.createdAt || transaction.date)
    const currentYear = now.getFullYear()
    
    // If transaction is from a previous year, update to current year
    if (transactionDate.getFullYear() < currentYear) {
      const newDate = new Date(currentYear, now.getMonth() - (index % 6), Math.min(index + 1, 28))
      transaction.date = newDate
      transaction.createdAt = newDate
      updated = true
    }
  })
  
  if (updated) {
    transactionStore.saveToStorage()
    console.log('Sample data updated to current year for better demo experience')
  }
}

// Better initialization
onMounted(() => {
  // Initialize store
  transactionStore.initializeTransactions()
  
  // Update sample data to current dates for demo
  setTimeout(() => {
    updateSampleDataToCurrent()
    debugStore() // Show debug info after initialization
  }, 100)
})

// Watch for period changes to update custom date range
watch(selectedPeriod, (newValue) => {
  if (newValue === 'custom') {
    const now = new Date()
    customDateRange.value = {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      to: now.toISOString().split('T')[0]
    }
  }
})

// Watch for transaction changes for debugging
watch(
  () => transactionStore.transactions.length,
  (newCount, oldCount) => {
    console.log(`Transaction count changed: ${oldCount} -> ${newCount}`)
  }
)
</script>

<style scoped>
/* Base animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
  }
}

/* Animation classes */
.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-fade-in {
  animation: fadeInScale 0.6s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.category-analysis-card {
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

/* Enhanced hover effects */
.hover-scale:hover {
  transform: scale(1.02);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.scale-102 {
  transform: scale(1.02);
}

/* Enhanced shadow effects */
.shadow-glow-primary {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.shadow-glow-secondary {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

/* Chart container enhancements */
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.chart-container canvas {
  max-width: 100%;
  height: auto !important;
}

/* Trend chart specific styles */
.trend-bar {
  transition: all 0.3s ease;
  cursor: pointer;
}

.trend-bar:hover {
  transform: scaleY(1.1);
  filter: brightness(1.1);
}

.trend-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  transform: translateX(-50%) translateY(-100%);
  margin-top: -8px;
}

.trend-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

/* Enhanced responsive design */
@media (max-width: 1024px) {
  .dashboard-card {
    padding: 1.25rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .chart-container {
    min-height: 180px;
  }
  
  /* Stack charts vertically on tablets */
  .lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .category-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .chart-container {
    min-height: 160px;
  }
  
  /* Mobile adjustments for period selector */
  .expense-period-selector {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .expense-period-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  /* Stack summary cards on mobile */
  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  /* Adjust category analysis grid */
  .lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  /* Mobile table adjustments */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  table th,
  table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  /* Mobile insights grid */
  .md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .container-app {
    padding: 1rem;
  }
  
  .dashboard-card {
    padding: 0.875rem;
  }
  
  .text-4xl {
    font-size: 1.75rem;
  }
  
  .text-2xl {
    font-size: 1.125rem;
  }
  
  .chart-container {
    min-height: 140px;
  }
  
  /* Single column for summary cards on small mobile */
  .lg\\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  /* Compact period selector */
  /* Custom period selector adjustments for mobile */
  .period-selector-mobile {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .period-selector-mobile button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  /* Hide less important elements on very small screens */
  .category-icon {
    display: none;
  }
  
  .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }
}

/* Enhanced loading states */
.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.75rem;
}

.chart-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced no-data state */
.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.75rem;
  border: 2px dashed #cbd5e1;
}

.no-data-icon {
  width: 3rem;
  height: 3rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.no-data-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.no-data-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

/* Enhanced accessibility */
@media (prefers-reduced-motion: reduce) {
  .dashboard-card,
  .category-analysis-card,
  .insight-card {
    animation: none !important;
    transition: none !important;
  }
  
  .animate-shimmer,
  .animate-float,
  .hover-lift,
  .hover-scale {
    animation: none !important;
    transform: none !important;
  }
  
  .trend-bar:hover {
    transform: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .dashboard-card {
    border: 2px solid #000;
    background: #fff;
  }
  
  .shadow-glow-primary,
  .shadow-glow-secondary {
    box-shadow: 0 0 0 2px #000;
  }
  
  .bg-gradient-to-br {
    background: #fff !important;
    border: 1px solid #000 !important;
  }
}

/* Print styles */
@media print {
  .hover-lift,
  .hover-scale,
  .animate-float,
  .animate-shimmer {
    transform: none !important;
    animation: none !important;
  }
  
  .dashboard-card::before {
    display: none !important;
  }
  
  .shadow-glow-primary,
  .shadow-glow-secondary {
    box-shadow: none !important;
  }
  
  .bg-gradient-to-br {
    background: #f8f9fa !important;
  }
  
  .chart-container {
    break-inside: avoid;
  }
  
  /* Hide interactive elements when printing */
  button {
    display: none !important;
  }
  
  .hover\\:bg-emerald-50 {
    background: transparent !important;
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  .dashboard-card {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(71, 85, 105, 0.3);
  }
  
  .text-slate-700 {
    color: #e2e8f0;
  }
  
  .text-slate-500 {
    color: #94a3b8;
  }
  
  .chart-loading {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  }
  
  .no-data-state {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-color: #475569;
  }
}

/* Focus management for better accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Ensure charts are accessible */
canvas {
  outline: none;
}

canvas:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Enhanced transitions for better UX */
.dashboard-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-analysis-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.insight-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Micro-interactions */
.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.category-analysis-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* Ensure text remains readable at all sizes */
@media (max-width: 480px) {
  .text-xs {
    font-size: 0.75rem;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }
  
  .font-bold {
    font-weight: 600;
  }
}
</style>