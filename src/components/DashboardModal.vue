<!-- src/components/DashboardModal.vue -->
<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="dashboard-modal-overlay"
      @click.self="closeModal"
    >
      <div class="dashboard-modal-container">
        <div class="dashboard-modal-header">
          <!-- Enhanced Header -->
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h2 class="modal-title">Add Quick Transaction</h2>
          </div>
          <button @click="closeModal" class="modal-close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="dashboard-modal-body">
          <!-- Enhanced Transaction Type Selection -->
          <div class="form-section">
            <label class="form-label">Transaction Type</label>
            <div class="type-selector">
              <button
                type="button"
                @click="form.type = 'income'"
                :class="['type-btn', { active: form.type === 'income' }]"
              >
                <div class="type-icon income">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                </div>
                <div class="type-info">
                  <div class="type-name">Income</div>
                  <div class="type-desc">Money coming in</div>
                </div>
              </button>
              <button
                type="button"
                @click="form.type = 'expense'"
                :class="['type-btn', { active: form.type === 'expense' }]"
              >
                <div class="type-icon expense">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                  </svg>
                </div>
                <div class="type-info">
                  <div class="type-name">Expense</div>
                  <div class="type-desc">Money going out</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Enhanced Amount Field -->
          <div class="form-section">
            <label class="form-label">Amount</label>
            <div class="amount-input-wrapper">
              <span class="currency-symbol">$</span>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="amount-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Enhanced Category Selection -->
          <div class="form-section">
            <label class="form-label">Category</label>
            <div class="category-select-wrapper">
              <select
                v-model="form.category"
                required
                class="category-select"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in availableCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <div class="select-arrow">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Enhanced Description Field -->
          <div class="form-section">
            <label class="form-label">Description (Optional)</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="description-input"
              placeholder="Add a note about this transaction..."
            ></textarea>
          </div>

          <!-- Enhanced Date Field -->
          <div class="form-section">
            <label class="form-label">Date</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="date-input"
            />
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="!isFormValid"
              class="submit-btn"
              :class="{ disabled: !isFormValid }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCategoriesStore } from '../stores/categories'

const categoriesStore = useCategoriesStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  type: 'expense',
  amount: null,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const availableCategories = computed(() => {
  // Get categories from store based on type
  return categoriesStore.categories
    .filter(cat => cat.type.toLowerCase() === form.value.type.toLowerCase())
    .map(cat => cat.name)
})

const isFormValid = computed(() => {
  return form.value.type && 
         form.value.amount && 
         form.value.amount > 0 && 
         form.value.category &&
         form.value.date
})

// Watch for type changes to reset category
watch(() => form.value.type, () => {
  form.value.category = ''
}, { immediate: false })

// Reset form when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
    nextTick(() => {
      focusFirstInput()
    })
  }
})

const resetForm = () => {
  form.value = {
    type: 'expense',
    amount: null,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const focusFirstInput = () => {
  const firstInput = document.querySelector('.dashboard-modal-container input, .dashboard-modal-container button[type="button"]')
  if (firstInput) {
    firstInput.focus()
  }
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const transactionData = {
    ...form.value,
    amount: parseFloat(form.value.amount),
    createdAt: form.value.date + 'T' + new Date().toTimeString().split(' ')[0],
    id: Date.now().toString()
  }

  emit('submit', transactionData)
  closeModal()
}

// Escape key handler
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Dark Glass-styled Dashboard modal matching CategoryModal */
.dashboard-modal-overlay {
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
  z-index: 100000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.dashboard-modal-container {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.dashboard-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
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
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.dashboard-modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  min-height: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.5rem;
  display: block;
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.type-btn:hover {
  border-color: rgba(16, 185, 129, 0.6);
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.type-btn.active {
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(16, 185, 129, 0.2);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.type-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.type-icon.income {
  background: #10b981;
}

.type-icon.expense {
  background: #f59e0b;
}

.type-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.type-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.amount-input-wrapper {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.amount-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.95);
  transition: all 0.2s ease;
}

.amount-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.amount-input:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.category-select-wrapper {
  position: relative;
}

.category-select {
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
  appearance: none;
  cursor: pointer;
}

.category-select option {
  background: rgba(31, 41, 55, 0.95);
  color: white;
}

.category-select:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.description-input {
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
  resize: none;
}

.description-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.description-input:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.date-input {
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
}

.date-input:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.8);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
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

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Focus improvements for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #10b981 !important;
  outline-offset: 2px !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .dashboard-modal-container {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .dashboard-modal-header,
  .dashboard-modal-body {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    flex: none;
  }
}
</style>