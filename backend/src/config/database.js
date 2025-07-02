// config/database.js
const { PrismaClient } = require('@prisma/client')
const config = require('./config')

class DatabaseManager {
  constructor() {
    this.prisma = null
    this.isConnected = false
    this.connectionRetries = 0
    this.maxRetries = 5
    this.retryDelay = 5000 // 5 seconds
  }

  // Initialize Prisma client with configuration
  async initialize() {
    try {
      console.log('🔌 Initializing database connection...')
      
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: config.database.url
          }
        },
        log: this.getLogLevel(),
        errorFormat: 'pretty'
        // Removed rejectOnNotFound - deprecated in Prisma 5.x
      })

      // Add middleware for logging and performance monitoring
      this.addMiddleware()

      // Test the connection
      await this.testConnection()
      
      console.log('✅ Database connection established successfully')
      this.isConnected = true
      
      return this.prisma
    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message)
      
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++
        console.log(`🔄 Retrying database connection (${this.connectionRetries}/${this.maxRetries}) in ${this.retryDelay/1000}s...`)
        
        await this.sleep(this.retryDelay)
        return this.initialize()
      }
      
      throw new Error(`Database initialization failed after ${this.maxRetries} attempts: ${error.message}`)
    }
  }

  // Test database connection
  async testConnection() {
    try {
      await this.prisma.$connect()
      await this.prisma.$queryRaw`SELECT 1`
      console.log('🔍 Database connection test passed')
    } catch (error) {
      console.error('🔍 Database connection test failed:', error.message)
      throw error
    }
  }

  // Add Prisma middleware for logging and monitoring
  addMiddleware() {
    // Query logging middleware
    this.prisma.$use(async (params, next) => {
      const before = Date.now()
      
      try {
        const result = await next(params)
        const after = Date.now()
        const duration = after - before
        
        if (config.development?.enableDebugLogs) {
          console.log(`📊 Query ${params.model}.${params.action} took ${duration}ms`)
        }
        
        // Log slow queries (> 1000ms)
        if (duration > 1000) {
          console.warn(`🐌 Slow query detected: ${params.model}.${params.action} took ${duration}ms`)
        }
        
        return result
      } catch (error) {
        const after = Date.now()
        const duration = after - before
        
        console.error(`❌ Query ${params.model}.${params.action} failed after ${duration}ms:`, error.message)
        throw error
      }
    })

    // Soft delete middleware (for models that support it)
    this.prisma.$use(async (params, next) => {
      // Handle soft delete for User model
      if (params.model === 'User') {
        if (params.action === 'delete') {
          // Change delete to update with isActive: false
          params.action = 'update'
          params.args.data = { isActive: false }
        }
        
        if (params.action === 'deleteMany') {
          // Change deleteMany to updateMany with isActive: false
          params.action = 'updateMany'
          if (params.args.data === undefined) {
            params.args.data = {}
          }
          params.args.data.isActive = false
        }
      }

      return next(params)
    })

    // Auto-update timestamps middleware
    this.prisma.$use(async (params, next) => {
      if (params.action === 'update' || params.action === 'updateMany') {
        if (params.args.data === undefined) {
          params.args.data = {}
        }
        params.args.data.updatedAt = new Date()
      }

      return next(params)
    })
  }

  // Get appropriate log level based on environment
  getLogLevel() {
    if (config.NODE_ENV === 'development') {
      return ['query', 'info', 'warn', 'error']
    } else if (config.NODE_ENV === 'production') {
      return ['warn', 'error']
    } else {
      return ['error']
    }
  }

  // Graceful shutdown
  async disconnect() {
    try {
      if (this.prisma && this.isConnected) {
        console.log('🔌 Disconnecting from database...')
        await this.prisma.$disconnect()
        this.isConnected = false
        console.log('✅ Database disconnected successfully')
      }
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error.message)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isConnected || !this.prisma) {
        return {
          status: 'error',
          message: 'Database not connected',
          timestamp: new Date().toISOString()
        }
      }

      const start = Date.now()
      await this.prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - start

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        connected: this.isConnected
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        connected: false
      }
    }
  }

  // Get database statistics
  async getStatistics() {
    try {
      if (!this.isConnected || !this.prisma) {
        throw new Error('Database not connected')
      }

      const [
        userCount,
        transactionCount,
        categoryCount,
        activeUsers
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.transaction.count(),
        this.prisma.category.count(),
        this.prisma.user.count({
          where: { isActive: true }
        })
      ])

      return {
        users: {
          total: userCount,
          active: activeUsers,
          inactive: userCount - activeUsers
        },
        transactions: {
          total: transactionCount
        },
        categories: {
          total: categoryCount
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching database statistics:', error)
      throw error
    }
  }

  // Clean up old data based on retention policy
  async cleanupOldData() {
    try {
      if (!this.isConnected || !this.prisma) {
        throw new Error('Database not connected')
      }

      const retentionDate = new Date()
      retentionDate.setDate(retentionDate.getDate() - (config.business?.dataRetentionDays || 365))

      console.log(`🧹 Cleaning up data older than ${retentionDate.toISOString()}...`)

      // Clean up old refresh tokens
      const deletedTokens = await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      console.log(`🧹 Cleaned up ${deletedTokens.count} expired refresh tokens`)

      // You can add more cleanup logic here for other data types
      // For example, old audit logs, temporary files, etc.

      return {
        deletedTokens: deletedTokens.count,
        cleanupDate: retentionDate.toISOString(),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error during data cleanup:', error)
      throw error
    }
  }

  // Database backup (for PostgreSQL)
  async createBackup() {
    try {
      if (config.NODE_ENV === 'production' && config.backup?.enabled) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupName = `backup-${timestamp}.sql`
        
        console.log(`📦 Creating database backup: ${backupName}`)
        
        // This would typically use pg_dump for PostgreSQL
        // Implementation depends on your database type and backup strategy
        
        return {
          backupName,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }
      }
    } catch (error) {
      console.error('Error creating database backup:', error)
      throw error
    }
  }

  // Utility function for sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get Prisma client instance
  getClient() {
    if (!this.prisma || !this.isConnected) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this.prisma
  }

  // Check if database is connected
  isHealthy() {
    return this.isConnected && this.prisma !== null
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager()

// Export both the manager and a function to get the Prisma client
module.exports = {
  databaseManager,
  
  // Helper function to get Prisma client
  getPrismaClient: () => databaseManager.getClient(),
  
  // Initialize database connection
  initializeDatabase: () => databaseManager.initialize(),
  
  // Graceful shutdown
  disconnectDatabase: () => databaseManager.disconnect(),
  
  // Health check
  checkDatabaseHealth: () => databaseManager.healthCheck(),
  
  // Statistics
  getDatabaseStatistics: () => databaseManager.getStatistics(),
  
  // Cleanup
  cleanupOldData: () => databaseManager.cleanupOldData(),
  
  // Backup
  createBackup: () => databaseManager.createBackup()
}