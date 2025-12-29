// src/composables/useLocalStorage.js
import { ref, watch, nextTick } from 'vue'

// In-memory storage to replace localStorage for Claude.ai compatibility
const memoryStorage = new Map()

// Storage change listeners
const storageListeners = new Map()

export function useLocalStorage(key, defaultValue = null, options = {}) {
  const {
    serializer = {
      read: (value) => {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      },
      write: (value) => JSON.stringify(value)
    },
    syncAcrossInstances = false,
    deep = true
  } = options

  // Initialize the reactive value
  const storedValue = memoryStorage.get(key)
  const initialValue = storedValue !== undefined 
    ? serializer.read(storedValue) 
    : (typeof defaultValue === 'function' ? defaultValue() : defaultValue)

  const data = ref(initialValue)

  // Save to memory storage
  const save = (value) => {
    try {
      const serializedValue = serializer.write(value)
      memoryStorage.set(key, serializedValue)
      
      // Notify other instances if sync is enabled
      if (syncAcrossInstances && storageListeners.has(key)) {
        storageListeners.get(key).forEach(listener => {
          if (listener !== data) {
            listener.value = value
          }
        })
      }
    } catch (error) {
    }
  }

  // Load from memory storage
  const load = () => {
    try {
      const stored = memoryStorage.get(key)
      if (stored !== undefined) {
        data.value = serializer.read(stored)
      }
    } catch (error) {
    }
  }

  // Remove from memory storage
  const remove = () => {
    try {
      memoryStorage.delete(key)
      data.value = typeof defaultValue === 'function' ? defaultValue() : defaultValue
      
      // Notify other instances
      if (syncAcrossInstances && storageListeners.has(key)) {
        storageListeners.get(key).forEach(listener => {
          if (listener !== data) {
            listener.value = data.value
          }
        })
      }
    } catch (error) {
    }
  }

  // Check if key exists
  const exists = () => {
    return memoryStorage.has(key)
  }

  // Clear all storage
  const clear = () => {
    memoryStorage.clear()
    // Reset all listeners to default values
    storageListeners.forEach((listeners, storageKey) => {
      listeners.forEach(listener => {
        listener.value = null
      })
    })
  }

  // Get all keys
  const getAllKeys = () => {
    return Array.from(memoryStorage.keys())
  }

  // Get storage size
  const getSize = () => {
    return memoryStorage.size
  }

  // Export all data
  const exportData = () => {
    const exported = {}
    memoryStorage.forEach((value, key) => {
      try {
        exported[key] = serializer.read(value)
      } catch {
        exported[key] = value
      }
    })
    return exported
  }

  // Import data
  const importData = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      try {
        const serializedValue = serializer.write(value)
        memoryStorage.set(key, serializedValue)
      } catch (error) {
      }
    })
  }

  // Watch for changes and save automatically
  watch(
    data,
    (newValue) => {
      save(newValue)
    },
    { deep }
  )

  // Setup cross-instance syncing if enabled
  if (syncAcrossInstances) {
    if (!storageListeners.has(key)) {
      storageListeners.set(key, new Set())
    }
    storageListeners.get(key).add(data)
  }

  // Save initial value if it doesn't exist
  if (!exists()) {
    save(data.value)
  }

  // Return reactive value and utility functions
  return {
    data,
    save,
    load,
    remove,
    exists,
    clear,
    getAllKeys,
    getSize,
    exportData,
    importData
  }
}

// Utility functions for common storage operations
export function useStorageAsync(key, defaultValue = null, options = {}) {
  const storage = useLocalStorage(key, defaultValue, options)
  
  // Async save with promise
  const saveAsync = async (value) => {
    return new Promise((resolve, reject) => {
      try {
        storage.save(value)
        nextTick(() => resolve(value))
      } catch (error) {
        reject(error)
      }
    })
  }

  // Async load with promise
  const loadAsync = async () => {
    return new Promise((resolve, reject) => {
      try {
        storage.load()
        nextTick(() => resolve(storage.data.value))
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    ...storage,
    saveAsync,
    loadAsync
  }
}

// Hook for managing multiple storage keys as a group
export function useStorageGroup(keys, options = {}) {
  const storageItems = {}
  
  keys.forEach(key => {
    const defaultValue = options[key]?.defaultValue || null
    const itemOptions = options[key]?.options || {}
    storageItems[key] = useLocalStorage(key, defaultValue, itemOptions)
  })

  // Save all items
  const saveAll = () => {
    Object.values(storageItems).forEach(item => {
      item.save(item.data.value)
    })
  }

  // Load all items
  const loadAll = () => {
    Object.values(storageItems).forEach(item => {
      item.load()
    })
  }

  // Remove all items
  const removeAll = () => {
    Object.values(storageItems).forEach(item => {
      item.remove()
    })
  }

  // Check if all items exist
  const allExist = () => {
    return Object.values(storageItems).every(item => item.exists())
  }

  // Export all group data
  const exportGroup = () => {
    const exported = {}
    Object.entries(storageItems).forEach(([key, item]) => {
      exported[key] = item.data.value
    })
    return exported
  }

  // Import group data
  const importGroup = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (storageItems[key]) {
        storageItems[key].data.value = value
      }
    })
  }

  return {
    items: storageItems,
    saveAll,
    loadAll,
    removeAll,
    allExist,
    exportGroup,
    importGroup
  }
}

// Utility for creating a simple reactive storage value
export function createStorageRef(key, defaultValue = null, options = {}) {
  const { data } = useLocalStorage(key, defaultValue, options)
  return data
}

// Storage event emitter for cross-component communication
class StorageEventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key).add(callback)
  }

  off(key, callback) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).delete(callback)
    }
  }

  emit(key, data) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
        }
      })
    }
  }

  clear() {
    this.listeners.clear()
  }
}

export const storageEvents = new StorageEventEmitter()

// Enhanced storage with events
export function useStorageWithEvents(key, defaultValue = null, options = {}) {
  const storage = useLocalStorage(key, defaultValue, options)

  // Override save to emit events
  const originalSave = storage.save
  storage.save = (value) => {
    originalSave(value)
    storageEvents.emit(key, { type: 'save', key, value })
    storageEvents.emit('*', { type: 'save', key, value })
  }

  // Override remove to emit events
  const originalRemove = storage.remove
  storage.remove = () => {
    originalRemove()
    storageEvents.emit(key, { type: 'remove', key })
    storageEvents.emit('*', { type: 'remove', key })
  }

  return {
    ...storage,
    on: (callback) => storageEvents.on(key, callback),
    off: (callback) => storageEvents.off(key, callback)
  }
}

export default useLocalStorage