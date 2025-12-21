// src/utils/constants.js

// Application Information
export const APP_INFO = {
  name: 'FinanceTracker',
  version: '1.0.0',
  description: 'Personal Finance Management Application',
  author: 'Your Name',
  website: 'https://financetracker.app'
}

// Color Palette
export const COLORS = {
  primary: '#10B981',      // Emerald Green
  secondary: '#F59E0B',    // Gold/Amber
  background: '#FAF9F6',   // Cream White
  text: '#334155',         // Slate Gray
  border: '#E5E7EB',       // Light Gray
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Opacity Variants
  primaryLight: '#10B98120',
  secondaryLight: '#F59E0B20',
  successLight: '#10B98110',
  warningLight: '#F59E0B10',
  errorLight: '#EF444410'
}

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
}

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
}

// Default Categories
export const DEFAULT_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other'
  ],
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Other'
  ]
}

// Currency Options
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' }
]

// Date Formats
export const DATE_FORMATS = {
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'DD/MM/YYYY': 'DD/MM/YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'DD MMM YYYY': 'DD MMM YYYY',
  'MMM DD, YYYY': 'MMM DD, YYYY'
}

// Language Options
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Time Periods
export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  ALL_TIME: 'all_time',
  CUSTOM: 'custom'
}

// Chart Types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area',
  RADAR: 'radar'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'finance_user',
  TOKEN: 'finance_token',
  REFRESH_TOKEN: 'finance_refresh_token',
  TRANSACTIONS: 'finance_transactions',
  CATEGORIES: 'finance_categories',
  PREFERENCES: 'finance_preferences',
  NOTIFICATIONS: 'finance_notifications',
  PRIVACY: 'finance_privacy',
  BUDGET: 'finance_budget',
  GOALS: 'finance_goals',
  THEME: 'finance_theme'
}

// API Endpoints (Updated to match Laravel backend on port 8000)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',

  // Health Check
  HEALTH: 'http://127.0.0.1:8000/api/health',
  
  // Authentication Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_RESET: '/auth/request-reset',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Add these missing 2FA endpoints:
    ENABLE_2FA: '/auth/enable-2fa',
    DISABLE_2FA: '/auth/disable-2fa',
    VERIFY_2FA: '/auth/verify-2fa'
  },

    SETTINGS: {
    GET: '/user/preferences',
    UPDATE_PREFERENCES: '/user/preferences',
    UPDATE_NOTIFICATIONS: '/user/notifications',
    EXPORT_DATA: '/user/export',
    DELETE_ALL_DATA: '/user/data',
    UPDATE_AUTO_BACKUP: '/user/auto-backup'
  },
  
  // Transaction Endpoints
  TRANSACTIONS: {
    BASE: '/transactions',
    LIST: '/transactions',
    CREATE: '/transactions',
    GET: '/transactions/:id',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id',
    BULK_DELETE: '/transactions',
    STATISTICS: '/transactions/statistics',
    TRENDS: '/transactions/trends',
    IMPORT: '/transactions/import',
    EXPORT: '/transactions/export'
  },
  
  // Category Endpoints
  CATEGORIES: {
    BASE: '/categories',
    LIST: '/categories',
    CREATE: '/categories',
    GET: '/categories/:id',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
    STATISTICS: '/categories/statistics',
    DEFAULTS: '/categories/defaults',
    RESTORE: '/categories/:id/restore'
  },
  
  // Budget Endpoints
  BUDGETS: {
    BASE: '/budgets',
    LIST: '/budgets',
    CREATE: '/budgets',
    GET: '/budgets/:id',
    UPDATE: '/budgets/:id',
    DELETE: '/budgets/:id'
  },

  // Report Endpoints
  REPORTS: {
    MONTHLY: '/reports/monthly',
    YEARLY: '/reports/yearly',
    CATEGORY: '/reports/category',
    EXPORT: '/reports/export'
  },
  
  // User Management (if needed later)
  USER: {
    PROFILE: '/auth/profile',
    PREFERENCES: '/user/preferences',
    NOTIFICATIONS: '/user/notifications',
    PRIVACY: '/user/privacy'
  }
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999999.99,
    PATTERN: /^\d+(\.\d{1,2})?$/
  },
  DESCRIPTION: {
    MAX_LENGTH: 255
  },
  CATEGORY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/
  }
}

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['text/csv', 'application/json', 'text/plain'],
    EXPORTS: ['application/pdf', 'text/csv', 'application/json']
  }
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 15,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100],
  MAX_PAGE_SIZE: 100
}

// Toast Notification Settings
export const TOAST_SETTINGS = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 7000
  },
  POSITION: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center'
  }
}

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
}

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  EXPORT_PDF: true,
  IMPORT_CSV: true,
  BUDGET_ALERTS: true,
  GOAL_TRACKING: true,
  MULTI_CURRENCY: true,
  CATEGORIES_MANAGEMENT: true,
  ADVANCED_REPORTS: true,
  TWO_FACTOR_AUTH: false, // Not implemented yet
  REAL_TIME_SYNC: false   // Not implemented yet
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! Login successful.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  REGISTER_SUCCESS: 'Account created successfully! Please log in.',
  TRANSACTION_ADDED: 'Transaction added successfully!',
  TRANSACTION_UPDATED: 'Transaction updated successfully!',
  TRANSACTION_DELETED: 'Transaction deleted successfully!',
  TRANSACTIONS_DELETED: 'Selected transactions deleted successfully!',
  CATEGORY_ADDED: 'Category added successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  CATEGORY_RESTORED: 'Category restored successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  DATA_IMPORTED: 'Data imported successfully!',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully! Please log in with your new password.'
}

// Budget Alert Thresholds
export const BUDGET_THRESHOLDS = {
  WARNING: 80,  // 80% of budget
  DANGER: 100   // 100% of budget (exceeded)
}

// Goal Types
export const GOAL_TYPES = {
  SAVINGS: 'savings',
  DEBT_PAYOFF: 'debt_payoff',
  INVESTMENT: 'investment',
  EMERGENCY_FUND: 'emergency_fund',
  VACATION: 'vacation',
  PURCHASE: 'purchase',
  OTHER: 'other'
}

// Export/Import Formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
}

// Request Timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000

// Rate Limiting
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  AUTH_REQUESTS_PER_MINUTE: 10,
  FILE_UPLOADS_PER_HOUR: 20
}

// Default Settings
export const DEFAULT_SETTINGS = {
  CURRENCY: 'USD',
  DATE_FORMAT: 'MM/DD/YYYY',
  THEME: 'light',
  LANGUAGE: 'en',
  NOTIFICATIONS: {
    email: true,
    budgetAlerts: true,
    monthlyReports: true,
    goalReminders: false
  },
  PRIVACY: {
    dataSharing: false,
    analytics: true,
    marketingEmails: false,
    autoBackup: true
  }
}

export default {
  APP_INFO,
  COLORS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  DEFAULT_CATEGORIES,
  CURRENCIES,
  DATE_FORMATS,
  LANGUAGES,
  THEMES,
  TIME_PERIODS,
  CHART_TYPES,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HTTP_STATUS,
  VALIDATION_RULES,
  FILE_LIMITS,
  PAGINATION,
  TOAST_SETTINGS,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  BUDGET_THRESHOLDS,
  GOAL_TYPES,
  EXPORT_FORMATS,
  REQUEST_TIMEOUT,
  RATE_LIMITS,
  DEFAULT_SETTINGS
}