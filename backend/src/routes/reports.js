// routes/reports.js
const express = require('express')
const router = express.Router()
const reportController = require('../controllers/reportController')
const validation = require('../middleware/validation')
const { query, body } = require('express-validator')

// Validation rules
const monthlyReportValidation = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
]

const yearlyReportValidation = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
]

const categoryReportValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  query('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE')
]

const exportValidation = [
  body('format')
    .optional()
    .isIn(['csv', 'json', 'pdf'])
    .withMessage('Format must be csv, json, or pdf'),
  body('reportType')
    .isIn(['monthly', 'yearly', 'category', 'transactions'])
    .withMessage('Report type must be monthly, yearly, category, or transactions'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
]

// Routes
router.get('/monthly', monthlyReportValidation, validation, reportController.getMonthlyReport)
router.get('/yearly', yearlyReportValidation, validation, reportController.getYearlyReport)
router.get('/category', categoryReportValidation, validation, reportController.getCategoryReport)

router.post('/export', exportValidation, validation, reportController.exportReport)

module.exports = router