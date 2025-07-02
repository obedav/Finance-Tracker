// controllers/authController.js - Updated with enhanced debugging and error handling
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const authController = {
  // Register new user
  async register(req, res) {
    try {
      console.log('\n🔵 === REGISTRATION REQUEST DEBUG ===')
      console.log('🔵 Timestamp:', new Date().toISOString())
      console.log('🔵 Method:', req.method)
      console.log('🔵 URL:', req.originalUrl)
      console.log('🔵 Headers:', {
        'content-type': req.headers['content-type'],
        'origin': req.headers['origin'],
        'user-agent': req.headers['user-agent']?.substring(0, 50) + '...'
      })
      console.log('🔵 Raw body:', req.body)
      console.log('🔵 Body type:', typeof req.body)
      console.log('🔵 Body keys:', Object.keys(req.body || {}))
      console.log('🔵 === END DEBUG ===\n')

      const { firstName, lastName, email, password } = req.body

      console.log('🔵 Extracted fields:', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordLength: password?.length,
        hasFirstName: !!firstName,
        hasLastName: !!lastName,
        hasEmail: !!email,
        hasPassword: !!password
      })

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        console.log('❌ Missing required fields:', {
          firstName: !firstName ? 'MISSING' : 'OK',
          lastName: !lastName ? 'MISSING' : 'OK',
          email: !email ? 'MISSING' : 'OK',
          password: !password ? 'MISSING' : 'OK'
        })
        
        return res.status(400).json({ 
          error: 'All fields are required',
          details: {
            firstName: !firstName ? 'Missing' : 'Present',
            lastName: !lastName ? 'Missing' : 'Present',
            email: !email ? 'Missing' : 'Present',
            password: !password ? 'Missing' : 'Present'
          }
        })
      }

      // Trim whitespace
      const trimmedFirstName = firstName.trim()
      const trimmedLastName = lastName.trim()
      const trimmedEmail = email.trim().toLowerCase()

      // Validate field lengths
      if (trimmedFirstName.length < 2) {
        console.log('❌ First name too short:', trimmedFirstName.length)
        return res.status(400).json({ 
          error: 'First name must be at least 2 characters long' 
        })
      }

      if (trimmedLastName.length < 2) {
        console.log('❌ Last name too short:', trimmedLastName.length)
        return res.status(400).json({ 
          error: 'Last name must be at least 2 characters long' 
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        console.log('❌ Invalid email format:', trimmedEmail)
        return res.status(400).json({ 
          error: 'Please enter a valid email address' 
        })
      }

      // Validate password strength
      if (password.length < 6) {
        console.log('❌ Password too short:', password.length)
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        })
      }

      console.log('✅ All validations passed')
      console.log('🔍 Checking if user exists:', trimmedEmail)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: trimmedEmail }
      })

      if (existingUser) {
        console.log('❌ User already exists:', trimmedEmail)
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        })
      }

      console.log('✅ User does not exist, proceeding with registration')

      // Hash password
      console.log('🔒 Hashing password...')
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      console.log('✅ Password hashed successfully')

      // Create user data
      const userData = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        password: hashedPassword,
        preferences: {
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          theme: 'light'
        }
      }

      console.log('👤 Creating user with data:', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        preferences: userData.preferences
      })

      // Create user
      const user = await prisma.user.create({
        data: userData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          preferences: true,
          createdAt: true
        }
      })

      console.log('✅ User created successfully:', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      })

      // Generate tokens
      console.log('🎫 Generating tokens...')
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      )

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })

      console.log('✅ Registration completed successfully')

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token: accessToken,
        refreshToken
      })
    } catch (error) {
      console.error('💥 Registration error:', error)
      
      // Handle Prisma errors
      if (error.code === 'P2002') {
        console.log('❌ Prisma unique constraint violation')
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        })
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        console.log('❌ Prisma database error:', error.code, error.message)
        return res.status(500).json({ 
          error: 'Database error occurred during registration' 
        })
      }

      // Handle JWT errors
      if (error.name === 'JsonWebTokenError') {
        console.log('❌ JWT error:', error.message)
        return res.status(500).json({ 
          error: 'Token generation failed' 
        })
      }

      // Generic error
      res.status(500).json({ 
        error: 'Failed to register user',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  },

  // Login user
  async login(req, res) {
    try {
      console.log('\n🔵 === LOGIN REQUEST DEBUG ===')
      console.log('🔵 Timestamp:', new Date().toISOString())
      console.log('🔵 Body:', { email: req.body.email, passwordProvided: !!req.body.password })

      const { email, password } = req.body

      // Validate required fields
      if (!email || !password) {
        console.log('❌ Missing credentials')
        return res.status(400).json({ 
          error: 'Email and password are required' 
        })
      }

      const trimmedEmail = email.trim().toLowerCase()
      console.log('🔍 Looking for user:', trimmedEmail)

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: trimmedEmail }
      })

      if (!user) {
        console.log('❌ User not found:', trimmedEmail)
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        })
      }

      console.log('✅ User found:', user.id)

      // Check if user is active
      if (!user.isActive) {
        console.log('❌ User account is deactivated:', user.id)
        return res.status(401).json({ 
          error: 'Account is deactivated' 
        })
      }

      // Verify password
      console.log('🔒 Verifying password...')
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        console.log('❌ Invalid password for user:', user.id)
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        })
      }

      console.log('✅ Password verified successfully')

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      )

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      console.log('✅ Login successful for user:', user.id)

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token: accessToken,
        refreshToken
      })
    } catch (error) {
      console.error('💥 Login error:', error)
      res.status(500).json({ error: 'Failed to login' })
    }
  },

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token is required' 
        })
      }

      // Verify refresh token
      let decoded
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      } catch (error) {
        return res.status(401).json({ 
          error: 'Invalid refresh token' 
        })
      }

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      })

      if (!storedToken || storedToken.expiresAt < new Date()) {
        return res.status(401).json({ 
          error: 'Refresh token expired or invalid' 
        })
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: storedToken.userId, email: storedToken.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      res.json({
        token: accessToken,
        refreshToken: refreshToken // Return the same refresh token
      })
    } catch (error) {
      console.error('Token refresh error:', error)
      res.status(500).json({ error: 'Failed to refresh token' })
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      const { refreshToken } = req.body

      if (refreshToken) {
        // Remove refresh token from database
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken }
        })
      }

      res.json({ message: 'Logout successful' })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({ error: 'Failed to logout' })
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json(user)
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({ error: 'Failed to get profile' })
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id
      const { firstName, lastName, avatar, preferences } = req.body

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(avatar !== undefined && { avatar }),
          ...(preferences && { preferences })
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          preferences: true,
          updatedAt: true
        }
      })

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ error: 'Failed to update profile' })
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user.id
      const { currentPassword, newPassword } = req.body

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Current password and new password are required' 
        })
      }

      // Validate new password strength
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'New password must be at least 6 characters long' 
        })
      }

      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ 
          error: 'Current password is incorrect' 
        })
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      })

      // Invalidate all refresh tokens for security
      await prisma.refreshToken.deleteMany({
        where: { userId }
      })

      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({ error: 'Failed to change password' })
    }
  },

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required' 
        })
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      // Don't reveal if user exists or not for security
      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      })

      // If user exists, generate reset token (implement email sending here)
      if (user) {
        const resetToken = jwt.sign(
          { userId: user.id, type: 'password_reset' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        )

        // In a real app, you would send this token via email
        console.log(`Password reset token for ${email}: ${resetToken}`)
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      res.status(500).json({ error: 'Failed to process password reset request' })
    }
  },

  // Reset password with token
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body

      if (!token || !newPassword) {
        return res.status(400).json({ 
          error: 'Token and new password are required' 
        })
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        })
      }

      // Verify token
      let decoded
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.type !== 'password_reset') {
          throw new Error('Invalid token type')
        }
      } catch (error) {
        return res.status(401).json({ 
          error: 'Invalid or expired reset token' 
        })
      }

      // Hash new password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword }
      })

      // Invalidate all refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId: decoded.userId }
      })

      res.json({ message: 'Password reset successfully' })
    } catch (error) {
      console.error('Password reset error:', error)
      res.status(500).json({ error: 'Failed to reset password' })
    }
  },

  // Deactivate account
  async deactivateAccount(req, res) {
    try {
      const userId = req.user.id
      const { password } = req.body

      if (!password) {
        return res.status(400).json({ 
          error: 'Password confirmation is required' 
        })
      }

      // Get user and verify password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Password is incorrect' 
        })
      }

      // Deactivate account
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      })

      // Invalidate all refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId }
      })

      res.json({ message: 'Account deactivated successfully' })
    } catch (error) {
      console.error('Account deactivation error:', error)
      res.status(500).json({ error: 'Failed to deactivate account' })
    }
  }
}

module.exports = authController