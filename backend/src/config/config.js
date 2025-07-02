// config/config.js
require('dotenv').config()

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 20000,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-fallback-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-fallback-refresh-secret',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '1h',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'financetracker',
    audience: process.env.JWT_AUDIENCE || 'financetracker-users'
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
    trustedProxies: process.env.TRUSTED_PROXIES ? process.env.TRUSTED_PROXIES.split(',') : [],
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 900000 // 15 minutes
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
    skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    allowedMimeTypes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    uploadPath: process.env.UPLOAD_PATH || 'uploads/',
    tempPath: process.env.TEMP_PATH || 'temp/',
    avatarPath: process.env.AVATAR_PATH || 'uploads/avatars/',
    documentsPath: process.env.DOCUMENTS_PATH || 'uploads/documents/'
  },

  // Email Configuration
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'FinanceTracker',
      address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER
    },
    templates: {
      passwordReset: 'password-reset',
      emailVerification: 'email-verification',
      welcomeEmail: 'welcome'
    }
  },

  // API Configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
    docsEnabled: process.env.API_DOCS_ENABLED !== 'false',
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true'
  },

  // Cache Configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    provider: process.env.CACHE_PROVIDER || 'memory', // memory, redis
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
    maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 1000,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB) || 0
    }
  },

  // Backup Configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
    retention: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    path: process.env.BACKUP_PATH || 'backups/',
    s3: {
      enabled: process.env.S3_BACKUP_ENABLED === 'true',
      bucket: process.env.S3_BACKUP_BUCKET,
      region: process.env.S3_BACKUP_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  },

  // Feature Flags
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
    enablePasswordReset: process.env.ENABLE_PASSWORD_RESET !== 'false',
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    enableTwoFactor: process.env.ENABLE_TWO_FACTOR === 'true',
    enableDataExport: process.env.ENABLE_DATA_EXPORT !== 'false',
    enableDataImport: process.env.ENABLE_DATA_IMPORT !== 'false',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
  },

  // Business Logic Configuration
  business: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'],
    maxTransactionsPerDay: parseInt(process.env.MAX_TRANSACTIONS_PER_DAY) || 1000,
    maxCategoriesPerUser: parseInt(process.env.MAX_CATEGORIES_PER_USER) || 50,
    dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS) || 2555, // 7 years
    exportLimits: {
      transactions: parseInt(process.env.EXPORT_LIMIT_TRANSACTIONS) || 10000,
      dateRange: parseInt(process.env.EXPORT_LIMIT_DAYS) || 365 // 1 year
    }
  },

  // Monitoring Configuration
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 60000, // 1 minute
    metricsEnabled: process.env.METRICS_ENABLED === 'true',
    alertsEnabled: process.env.ALERTS_ENABLED === 'true',
    errorTracking: {
      enabled: process.env.ERROR_TRACKING_ENABLED === 'true',
      dsn: process.env.SENTRY_DSN || process.env.ERROR_TRACKING_DSN
    }
  },

  // Development Configuration
  development: {
    enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
    mockExternalServices: process.env.MOCK_EXTERNAL_SERVICES === 'true',
    seedDatabase: process.env.SEED_DATABASE === 'true',
    enableCors: process.env.ENABLE_CORS !== 'false',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true'
  }
}

// Validation function
const validateConfig = () => {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate JWT secrets are strong enough
  if (config.jwt.secret.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long for security')
  }

  if (config.jwt.refreshSecret.length < 32) {
    console.warn('⚠️  JWT_REFRESH_SECRET should be at least 32 characters long for security')
  }

  // Validate database URL format
  if (!config.database.url.includes('://')) {
    throw new Error('DATABASE_URL must be a valid connection string')
  }

  console.log('✅ Configuration validation passed')
}

// Environment-specific overrides
if (config.NODE_ENV === 'production') {
  // Production overrides
  config.logging.level = 'warn'
  config.development.enableDebugLogs = false
  config.api.docsEnabled = false
  
} else if (config.NODE_ENV === 'test') {
  // Test overrides
  config.logging.level = 'error'
  config.email.enabled = false
  config.rateLimit.maxRequests = 1000
  config.cache.enabled = false
  
} else if (config.NODE_ENV === 'development') {
  // Development overrides
  config.logging.level = 'debug'
  config.development.enableDebugLogs = true
  config.rateLimit.maxRequests = 1000
}

// Validate configuration
if (process.env.NODE_ENV !== 'test') {
  validateConfig()
}

module.exports = config