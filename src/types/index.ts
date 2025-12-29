/**
 * Core Type Definitions for Finance Tracker
 * Centralized, strict type definitions for the entire application
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User extends BaseEntity {
  name: string
  email: string
  email_verified_at: string | null
  profile_picture: string | null
  settings: UserSettings | null
}

export interface UserSettings {
  currency: string
  language: string
  timezone: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    budget_alerts: boolean
    transaction_reminders: boolean
  }
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  token?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category extends BaseEntity {
  user_id: number | null
  name: string
  type: TransactionType
  icon: string
  color: string
  description?: string
  is_default: boolean
  is_active: boolean
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction extends BaseEntity {
  user_id: number
  category_id: number
  type: TransactionType
  amount: number
  description: string
  date: string
  notes: string | null
  status: TransactionStatus
  receipt_path: string | null
  category?: Category
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}
