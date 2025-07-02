// app.js - Complete Application Setup
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const path = require('path')

// Load configuration
const config = require('./src/config/config')
const { initializeDatabase, disconnectDatabase, checkDatabaseHealth } = require('./src/config/database')

// Import routes
const authRoutes = require('./src/routes/auth')
const transactionRoutes = require('./src/routes/transactions')
const categoryRoutes = require('./src/routes/categories')
const reportRoutes = require('./src/routes/reports')
const userRoutes = require('./src/routes/user')

// Import middleware
const authMiddleware = require('./src/middleware/auth')
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler')
const validation = require('./src/middleware/validation')

const app = express()

// Trust proxy (for deployment behind reverse proxy)
if (config.security.trustedProxies.length > 0) {
  app.set('trust proxy', config.security.trustedProxies)
} else {
  app.set('trust proxy', 1)
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", config.server.frontendUrl],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman, etc.)
    if (!origin) return callback(null, true)
    
    if (config.security.corsOrigins.includes(origin) || config.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`
    return callback(new Error(msg), false)
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health'
  }
})

app.use('/api/', limiter)

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: config.rateLimit.authWindowMs,
  max: config.rateLimit.authMaxRequests,
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.authWindowMs / 1000)
  },
  skipSuccessfulRequests: config.rateLimit.skipSuccessfulRequests,
  skipFailedRequests: config.rateLimit.skipFailedRequests
})

// Body parsing middleware
app.use(express.json({ 
  limit: config.api.maxRequestSize,
  type: 'application/json'
}))
app.use(express.urlencoded({ 
  extended: true, 
  limit: config.api.maxRequestSize 
}))

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  threshold: 1024 // Only compress responses larger than 1KB
}))

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, config.upload.uploadPath), {
  maxAge: '1d',
  etag: true
}))

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400
  }))
}

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(config.api.timeout, () => {
    res.status(408).json({
      error: 'Request timeout',
      message: 'The request took too long to process'
    })
  })
  next()
})

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth()
    
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: dbHealth,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      node: process.version
    }

    // If database is unhealthy, return 503
    if (dbHealth.status !== 'healthy') {
      return res.status(503).json(health)
    }

    res.status(200).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Ready check endpoint (for Kubernetes)
app.get('/ready', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth()
    
    if (dbHealth.status === 'healthy') {
      res.status(200).json({ status: 'ready' })
    } else {
      res.status(503).json({ status: 'not ready', reason: 'database unavailable' })
    }
  } catch (error) {
    res.status(503).json({ status: 'not ready', reason: error.message })
  }
})

// Maintenance mode check
app.use((req, res, next) => {
  if (config.features.maintenanceMode && req.path !== '/health' && req.path !== '/ready') {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'The service is currently under maintenance. Please try again later.',
      retryAfter: 3600 // 1 hour
    })
  }
  next()
})

// API routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/transactions', authMiddleware, transactionRoutes)
app.use('/api/categories', authMiddleware, categoryRoutes)
app.use('/api/reports', authMiddleware, reportRoutes)
app.use('/api/user', authMiddleware, userRoutes)

// API documentation endpoint
app.get('/api', (req, res) => {
  if (!config.api.docsEnabled) {
    return res.status(404).json({ error: 'API documentation is disabled' })
  }

  res.json({
    name: 'FinanceTracker API',
    version: config.api.version,
    description: 'RESTful API for personal finance tracking',
    environment: config.NODE_ENV,
    documentation: {
      baseUrl: `${req.protocol}://${req.get('host')}${config.api.prefix}`,
      authentication: 'Bearer Token (JWT)',
      rateLimit: {
        general: `${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs/1000/60} minutes`,
        auth: `${config.rateLimit.authMaxRequests} requests per ${config.rateLimit.authWindowMs/1000/60} minutes`
      }
    },
    endpoints: {
      auth: {
        'POST /api/auth/register': {
          description: 'Register new user',
          body: ['firstName', 'lastName', 'email', 'password']
        },
        'POST /api/auth/login': {
          description: 'Login user',
          body: ['email', 'password']
        },
        'POST /api/auth/refresh': {
          description: 'Refresh access token',
          body: ['refreshToken']
        },
        'POST /api/auth/logout': {
          description: 'Logout user',
          body: ['refreshToken']
        },
        'GET /api/auth/profile': 'Get user profile (authenticated)',
        'PUT /api/auth/profile': 'Update user profile (authenticated)',
        'PUT /api/auth/change-password': 'Change password (authenticated)',
        'POST /api/auth/request-reset': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password with token'
      },
      transactions: {
        'GET /api/transactions': 'Get all transactions with filtering and pagination',
        'GET /api/transactions/:id': 'Get single transaction',
        'POST /api/transactions': 'Create new transaction',
        'PUT /api/transactions/:id': 'Update transaction',
        'DELETE /api/transactions/:id': 'Delete transaction',
        'DELETE /api/transactions': 'Delete multiple transactions',
        'GET /api/transactions/statistics': 'Get transaction statistics',
        'GET /api/transactions/trends': 'Get monthly trends',
        'POST /api/transactions/import': 'Import transactions from CSV'
      },
      categories: {
        'GET /api/categories': 'Get all categories',
        'GET /api/categories/:id': 'Get single category',
        'POST /api/categories': 'Create new category',
        'PUT /api/categories/:id': 'Update category',
        'DELETE /api/categories/:id': 'Delete category',
        'GET /api/categories/statistics': 'Get category statistics',
        'GET /api/categories/defaults': 'Get default categories',
        'PUT /api/categories/:id/restore': 'Restore deactivated category'
      },
      reports: {
        'GET /api/reports/monthly': 'Get monthly financial report',
        'GET /api/reports/yearly': 'Get yearly financial report',
        'GET /api/reports/category': 'Get category-specific report',
        'POST /api/reports/export': 'Export report data (CSV/JSON)'
      }
    },
    features: {
      registration: config.features.enableRegistration,
      passwordReset: config.features.enablePasswordReset,
      dataExport: config.features.enableDataExport,
      dataImport: config.features.enableDataImport
    }
  })
})

// Catch undefined API routes
app.use('/api/*', notFoundHandler)

// Serve frontend in production
if (config.NODE_ENV === 'production') {
  // Serve static files from frontend build
  app.use(express.static(path.join(__dirname, 'public')))
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
} else {
  // Development catch-all
  app.get('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${req.originalUrl} does not exist.`,
      availableRoutes: [
        'GET /health - Health check',
        'GET /ready - Ready check',
        'GET /api - API documentation',
        'POST /api/auth/* - Authentication endpoints',
        'GET|POST|PUT|DELETE /api/transactions/* - Transaction endpoints',
        'GET|POST|PUT|DELETE /api/categories/* - Category endpoints',
        'GET|POST /api/reports/* - Report endpoints'
      ]
    })
  })
}

// Global error handler (must be last)
app.use(errorHandler)

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    console.log('🔌 Initializing database connection...')
    await initializeDatabase()
    
    // Start HTTP server
    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`)
      console.log(`📱 Environment: ${config.NODE_ENV}`)
      console.log(`🌍 Health check: http://${config.server.host}:${config.server.port}/health`)
      console.log(`📚 API docs: http://${config.server.host}:${config.server.port}/api`)
      console.log(`🔒 CORS origins: ${config.security.corsOrigins.join(', ')}`)
      
      if (config.NODE_ENV === 'development') {
        console.log(`🔧 Development mode - Enhanced logging enabled`)
        console.log(`📊 Rate limiting: ${config.rateLimit.maxRequests} req/15min (general), ${config.rateLimit.authMaxRequests} req/15min (auth)`)
      }
    })

    // Set server timeout
    server.timeout = config.api.timeout

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)
      
      // Stop accepting new connections
      server.close(async () => {
        console.log('✅ HTTP server closed')
        
        try {
          // Close database connections
          await disconnectDatabase()
          console.log('✅ Database connections closed')
          
          console.log('✅ Graceful shutdown completed')
          process.exit(0)
        } catch (error) {
          console.error('❌ Error during shutdown:', error)
          process.exit(1)
        }
      })

      // Force close after timeout
      setTimeout(() => {
        console.error('❌ Graceful shutdown timed out, forcing exit')
        process.exit(1)
      }, 10000) // 10 seconds
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Promise Rejection at:', promise, 'reason:', reason)
  
  if (config.NODE_ENV === 'production') {
    console.error('🛑 Server shutting down due to unhandled promise rejection')
    process.exit(1)
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception:', error)
  
  if (config.NODE_ENV === 'production') {
    console.error('🛑 Server shutting down due to uncaught exception')
    process.exit(1)
  }
})

// Start the server
if (require.main === module) {
  startServer()
}

module.exports = { app, startServer }