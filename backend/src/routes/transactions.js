// routes/transactions.js
const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const validation = require('../middleware/validation')
const { body, query } = require('express-validator')

// Validation rules
const createTransactionValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('categoryId')
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
]

const updateTransactionValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
]

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min amount must be a non-negative number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max amount must be a non-negative number'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'date', 'amount', 'type'])
    .withMessage('SortBy must be one of: createdAt, date, amount, type'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc')
]

// Routes
router.get('/', queryValidation, validation, transactionController.getTransactions)
router.get('/statistics', transactionController.getStatistics)
router.get('/trends', transactionController.getMonthlyTrends)
router.get('/:id', transactionController.getTransaction)

router.post('/', createTransactionValidation, validation, transactionController.createTransaction)
router.post('/import', [
  body('transactions')
    .isArray({ min: 1 })
    .withMessage('Transactions must be a non-empty array')
], validation, transactionController.importTransactions)

router.put('/:id', updateTransactionValidation, validation, transactionController.updateTransaction)

router.delete('/:id', transactionController.deleteTransaction)
router.delete('/', [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs must be a non-empty array')
], validation, transactionController.deleteMultipleTransactions)

module.exports = router