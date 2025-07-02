<!-- src/components/transactions/TransactionItem.vue -->
<template>
  <div 
    :class="[
      'bg-white rounded-lg border transition-all duration-200 hover:shadow-md',
      isSelected ? 'border-[#10B981] shadow-md' : 'border-[#E5E7EB] hover:border-[#10B981]/30'
    ]"
  >
    <div class="p-4">
      <div class="flex items-center justify-between">
        <!-- Left Side: Selection, Icon, and Details -->
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <!-- Selection Checkbox -->
          <div v-if="selectable" class="flex-shrink-0">
            <input
              type="checkbox"
              :checked="isSelected"
              @change="$emit('toggle-select', transaction.id)"
              class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981] focus:ring-2"
            />
          </div>

          <!-- Transaction Type Indicator -->
          <div class="flex-shrink-0">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                transaction.type === 'income' 
                  ? 'bg-[#10B981]/10 text-[#10B981]' 
                  : 'bg-[#F59E0B]/10 text-[#F59E0B]'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  v-if="transaction.type === 'income'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-medium text-[#334155] truncate">
                {{ transaction.category }}
              </h4>
              <span 
                v-if="transaction.status"
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(transaction.status)
                ]"
              >
                {{ transaction.status }}
              </span>
            </div>
            
            <p 
              v-if="transaction.description" 
              class="text-sm text-[#334155]/70 truncate mb-1"
              :title="transaction.description"
            >
              {{ transaction.description }}
            </p>
            
            <div class="flex items-center space-x-4 text-xs text-[#334155]/60">
              <span class="flex items-center space-x-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ formatDate(transaction.createdAt || transaction.date) }}</span>
              </span>
              
              <span v-if="transaction.updatedAt && transaction.updatedAt !== transaction.createdAt" class="flex items-center space-x-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Updated {{ formatDate(transaction.updatedAt) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Amount and Actions -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <!-- Amount -->
          <div class="text-right">
            <div 
              :class="[
                'font-semibold text-lg',
                transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#F59E0B]'
              ]"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}${{ formatCurrency(transaction.amount) }}
            </div>
            <div v-if="showPercentage" class="text-xs text-[#334155]/60">
              {{ percentage }}% of {{ transaction.type }}
            </div>
          </div>

          <!-- Actions Menu -->
          <div class="relative" v-if="showActions">
            <button
              @click="showMenu = !showMenu"
              class="p-2 text-[#334155]/60 hover:text-[#334155] hover:bg-[#FAF9F6] rounded-lg transition-colors"
              :class="{ 'bg-[#FAF9F6] text-[#334155]': showMenu }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showMenu"
              v-click-outside="() => showMenu = false"
              class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10"
            >
              <button
                @click="handleEdit"
                class="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#FAF9F6] flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit</span>
              </button>
              
              <button
                @click="handleDuplicate"
                class="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#FAF9F6] flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span>Duplicate</span>
              </button>
              
              <div class="border-t border-[#E5E7EB] my-1"></div>
              
              <button
                @click="handleDelete"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expanded Details -->
      <div v-if="showDetails" class="mt-4 pt-4 border-t border-[#E5E7EB]">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-[#334155]/60">ID:</span>
            <span class="ml-2 text-[#334155] font-mono">{{ transaction.id }}</span>
          </div>
          <div>
            <span class="text-[#334155]/60">Type:</span>
            <span class="ml-2 text-[#334155] capitalize">{{ transaction.type }}</span>
          </div>
          <div>
            <span class="text-[#334155]/60">Category:</span>
            <span class="ml-2 text-[#334155]">{{ transaction.category }}</span>
          </div>
          <div>
            <span class="text-[#334155]/60">Amount:</span>
            <span class="ml-2 text-[#334155] font-medium">${{ formatCurrency(transaction.amount) }}</span>
          </div>
        </div>
        
        <div v-if="transaction.description" class="mt-3">
          <span class="text-[#334155]/60">Description:</span>
          <p class="mt-1 text-[#334155]">{{ transaction.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  },
  selectable: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  showPercentage: {
    type: Boolean,
    default: false
  },
  percentage: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['toggle-select', 'edit', 'duplicate', 'delete'])

const showMenu = ref(false)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffInDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-[#10B981]/10 text-[#10B981]'
    case 'pending':
      return 'bg-[#F59E0B]/10 text-[#F59E0B]'
    case 'cancelled':
      return 'bg-red-100 text-red-600'
    case 'failed':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.transaction)
}

const handleDuplicate = () => {
  showMenu.value = false
  emit('duplicate', props.transaction)
}

const handleDelete = () => {
  showMenu.value = false
  if (confirm('Are you sure you want to delete this transaction?')) {
    emit('delete', props.transaction.id)
  }
}

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>