// middleware/errorHandler.js
const config = require('../config/config')

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400)
    this.details = details
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401)
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403)
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409)
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error('Error caught by error handler:', {
    message: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  })

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered'
    error = new ValidationError(message)
  }

  if (err.code === 'P2014') {
    const message = 'Invalid ID provided'
    error = new ValidationError(message)
  }

  if (err.code === 'P2003') {
    const message = 'Invalid input data'
    error = new ValidationError(message)
  }

  if (err.code === 'P2025') {
    const message = 'Record not found'
    error = new NotFoundError()
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = new UnauthorizedError(message)
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = new UnauthorizedError(message)
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = new ValidationError(message)
  }

  // Cast errors
  if (err.name === 'CastError') {
    const message = `Resource not found`
    error = new NotFoundError()
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ConflictError(message)
  }

  // Rate limit errors
  if (err.status === 429) {
    error = new AppError('Too many requests, please try again later', 429)
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ValidationError('File too large')
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ValidationError('Unexpected file field')
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error = new AppError('Internal server error', 500, false)
  }

  // Send error response
  sendErrorResponse(error, req, res)
}

// Send error response based on environment
const sendErrorResponse = (err, req, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    const response = {
      status: err.status,
      error: err.message,
      ...(err.details && { details: err.details }),
      ...(config.NODE_ENV === 'development' && { stack: err.stack })
    }

    return res.status(err.statusCode).json(response)
  }

  // Programming or unknown errors: don't leak error details
  console.error('ERROR:', err)

  const response = {
    status: 'error',
    error: config.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    ...(config.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err
    })
  }

  res.status(500).json(response)
}

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`)
  next(error)
}

// Validation error formatter
const formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value,
    location: error.location
  }))
}

// Global promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason)
  
  if (config.NODE_ENV === 'production') {
    // Log to monitoring service
    console.error('Server shutting down due to unhandled promise rejection')
    process.exit(1)
  }
})

// Global exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  
  if (config.NODE_ENV === 'production') {
    // Log to monitoring service
    console.error('Server shutting down due to uncaught exception')
    process.exit(1)
  }
})

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  formatValidationErrors,
  
  // Error classes
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
}