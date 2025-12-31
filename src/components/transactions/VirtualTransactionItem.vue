<!-- src/components/transactions/VirtualTransactionItem.vue -->
<!-- Wrapper component for TransactionItem to work with vue3-virtual-scroll-list -->
<template>
  <TransactionItem
    v-if="source"
    :transaction="source"
    :selectable="selectable"
    :is-selected="isSelected"
    :show-actions="showActions"
    :show-details="showDetails"
    :show-percentage="showPercentage"
    :percentage="percentage"
    @toggle-select="$emit('toggle-select', $event)"
    @edit="$emit('edit', $event)"
    @duplicate="$emit('duplicate', $event)"
    @delete="$emit('delete', $event)"
    :class="containerClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TransactionItem from './TransactionItem.vue'
import type { Transaction } from '@/types/models'

interface Props {
  source: Transaction  // Required by vue3-virtual-scroll-list
  index: number        // Required by vue3-virtual-scroll-list
  selectable?: boolean
  isSelected?: boolean
  showActions?: boolean
  showDetails?: boolean
  showPercentage?: boolean
  percentage?: number
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  isSelected: false,
  showActions: true,
  showDetails: false,
  showPercentage: false,
  percentage: 0,
  containerClass: 'px-6 py-4 hover:bg-[#FAF9F6] border-b border-[#E5E7EB]'
})

defineEmits<{
  (e: 'toggle-select', id: number | string): void
  (e: 'edit', transaction: Transaction): void
  (e: 'duplicate', transaction: Transaction): void
  (e: 'delete', id: number | string): void
}>()
</script>
