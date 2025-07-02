Based on the project structure and design patterns I've observed in your finance tracker application, here's a complete implementation for CategoryList.vue:

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\categories\CategoryList.vue**
```vue
<!-- src/components/categories/CategoryList.vue -->
<template>
  <div class="category-list">
    <!-- Empty State -->
    <div 
      v-if="!categories || categories.length === 0" 
      class="bg-white rounded-lg shadow-lg p-8 text-center border border-[#E5E7EB]"
    >
      <div class="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-[#334155] mb-2">No Categories Found</h3>
      <p class="text-[#334155]/70 mb-6">
        {{ emptyMessage || `You haven't created any ${categoryType} categories yet.` }}
      </p>
      <button 
        v-if="showAddButton"
        @click="$emit('add')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Your First Category
      </button>
    </div>

    <!-- Category Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="bg-white rounded-lg shadow-lg p-6 border border-[#E5E7EB] hover:shadow-xl transition-shadow group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
              :style="{ backgroundColor: getCategoryColorWithOpacity(category) }"
            >
              <svg 
                class="w-6 h-6" 
                :style="{ color: category.color || getCategoryDefaultColor(category) }"
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
            <div>
              <div class="flex items-center">
                <h3 class="font-semibold text-[#334155]">{{ category.name }}</h3>
                <span 
                  v-if="category.isDefault" 
                  class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  Default
                </span>
                <span 
                  v-if="!category.isActive" 
                  class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  Inactive
                </span>
              </div>
              <p class="text-sm text-[#334155]/70 line-clamp-1">
                {{ category.description || `${capitalize(category.type)} category` }}
              </p>
            </div>
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity flex">
            <button 
              v-if="showEditButton"
              @click="$emit('edit', category)"
              class="text-[#334155]/70 hover:text-[#10B981] p-1 transition-colors"
              :title="`Edit ${category.name}`"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              v-if="showDeleteButton"
              @click="confirmDelete(category)"
              class="text-[#334155]/70 hover:text-[#F59E0B] p-1 transition-colors ml-2"
              :title="`Delete ${category.name}`"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-[#334155]/70">Transactions</span>
            <span class="font-medium text-[#334155]">{{ category.transactionCount || 0 }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-[#334155]/70">
              {{ category.type === 'income' ? 'Total Income' : 'Total Expenses' }}
            </span>
            <span 
              class="font-medium"
              :style="{ color: category.color || getCategoryDefaultColor(category) }"
            >
              {{ formatCurrency(category.totalAmount || 0) }}
            </span>
          </div>
          <div v-if="showProgressBar" class="w-full bg-[#E5E7EB] rounded-full h-2 mt-3">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :style="{
                width: `${getCategoryPercentage(category)}%`,
                backgroundColor: category.color || getCategoryDefaultColor(category)
              }"
            ></div>
          </div>
          <div v-if="showProgressBar && category.type === 'expense' && category.budgetLimit" class="flex justify-between text-xs mt-1">
            <span class="text-[#334155]/70">
              {{ formatCurrency(category.totalAmount || 0) }} of {{ formatCurrency(category.budgetLimit) }}
            </span>
            <span 
              :class="getBudgetStatusClass(category)"
            >
              {{ getBudgetStatusText(category) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-[#334155] mb-2">Delete Category</h3>
          <p class="text-[#334155]/70">
            Are you sure you want to delete <strong>{{ categoryToDelete?.name }}</strong>? 
            This action cannot be undone.
          </p>
          <p v-if="categoryToDelete?.transactionCount > 0" class="mt-2 text-sm text-red-600">
            Warning: This category is used in {{ categoryToDelete.transactionCount }} transactions.
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelDelete"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteAction"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  categoryType: {
    type: String,
    default: 'all',
    validator: (value) => ['all', 'income', 'expense'].includes(value)
  },
  emptyMessage: {
    type: String,
    default: ''
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: true
  },
  showProgressBar: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add', 'edit', 'delete'])

// Delete confirmation modal state
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getCategoryDefaultColor = (category) => {
  return category.type === 'income' ? '#10B981' : '#F59E0B'
}

const getCategoryColorWithOpacity = (category) => {
  const color = category.color || getCategoryDefaultColor(category)
  // Convert hex to rgba with 0.1 opacity
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }
  return color + '1A' // Add 10% opacity for hex colors
}

const getCategoryPercentage = (category) => {
  if (category.type === 'expense' && category.budgetLimit) {
    return Math.min(((category.totalAmount || 0) / category.budgetLimit) * 100, 100)
  } else if (category.type === 'income' && category.targetGoal) {
    return Math.min(((category.totalAmount || 0) / category.targetGoal) * 100, 100)
  }
  return 100 // Default to full width if no budget/target
}

const getBudgetStatusClass = (category) => {
  if (!category.budgetLimit || !category.totalAmount) return 'text-gray-500'
  
  const percentage = (category.totalAmount / category.budgetLimit) * 100
  
  if (percentage >= 100) return 'text-red-600 font-medium'
  if (percentage >= 80) return 'text-amber-600 font-medium'
  return 'text-emerald-600'
}

const getBudgetStatusText = (category) => {
  if (!category.budgetLimit || !category.totalAmount) return 'No budget set'
  
  const percentage = (category.totalAmount / category.budgetLimit) * 100
  const remaining = category.budgetLimit - category.totalAmount
  
  if (percentage >= 100) return 'Over budget'
  if (percentage >= 80) return 'Near limit'
  return `${formatCurrency(remaining)} left`
}

// Delete category handling
const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

const confirmDeleteAction = () => {
  emit('delete', categoryToDelete.value)
  showDeleteModal.value = false
  categoryToDelete.value = null
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>