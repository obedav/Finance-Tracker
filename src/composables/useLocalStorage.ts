import { ref, watch, nextTick, type Ref } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface Serializer<T> {
  read: (value: string) => T
  write: (value: T) => string
}

export interface LocalStorageOptions<T> {
  serializer?: Serializer<T>
  syncAcrossInstances?: boolean
  deep?: boolean
}

export interface UseLocalStorageReturn<T> {
  data: Ref<T>
  save: (value: T) => void
  load: () => void
  remove: () => void
  exists: () => boolean
  clear: () => void
  getAllKeys: () => string[]
  getSize: () => number
  exportData: () => Record<string, unknown>
  importData: (data: Record<string, unknown>) => void
}

// In-memory storage to replace localStorage for Claude.ai compatibility
const memoryStorage = new Map<string, string>()

// Storage change listeners
const storageListeners = new Map<string, Set<Ref<unknown>>>()

// Default serializer
const defaultSerializer: Serializer<unknown> = {
  read: (value: string): unknown => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },
  write: (value: unknown): string => JSON.stringify(value)
}

export function useLocalStorage<T = unknown>(
  key: string,
  defaultValue: T | (() => T) | null = null,
  options: LocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = defaultSerializer as Serializer<T>,
    syncAcrossInstances = false,
    deep = true
  } = options

  // Initialize the reactive value
  const storedValue = memoryStorage.get(key)
  const initialValue = storedValue !== undefined
    ? serializer.read(storedValue)
    : (typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue) as T

  const data = ref(initialValue) as Ref<T>

  // Save to memory storage
  const save = (value: T): void => {
    try {
      const serializedValue = serializer.write(value)
      memoryStorage.set(key, serializedValue)

      // Notify other instances if sync is enabled
      if (syncAcrossInstances && storageListeners.has(key)) {
        storageListeners.get(key)?.forEach(listener => {
          if (listener !== data) {
            listener.value = value
          }
        })
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Load from memory storage
  const load = (): void => {
    try {
      const stored = memoryStorage.get(key)
      if (stored !== undefined) {
        data.value = serializer.read(stored)
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Remove from memory storage
  const remove = (): void => {
    try {
      memoryStorage.delete(key)
      data.value = (typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue) as T

      // Notify other instances
      if (syncAcrossInstances && storageListeners.has(key)) {
        storageListeners.get(key)?.forEach(listener => {
          if (listener !== data) {
            listener.value = data.value
          }
        })
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Check if key exists
  const exists = (): boolean => {
    return memoryStorage.has(key)
  }

  // Clear all storage
  const clear = (): void => {
    memoryStorage.clear()
    storageListeners.forEach((listeners) => {
      listeners.forEach(listener => {
        listener.value = null
      })
    })
  }

  // Get all keys
  const getAllKeys = (): string[] => {
    return Array.from(memoryStorage.keys())
  }

  // Get storage size
  const getSize = (): number => {
    return memoryStorage.size
  }

  // Export all data
  const exportData = (): Record<string, unknown> => {
    const exported: Record<string, unknown> = {}
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
  const importData = (data: Record<string, unknown>): void => {
    Object.entries(data).forEach(([key, value]) => {
      try {
        const serializedValue = serializer.write(value as T)
        memoryStorage.set(key, serializedValue)
      } catch (error) {
        // Silent error handling
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
    storageListeners.get(key)?.add(data)
  }

  // Save initial value if it doesn't exist
  if (!exists()) {
    save(data.value)
  }

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

// Utility functions
export function useStorageAsync<T = unknown>(
  key: string,
  defaultValue: T | (() => T) | null = null,
  options: LocalStorageOptions<T> = {}
) {
  const storage = useLocalStorage<T>(key, defaultValue, options)

  const saveAsync = async (value: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      try {
        storage.save(value)
        nextTick(() => resolve(value))
      } catch (error) {
        reject(error)
      }
    })
  }

  const loadAsync = async (): Promise<T> => {
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

export function useStorageGroup(
  keys: string[],
  options: Record<string, { defaultValue?: unknown; options?: LocalStorageOptions<unknown> }> = {}
) {
  const storageItems: Record<string, UseLocalStorageReturn<unknown>> = {}

  keys.forEach(key => {
    const defaultValue = options[key]?.defaultValue || null
    const itemOptions = options[key]?.options || {}
    storageItems[key] = useLocalStorage(key, defaultValue, itemOptions)
  })

  const saveAll = (): void => {
    Object.values(storageItems).forEach(item => {
      item.save(item.data.value)
    })
  }

  const loadAll = (): void => {
    Object.values(storageItems).forEach(item => {
      item.load()
    })
  }

  const removeAll = (): void => {
    Object.values(storageItems).forEach(item => {
      item.remove()
    })
  }

  const allExist = (): boolean => {
    return Object.values(storageItems).every(item => item.exists())
  }

  const exportGroup = (): Record<string, unknown> => {
    const exported: Record<string, unknown> = {}
    Object.entries(storageItems).forEach(([key, item]) => {
      exported[key] = item.data.value
    })
    return exported
  }

  const importGroup = (data: Record<string, unknown>): void => {
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

export function createStorageRef<T = unknown>(
  key: string,
  defaultValue: T | (() => T) | null = null,
  options: LocalStorageOptions<T> = {}
): Ref<T> {
  const { data } = useLocalStorage<T>(key, defaultValue, options)
  return data
}

class StorageEventEmitter {
  private listeners: Map<string, Set<(data: { type: string; key: string; value?: unknown }) => void>>

  constructor() {
    this.listeners = new Map()
  }

  on(key: string, callback: (data: { type: string; key: string; value?: unknown }) => void): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)?.add(callback)
  }

  off(key: string, callback: (data: { type: string; key: string; value?: unknown }) => void): void {
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.delete(callback)
    }
  }

  emit(key: string, data: { type: string; key: string; value?: unknown }): void {
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          // Silent error handling
        }
      })
    }
  }

  clear(): void {
    this.listeners.clear()
  }
}

export const storageEvents = new StorageEventEmitter()

export function useStorageWithEvents<T = unknown>(
  key: string,
  defaultValue: T | (() => T) | null = null,
  options: LocalStorageOptions<T> = {}
) {
  const storage = useLocalStorage<T>(key, defaultValue, options)

  const originalSave = storage.save
  const enhancedSave = (value: T): void => {
    originalSave(value)
    storageEvents.emit(key, { type: 'save', key, value })
    storageEvents.emit('*', { type: 'save', key, value })
  }

  const originalRemove = storage.remove
  const enhancedRemove = (): void => {
    originalRemove()
    storageEvents.emit(key, { type: 'remove', key })
    storageEvents.emit('*', { type: 'remove', key })
  }

  return {
    ...storage,
    save: enhancedSave,
    remove: enhancedRemove,
    on: (callback: (data: { type: string; key: string; value?: unknown }) => void) => storageEvents.on(key, callback),
    off: (callback: (data: { type: string; key: string; value?: unknown }) => void) => storageEvents.off(key, callback)
  }
}

export default useLocalStorage
