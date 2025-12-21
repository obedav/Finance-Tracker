/**
 * Type Definitions Index
 * Central export point for all TypeScript types
 */

// Export all model types
export type {
  // User Types
  User,
  UserRegistration,
  UserLogin,
  AuthResponse,

  // Category Types
  Category,
  CategoryFormData,
  CategoryStats,

  // Transaction Types
  Transaction,
  TransactionFormData,
  TransactionFilters,
  TransactionStats,

  // Budget Types
  Budget,
  BudgetFormData,
  BudgetProgress,

  // Report Types
  ReportParams,
  MonthlyReport,
  CategoryReport,
  DailyReport,
  FinancialSummary,
  TrendData,

  // Chart Types
  ChartDataset,
  ChartData,
  ChartOptions,

  // API Response Types
  ApiResponse,
  PaginatedResponse,
  ApiError,

  // Form Types
  FormField,
  ValidationError,

  // Store State Types
  AuthState,
  TransactionState,
  CategoryState,
  BudgetState,

  // Utility Types
  TransactionType,
  BudgetPeriod,
  DateRange,
  SortOrder,
  SortField,

  // Composable Return Types
  UseTransactionFiltersReturn,
  UseCurrencyReturn,
  UseDateReturn
} from './models'

// Export all API types
export type {
  // API Configuration
  ApiConfig,
  RequestConfig,

  // Service Interfaces
  AuthServiceInterface,
  CategoryServiceInterface,
  TransactionServiceInterface,
  BudgetServiceInterface,
  ReportServiceInterface,

  // API Error Types
  ApiErrorResponse,

  // Mock API Types
  MockDataStore,
  MockApiResponse
} from './api'

// Re-export ApiError class
export { ApiError } from './api'
