// models/Category.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Category {
  constructor(data) {
    Object.assign(this, data)
  }

  // Static methods for category operations
  static async findById(id, userId = null) {
    try {
      const where = {
        id,
        OR: [
          { userId },
          { isDefault: true }
        ]
      }

      const category = await prisma.category.findFirst({
        where,
        include: {
          _count: {
            select: {
              transactions: userId ? { where: { userId } } : true
            }
          }
        }
      })

      return category ? new Category(category) : null
    } catch (error) {
      throw new Error(`Error finding category: ${error.message}`)
    }
  }

  static async findByUser(userId, options = {}) {
    try {
      const { type, search, includeDefault = true } = options

      const where = {
        isActive: true,
        ...(type && { type: type.toUpperCase() }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      }

      if (includeDefault) {
        where.OR = [
          { userId },
          { isDefault: true }
        ]
      } else {
        where.userId = userId
      }

      const categories = await prisma.category.findMany({
        where,
        include: {
          _count: {
            select: {
              transactions: {
                where: { userId }
              }
            }
          }
        },
        orderBy: [
          { isDefault: 'desc' },
          { name: 'asc' }
        ]
      })

      return categories.map(cat => new Category(cat))
    } catch (error) {
      throw new Error(`Error finding user categories: ${error.message}`)
    }
  }

  static async findByType(type, userId = null) {
    try {
      const where = {
        type: type.toUpperCase(),
        isActive: true
      }

      if (userId) {
        where.OR = [
          { userId },
          { isDefault: true }
        ]
      } else {
        where.isDefault = true
      }

      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' }
      })

      return categories.map(cat => new Category(cat))
    } catch (error) {
        throw new Error(`Error finding categories by type: ${error.message}`)
        }
      }
    }
    
    module.exports = Category
    