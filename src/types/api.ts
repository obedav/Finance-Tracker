/**
 * API Service Type Definitions
 * Types for API requests, responses, and service interfaces
 */

import type {
  User,
  Category,
  Transaction,
  Budget,
  AuthResponse,
  UserLogin,
  UserRegistration,
  CategoryFormData,
  TransactionFormData,
  BudgetFormData,
  ApiResponse,
  PaginatedResponse,
  ReportParams,
  MonthlyReport,
  CategoryReport,
  FinancialSummary
} from './models'

// ============================================================================
// API Configuration
// ============================================================================

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

// ============================================================================
// Auth Service
// ============================================================================

export interface AuthServiceInterface {
  login(credentials: UserLogin): Promise<AuthResponse>
  register(userData: UserRegistration): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<User>
  updateProfile(data: Partial<User>): Promise<User>
  changePassword(currentPassword: string, newPassword: string): Promise<void>
}

// ============================================================================
// Category Service
// ============================================================================

export interface CategoryServiceInterface {
  getAll(): Promise<Category[]>
  getById(id: number): Promise<Category>
  getByType(type: 'income' | 'expense'): Promise<Category[]>
  create(data: CategoryFormData): Promise<Category>
  update(id: number, data: Partial<CategoryFormData>): Promise<Category>
  delete(id: number): Promise<void>
}

// ============================================================================
// Transaction Service
// ============================================================================

export interface TransactionServiceInterface {
  getAll(params?: Record<string, unknown>): Promise<Transaction[]>
  getById(id: number): Promise<Transaction>
  create(data: TransactionFormData): Promise<Transaction>
  update(id: number, data: Partial<TransactionFormData>): Promise<Transaction>
  delete(id: number): Promise<void>
  getStats(startDate?: string, endDate?: string): Promise<{
    total_income: number
    total_expenses: number
    net_balance: number
  }>
}

// ============================================================================
// Budget Service
// ============================================================================

export interface BudgetServiceInterface {
  getAll(): Promise<Budget[]>
  getById(id: number): Promise<Budget>
  create(data: BudgetFormData): Promise<Budget>
  update(id: number, data: Partial<BudgetFormData>): Promise<Budget>
  delete(id: number): Promise<void>
  getProgress(): Promise<Budget[]>
}

// ============================================================================
// Report Service
// ============================================================================

export interface ReportServiceInterface {
  getMonthlyReport(params: ReportParams): Promise<MonthlyReport[]>
  getCategoryReport(params: ReportParams): Promise<CategoryReport[]>
  getFinancialSummary(params: ReportParams): Promise<FinancialSummary>
  exportReport(params: ReportParams, format: 'csv' | 'pdf'): Promise<Blob>
}

// ============================================================================
// API Error Handling
// ============================================================================

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status: number
  statusText: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============================================================================
// Mock API Types
// ============================================================================

export interface MockDataStore {
  users: User[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  nextId: {
    user: number
    category: number
    transaction: number
    budget: number
  }
}

export interface MockApiResponse<T> {
  data: T
  status: number
  message?: string
}
