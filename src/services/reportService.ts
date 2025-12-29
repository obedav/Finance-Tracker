// src/services/reportService.ts
import { apiHelpers, mockApiHelpers } from './api'
import { API_ENDPOINTS } from '../utils/constants'
import { getDateRange } from '../utils/helpers'

/**
 * Type Definitions for Report Service
 */

export interface ReportSummary {
  totalIncome: number
  totalExpenses: number
  netAmount: number | null
  transactionCount: number
  savingsRate?: number | null
  monthlyAverage?: number | null
}

export interface CategoryBreakdownItem {
  category: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface DailyTrend {
  date: string
  income: number
  expenses: number
}

export interface TopExpense {
  description: string
  amount: number
  category: string
  date: string
}

export interface MonthlyReportData {
  period: string
  summary: ReportSummary
  categoryBreakdown: CategoryBreakdownItem[]
  dailyTrends: DailyTrend[]
  topExpenses: TopExpense[]
  insights: string[]
}

export interface MonthlyReportResponse {
  success: boolean
  report?: MonthlyReportData
  message?: string
  code?: string
}

export interface MonthlyBreakdownItem {
  month: string
  income: number
  expenses: number
  transactionCount: number
}

export interface CategoryTotal {
  category: string
  total: number
  average: number
  transactionCount: number
}

export interface QuarterlyData {
  quarter: string
  income: number
  expenses: number
  netAmount: number | null
}

export interface YearOverYearData {
  year: number
  income: number
  expenses: number
  growth: number
}

export interface YearlyReportData {
  year: number
  summary: ReportSummary
  monthlyBreakdown: MonthlyBreakdownItem[]
  categoryTotals: CategoryTotal[]
  quarterlyComparison: QuarterlyData[]
  yearOverYear: YearOverYearData[]
}

export interface YearlyReportResponse {
  success: boolean
  report?: YearlyReportData
  message?: string
  code?: string
}

export interface CategoryAnalysisItem {
  category: string
  amount: number
  percentage: number
  trend: 'increasing' | 'decreasing'
  trendPercentage: number
}

export interface CategoryReportInsights {
  topCategory: string
  topCategoryAmount: number
  fastestGrowing: string
  growthRate: number
  recommendations: string[]
}

export interface CategoryReportData {
  period: string
  type: string | null
  categories: CategoryAnalysisItem[]
  trends: Record<string, any>[]
  insights: CategoryReportInsights
}

export interface CategoryReportResponse {
  success: boolean
  report?: CategoryReportData
  message?: string
  code?: string
}

export interface TrendDataPoint {
  month: string
  value: number
}

export interface SeasonalityData {
  spring: { average: number; trend: string }
  summer: { average: number; trend: string }
  fall: { average: number; trend: string }
  winter: { average: number; trend: string }
}

export interface WeeklyPatterns {
  weekdays: number
  weekends: number
  pattern: string
}

export interface MonthlyPatterns {
  beginning: number
  middle: number
  end: number
  pattern: string
}

export interface ForecastData {
  nextMonth: {
    predictedIncome: number
    predictedExpenses: number
    confidence: number
  }
}

export interface TrendsReportData {
  period: string
  trends: {
    income: TrendDataPoint[]
    expenses: TrendDataPoint[]
    balance: TrendDataPoint[]
  }
  patterns: {
    seasonality: SeasonalityData
    weeklyPatterns: WeeklyPatterns
    monthlyPatterns: MonthlyPatterns
  }
  forecasting: ForecastData
}

export interface TrendsReportResponse {
  success: boolean
  report?: TrendsReportData
  message?: string
  code?: string
}

export interface GroupedDataPoint {
  period: string
  income: number
  expenses: number
}

export interface CustomRangeReportData {
  startDate: string
  endDate: string
  groupBy: string
  summary: ReportSummary
  groupedData: GroupedDataPoint[]
  categoryBreakdown: CategoryBreakdownItem[]
}

export interface CustomRangeReportResponse {
  success: boolean
  report?: CustomRangeReportData
  message?: string
  code?: string
}

export interface PeriodData {
  income: number
  expenses: number
  balance: number | null
  transactionCount: number
}

export interface ChangeMetrics {
  incomeChange: number | null
  expenseChange: number | null
  balanceChange: number | null
  transactionChange: number | null
}

export interface QuickStats {
  avgDailySpending: number
  topCategory: string
  largestTransaction: number
  savingsRate: number
}

export interface DashboardSummaryData {
  currentPeriod: PeriodData
  previousPeriod: PeriodData
  changes: ChangeMetrics
  quickStats: QuickStats
}

export interface DashboardSummaryResponse {
  success: boolean
  summary?: DashboardSummaryData
  message?: string
  code?: string
}

export interface SpendingInsights {
  score: number
  trends: string[]
  recommendations: string[]
}

export interface SavingsInsights {
  rate: number
  monthlyAverage: number
  goalProgress: number
  recommendations: string[]
}

export interface BudgetingInsights {
  adherence: number
  overBudgetCategories: string[]
  underBudgetCategories: string[]
  suggestions: string[]
}

export interface FinancialInsightsData {
  spending: SpendingInsights
  savings: SavingsInsights
  budgeting: BudgetingInsights
}

export interface FinancialInsightsResponse {
  success: boolean
  insights?: FinancialInsightsData
  message?: string
  code?: string
}

export interface BudgetPerformance {
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
  status: 'over_budget' | 'under_budget' | 'on_track'
}

export interface CategoryBudgetAnalysis {
  category: string
  budgeted: number
  actual: number
  variance: number
  status: 'over_budget' | 'under_budget' | 'on_track'
}

export interface BudgetAnalysisData {
  period: string
  overallPerformance: BudgetPerformance
  categoryAnalysis: CategoryBudgetAnalysis[]
  alerts: string[]
  recommendations: string[]
}

export interface BudgetAnalysisResponse {
  success: boolean
  analysis?: BudgetAnalysisData
  message?: string
  code?: string
}

export interface WeeklySpendingPattern {
  averageByDay: Record<string, number>
  peakDay: string
  lowestDay: string
}

export interface MonthlySpendingPattern {
  averageByWeek: number[]
  peakWeek: string
  pattern: string
}

export interface CategoryPatterns {
  most_frequent: string
  highest_average: string
  most_variable: string
}

export interface SpendingPatternsData {
  period: string
  weekly: WeeklySpendingPattern
  monthly: MonthlySpendingPattern
  categories: CategoryPatterns
  insights: string[]
}

export interface SpendingPatternsResponse {
  success: boolean
  patterns?: SpendingPatternsData
  message?: string
  code?: string
}

export interface ExportResponse {
  success: boolean
  message?: string
  code?: string
}

export interface EmailResponse {
  success: boolean
  message?: string
  code?: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const USE_MOCK_API = false  // Use real Laravel API

class ReportService {
  private cache: Map<string, CacheEntry<any>>
  private cacheTimeout: number

  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Financial Reports
   */

  // Get monthly report
  async getMonthlyReport(year: number, month: number): Promise<MonthlyReportResponse> {
    try {
      const cacheKey = this.generateCacheKey('monthlyReport', { year, month })
      const cached = this.getFromCache<MonthlyReportResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetMonthlyReport(year, month)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<MonthlyReportResponse>(`${API_ENDPOINTS.REPORTS.MONTHLY}?year=${year}&month=${month}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch monthly report',
        code: error.code || 'FETCH_MONTHLY_REPORT_ERROR'
      }
    }
  }

  // Get yearly report
  async getYearlyReport(year: number): Promise<YearlyReportResponse> {
    try {
      const cacheKey = this.generateCacheKey('yearlyReport', { year })
      const cached = this.getFromCache<YearlyReportResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetYearlyReport(year)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<YearlyReportResponse>(`${API_ENDPOINTS.REPORTS.YEARLY}?year=${year}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch yearly report',
        code: error.code || 'FETCH_YEARLY_REPORT_ERROR'
      }
    }
  }

  // Get category report
  async getCategoryReport(period: string = 'month', type: string | null = null): Promise<CategoryReportResponse> {
    try {
      const cacheKey = this.generateCacheKey('categoryReport', { period, type })
      const cached = this.getFromCache<CategoryReportResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCategoryReport(period, type)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = new URLSearchParams({ period })
      if (type) queryParams.append('type', type)

      const response = await apiHelpers.get<CategoryReportResponse>(`${API_ENDPOINTS.REPORTS.CATEGORY}?${queryParams.toString()}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch category report',
        code: error.code || 'FETCH_CATEGORY_REPORT_ERROR'
      }
    }
  }

  // Get trends report
  async getTrendsReport(period: string = '6months'): Promise<TrendsReportResponse> {
    try {
      const cacheKey = this.generateCacheKey('trendsReport', { period })
      const cached = this.getFromCache<TrendsReportResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetTrendsReport(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<TrendsReportResponse>(`${API_ENDPOINTS.REPORTS.TRENDS}?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch trends report',
        code: error.code || 'FETCH_TRENDS_REPORT_ERROR'
      }
    }
  }

  // Get custom date range report
  async getCustomRangeReport(startDate: string, endDate: string, groupBy: string = 'month'): Promise<CustomRangeReportResponse> {
    try {
      const cacheKey = this.generateCacheKey('customRangeReport', { startDate, endDate, groupBy })
      const cached = this.getFromCache<CustomRangeReportResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetCustomRangeReport(startDate, endDate, groupBy)
        this.setCache(cacheKey, result)
        return result
      }

      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        groupBy
      })

      const response = await apiHelpers.get<CustomRangeReportResponse>(`/reports/custom-range?${queryParams.toString()}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch custom range report',
        code: error.code || 'FETCH_CUSTOM_RANGE_REPORT_ERROR'
      }
    }
  }

  /**
   * Dashboard Analytics
   */

  // Get dashboard summary
  async getDashboardSummary(period: string = 'month'): Promise<DashboardSummaryResponse> {
    try {
      const cacheKey = this.generateCacheKey('dashboardSummary', { period })
      const cached = this.getFromCache<DashboardSummaryResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetDashboardSummary(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<DashboardSummaryResponse>(`/reports/dashboard-summary?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch dashboard summary',
        code: error.code || 'FETCH_DASHBOARD_SUMMARY_ERROR'
      }
    }
  }

  // Get financial insights
  async getFinancialInsights(period: string = 'month'): Promise<FinancialInsightsResponse> {
    try {
      const cacheKey = this.generateCacheKey('financialInsights', { period })
      const cached = this.getFromCache<FinancialInsightsResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetFinancialInsights(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<FinancialInsightsResponse>(`/reports/insights?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch financial insights',
        code: error.code || 'FETCH_INSIGHTS_ERROR'
      }
    }
  }

  /**
   * Budget Analysis
   */

  // Get budget vs actual report
  async getBudgetAnalysis(period: string = 'month'): Promise<BudgetAnalysisResponse> {
    try {
      const cacheKey = this.generateCacheKey('budgetAnalysis', { period })
      const cached = this.getFromCache<BudgetAnalysisResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetBudgetAnalysis(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<BudgetAnalysisResponse>(`/reports/budget-analysis?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch budget analysis',
        code: error.code || 'FETCH_BUDGET_ANALYSIS_ERROR'
      }
    }
  }

  // Get spending patterns
  async getSpendingPatterns(period: string = '3months'): Promise<SpendingPatternsResponse> {
    try {
      const cacheKey = this.generateCacheKey('spendingPatterns', { period })
      const cached = this.getFromCache<SpendingPatternsResponse>(cacheKey)

      if (cached) {
        return cached
      }

      if (USE_MOCK_API) {
        const result = await this.mockGetSpendingPatterns(period)
        this.setCache(cacheKey, result)
        return result
      }

      const response = await apiHelpers.get<SpendingPatternsResponse>(`/reports/spending-patterns?period=${period}`)

      this.setCache(cacheKey, response)
      return response
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to fetch spending patterns',
        code: error.code || 'FETCH_SPENDING_PATTERNS_ERROR'
      }
    }
  }

  /**
   * Export Reports
   */

  // Export report as PDF
  async exportReportPDF(reportType: string, parameters: Record<string, any> = {}): Promise<ExportResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockExportReportPDF(reportType, parameters)
      }

      const queryParams = new URLSearchParams({
        type: reportType,
        format: 'pdf',
        ...parameters
      })

      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`
      await apiHelpers.download(`/reports/export?${queryParams.toString()}`, filename)

      return {
        success: true,
        message: 'Report exported successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to export PDF report',
        code: error.code || 'EXPORT_PDF_ERROR'
      }
    }
  }

  // Export report as Excel
  async exportReportExcel(reportType: string, parameters: Record<string, any> = {}): Promise<ExportResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockExportReportExcel(reportType, parameters)
      }

      const queryParams = new URLSearchParams({
        type: reportType,
        format: 'excel',
        ...parameters
      })

      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`
      await apiHelpers.download(`/reports/export?${queryParams.toString()}`, filename)

      return {
        success: true,
        message: 'Report exported successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to export Excel report',
        code: error.code || 'EXPORT_EXCEL_ERROR'
      }
    }
  }

  // Email report
  async emailReport(reportType: string, email: string, parameters: Record<string, any> = {}): Promise<EmailResponse> {
    try {
      if (USE_MOCK_API) {
        return await this.mockEmailReport(reportType, email, parameters)
      }

      const response = await apiHelpers.post<EmailResponse>('/reports/email', {
        type: reportType,
        email,
        parameters
      })

      return {
        success: true,
        message: response.message || 'Report sent successfully'
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Failed to email report',
        code: error.code || 'EMAIL_REPORT_ERROR'
      }
    }
  }

  /**
   * Utility Methods
   */

  // Generate cache key
  private generateCacheKey(operation: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')

    return `${operation}:${paramString}`
  }

  // Cache management
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)

    if (!cached) return null

    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Mock API Methods (for development)
   */

  private async mockGetMonthlyReport(year: number, month: number): Promise<MonthlyReportResponse> {
    await mockApiHelpers.delay(600)

    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

    return {
      success: true,
      report: {
        period: `${monthName} ${year}`,
        summary: {
          totalIncome: Math.random() * 3000 + 2000,
          totalExpenses: Math.random() * 2500 + 1500,
          netAmount: null, // Will be calculated
          transactionCount: Math.floor(Math.random() * 50) + 30,
          savingsRate: null // Will be calculated
        },
        categoryBreakdown: this.generateCategoryBreakdown(),
        dailyTrends: this.generateDailyTrends(new Date(year, month - 1)),
        topExpenses: this.generateTopExpenses(),
        insights: this.generateInsights()
      }
    }
  }

  private async mockGetYearlyReport(year: number): Promise<YearlyReportResponse> {
    await mockApiHelpers.delay(800)

    return {
      success: true,
      report: {
        year: year,
        summary: {
          totalIncome: Math.random() * 30000 + 40000,
          totalExpenses: Math.random() * 25000 + 30000,
          netAmount: null, // Will be calculated
          transactionCount: Math.floor(Math.random() * 500) + 300,
          monthlyAverage: null // Will be calculated
        },
        monthlyBreakdown: this.generateMonthlyBreakdown(year),
        categoryTotals: this.generateCategoryTotals(),
        quarterlyComparison: this.generateQuarterlyComparison(year),
        yearOverYear: this.generateYearOverYearComparison(year)
      }
    }
  }

  private async mockGetCategoryReport(period: string, type: string | null): Promise<CategoryReportResponse> {
    await mockApiHelpers.delay(500)

    return {
      success: true,
      report: {
        period: period,
        type: type,
        categories: this.generateCategoryAnalysis(type),
        trends: this.generateCategoryTrends(),
        insights: {
          topCategory: 'Food & Dining',
          topCategoryAmount: 1245.50,
          fastestGrowing: 'Entertainment',
          growthRate: 15.5,
          recommendations: [
            'Consider reducing Food & Dining expenses',
            'Entertainment spending is increasing rapidly',
            'Transportation costs are well controlled'
          ]
        }
      }
    }
  }

  private async mockGetTrendsReport(period: string): Promise<TrendsReportResponse> {
    await mockApiHelpers.delay(600)

    const months = period === '6months' ? 6 : period === '12months' ? 12 : 3

    return {
      success: true,
      report: {
        period: period,
        trends: {
          income: this.generateTrendData(months, 'income'),
          expenses: this.generateTrendData(months, 'expense'),
          balance: this.generateTrendData(months, 'balance')
        },
        patterns: {
          seasonality: this.generateSeasonalityData(),
          weeklyPatterns: this.generateWeeklyPatterns(),
          monthlyPatterns: this.generateMonthlyPatterns()
        },
        forecasting: {
          nextMonth: {
            predictedIncome: Math.random() * 1000 + 3000,
            predictedExpenses: Math.random() * 800 + 2200,
            confidence: Math.random() * 20 + 75
          }
        }
      }
    }
  }

  private async mockGetCustomRangeReport(startDate: string, endDate: string, groupBy: string): Promise<CustomRangeReportResponse> {
    await mockApiHelpers.delay(700)

    return {
      success: true,
      report: {
        startDate,
        endDate,
        groupBy,
        summary: {
          totalIncome: Math.random() * 5000 + 3000,
          totalExpenses: Math.random() * 4000 + 2500,
          netAmount: null,
          transactionCount: Math.floor(Math.random() * 100) + 50
        },
        groupedData: this.generateGroupedData(startDate, endDate, groupBy),
        categoryBreakdown: this.generateCategoryBreakdown()
      }
    }
  }

  private async mockGetDashboardSummary(period: string): Promise<DashboardSummaryResponse> {
    await mockApiHelpers.delay(400)

    return {
      success: true,
      summary: {
        currentPeriod: {
          income: Math.random() * 1000 + 2500,
          expenses: Math.random() * 800 + 1800,
          balance: null,
          transactionCount: Math.floor(Math.random() * 30) + 20
        },
        previousPeriod: {
          income: Math.random() * 1000 + 2300,
          expenses: Math.random() * 800 + 1700,
          balance: null,
          transactionCount: Math.floor(Math.random() * 30) + 18
        },
        changes: {
          incomeChange: null, // Will be calculated
          expenseChange: null, // Will be calculated
          balanceChange: null, // Will be calculated
          transactionChange: null // Will be calculated
        },
        quickStats: {
          avgDailySpending: Math.random() * 50 + 80,
          topCategory: 'Food & Dining',
          largestTransaction: Math.random() * 200 + 300,
          savingsRate: Math.random() * 30 + 10
        }
      }
    }
  }

  private async mockGetFinancialInsights(period: string): Promise<FinancialInsightsResponse> {
    await mockApiHelpers.delay(500)

    return {
      success: true,
      insights: {
        spending: {
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          trends: [
            'Your spending decreased by 5% this month',
            'Food & Dining expenses are 20% above average',
            'Transportation costs are well controlled'
          ],
          recommendations: [
            'Consider meal planning to reduce food costs',
            'Look for subscription services you might not be using',
            'Review your largest expenses for optimization opportunities'
          ]
        },
        savings: {
          rate: Math.random() * 20 + 15, // 15-35%
          monthlyAverage: Math.random() * 500 + 800,
          goalProgress: Math.random() * 100,
          recommendations: [
            'Try to increase savings rate to 25%',
            'Consider automating savings transfers',
            'Review and optimize recurring expenses'
          ]
        },
        budgeting: {
          adherence: Math.random() * 30 + 70, // 70-100%
          overBudgetCategories: ['Food & Dining', 'Entertainment'],
          underBudgetCategories: ['Transportation', 'Healthcare'],
          suggestions: [
            'Set stricter limits for dining out',
            'Allocate unused transportation budget to emergency fund'
          ]
        }
      }
    }
  }

  private async mockGetBudgetAnalysis(period: string): Promise<BudgetAnalysisResponse> {
    await mockApiHelpers.delay(500)

    return {
      success: true,
      analysis: {
        period,
        overallPerformance: {
          budgetedAmount: 3000,
          actualAmount: 3250,
          variance: 250,
          variancePercentage: 8.3,
          status: 'over_budget'
        },
        categoryAnalysis: [
          {
            category: 'Food & Dining',
            budgeted: 600,
            actual: 750,
            variance: 150,
            status: 'over_budget'
          },
          {
            category: 'Transportation',
            budgeted: 300,
            actual: 280,
            variance: -20,
            status: 'under_budget'
          },
          {
            category: 'Entertainment',
            budgeted: 200,
            actual: 320,
            variance: 120,
            status: 'over_budget'
          }
        ],
        alerts: [
          'Food & Dining is 25% over budget',
          'Entertainment spending exceeded budget by 60%'
        ],
        recommendations: [
          'Review dining expenses and consider meal planning',
          'Set spending alerts for entertainment category'
        ]
      }
    }
  }

  private async mockGetSpendingPatterns(period: string): Promise<SpendingPatternsResponse> {
    await mockApiHelpers.delay(600)

    return {
      success: true,
      patterns: {
        period,
        weekly: {
          averageByDay: {
            Monday: 45.30,
            Tuesday: 38.20,
            Wednesday: 52.10,
            Thursday: 41.80,
            Friday: 78.50,
            Saturday: 95.20,
            Sunday: 65.40
          },
          peakDay: 'Saturday',
          lowestDay: 'Tuesday'
        },
        monthly: {
          averageByWeek: [320, 280, 350, 400, 290],
          peakWeek: 'Week 4 (Month End)',
          pattern: 'Higher spending at month end'
        },
        categories: {
          most_frequent: 'Food & Dining',
          highest_average: 'Bills & Utilities',
          most_variable: 'Entertainment'
        },
        insights: [
          'Weekend spending is 40% higher than weekdays',
          'Month-end spending spikes by 25%',
          'Food expenses peak on Fridays and Saturdays'
        ]
      }
    }
  }

  private async mockExportReportPDF(reportType: string, parameters: Record<string, any>): Promise<ExportResponse> {
    await mockApiHelpers.delay(2000)

    // Simulate PDF generation and download
    const content = `Mock PDF Report: ${reportType}\nGenerated: ${new Date().toISOString()}\nParameters: ${JSON.stringify(parameters, null, 2)}`
    const blob = new Blob([content], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'PDF report exported successfully'
    }
  }

  private async mockExportReportExcel(reportType: string, parameters: Record<string, any>): Promise<ExportResponse> {
    await mockApiHelpers.delay(1800)

    // Simulate Excel generation and download
    const content = `Mock Excel Report: ${reportType}\nGenerated: ${new Date().toISOString()}\nParameters: ${JSON.stringify(parameters, null, 2)}`
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'Excel report exported successfully'
    }
  }

  private async mockEmailReport(reportType: string, email: string, parameters: Record<string, any>): Promise<EmailResponse> {
    await mockApiHelpers.delay(1200)

    return {
      success: true,
      message: `Report sent successfully to ${email}`
    }
  }

  /**
   * Mock Data Generators
   */

  private generateCategoryBreakdown(): CategoryBreakdownItem[] {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities']
    return categories.map(category => ({
      category,
      amount: Math.random() * 500 + 100,
      percentage: Math.random() * 25 + 5,
      transactionCount: Math.floor(Math.random() * 15) + 5
    }))
  }

  private generateDailyTrends(date: Date): DailyTrend[] {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const trends: DailyTrend[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      trends.push({
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        income: Math.random() * 200 + 50,
        expenses: Math.random() * 150 + 80
      })
    }

    return trends
  }

  private generateTopExpenses(): TopExpense[] {
    const descriptions = ['Grocery Store', 'Gas Station', 'Restaurant', 'Online Shopping', 'Coffee Shop']
    return descriptions.map(description => ({
      description,
      amount: Math.random() * 200 + 50,
      category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0]
    }))
  }

  private generateInsights(): string[] {
    return [
      'Spending increased by 8% compared to last month',
      'Food & Dining represents 35% of total expenses',
      'Weekend spending is 40% higher than weekdays',
      'Savings rate improved to 22% this month'
    ]
  }

  private generateMonthlyBreakdown(year: number): MonthlyBreakdownItem[] {
    const months: MonthlyBreakdownItem[] = []
    for (let month = 0; month < 12; month++) {
      months.push({
        month: new Date(year, month).toLocaleString('default', { month: 'short' }),
        income: Math.random() * 1000 + 2000,
        expenses: Math.random() * 800 + 1500,
        transactionCount: Math.floor(Math.random() * 40) + 20
      })
    }
    return months
  }

  private generateCategoryTotals(): CategoryTotal[] {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare']
    return categories.map(category => ({
      category,
      total: Math.random() * 2000 + 500,
      average: Math.random() * 200 + 50,
      transactionCount: Math.floor(Math.random() * 50) + 10
    }))
  }

  private generateQuarterlyComparison(year: number): QuarterlyData[] {
    return ['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => ({
      quarter,
      income: Math.random() * 3000 + 7000,
      expenses: Math.random() * 2500 + 5500,
      netAmount: null // Will be calculated
    }))
  }

  private generateYearOverYearComparison(year: number): YearOverYearData[] {
    return [year - 1, year].map(y => ({
      year: y,
      income: Math.random() * 5000 + 35000,
      expenses: Math.random() * 4000 + 25000,
      growth: y === year ? Math.random() * 20 - 10 : 0 // -10% to +10%
    }))
  }

  private generateCategoryAnalysis(type: string | null): CategoryAnalysisItem[] {
    const categories = type === 'income'
      ? ['Salary', 'Freelance', 'Investment', 'Other']
      : ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities']

    return categories.map(category => ({
      category,
      amount: Math.random() * 1000 + 200,
      percentage: Math.random() * 30 + 5,
      trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      trendPercentage: Math.random() * 20
    }))
  }

  private generateCategoryTrends(): Record<string, any>[] {
    const months: Record<string, any>[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        month: date.toISOString().substr(0, 7),
        'Food & Dining': Math.random() * 300 + 400,
        'Transportation': Math.random() * 200 + 200,
        'Entertainment': Math.random() * 150 + 100
      })
    }
    return months
  }

  private generateTrendData(months: number, type: string): TrendDataPoint[] {
    const data: TrendDataPoint[] = []
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)

      let value: number
      switch (type) {
        case 'income':
          value = Math.random() * 1000 + 2500
          break
        case 'expense':
          value = Math.random() * 800 + 1800
          break
        case 'balance':
          value = Math.random() * 1000 + 500
          break
        default:
          value = Math.random() * 500
      }

      data.push({
        month: date.toISOString().substr(0, 7),
        value
      })
    }
    return data
  }

  private generateSeasonalityData(): SeasonalityData {
    return {
      spring: { average: 2400, trend: 'stable' },
      summer: { average: 2800, trend: 'higher' },
      fall: { average: 2600, trend: 'stable' },
      winter: { average: 3200, trend: 'highest' }
    }
  }

  private generateWeeklyPatterns(): WeeklyPatterns {
    return {
      weekdays: 180,
      weekends: 280,
      pattern: 'Higher weekend spending'
    }
  }

  private generateMonthlyPatterns(): MonthlyPatterns {
    return {
      beginning: 220,
      middle: 190,
      end: 310,
      pattern: 'Month-end spending spike'
    }
  }

  private generateGroupedData(startDate: string, endDate: string, groupBy: string): GroupedDataPoint[] {
    // Simplified mock grouped data
    const start = new Date(startDate)
    const end = new Date(endDate)
    const data: GroupedDataPoint[] = []

    if (groupBy === 'day') {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        data.push({
          period: d.toISOString().split('T')[0],
          income: Math.random() * 200,
          expenses: Math.random() * 150
        })
      }
    } else if (groupBy === 'week') {
      // Simplified weekly grouping
      for (let i = 0; i < 4; i++) {
        data.push({
          period: `Week ${i + 1}`,
          income: Math.random() * 800 + 600,
          expenses: Math.random() * 600 + 400
        })
      }
    } else { // month
      data.push({
        period: start.toISOString().substr(0, 7),
        income: Math.random() * 3000 + 2000,
        expenses: Math.random() * 2500 + 1500
      })
    }

    return data
  }
}

// Create and export singleton instance
const reportService = new ReportService()

export default reportService
