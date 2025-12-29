Here's a complete implementation for CategoryManager.vue that integrates the CategoryList and CategoryForm components:

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\categories\CategoryManager.vue**
```vue
<template>
  <div class="category-manager">
    <!-- Header with Tabs -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6 border border-[#E5E7EB]">
      <div class="flex space-x-1 bg-[#FAF9F6] p-1 rounded-lg">
        <button
          @click="activeTab = 'income'"
          :class="[
            'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
            activeTab === 'income' 
              ? 'bg-[#10B981] text-white shadow-sm' 
              : 'text-[#334155]/70 hover:text-[#10B981]'
          ]"
        >
          Income Categories
        </button>
        <button
          @click="activeTab = 'expense'"
          :class="[
            'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
            activeTab === 'expense' 
              ? 'bg-[#F59E0B] text-white shadow-sm' 
              : 'text-[#334155]/70 hover:text-[#F59E0B]'
          ]"
        >
          Expense Categories
        </button>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white rounded-lg shadow-lg p-4 mb-6 border border-[#E5E7EB]">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <!-- Filter and Actions -->
        <div class="flex items-center space-x-4">
          <!-- Filter Dropdown -->
          <div class="relative">
            <select
              v-model="filterOption"
              class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="default">Default Only</option>
              <option value="custom">Custom Only</option>
            </select>
          </div>

          <!-- Add Category Button -->
          <button 
            @click="openAddCategoryModal"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Category
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-lg p-8 text-center border border-[#E5E7EB]">
      <div class="animate-spin w-12 h-12 mx-auto mb-4">
        <svg class="w-full h-full text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-[#334155]/70">Loading categories...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8 text-center border border-[#E5E7EB]">
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-[#334155] mb-2">Error Loading Categories</h3>
      <p class="text-[#334155]/70 mb-4">{{ error }}</p>
      <button 
        @click="fetchCategories"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>

    <!-- Category List -->
    <div v-else>
      <CategoryList
        :categories="filteredCategories"
        :categoryType="activeTab"
        :emptyMessage="getEmptyMessage()"
        @edit="editCategory"
        @delete="deleteCategory"
        @add="openAddCategoryModal"
      />
    </div>

    <!-- Category Form Modal -->
    <div 
      v-if="showCategoryModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[#334155]">
            {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
          </h2>
          <button 
            @click="closeCategoryModal"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <CategoryForm
          :category="editingCategory"
          :defaultType="activeTab"
          :submitButtonText="editingCategory ? 'Update Category' : 'Create Category'"
          :isSubmitting="isSubmitting"
          :parentCategories="parentCategoriesForForm"
          @submit="handleCategorySubmit"
          @cancel="closeCategoryModal"
        />
      </div>
    </div>

    <!-- Bulk Actions Modal -->
    <div 
      v-if="showBulkActionsModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[#334155]">Category Management</h2>
          <button 
            @click="showBulkActionsModal = false"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <button 
            @click="resetToDefaults"
            class="w-full flex items-center justify-between p-4 bg-[#FAF9F6] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 text-[#334155]/70 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span class="text-[#334155]">Reset to Default Categories</span>
            </div>
            <svg class="w-5 h-5 text-[#334155]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button 
            @click="importCategories"
            class="w-full flex items-center justify-between p-4 bg-[#FAF9F6] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <div class="flex items-center">
              Let me continue with the CategoryManager.vue implementation:

**File: c:\Users\obeda\Desktop\obe-finance-tracker\src\components\categories\CategoryManager.vue** (continued)
```vue
              <svg class="w-5 h-5 text-[#334155]/70 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span class="text-[#334155]">Import Categories</span>
            </div>
            <svg class="w-5 h-5 text-[#334155]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button 
            @click="exportCategories"
            class="w-full flex items-center justify-between p-4 bg-[#FAF9F6] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 text-[#334155]/70 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span class="text-[#334155]">Export Categories</span>
            </div>
            <svg class="w-5 h-5 text-[#334155]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div 
      v-if="showImportModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[#334155]">Import Categories</h2>
          <button 
            @click="showImportModal = false"
            class="text-[#334155]/70 hover:text-[#334155] transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              ref="fileInput" 
              accept=".json" 
              class="hidden" 
              @change="handleFileUpload"
            />
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-sm text-gray-600 mb-2">Drag and drop your JSON file here, or</p>
            <button 
              @click="$refs.fileInput.click()"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Files
            </button>
            <p class="text-xs text-gray-500 mt-2">Only JSON files are supported</p>
          </div>
          
          <div v-if="importError" class="text-sm text-red-600 p-2 bg-red-50 rounded">
            {{ importError }}
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="showImportModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button 
              @click="confirmImport"
              :disabled="!importData || isImporting"
              :class="[
                'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                importData && !isImporting 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              ]"
            >
              <span v-if="isImporting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
              <span v-else>Import</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import CategoryList from '@/components/categories/CategoryList.vue'
import CategoryForm from '@/components/forms/CategoryForm.vue'

// Store
const categoriesStore = useCategoriesStore()

// State
const activeTab = ref('income')
const searchQuery = ref('')
const filterOption = ref('all')
const loading = ref(false)
const error = ref(null)
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const isSubmitting = ref(false)
const showBulkActionsModal = ref(false)
const showImportModal = ref(false)
const importData = ref(null)
const importError = ref(null)
const isImporting = ref(false)

// Computed properties
const filteredCategories = computed(() => {
  let result = categoriesStore.categories.filter(cat => cat.type === activeTab.value)
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(cat => 
      cat.name.toLowerCase().includes(query) || 
      (cat.description && cat.description.toLowerCase().includes(query))
    )
  }
  
  // Apply additional filters
  switch (filterOption.value) {
    case 'active':
      result = result.filter(cat => cat.isActive !== false)
      break
    case 'inactive':
      result = result.filter(cat => cat.isActive === false)
      break
    case 'default':
      result = result.filter(cat => cat.isDefault)
      break
    case 'custom':
      result = result.filter(cat => !cat.isDefault)
      break
  }
  
  return result
})

const parentCategoriesForForm = computed(() => {
  return categoriesStore.categories
    .filter(cat => cat.type === activeTab.value && !cat.parentId)
    .map(cat => ({
      id: cat.id,
      name: cat.name
    }))
})

// Lifecycle hooks
onMounted(() => {
  fetchCategories()
})

// Watch for tab changes to reset search and filter
watch(activeTab, () => {
  searchQuery.value = ''
  filterOption.value = 'all'
})

// Methods
const fetchCategories = async () => {
  loading.value = true
  error.value = null
  
  try {
    await categoriesStore.initializeCategories()
  } catch (err) {
    error.value = err.message || 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

const getEmptyMessage = () => {
  if (searchQuery.value) {
    return `No ${activeTab.value} categories found matching "${searchQuery.value}"`
  }
  
  switch (filterOption.value) {
    case 'active':
      return `No active ${activeTab.value} categories found`
    case 'inactive':
      return `No inactive ${activeTab.value} categories found`
    case 'default':
      return `No default ${activeTab.value} categories found`
    case 'custom':
      return `No custom ${activeTab.value} categories found`
    default:
      return `No ${activeTab.value} categories found`
  }
}

const openAddCategoryModal = () => {
  editingCategory.value = null
  showCategoryModal.value = true
}

const editCategory = (category) => {
  editingCategory.value = { ...category }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
}

const handleCategorySubmit = async (formData) => {
  isSubmitting.value = true
  
  try {
    if (editingCategory.value) {
      await categoriesStore.updateCategory(editingCategory.value.id, formData)
    } else {
      await categoriesStore.addCategory(formData)
    }
    closeCategoryModal()
  } catch (err) {
    // You could show an error message here
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (category) => {
  try {
    await categoriesStore.deleteCategory(category.id)
  } catch (err) {
    // You could show an error message here
  }
}

const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset to default categories? This will remove all custom categories.')) {
    try {
      categoriesStore.resetToDefaults()
      showBulkActionsModal.value = false
        } catch (err) {
      // You could show an error message here
    }
  }
}

const importCategories = () => {
  importData.value = null
  importError.value = null
  showImportModal.value = true
  showBulkActionsModal.value = false
}

const exportCategories = () => {
  try {
    const exportData = categoriesStore.exportCategories()
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileName = `finance-categories-${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileName)
    linkElement.click()
    
    showBulkActionsModal.value = false
  } catch (err) {
    // You could show an error message here
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  importError.value = null
  
  // Validate file type
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    importError.value = 'Only JSON files are supported'
    return
  }
  
  try {
    const fileContent = await readFileAsText(file)
    const parsedData = JSON.parse(fileContent)
    
    // Basic validation of the imported data
    if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
      importError.value = 'Invalid file format. Expected a categories array.'
      return
    }
    
    importData.value = parsedData
  } catch (err) {
    importError.value = 'Failed to read file. Please make sure it is a valid JSON file.'
  }
}

const confirmImport = async () => {
  if (!importData.value) return
  
  isImporting.value = true
  importError.value = null
  
  try {
    const result = await categoriesStore.importCategories(importData.value.categories)
    showImportModal.value = false
    alert(`Successfully imported ${result.imported} categories.`)
  } catch (err) {
    importError.value = err.message || 'Failed to import categories'
  } finally {
    isImporting.value = false
  }
}

// Helper function to read file content
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
</script>

<style scoped>
/* Add any component-specific styles here */
.category-manager {
  /* Your styles */
}
</style>
      