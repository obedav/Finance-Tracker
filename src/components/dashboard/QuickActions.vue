I'll create a complete implementation for the QuickActions.vue component that will complement the other dashboard components and fit with the overall design of your finance tracker application.

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\dashboard\QuickActions.vue**
```vue
<!-- src/components/dashboard/QuickActions.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg p-6 border border-[#E5E7EB] h-full">
    <h3 class="text-lg font-semibold text-[#334155] mb-4">Quick Actions</h3>
    
    <!-- Primary Actions -->
    <div class="space-y-3 mb-6">
      <button 
        @click="openAddTransactionModal"
        class="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
      >
        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Transaction
      </button>
      
      <button 
        @click="navigateTo('/reports')"
        class="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
      >
        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        View Reports
      </button>
      
      <button 
        @click="navigateTo('/transactions')"
        class="w-full border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
      >
        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        View All Transactions
      </button>
    </div>
    
    <!-- Quick Add Buttons -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-[#334155]/70 mb-3">Quick Add</h4>
      <div class="grid grid-cols-2 gap-3">
        <button 
          @click="openQuickAddModal('income')"
          class="flex flex-col items-center justify-center p-4 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
          <span class="text-sm font-medium">Income</span>
        </button>
        
        <button 
          @click="openQuickAddModal('expense')"
          class="flex flex-col items-center justify-center p-4 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
          </svg>
          <span class="text-sm font-medium">Expense</span>
        </button>
      </div>
    </div>
    
    <!-- Common Categories -->
    <div v-if="frequentCategories.length > 0">
      <h4 class="text-sm font-medium text-[#334155]/70 mb-3">Frequent Categories</h4>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="category in frequentCategories" 
          :key="category.id"
          @click="openCategoryTransactionModal(category)"
          class="px-3 py-1 text-xs font-medium rounded-full bg-[#334155]/10 text-[#334155] hover:bg-[#334155]/20 transition-colors flex items-center"
        >
          <span 
            class="w-2 h-2 rounded-full mr-1.5"
            :class="category.type === 'income' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'"
          ></span>
          {{ category.name }}
        </button>
      </div>
    </div>
    
    <!-- Shortcuts -->
    <div class="mt-6 pt-6 border-t border-[#E5E7EB]">
      <h4 class="text-sm font-medium text-[#334155]/70 mb-3">Shortcuts</h4>
      <div class="grid grid-cols-2 gap-3">
        <button 
          @click="navigateTo('/settings/categories')"
          class="flex items-center justify-center p-3 bg-[#FAF9F6] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors text-[#334155] text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Categories
        </button>
        
        <button 
          @click="navigateTo('/settings/budgets')"
          class="flex items-center justify-center p-3 bg-[#FAF9F6] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors text-[#334155] text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Budgets
        </button>
        
        <button 
          @click="navigateTo('/settings/accounts')"
          class="flex items-center justify-center p-3 bg-[#FAF9F6] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors text-[#334155] text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          Accounts
        </button>
        
        <button 
          @click="navigateTo('/settings')"
          class="flex items-center justify-center p-3 bg-[#FAF9F6] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors text-[#334155] text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Settings
        </button>
      </div>
    </div>
    
    <!-- Transaction Modal -->
    <TransactionModal 
      v-if="showTransactionModal"
      :initialType="quickAddType"
      @close="closeTransactionModal"
      @submit="handleTransactionSubmit"
    />
    
    <!-- Category Transaction Modal -->
    <CategoryTransactionModal
      v-if="showCategoryModal"
      :category="selectedCategory"
      @close="closeCategoryModal"
      @submit="handleCategoryTransactionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionModal from '@/components/TransactionModal.vue'
import CategoryTransactionModal from '@/components/CategoryTransactionModal.vue'

// Router
const router = useRouter()

// Store
const transactionStore = useTransactionStore()

// State
const showTransactionModal = ref(false)
const showCategoryModal = ref(false)
const quickAddType = ref(null)
const selectedCategory = ref(null)
const frequentCategories = ref([])

// Methods
const navigateTo = (path) => {
  router.push(path)
}

const openAddTransactionModal = () => {
  quickAddType.value = null
  showTransactionModal.value = true
}

const openQuickAddModal = (type) => {
  quickAddType.value = type
  showTransactionModal.value = true
}

const closeTransactionModal = () => {
  showTransactionModal.value = false
  quickAddType.value = null
}

const handleTransactionSubmit = (transaction) => {
  transactionStore.addTransaction(transaction)
  closeTransactionModal()
  
  // Optionally show a success notification
  showNotification('Transaction added successfully')
  
  // Refresh frequent categories
  fetchFrequentCategories()
}

const openCategoryTransactionModal = (category) => {
  selectedCategory.value = category
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  selectedCategory.value = null
}

const handleCategoryTransactionSubmit = (transaction) => {
  transactionStore.addTransaction(transaction)
  closeCategoryModal()
  
  // Optionally show a success notification
  showNotification('Transaction added successfully')
}

const fetchFrequentCategories = async () => {
  try {
    // This would typically be an API call or store method
    // For now, we'll simulate with the most used categories from the transaction store
    const categories = await transactionStore.getFrequentCategories(5)
    frequentCategories.value = categories
  } catch (error) {
  }
}

const showNotification = (message, type = 'success') => {
  // This would integrate with your notification system
  // For now, we'll just log to console
  
  // If you have a notification system, you would use it here
  // Example: notificationStore.show({ message, type })
}

// Lifecycle
onMounted(() => {
  fetchFrequentCategories()
})
</script>

<style scoped>
/* Transition effects */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Group hover effect */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>