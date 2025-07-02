<!-- src/components/transactions/TransactionSearch.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-[#334155]">Search Transactions</h3>
      <button
        v-if="hasActiveSearch"
        @click="clearSearch"
        class="text-sm text-[#F59E0B] hover:text-[#F59E0B]/80 font-medium transition-colors"
      >
        Clear Search
      </button>
    </div>

    <div class="space-y-4">
      <!-- Main Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-[#334155]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by description, amount, category..."
          class="w-full pl-12 pr-12 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
        />
        <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-4 flex items-center">
          <svg class="animate-spin w-4 h-4 text-[#334155]/60" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <button
          v-else-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#334155]/60 hover:text-[#334155]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Advanced Search Toggle -->
      <div class="flex items-center justify-between">
        <button
          @click="showAdvanced = !showAdvanced"
          class="flex items-center space-x-2 text-sm text-[#334155]/70 hover:text-[#334155] transition-colors"
        >
          <svg 
            :class="['w-4 h-4 transition-transform', showAdvanced ? 'rotate-90' : '']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span>Advanced Search</span>
        </button>

        <!-- Search Stats -->
        <div v-if="searchResults.length > 0" class="text-sm text-[#334155]/60">
          {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }} found
        </div>
      </div>

      <!-- Advanced Search Options -->
      <div v-if="showAdvanced" class="space-y-4 pt-4 border-t border-[#E5E7EB]">
        <!-- Search Fields -->
        <div>
          <label class="block text-sm font-medium text-[#334155] mb-2">Search In</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center space-x-2">
              <input
                v-model="searchFields.description"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Description</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="searchFields.category"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Category</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="searchFields.amount"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Amount</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="searchFields.type"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Type</span>
            </label>
          </div>
        </div>

        <!-- Search Options -->
        <div>
          <label class="block text-sm font-medium text-[#334155] mb-2">Search Options</label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                v-model="searchOptions.caseSensitive"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Case sensitive</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="searchOptions.exactMatch"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Exact match only</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="searchOptions.regex"
                type="checkbox"
                class="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
              />
              <span class="text-sm text-[#334155]">Regular expression</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Saved Searches -->
      <div v-if="savedSearches.length > 0">
        <label class="block text-sm font-medium text-[#334155] mb-2">Saved Searches</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="savedSearch in savedSearches"
            :key="savedSearch.id"
            @click="loadSavedSearch(savedSearch)"
            class="inline-flex items-center px-3 py-1 bg-[#FAF9F6] text-[#334155] text-sm rounded-md border border-[#E5E7EB] hover:border-[#10B981] hover:bg-[#10B981]/5 transition-all group"
          >
            <span>{{ savedSearch.name }}</span>
            <button
              @click.stop="deleteSavedSearch(savedSearch.id)"
              class="ml-2 text-[#334155]/60 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </button>
        </div>
      </div>

      <!-- Save Current Search -->
      <div v-if="hasActiveSearch && showSaveSearch">
        <div class="flex items-center space-x-2">
          <input
            v-model="newSearchName"
            type="text"
            placeholder="Enter search name..."
            class="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] text-[#334155]"
            @keyup.enter="saveCurrentSearch"
          />
          <button
            @click="saveCurrentSearch"
            :disabled="!newSearchName.trim()"
            class="px-4 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#10B981]/90 disabled:bg-[#E5E7EB] disabled:text-[#334155]/50 transition-colors"
          >
            Save
          </button>
          <button
            @click="showSaveSearch = false"
            class="px-4 py-2 border border-[#E5E7EB] text-[#334155] rounded-md hover:bg-[#FAF9F6] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="hasActiveSearch" class="flex items-center justify-between pt-2">
        <button
          v-if="!showSaveSearch"
          @click="showSaveSearch = true"
          class="text-sm text-[#10B981] hover:text-[#10B981]/80 font-medium transition-colors"
        >
          Save this search
        </button>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm text-[#334155]/60">
            Found {{ searchResults.length }} transaction{{ searchResults.length !== 1 ? 's' : '' }}
          </span>
          <button
            @click="exportSearchResults"
            class="px-3 py-1 text-sm bg-[#F59E0B] text-white rounded-md hover:bg-[#F59E0B]/90 transition-colors"
          >
            Export Results
          </button>
        </div>
      </div>
    </div>

    <!-- Search Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="mt-4 pt-4 border-t border-[#E5E7EB]">
      <div class="text-sm font-medium text-[#334155] mb-2">Suggestions</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="applySuggestion(suggestion)"
          class="px-3 py-1 text-sm bg-[#10B981]/10 text-[#10B981] rounded-md hover:bg-[#10B981]/20 transition-colors"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useLocalStorage } from '../../composables/useLocalStorage'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search transactions...'
  }
})

const emit = defineEmits(['search-results', 'export-results'])

const { data: savedSearchesData } = useLocalStorage('saved_searches', [])

const searchQuery = ref('')
const isSearching = ref(false)
const showAdvanced = ref(false)
const showSaveSearch = ref(false)
const newSearchName = ref('')
const savedSearches = ref(savedSearchesData.value)

const searchFields = ref({
  description: true,
  category: true,
  amount: true,
  type: false
})

const searchOptions = ref({
  caseSensitive: false,
  exactMatch: false,
  regex: false
})

const hasActiveSearch = computed(() => {
  return searchQuery.value.trim().length > 0
})

const showSuggestions = computed(() => {
  return searchQuery.value.length > 0 && searchQuery.value.length < 3
})

const suggestions = computed(() => {
  if (!showSuggestions.value) return []
  
  const query = searchQuery.value.toLowerCase()
  const allTerms = new Set()
  
  props.transactions.forEach(transaction => {
    if (transaction.description) {
      transaction.description.toLowerCase().split(' ').forEach(word => {
        if (word.includes(query) && word.length > 2) {
          allTerms.add(word)
        }
      })
    }
    
    if (transaction.category.toLowerCase().includes(query)) {
      allTerms.add(transaction.category)
    }
  })
  
  return Array.from(allTerms).slice(0, 5)
})

const searchResults = computed(() => {
  if (!hasActiveSearch.value) return props.transactions
  
  const query = searchQuery.value.trim()
  let searchTerm = searchOptions.value.caseSensitive ? query : query.toLowerCase()
  
  return props.transactions.filter(transaction => {
    let matches = false
    
    // Build search text based on selected fields
    const searchTexts = []
    
    if (searchFields.value.description && transaction.description) {
      searchTexts.push(transaction.description)
    }
    
    if (searchFields.value.category) {
      searchTexts.push(transaction.category)
    }
    
    if (searchFields.value.amount) {
      searchTexts.push(transaction.amount.toString())
    }
    
    if (searchFields.value.type) {
      searchTexts.push(transaction.type)
    }
    
    const searchText = searchTexts.join(' ')
    const normalizedSearchText = searchOptions.value.caseSensitive ? searchText : searchText.toLowerCase()
    
    if (searchOptions.value.regex) {
      try {
        const regex = new RegExp(searchTerm, searchOptions.value.caseSensitive ? 'g' : 'gi')
        matches = regex.test(searchText)
      } catch (error) {
        // Invalid regex, fall back to simple search
        matches = normalizedSearchText.includes(searchTerm)
      }
    } else if (searchOptions.value.exactMatch) {
      matches = normalizedSearchText === searchTerm
    } else {
      matches = normalizedSearchText.includes(searchTerm)
    }
    
    return matches
  })
})

let searchTimeout
const handleSearch = () => {
  isSearching.value = true
  
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search-results', searchResults.value)
    isSearching.value = false
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  showSaveSearch.value = false
  emit('search-results', props.transactions)
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion
  handleSearch()
}

const saveCurrentSearch = () => {
  if (!newSearchName.value.trim()) return
  
  const newSearch = {
    id: Date.now(),
    name: newSearchName.value.trim(),
    query: searchQuery.value,
    fields: { ...searchFields.value },
    options: { ...searchOptions.value },
    createdAt: new Date().toISOString()
  }
  
  savedSearches.value.push(newSearch)
  savedSearchesData.value = savedSearches.value
  
  newSearchName.value = ''
  showSaveSearch.value = false
}

const loadSavedSearch = (savedSearch) => {
  searchQuery.value = savedSearch.query
  searchFields.value = { ...savedSearch.fields }
  searchOptions.value = { ...savedSearch.options }
  handleSearch()
}

const deleteSavedSearch = (searchId) => {
  savedSearches.value = savedSearches.value.filter(search => search.id !== searchId)
  savedSearchesData.value = savedSearches.value
}

const exportSearchResults = () => {
  emit('export-results', searchResults.value)
}

// Watch for advanced search option changes
watch([searchFields, searchOptions], () => {
  if (hasActiveSearch.value) {
    handleSearch()
  }
}, { deep: true })

// Initialize search
onMounted(() => {
  emit('search-results', props.transactions)
})
</script>