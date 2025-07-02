// src/stores/index.js
import { createPinia } from 'pinia'

export default createPinia()

// src/stores/transactions.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  
  const totalIncome = computed(() => 
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )
  
  const totalExpenses = computed(() => 
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )
  
  const balance = computed(() => totalIncome.value - totalExpenses.value)
  
  const addTransaction = (transaction) => {
    transactions.value.unshift({
      id: Date.now(),
      ...transaction,
      createdAt: new Date()
    })
  }
  
  const updateTransaction = (id, updatedData) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index > -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...updatedData,
        updatedAt: new Date()
      }
    }
  }
  
  const deleteTransaction = (id) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index > -1) {
      transactions.value.splice(index, 1)
    }
  }
  
  return {
    transactions,
    loading,
    totalIncome,
    totalExpenses,
    balance,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
})