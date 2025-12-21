// src/utils/clearMockData.js
// Utility to clear old localStorage mock data

export const clearMockData = () => {
  try {
    // Clear all finance-related localStorage items
    const keysToRemove = [
      'finance_transactions',
      'finance_categories',
      'finance_user',
      'finance_budget',
      'finance_goals',
      'finance_preferences',
      'finance_notifications',
      'finance_privacy',
      'mock_users'
    ]

    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log(`✅ Removed: ${key}`)
      }
    })

    console.log('🎉 All mock data cleared successfully!')
    console.log('💡 The app will now fetch data from the Laravel backend API')

    return {
      success: true,
      message: 'Mock data cleared successfully. Please refresh the page and login to fetch real data from the API.'
    }
  } catch (error) {
    console.error('❌ Error clearing mock data:', error)
    return {
      success: false,
      message: 'Failed to clear mock data: ' + error.message
    }
  }
}

// Auto-clear on import (optional - comment out if not desired)
// clearMockData()

export default clearMockData
