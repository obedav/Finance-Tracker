<!-- src/components/transactions/TransactionList.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg border border-[#E5E7EB]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-semibold text-[#334155]">
            Transactions 
            <span v-if="transactions.length > 0" class="text-sm font-normal text-[#334155]/60">
              ({{ transactions.length }} {{ transactions.length === 1 ? 'item' : 'items' }})
            </span>
          </h3>
          
          <!-- Bulk Actions -->
          <div v-if="selectedTransactions.length > 0" class="flex items-center space-x-2">
            <span class="text-sm text-[#334155]/60">
              {{ selectedTransactions.length }} selected
            </span>
            <button
              @click="bulkDelete"
              class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- View Toggle -->
          <div class="flex bg-[#FAF9F6] rounded-lg p-1">
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-all',
                viewMode === 'list' 
                  ? 'bg-white text-[#334155] shadow-sm' 
                  : 'text-[#334155]/60 hover:text-[#334155]'
              ]"
            >
              List
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-all',
                viewMode === 'grid' 
                  ? 'bg-white text-[#334155] shadow-sm' 
                  : 'text-[#334155]/60 hover:text-[#334155]'
              ]"
            >
              Grid
            </button>
          </div>

          <!-- Select All -->
          <button
            v-if="transactions.length > 0"
            @click="toggleSelectAll"
            class="flex items-center space-x-2 px-3 py-1 text-sm text-[#334155]/60 hover:text-[#334155] border border-[#E5E7EB] rounded-md hover:bg-[#FAF9F6] transition-all"
          >
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isSomeSelected"
              class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              readonly
            />
            <span>Select All</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center space-x-2 text-[#334155]/60">
        <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading transactions...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="transactions.length === 0" class="p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-[#FAF9F6] rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-[#334155]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h4 class="text-lg font-medium text-[#334155] mb-2">No transactions found</h4>
      <p class="text-[#334155]/60 mb-4">
        {{ hasFilters ? 'Try adjusting your filters to see more results.' : 'Start by adding your first transaction.' }}
      </p>
      <button
        v-if="!hasFilters"
        @click="$emit('add-transaction')"
        class="inline-flex items-center px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Transaction
      </button>
    </div>

    <!-- Transaction List -->
    <div v-else class="divide-y divide-[#E5E7EB]">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="divide-y divide-[#E5E7EB]">
        <TransactionItem
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          :transaction="transaction"
          :selectable="true"
          :is-selected="selectedTransactions.includes(transaction.id)"
          :show-actions="true"
          :show-percentage="showPercentages"
          :percentage="getTransactionPercentage(transaction)"
          @toggle-select="toggleSelect"
          @edit="$emit('edit-transaction', $event)"
          @duplicate="$emit('duplicate-transaction', $event)"
          @delete="$emit('delete-transaction', $event)"
          class="px-6 py-4 hover:bg-[#FAF9F6]"
        />
      </div>

      <!-- Grid View -->
      <div v-else class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TransactionItem
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            :transaction="transaction"
            :selectable="true"
            :is-selected="selectedTransactions.includes(transaction.id)"
            :show-actions="true"
            :show-details="true"
            @toggle-select="toggleSelect"
            @edit="$emit('edit-transaction', $event)"
            @duplicate="$emit('duplicate-transaction', $event)"
            @delete="$emit('delete-transaction', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-4 border-t border-[#E5E7EB]">
      <div class="flex items-center justify-between">
        <div class="text-sm text-[#334155]/60">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, transactions.length) }} 
          of {{ transactions.length }} transactions
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 text-sm border rounded-md transition-all',
              currentPage === 1
                ? 'border-[#E5E7EB] text-[#334155]/40 cursor-not-allowed'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981] hover:text-[#10B981]'
            ]"
          >
            Previous
          </button>
          
          <div class="flex space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-all',
                page === currentPage
                  ? 'bg-[#10B981] text-white'
                  : 'text-[#334155] hover:bg-[#FAF9F6]'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 text-sm border rounded-md transition-all',
              currentPage === totalPages
                ? 'border-[#E5E7EB] text-[#334155]/40 cursor-not-allowed'
                : 'border-[#E5E7EB] text-[#334155] hover:border-[#10B981] hover:text-[#10B981]'
            ]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TransactionItem from './TransactionItem.vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasFilters: {
    type: Boolean,
    default: false
  },
  showPercentages: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 15
  }
})

const emit = defineEmits([
  'add-transaction',
  'edit-transaction',
  'duplicate-transaction',
  'delete-transaction',
  'bulk-delete'
])

const viewMode = ref('list')
const currentPage = ref(1)
const selectedTransactions = ref([])

const totalPages = computed(() => {
  return Math.ceil(props.transactions.length / props.pageSize)
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.transactions.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
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
  
  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

const isAllSelected = computed(() => {
  return props.transactions.length > 0 && selectedTransactions.value.length === props.transactions.length
})

const isSomeSelected = computed(() => {
  return selectedTransactions.value.length > 0 && selectedTransactions.value.length < props.transactions.length
})

const toggleSelect = (transactionId) => {
  const index = selectedTransactions.value.indexOf(transactionId)
  if (index > -1) {
    selectedTransactions.value.splice(index, 1)
  } else {
    selectedTransactions.value.push(transactionId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTransactions.value = []
  } else {
    selectedTransactions.value = props.transactions.map(t => t.id)
  }
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedTransactions.value.length} selected transactions?`)) {
    emit('bulk-delete', selectedTransactions.value)
    selectedTransactions.value = []
  }
}

const getTransactionPercentage = (transaction) => {
  if (!props.showPercentages) return 0
  
  const total = props.transactions
    .filter(t => t.type === transaction.type)
    .reduce((sum, t) => sum + t.amount, 0)
  
  return total > 0 ? Math.round((transaction.amount / total) * 100) : 0
}

// Reset pagination when transactions change
watch(() => props.transactions.length, () => {
  currentPage.value = 1
  selectedTransactions.value = []
})

// Reset selection when transactions change
watch(() => props.transactions, () => {
  selectedTransactions.value = selectedTransactions.value.filter(id => 
    props.transactions.some(t => t.id === id)
  )
}, { deep: true })
</script>