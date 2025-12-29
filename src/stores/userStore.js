// src/stores/userStore.js
import { defineStore } from 'pinia'
import userService from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoaded: false,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    },
    initials: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName.charAt(0)}${state.user.lastName.charAt(0)}`
    },
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || null
  },

  actions: {
    async fetchUserProfile() {
      this.loading = true
      this.error = null
      
      try {
        const userData = await userService.getCurrentUser()
        this.user = userData
        this.isAuthenticated = true
        this.isLoaded = true
        return userData
      } catch (error) {
        this.error = error.message || 'Failed to fetch user profile'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateUserProfile(profileData) {
      this.loading = true
      this.error = null
      
      try {
        const updatedUser = await userService.updateProfile(profileData)
        this.user = { ...this.user, ...updatedUser }
        return updatedUser
      } catch (error) {
        this.error = error.message || 'Failed to update user profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearUserData() {
      this.user = null
      this.isAuthenticated = false
      this.isLoaded = false
      this.error = null
    }
  }
})