// models/User.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

class User {
  constructor(data) {
    Object.assign(this, data)
  }

  // Static methods for user operations
  static async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5 // Latest 5 transactions
          },
          categories: {
            where: { isActive: true }
          }
        }
      })
      return user ? new User(user) : null
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`)
    }
  }

  static async findByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      return user ? new User(user) : null
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`)
    }
  }

  static async create(userData) {
    try {
      const { firstName, lastName, email, password, preferences = {} } = userData
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          preferences: preferences || {
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            theme: 'light'
          }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          preferences: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return new User(user)
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('User with this email already exists')
      }
      throw new Error(`Error creating user: ${error.message}`)
    }
  }

  static async update(id, updateData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          preferences: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return new User(user)
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('User not found')
      }
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  static async delete(id) {
    try {
      // Soft delete - mark as inactive
      await prisma.user.update({
        where: { id },
        data: { isActive: false }
      })
      
      return true
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('User not found')
      }
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }

  static async changePassword(id, currentPassword, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        throw new Error('Current password is incorrect')
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      
      await prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword }
      })
      
      return true
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`)
    }
  }

  static async verifyPassword(email, password) {
    try {
      const user = await this.findByEmail(email)
      if (!user) {
        return false
      }
      
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`)
    }
  }

  static async getUserStatistics(id) {
    try {
      const [
        transactionCount,
        totalIncome,
        totalExpenses,
        categoryCount,
        recentActivity
      ] = await Promise.all([
        prisma.transaction.count({
          where: { userId: id }
        }),
        prisma.transaction.aggregate({
          where: { userId: id, type: 'INCOME' },
          _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
          where: { userId: id, type: 'EXPENSE' },
          _sum: { amount: true }
        }),
        prisma.category.count({
          where: { userId: id, isActive: true }
        }),
        prisma.transaction.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            category: {
              select: { name: true, type: true }
            }
          }
        })
      ])

      const income = totalIncome._sum.amount || 0
      const expenses = totalExpenses._sum.amount || 0

      return {
        transactionCount,
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        categoryCount,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
        recentActivity
      }
    } catch (error) {
      throw new Error(`Error getting user statistics: ${error.message}`)
    }
  }

  static async getActiveUsers() {
    try {
      return await prisma.user.count({
        where: { isActive: true }
      })
    } catch (error) {
      throw new Error(`Error getting active users count: ${error.message}`)
    }
  }

  static async searchUsers(query, limit = 10) {
    try {
      return await prisma.user.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          createdAt: true
        },
        take: limit
      })
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`)
    }
  }

  // Instance methods
  async updatePreferences(newPreferences) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: this.id },
        data: {
          preferences: {
            ...this.preferences,
            ...newPreferences
          }
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
      
      Object.assign(this, updatedUser)
      return this
    } catch (error) {
      throw new Error(`Error updating preferences: ${error.message}`)
    }
  }

  async updateAvatar(avatarUrl) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: this.id },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          updatedAt: true
        }
      })
      
      Object.assign(this, updatedUser)
      return this
    } catch (error) {
      throw new Error(`Error updating avatar: ${error.message}`)
    }
  }

  async getTransactions(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        categoryId,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options

      const skip = (page - 1) * limit
      
      const where = {
        userId: this.id,
        ...(type && { type }),
        ...(categoryId && { categoryId }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true, type: true, color: true, icon: true }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.transaction.count({ where })
      ])

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Error getting user transactions: ${error.message}`)
    }
  }

  async getCategories(type = null) {
    try {
      const where = {
        OR: [
          { userId: this.id },
          { isDefault: true }
        ],
        isActive: true,
        ...(type && { type })
      }

      return await prisma.category.findMany({
        where,
        orderBy: [
          { isDefault: 'desc' },
          { name: 'asc' }
        ]
      })
    } catch (error) {
      throw new Error(`Error getting user categories: ${error.message}`)
    }
  }

  // Computed properties
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get initials() {
    return `${this.firstName?.charAt(0) || ''}${this.lastName?.charAt(0) || ''}`.toUpperCase()
  }

  get isVerified() {
    return this.emailVerifiedAt !== null
  }

  // Sanitize user data for API responses
  toJSON() {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword
  }

  // Safe user data for public display
  toPublic() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      initials: this.initials,
      avatar: this.avatar
    }
  }
}

module.exports = User