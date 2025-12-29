<!-- src/components/CategoryModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div 
        v-if="isVisible" 
        class="category-modal-overlay" 
        @click.self="$emit('close')"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="category-modal-container">
          <!-- Enhanced Header -->
          <div class="category-modal-header">
            <div class="modal-title-section">
              <div class="modal-icon">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h3 id="modal-title" class="modal-title">
                  {{ category ? 'Edit Category' : 'Add New Category' }}
                </h3>
                <p class="modal-subtitle">Create a custom category for your transactions</p>
              </div>
            </div>
            <button 
              @click="$emit('close')"
              class="modal-close-btn"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="category-modal-body">
            <div class="form-grid">
              <!-- Category Name -->
              <div class="form-section">
                <label class="form-label" for="category-name">Category Name</label>
                <input
                  id="category-name"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter category name"
                  ref="nameInput"
                />
              </div>

              <!-- Category Type -->
              <div class="form-section">
                <label class="form-label">Category Type</label>
                <div class="type-selector">
                  <button
                    type="button"
                    @click="form.type = 'income'"
                    :class="['type-btn', { active: form.type === 'income' }]"
                    :aria-pressed="form.type === 'income'"
                  >
                    <div class="type-icon income">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                      </svg>
                    </div>
                    Income
                  </button>
                  <button
                    type="button"
                    @click="form.type = 'expense'"
                    :class="['type-btn', { active: form.type === 'expense' }]"
                    :aria-pressed="form.type === 'expense'"
                  >
                    <div class="type-icon expense">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                      </svg>
                    </div>
                    Expense
                  </button>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="form-section">
              <label class="form-label" for="category-description">Description</label>
              <textarea
                id="category-description"
                v-model="form.description"
                rows="3"
                class="form-textarea"
                placeholder="Describe what this category is used for..."
              ></textarea>
            </div>

            <!-- Icon Selection -->
            <div class="form-section">
              <label class="form-label">Icon</label>
              <div class="icon-grid">
                <button
                  v-for="icon in availableIcons"
                  :key="icon.name"
                  type="button"
                  @click="form.icon = icon.path"
                  :class="['icon-btn', { selected: form.icon === icon.path }]"
                  :title="icon.name"
                  :aria-label="`Select ${icon.name} icon`"
                  :aria-pressed="form.icon === icon.path"
                >
                  <svg 
                    class="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon.path"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button
                type="button"
                @click="$emit('close')"
                class="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="submit-btn"
                :class="{ disabled: !isFormValid }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ category ? 'Update Category' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: 'expense'
  },
  isVisible: {
    type: Boolean,
    default: false // Changed from true to false
  }
})

const emit = defineEmits(['close', 'submit'])

const nameInput = ref(null)

const form = ref({
  name: '',
  description: '',
  type: props.type || 'expense',
  icon: ''
})

const availableIcons = [
  { name: 'Money', path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
  { name: 'Shopping', path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z' },
  { name: 'Food', path: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' },
  { name: 'Transport', path: 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h3m10 0h3m-17 3h18' },
  { name: 'Entertainment', path: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Health', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: 'Education', path: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { name: 'Work', path: 'M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z' },
  { name: 'Gift', path: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { name: 'Home', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Travel', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Other', path: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z' }
]

const isFormValid = computed(() => {
  return form.value.name.trim() && form.value.type && form.value.icon
})

// Initialize form with category data if editing
const initializeForm = () => {
  if (props.category) {
    form.value = {
      name: props.category.name || '',
      description: props.category.description || '',
      type: props.category.type || 'expense',
      icon: props.category.icon || availableIcons[0].path
    }
  } else {
    form.value = {
      name: '',
      description: '',
      type: props.type || 'expense',
      icon: availableIcons[0].path
    }
  }
}

// Watch for category prop changes
watch(() => props.category, () => {
  initializeForm()
}, { immediate: true })

// Update type when prop changes
watch(() => props.type, (newType) => {
  if (newType && !props.category) {
    form.value.type = newType
  }
})

// Focus management
const focusFirstInput = () => {
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
    }
  })
}

// Watch for modal visibility and handle body scroll
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    focusFirstInput()
  } else {
    document.body.style.overflow = ''
  }
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const categoryData = {
    ...form.value,
    name: form.value.name.trim(),
    description: form.value.description.trim()
  }
  
  emit('submit', categoryData)
}

// Escape key handler
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.isVisible) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  initializeForm()
  if (props.isVisible) {
    focusFirstInput()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // Restore body scroll on unmount
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Dark Glass-styled Category modal */
.category-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Reduced from 100000 to standard high z-index */
  padding: 1rem;
}

.category-modal-container {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative; /* Ensure proper positioning */
}

.category-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0; /* Prevent button from shrinking */
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.category-modal-body {
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.95);
  transition: all 0.2s ease;
  box-sizing: border-box; /* Ensure proper box sizing */
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  resize: none;
  min-height: 80px; /* Ensure minimum height */
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.type-btn:hover {
  border-color: rgba(16, 185, 129, 0.6);
  background: rgba(16, 185, 129, 0.1);
  color: rgba(255, 255, 255, 1);
}

.type-btn.active {
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(16, 185, 129, 0.2);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.type-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.type-icon.income {
  background: #10b981;
}

.type-icon.expense {
  background: #f59e0b;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  max-height: 8rem;
  overflow-y: auto;
  padding: 0.25rem; /* Add small padding to prevent cutoff */
}

.icon-btn {
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1; /* Ensure square buttons */
}

.icon-btn:hover {
  border-color: rgba(16, 185, 129, 0.6);
  background: rgba(16, 185, 129, 0.1);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.icon-btn.selected {
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(16, 185, 129, 0.2);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.submit-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.submit-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom scrollbar for icon grid */
.icon-grid::-webkit-scrollbar {
  width: 4px;
}

.icon-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.icon-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.icon-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .category-modal-container,
.modal-leave-to .category-modal-container {
  transform: translateY(20px) scale(0.95);
}

.modal-enter-to .category-modal-container,
.modal-leave-from .category-modal-container {
  transform: translateY(0) scale(1);
}

/* Focus improvements for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #10b981 !important;
  outline-offset: 2px !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .category-modal-container {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .category-modal-header,
  .category-modal-body {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .icon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    flex: none;
  }
}

/* Ensure modal appears above all other content */
.category-modal-overlay {
  isolation: isolate;
}
</style>