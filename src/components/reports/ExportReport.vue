<!-- src/views/reports/ExportReport.vue -->
<template>
  <div class="min-h-screen bg-cream p-6">
    <div class="container-app">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold text-slate-700">Export Reports</h1>
        <p class="text-slate-500">Generate and download your financial reports</p>
      </div>

      <!-- Export Options -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Quick Export -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Quick Export</h3>
          <div class="space-y-4">
            <button 
              @click="quickExport('transactions', 'csv')"
              :disabled="exporting"
              class="w-full btn-primary group"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export All Transactions (CSV)
            </button>
            
            <button 
              @click="quickExport('categories', 'json')"
              :disabled="exporting"
              class="w-full btn-secondary group"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              Export Categories (JSON)
            </button>
            
            <button 
              @click="quickExport('monthly', 'pdf')"
              :disabled="exporting"
              class="w-full btn-outline group"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Monthly Report (PDF)
            </button>
          </div>
        </div>

        <!-- Email Reports -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-700 mb-6">Email Reports</h3>
          <div class="space-y-4">
            <div>
              <label class="form-label">Email Address</label>
              <input 
                v-model="emailForm.address"
                type="email" 
                class="form-input" 
                placeholder="Enter email address"
              >
            </div>
            <div>
              <label class="form-label">Report Type</label>
              <select v-model="emailForm.reportType" class="form-input">
                <option value="monthly">Monthly Summary</option>
                <option value="yearly">Yearly Summary</option>
                <option value="category">Category Analysis</option>
                <option value="trends">Trends Report</option>
              </select>
            </div>
            <button 
              @click="emailReport"
              :disabled="!emailForm.address || emailing"
              class="w-full btn-primary"
            >
              <svg v-if="emailing" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {{ emailing ? 'Sending...' : 'Send Report' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Export -->
      <div class="card mb-8">
        <h3 class="text-lg font-semibold text-slate-700 mb-6">Custom Export</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="form-label">Report Type</label>
            <select v-model="customExport.type" class="form-input">
              <option value="transactions">Transactions</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="category">Category Report</option>
              <option value="trends">Trends Report</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Format</label>
            <select v-model="customExport.format" class="form-input">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Start Date</label>
            <input 
              v-model="customExport.startDate"
              type="date" 
              class="form-input"
            >
          </div>
          
          <div>
            <label class="form-label">End Date</label>
            <input 
              v-model="customExport.endDate"
              type="date" 
              class="form-input"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="form-label">Transaction Type</label>
            <select v-model="customExport.transactionType" class="form-input">
              <option value="">All</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Categories</label>
            <select v-model="customExport.categories" multiple class="form-input h-20">
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Include</label>
            <div class="space-y-2 mt-2">
              <label class="flex items-center">
                <input 
                  v-model="customExport.includeCharts" 
                  type="checkbox" 
                  class="mr-2"
                >
                <span class="text-sm">Charts & Graphs</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="customExport.includeSummary" 
                  type="checkbox" 
                  class="mr-2"
                >
                <span class="text-sm">Summary Statistics</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="customExport.includeInsights" 
                  type="checkbox" 
                  class="mr-2"
                >
                <span class="text-sm">Insights & Recommendations</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            @click="customExportReport"
            :disabled="exporting"
            class="btn-primary"
          >
            <svg v-if="exporting" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ exporting ? 'Generating...' : 'Generate Export' }}
          </button>
        </div>
      </div>

      <!-- Export History -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-700">Export History</h3>
          <button @click="clearHistory" class="btn-ghost btn-sm">
            Clear History
          </button>
        </div>

        <div v-if="exportHistory.length === 0" class="text-center py-8">
          <div class="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p class="text-slate-500">No exports yet</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="export_ in exportHistory" 
            :key="export_.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-slate-700">{{ export_.name }}</h4>
                <p class="text-sm text-slate-500">
                  {{ formatDate(export_.createdAt) }} • {{ export_.format.toUpperCase() }} • {{ export_.size }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                :class="getStatusColor(export_.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ export_.status }}
              </span>
              <button 
                v-if="export_.status === 'completed'"
                @click="downloadExport(export_)"
                class="btn-ghost btn-sm"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div 
        v-if="message.text" 
        :class="message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'"
        class="fixed bottom-6 right-6 p-4 border rounded-lg shadow-lg max-w-sm z-50"
      >
        <div class="flex items-center">
          <svg 
            v-if="message.type === 'success'"
            class="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg 
            v-else
            class="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>{{ message.text }}</span>
          <button @click="message.text = ''" class="ml-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import reportService from '@/services/reportService'
import transactionService from '@/services/transactionService'
import categoryService from '@/services/categoryService'
import { formatDate } from '@/utils/formatters'
import { getFromStorage, setToStorage } from '@/utils/helpers'

const exporting = ref(false)
const emailing = ref(false)
const availableCategories = ref([])
const exportHistory = ref([])

const emailForm = ref({
  address: '',
  reportType: 'monthly'
})

const customExport = ref({
  type: 'transactions',
  format: 'csv',
  startDate: '',
  endDate: '',
  transactionType: '',
  categories: [],
  includeCharts: true,
  includeSummary: true,
  includeInsights: false
})

const message = ref({
  text: '',
  type: 'success'
})

const showMessage = (text, type = 'success') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value.text = ''
  }, 5000)
}

const quickExport = async (type, format) => {
  exporting.value = true
  
  try {
    let result
    
    switch (type) {
      case 'transactions':
        if (format === 'csv') {
          result = await transactionService.exportTransactions({}, 'csv')
        } else {
          result = await transactionService.exportTransactions({}, 'json')
        }
        break
      case 'categories':
        result = await categoryService.exportCategories(format)
        break
      case 'monthly':
        if (format === 'pdf') {
          result = await reportService.exportReportPDF('monthly', {})
        } else {
          result = await reportService.exportReportExcel('monthly', {})
        }
        break
    }
    
    addToHistory({
      id: Date.now(),
      name: `${type}_${format}_${new Date().toISOString().split('T')[0]}`,
      type,
      format,
      status: 'completed',
      createdAt: new Date(),
      size: '2.4 MB' // Mock size
    })
    
    showMessage('Export completed successfully!')
  } catch (error) {
    console.error('Quick export error:', error)
    showMessage('Export failed. Please try again.', 'error')
  } finally {
    exporting.value = false
  }
}

const emailReport = async () => {
  emailing.value = true
  
  try {
    await reportService.emailReport(
      emailForm.value.reportType,
      emailForm.value.address,
      {}
    )
    
    showMessage(`Report sent to ${emailForm.value.address}`)
    emailForm.value.address = ''
  } catch (error) {
    console.error('Email report error:', error)
    showMessage('Failed to send report. Please try again.', 'error')
  } finally {
    emailing.value = false
  }
}

const customExportReport = async () => {
  exporting.value = true
  
  try {
    const parameters = {
      startDate: customExport.value.startDate,
      endDate: customExport.value.endDate,
      type: customExport.value.transactionType,
      categories: customExport.value.categories,
      includeCharts: customExport.value.includeCharts,
      includeSummary: customExport.value.includeSummary,
      includeInsights: customExport.value.includeInsights
    }
    
    let result
    
    if (customExport.value.format === 'pdf') {
      result = await reportService.exportReportPDF(customExport.value.type, parameters)
    } else {
      result = await reportService.exportReportExcel(customExport.value.type, parameters)
    }
    
    addToHistory({
      id: Date.now(),
      name: `custom_${customExport.value.type}_${customExport.value.format}_${new Date().toISOString().split('T')[0]}`,
      type: customExport.value.type,
      format: customExport.value.format,
      status: 'completed',
      createdAt: new Date(),
      size: '3.7 MB', // Mock size
      parameters
    })
    
    showMessage('Custom export completed successfully!')
  } catch (error) {
    console.error('Custom export error:', error)
    showMessage('Custom export failed. Please try again.', 'error')
  } finally {
    exporting.value = false
  }
}

const addToHistory = (exportItem) => {
  exportHistory.value.unshift(exportItem)
  // Keep only last 20 exports
  if (exportHistory.value.length > 20) {
    exportHistory.value = exportHistory.value.slice(0, 20)
  }
  saveHistory()
}

const clearHistory = () => {
  exportHistory.value = []
  saveHistory()
  showMessage('Export history cleared')
}

const downloadExport = (exportItem) => {
  // In a real app, this would download from server
  showMessage(`Downloading ${exportItem.name}...`)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'processing':
      return 'bg-gold-100 text-gold-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    availableCategories.value = response.categories?.map(cat => cat.name) || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadHistory = () => {
  const saved = getFromStorage('export_history', [])
  exportHistory.value = saved.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt)
  }))
}

const saveHistory = () => {
  setToStorage('export_history', exportHistory.value)
}

const initializeDates = () => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  customExport.value.startDate = firstDayOfMonth.toISOString().split('T')[0]
  customExport.value.endDate = today.toISOString().split('T')[0]
}

onMounted(() => {
  loadCategories()
  loadHistory()
  initializeDates()
})
</script>