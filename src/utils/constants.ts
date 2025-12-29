// src/utils/constants.ts
// Type-safe application constants

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AppInfo {
  name: string
  version: string
  description: string
  author: string
  website: string
}

export interface ColorPalette {
  primary: string
  secondary: string
  background: string
  text: string
  border: string
  success: string
  warning: string
  error: string
  info: string
  primaryLight: string
  secondaryLight: string
  successLight: string
  warningLight: string
  errorLight: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
}

export interface Language {
  code: string
  name: string
  flag: string
}

export interface PasswordRule {
  MIN_LENGTH: number
  PATTERN: RegExp
}

export interface AmountRule {
  MIN: number
  MAX: number
  PATTERN: RegExp
}

export interface LengthRule {
  MIN_LENGTH?: number
  MAX_LENGTH?: number
  PATTERN?: RegExp
}

export interface ValidationRules {
  EMAIL: RegExp
  PHONE: RegExp
  PASSWORD: PasswordRule
  AMOUNT: AmountRule
  DESCRIPTION: LengthRule
  CATEGORY_NAME: LengthRule
  NAME: LengthRule
}

export interface FileTypes {
  IMAGES: string[]
  DOCUMENTS: string[]
  EXPORTS: string[]
}

export interface FileLimits {
  MAX_SIZE: number
  ALLOWED_TYPES: FileTypes
}

export interface ToastDuration {
  SHORT: number
  MEDIUM: number
  LONG: number
}

export interface ToastPosition {
  TOP_RIGHT: string
  TOP_LEFT: string
  BOTTOM_RIGHT: string
  BOTTOM_LEFT: string
  TOP_CENTER: string
  BOTTOM_CENTER: string
}

export interface ToastSettings {
  DURATION: ToastDuration
  POSITION: ToastPosition
}

export interface NotificationSettings {
  email: boolean
  budgetAlerts: boolean
  monthlyReports: boolean
  goalReminders: boolean
}

export interface PrivacySettings {
  dataSharing: boolean
  analytics: boolean
  marketingEmails: boolean
  autoBackup: boolean
}

export interface DefaultSettings {
  CURRENCY: string
  DATE_FORMAT: string
  THEME: string
  LANGUAGE: string
  NOTIFICATIONS: NotificationSettings
  PRIVACY: PrivacySettings
}

// ============================================================================
// APPLICATION INFORMATION
// ============================================================================

export const APP_INFO: AppInfo = {
  name: 'FinanceTracker',
  version: '1.0.0',
  description: 'Personal Finance Management Application',
  author: 'Your Name',
  website: 'https://financetracker.app'
} as const

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const COLORS: ColorPalette = {
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
} as const

// ============================================================================
// TRANSACTION ENUMS
// ============================================================================

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
} as const

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES]

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
} as const

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS]

// ============================================================================
// DEFAULT CATEGORIES
// ============================================================================

export const DEFAULT_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other'
  ] as const,
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Other'
  ] as const
} as const

// ============================================================================
// CURRENCY OPTIONS
// ============================================================================

export const CURRENCIES: readonly Currency[] = [
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
] as const

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMATS = {
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'DD/MM/YYYY': 'DD/MM/YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'DD MMM YYYY': 'DD MMM YYYY',
  'MMM DD, YYYY': 'MMM DD, YYYY'
} as const

export type DateFormat = typeof DATE_FORMATS[keyof typeof DATE_FORMATS]

// ============================================================================
// LANGUAGE OPTIONS
// ============================================================================

export const LANGUAGES: readonly Language[] = [
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
] as const

// ============================================================================
// THEME OPTIONS
// ============================================================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

export type Theme = typeof THEMES[keyof typeof THEMES]

// ============================================================================
// TIME PERIODS
// ============================================================================

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
} as const

export type TimePeriod = typeof TIME_PERIODS[keyof typeof TIME_PERIODS]

// ============================================================================
// CHART TYPES
// ============================================================================

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area',
  RADAR: 'radar'
} as const

export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES]

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
} as const

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

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
} as const

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',

  // Health Check
  HEALTH: 'http://localhost:8000/api/health',

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
    EXPORT_CSV: '/transactions/export/csv',
    IMPORT_CSV: '/transactions/import/csv',
    DOWNLOAD_TEMPLATE: '/transactions/import/template',
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

  // User Management
  USER: {
    PROFILE: '/auth/profile',
    PREFERENCES: '/user/preferences',
    NOTIFICATIONS: '/user/notifications',
    PRIVACY: '/user/privacy'
  }
} as const

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

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
} as const

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES: ValidationRules = {
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
} as const

// ============================================================================
// FILE UPLOAD LIMITS
// ============================================================================

export const FILE_LIMITS: FileLimits = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['text/csv', 'application/json', 'text/plain'],
    EXPORTS: ['application/pdf', 'text/csv', 'application/json']
  }
} as const

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 15,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100] as const,
  MAX_PAGE_SIZE: 100
} as const

// ============================================================================
// TOAST NOTIFICATION SETTINGS
// ============================================================================

export const TOAST_SETTINGS: ToastSettings = {
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
} as const

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
} as const

// ============================================================================
// BREAKPOINTS (matching Tailwind CSS)
// ============================================================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  // ✅ Implemented and Working
  DARK_MODE: true,
  BUDGET_ALERTS: true,
  CATEGORIES_MANAGEMENT: true,
  ADVANCED_REPORTS: true,
  IMPORT_CSV: true,
  EXPORT_CSV: true,
  EXPORT_PDF: true,

  // ❌ Not Implemented
  GOAL_TRACKING: false,
  MULTI_CURRENCY: false,
  RECEIPT_UPLOAD: false,
  TWO_FACTOR_AUTH: false,
  REAL_TIME_SYNC: false,
  BANK_INTEGRATION: false
} as const

// ============================================================================
// ERROR MESSAGES
// ============================================================================

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
} as const

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

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
} as const

// ============================================================================
// BUDGET ALERT THRESHOLDS
// ============================================================================

export const BUDGET_THRESHOLDS = {
  WARNING: 80,  // 80% of budget
  DANGER: 100   // 100% of budget (exceeded)
} as const

// ============================================================================
// GOAL TYPES
// ============================================================================

export const GOAL_TYPES = {
  SAVINGS: 'savings',
  DEBT_PAYOFF: 'debt_payoff',
  INVESTMENT: 'investment',
  EMERGENCY_FUND: 'emergency_fund',
  VACATION: 'vacation',
  PURCHASE: 'purchase',
  OTHER: 'other'
} as const

export type GoalType = typeof GOAL_TYPES[keyof typeof GOAL_TYPES]

// ============================================================================
// EXPORT/IMPORT FORMATS
// ============================================================================

export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
} as const

export type ExportFormat = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS]

// ============================================================================
// REQUEST TIMEOUT
// ============================================================================

export const REQUEST_TIMEOUT = 30000 as const

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  AUTH_REQUESTS_PER_MINUTE: 10,
  FILE_UPLOADS_PER_HOUR: 20
} as const

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

export const DEFAULT_SETTINGS: DefaultSettings = {
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
} as const

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

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
} as const
