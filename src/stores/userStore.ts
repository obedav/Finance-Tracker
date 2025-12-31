import { defineStore } from 'pinia'
import userService from '@/services/userService'
import type { User } from '@/types/models'

interface UserState {
  user: User | null
  isLoaded: boolean
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoaded: false,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    fullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.name}`
    },
    initials: (state): string => {
      if (!state.user || !state.user.name) return ''
      const names = state.user.name.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      }
      return state.user.name.charAt(0).toUpperCase()
    },
    userEmail: (state): string => state.user?.email || '',
    userId: (state): number | null => state.user?.id || null
  },

  actions: {
    async fetchUserProfile(): Promise<User | null> {
      this.loading = true
      this.error = null

      try {
        const userData = await userService.getCurrentUser()
        this.user = userData
        this.isAuthenticated = true
        this.isLoaded = true
        return userData
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile'
        this.error = errorMessage
        return null
      } finally {
        this.loading = false
      }
    },

    async updateUserProfile(profileData: Partial<User>): Promise<User> {
      this.loading = true
      this.error = null

      try {
        const updatedUser = await userService.updateProfile(profileData)
        this.user = { ...this.user!, ...updatedUser }
        return updatedUser
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user profile'
        this.error = errorMessage
        throw error
      } finally {
        this.loading = false
      }
    },

    clearUserData(): void {
      this.user = null
      this.isAuthenticated = false
      this.isLoaded = false
      this.error = null
    }
  }
})
