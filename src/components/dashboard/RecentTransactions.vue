I'll create a complete implementation for the RecentTransactions.vue component that will complement the other dashboard components and fit with the overall design of your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\dashboard\RecentTransactions.vue**
```vue
<!-- src/components/dashboard/RecentTransactions.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg p-6 border border-[#E5E7EB]">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-[#334155]">Recent Transactions</h3>
      <div class="flex items-center space-x-2">
        <button 
          @click="refreshTransactions" 
          class="p-2 rounded-full hover:bg-gray-100 text-[#334155]/70 transition-colors"
          :class="{ 'animate-spin': isRefreshing }"
          :disabled="isRefreshing"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
        <router-link 
          to="/transactions" 
          class="text-sm font-medium text-[#10B981] hover:text-[#10B981]/80 transition-colors"
        >
          View All
        </router-link>
      </div>
    </div>

    <!-- Transactions List -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-10 h-10 text-[#10B981]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="mt-3 text-sm text-[#334155]/70">Loading transactions...</p>
      </div>
    </div>

    <div v-else-if="transactions.length === 0" class="flex flex-col items-center justify-center py-12">
      <svg class="w-16 h-16 text-[#334155]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <p class="mt-4 text-[#334155]/70">No transactions yet</p>
      <button 
        @click="openAddTransactionModal" 
        class="mt-3 px-4 py-2 bg-[#10B981] text-white text-sm font-medium rounded-lg hover:bg-[#10B981]/90 transition-colors"
      >
        Add Your First Transaction
      </button>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id"
        class="flex items-center p-3 rounded-lg hover:bg-[#FAF9F6] transition-colors cursor-pointer"
        @click="viewTransactionDetails(transaction)"
      >
        <!-- Transaction Icon -->
        <div 
          class="p-2 rounded-full mr-4"
          :class="transaction.type === 'income' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'"
        >
          <svg v-if="transaction.type === 'income'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
          </svg>
        </div>
        
        <!-- Transaction Details -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div class="truncate">
              <p class="text-sm font-medium text-[#334155]">{{ transaction.description || getCategoryName(transaction.category) }}</p>
              <p class="text-xs text-[#334155]/70">{{ transaction.category }}</p>
            </div>
            <div class="text-right">
              <p 
                class="text-sm font-semibold"
                :class="transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#F59E0B]'"
              >
                {{ formatTransactionAmount(transaction.amount, transaction.type) }}
              </p>
              <p class="text-xs text-[#334155]/70">{{ formatDate(transaction.createdAt || transaction.date) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- View More Link -->
      <div class="pt-2 text-center">
        <router-link 
          to="/transactions" 
          class="inline-flex items-center text-sm font-medium text-[#10B981] hover:text-[#10B981]/80 transition-colors"
        >
          View All Transactions
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <TransactionDetailsModal
      v-if="showDetailsModal"
      :transaction="selectedTransaction"
      @close="closeDetailsModal"
      @edit="editTransaction"
      @delete="deleteTransaction"
    />

    <!-- Add Transaction Modal -->
    <TransactionModal
      v-if="showAddModal"
      @close="closeAddModal"
      @submit="handleTransactionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactions'
import TransactionDetailsModal from '@/components/TransactionDetailsModal.vue'
import TransactionModal from '@/components/TransactionModal.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

// Router
const router = useRouter()

// Store
const transactionStore = useTransactionStore()

// State
const isLoading = ref(true)
const isRefreshing = ref(false)
const transactions = ref([])
const showDetailsModal = ref(false)
const showAddModal = ref(false)
const selectedTransaction = ref(null)
const limit = ref(5) // Number of transactions to show

// Computed
const categoryMap = computed(() => {
  // This would typically come from a categories store or service
  // For now, we'll just return a simple mapping
  return {
    'salary': 'Salary',
    'freelance': 'Freelance Income',
    'investment': 'Investment Returns',
    'gift': 'Gifts Received',
    'groceries': 'Groceries',
    'dining': 'Dining Out',
    'utilities': 'Utilities',
    'rent': 'Rent/Mortgage',
    'entertainment': 'Entertainment',
    'transportation': 'Transportation',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'shopping': 'Shopping',
    'travel': 'Travel',
    'other': 'Other'
  }
})

// Methods
const fetchRecentTransactions = async () => {
  isLoading.value = true
  try {
    // In a real app, you might have a dedicated API call for recent transactions
    // Here we're using the store's recentTransactions computed property
    transactions.value = transactionStore.recentTransactions.slice(0, limit.value)
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const refreshTransactions = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    await transactionStore.initializeTransactions()
    await fetchRecentTransactions()
  } catch (error) {
  } finally {
    isRefreshing.value = false
  }
}

const viewTransactionDetails = (transaction) => {
  selectedTransaction.value = transaction
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedTransaction.value = null
}

const editTransaction = (transaction) => {
  closeDetailsModal()
  router.push(`/transactions/edit/${transaction.id}`)
}

const deleteTransaction = async (transaction) => {
  try {
    await transactionStore.deleteTransaction(transaction.id)
    closeDetailsModal()
    await fetchRecentTransactions()
  } catch (error) {
  }
}

const openAddTransactionModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const handleTransactionSubmit = async (transaction) => {
  try {
    await transactionStore.addTransaction(transaction)
    closeAddModal()
    await fetchRecentTransactions()
  } catch (error) {
  }
}

const getCategoryName = (categoryId) => {
  return categoryMap.value[categoryId] || categoryId
}

const formatTransactionAmount = (amount, type) => {
  const prefix = type === 'income' ? '+' : '-'
  return `${prefix}${formatCurrency(amount)}`
}

// Lifecycle
onMounted(() => {
  fetchRecentTransactions()
})
</script>

<style scoped>
/* Animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
.hover\:bg-gray-100:hover {
  background-color: rgba(243, 244, 246, 1);
}

.hover\:bg-\[\#FAF9F6\]:hover {
  background-color: #FAF9F6;
}

.hover\:bg-\[\#10B981\]\/90:hover {
  background-color: rgba(16, 185, 129, 0.9);
}

.hover\:text-\[\#10B981\]\/80:hover {
  color: rgba(16, 185, 129, 0.8);
}
</style>
  