

// middleware/auth.js
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token is required' 
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Access token has expired' 
        })
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid access token' 
        })
      } else {
        return res.status(401).json({ 
          error: 'Token verification failed' 
        })
      }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      })
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account is deactivated' 
      })
    }

    // Add user to request object
    req.user = user

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ 
      error: 'Authentication failed' 
    })
  }
}

// Optional auth middleware (doesn't throw error if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null

    if (!token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })

    req.user = user && user.isActive ? user : null
    next()
  } catch (error) {
    req.user = null
    next()
  }
}

// Admin middleware (requires admin role)
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      })
    }

    // In this simple app, we'll check if user email is admin
    // In a real app, you'd have a proper role system
    const isAdmin = req.user.email === process.env.ADMIN_EMAIL || req.user.isAdmin

    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Admin access required' 
      })
    }

    next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    res.status(500).json({ 
      error: 'Authorization failed' 
    })
  }
}

module.exports = authMiddleware
module.exports.optionalAuth = optionalAuth
module.exports.adminMiddleware = adminMiddleware