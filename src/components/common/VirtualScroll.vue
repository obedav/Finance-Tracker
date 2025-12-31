<template>
  <VirtualList
    :data-key="dataKey"
    :data-sources="items"
    :data-component="itemComponent"
    :estimate-size="estimateSize"
    :keeps="keeps"
    :page-mode="pageMode"
    @scroll="handleScroll"
    @tobottom="handleBottom"
    @totop="handleTop"
  />
</template>

<script setup lang="ts">
// @ts-ignore - vue3-virtual-scroll-list doesn't have types
import VirtualList from 'vue3-virtual-scroll-list'

interface Props {
  items: any[]
  dataKey: string
  itemComponent: any
  estimateSize?: number
  keeps?: number
  pageMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  estimateSize: 80,
  keeps: 30,
  pageMode: false,
})

const emit = defineEmits<{
  (e: 'scroll', event: Event): void
  (e: 'bottom'): void
  (e: 'top'): void
}>()

const handleScroll = (event: Event) => {
  emit('scroll', event)
}

const handleBottom = () => {
  emit('bottom')
}

const handleTop = () => {
  emit('top')
}
</script>

<style scoped>
/* Add any virtual scroll specific styles here */
</style>
