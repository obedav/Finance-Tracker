// controllers/categoryController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categoryController = {
  // Get all categories for a user
  async getCategories(req, res) {
    try {
      const userId = req.user.id
      const { type, search } = req.query

      const where = {
        OR: [
          { userId },
          { isDefault: true }
        ],
        isActive: true,
        ...(type && { type: type.toUpperCase() }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
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

      // Calculate transaction totals for each category
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const stats = await prisma.transaction.aggregate({
            where: {
              categoryId: category.id,
              userId
            },
            _sum: { amount: true },
            _count: true
          })

          return {
            ...category,
            transactionCount: stats._count,
            totalAmount: stats._sum.amount || 0
          }
        })
      )

      res.json(categoriesWithStats)
    } catch (error) {
      console.error('Error fetching categories:', error)
      res.status(500).json({ error: 'Failed to fetch categories' })
    }
  },

  // Get single category
  async getCategory(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const category = await prisma.category.findFirst({
        where: {
          id,
          OR: [
            { userId },
            { isDefault: true }
          ]
        },
        include: {
          _count: {
            select: {
              transactions: {
                where: { userId }
              }
            }
          }
        }
      })

      if (!category) {
        return res.status(404).json({ error: 'Category not found' })
      }

      // Get transaction statistics
      const stats = await prisma.transaction.aggregate({
        where: {
          categoryId: id,
          userId
        },
        _sum: { amount: true },
        _count: true
      })

      res.json({
        ...category,
        transactionCount: stats._count,
        totalAmount: stats._sum.amount || 0
      })
    } catch (error) {
      console.error('Error fetching category:', error)
      res.status(500).json({ error: 'Failed to fetch category' })
    }
  },

  // Create new category
  async createCategory(req, res) {
    try {
      const userId = req.user.id
      const { name, description, type, icon, color } = req.body

      // Validate required fields
      if (!name || !type) {
        return res.status(400).json({ 
          error: 'Name and type are required' 
        })
      }

      // Check if category name already exists for this user
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          OR: [
            { userId },
            { isDefault: true }
          ]
        }
      })

      if (existingCategory) {
        return res.status(400).json({ 
          error: 'Category with this name already exists' 
        })
      }

      const category = await prisma.category.create({
        data: {
          name,
          description,
          type: type.toUpperCase(),
          icon,
          color,
          userId
        }
      })

      res.status(201).json(category)
    } catch (error) {
      console.error('Error creating category:', error)
      res.status(500).json({ error: 'Failed to create category' })
    }
  },

  // Update category
  async updateCategory(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { name, description, type, icon, color } = req.body

      // Check if category exists and belongs to user (not default)
      const existingCategory = await prisma.category.findFirst({
        where: { 
          id, 
          userId, // Only user's own categories can be updated
          isDefault: false 
        }
      })

      if (!existingCategory) {
        return res.status(404).json({ 
          error: 'Category not found or cannot be modified' 
        })
      }

      // Check if new name conflicts with existing categories
      if (name && name !== existingCategory.name) {
        const nameConflict = await prisma.category.findFirst({
          where: {
            name: { equals: name, mode: 'insensitive' },
            id: { not: id },
            OR: [
              { userId },
              { isDefault: true }
            ]
          }
        })

        if (nameConflict) {
          return res.status(400).json({ 
            error: 'Category with this name already exists' 
          })
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(type && { type: type.toUpperCase() }),
          ...(icon && { icon }),
          ...(color && { color })
        }
      })

      res.json(category)
    } catch (error) {
      console.error('Error updating category:', error)
      res.status(500).json({ error: 'Failed to update category' })
    }
  },

  // Delete category
  async deleteCategory(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if category exists and belongs to user (not default)
      const category = await prisma.category.findFirst({
        where: { 
          id, 
          userId,
          isDefault: false 
        }
      })

      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found or cannot be deleted' 
        })
      }

      // Check if category has transactions
      const transactionCount = await prisma.transaction.count({
        where: { categoryId: id }
      })

      if (transactionCount > 0) {
        // Soft delete - mark as inactive instead of deleting
        await prisma.category.update({
          where: { id },
          data: { isActive: false }
        })

        res.json({ 
          message: 'Category deactivated (has existing transactions)',
          deactivated: true
        })
      } else {
        // Hard delete if no transactions
        await prisma.category.delete({
          where: { id }
        })

        res.json({ message: 'Category deleted successfully' })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      res.status(500).json({ error: 'Failed to delete category' })
    }
  },

  // Get category statistics
  async getCategoryStatistics(req, res) {
    try {
      const userId = req.user.id
      const { startDate, endDate, type } = req.query

      const where = {
        userId,
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }),
        ...(type && { type: type.toUpperCase() })
      }

      const categoryStats = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where,
        _sum: { amount: true },
        _count: true,
        _avg: { amount: true }
      })

      // Get category details
      const categoryIds = categoryStats.map(stat => stat.categoryId)
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { 
          id: true, 
          name: true, 
          type: true, 
          color: true, 
          icon: true 
        }
      })

      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat
        return acc
      }, {})

      const enhancedStats = categoryStats.map(stat => ({
        category: categoryMap[stat.categoryId],
        totalAmount: stat._sum.amount,
        transactionCount: stat._count,
        averageAmount: stat._avg.amount
      }))

      // Calculate percentages
      const totalAmount = enhancedStats.reduce((sum, stat) => sum + stat.totalAmount, 0)
      const statsWithPercentages = enhancedStats.map(stat => ({
        ...stat,
        percentage: totalAmount > 0 ? (stat.totalAmount / totalAmount) * 100 : 0
      }))

      // Sort by total amount descending
      statsWithPercentages.sort((a, b) => b.totalAmount - a.totalAmount)

      res.json({
        statistics: statsWithPercentages,
        summary: {
          totalCategories: statsWithPercentages.length,
          totalAmount,
          totalTransactions: categoryStats.reduce((sum, stat) => sum + stat._count, 0)
        }
      })
    } catch (error) {
      console.error('Error fetching category statistics:', error)
      res.status(500).json({ error: 'Failed to fetch category statistics' })
    }
  },

  // Get default categories
  async getDefaultCategories(req, res) {
    try {
      const defaultCategories = await prisma.category.findMany({
        where: { isDefault: true, isActive: true },
        orderBy: { name: 'asc' }
      })

      res.json(defaultCategories)
    } catch (error) {
      console.error('Error fetching default categories:', error)
      res.status(500).json({ error: 'Failed to fetch default categories' })
    }
  },

  // Restore deactivated category
  async restoreCategory(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const category = await prisma.category.findFirst({
        where: { 
          id, 
          userId,
          isActive: false 
        }
      })

      if (!category) {
        return res.status(404).json({ 
          error: 'Deactivated category not found' 
        })
      }

      const restoredCategory = await prisma.category.update({
        where: { id },
        data: { isActive: true }
      })

      res.json({
        message: 'Category restored successfully',
        category: restoredCategory
      })
    } catch (error) {
      console.error('Error restoring category:', error)
      res.status(500).json({ error: 'Failed to restore category' })
    }
  }
}

module.exports = categoryController