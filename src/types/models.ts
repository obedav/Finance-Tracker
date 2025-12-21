/**
 * Core Data Models and Type Definitions
 * Comprehensive TypeScript types for the Finance Tracker application
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface UserRegistration {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  created_at: string
  updated_at: string
}

export interface CategoryFormData {
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
}

export interface CategoryStats {
  category_id: number
  category_name: string
  total: number
  count: number
  percentage: number
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface Transaction {
  id: number
  user_id: number
  category_id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  transaction_date: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface TransactionFormData {
  category_id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  transaction_date: string
}

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all'
  category_id?: number | null
  start_date?: string | null
  end_date?: string | null
  min_amount?: number | null
  max_amount?: number | null
  search?: string
}

export interface TransactionStats {
  total_income: number
  total_expenses: number
  net_balance: number
  transaction_count: number
  average_transaction: number
}

// ============================================================================
// Budget Types
// ============================================================================

export interface Budget {
  id: number
  user_id: number
  category_id: number
  amount: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
  category?: Category
  spent?: number
  remaining?: number
  percentage?: number
}

export interface BudgetFormData {
  category_id: number
  amount: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date?: string | null
}

export interface BudgetProgress {
  budget_id: number
  category_name: string
  budget_amount: number
  spent_amount: number
  remaining_amount: number
  percentage_used: number
  is_exceeded: boolean
}

// ============================================================================
// Report Types
// ============================================================================

export interface ReportParams {
  start_date: string
  end_date: string
  type?: 'income' | 'expense' | 'all'
  category_id?: number | null
}

export interface MonthlyReport {
  month: string
  income: number
  expenses: number
  net: number
}

export interface CategoryReport {
  category_id: number
  category_name: string
  type: 'income' | 'expense'
  total: number
  count: number
  percentage: number
  average: number
}

export interface DailyReport {
  date: string
  income: number
  expenses: number
  net: number
  transaction_count: number
}

export interface FinancialSummary {
  total_income: number
  total_expenses: number
  net_balance: number
  transaction_count: number
  average_transaction: number
  largest_expense: number
  largest_income: number
  most_used_category: string | null
}

export interface TrendData {
  labels: string[]
  income: number[]
  expenses: number[]
  net: number[]
}

// ============================================================================
// Chart Types
// ============================================================================

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  tension?: number
  fill?: boolean
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins?: Record<string, unknown>
  scales?: Record<string, unknown>
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea'
  value: string | number
  placeholder?: string
  required?: boolean
  options?: Array<{ label: string; value: string | number }>
  error?: string
}

export interface ValidationError {
  field: string
  message: string
}

// ============================================================================
// Store State Types
// ============================================================================

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface TransactionState {
  transactions: Transaction[]
  currentTransaction: Transaction | null
  filters: TransactionFilters
  stats: TransactionStats | null
  isLoading: boolean
  error: string | null
}

export interface CategoryState {
  categories: Category[]
  incomeCategories: Category[]
  expenseCategories: Category[]
  currentCategory: Category | null
  isLoading: boolean
  error: string | null
}

export interface BudgetState {
  budgets: Budget[]
  currentBudget: Budget | null
  progress: BudgetProgress[]
  isLoading: boolean
  error: string | null
}

// ============================================================================
// Utility Types
// ============================================================================

export type TransactionType = 'income' | 'expense'
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type DateRange = { start: string; end: string }
export type SortOrder = 'asc' | 'desc'
export type SortField = 'date' | 'amount' | 'category' | 'description'

// ============================================================================
// Composable Return Types
// ============================================================================

export interface UseTransactionFiltersReturn {
  filters: TransactionFilters
  updateFilters: (newFilters: Partial<TransactionFilters>) => void
  resetFilters: () => void
  applyFilters: (transactions: Transaction[]) => Transaction[]
}

export interface UseCurrencyReturn {
  formatCurrency: (amount: number) => string
  parseCurrency: (formatted: string) => number
}

export interface UseDateReturn {
  formatDate: (date: string | Date) => string
  parseDate: (formatted: string) => Date
  getRelativeDate: (date: string | Date) => string
}
