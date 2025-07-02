// routes/categories.js
const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const validation = require('../middleware/validation')
const { body, query } = require('express-validator')

// Validation rules
const createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('type')
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Icon path must not exceed 1000 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code')
]

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Icon path must not exceed 1000 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code')
]

const queryValidation = [
  query('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE', 'income', 'expense'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters')
]

// Routes
router.get('/', queryValidation, validation, categoryController.getCategories)
router.get('/defaults', categoryController.getDefaultCategories)
router.get('/statistics', categoryController.getCategoryStatistics)
router.get('/:id', categoryController.getCategory)

router.post('/', createCategoryValidation, validation, categoryController.createCategory)

router.put('/:id', updateCategoryValidation, validation, categoryController.updateCategory)
router.put('/:id/restore', categoryController.restoreCategory)

router.delete('/:id', categoryController.deleteCategory)

module.exports = router