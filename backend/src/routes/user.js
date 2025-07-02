const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/user/preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user with preferences from database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Default settings structure
    const defaultSettings = {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        budgetAlerts: true,
        monthlyReports: true,
        goalReminders: false,
        transactionReminders: false,
        lowBalanceAlerts: false
      },
      security: {
        twoFactorEnabled: false
      },
      data: {
        autoBackup: false
      }
    };
    
    // Merge user preferences with defaults
    const userSettings = {
      ...defaultSettings,
      ...(user.preferences || {})
    };
    
    res.json({ 
      success: true, 
      data: userSettings 
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user preferences',
      error: error.message 
    });
  }
});

// PUT /api/user/preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;
    
    // Update user preferences in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.updatePreferences(preferences);
    
    res.json({ 
      success: true, 
      data: preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update preferences',
      error: error.message 
    });
  }
});

// PUT /api/user/notifications
router.put('/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = req.body;
    
    // Update user notification preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const currentPreferences = user.preferences || {};
    await user.updatePreferences({
      ...currentPreferences,
      notifications
    });
    
    res.json({ 
      success: true, 
      data: notifications,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update notification settings',
      error: error.message 
    });
  }
});

// GET /api/user/export - REAL DATA VERSION
router.get('/export', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const format = req.query.format || 'json';
    
    console.log(`Exporting ${format.toUpperCase()} data for user ${userId}...`);
    
    // Fetch real user data from database
    const [user, transactions, categories, userStats] = await Promise.all([
      User.findById(userId),
      Transaction.findByUser(userId, { limit: 10000 }), // Get all transactions
      prisma.category.findMany({
        where: {
          OR: [
            { userId },
            { isDefault: true }
          ],
          isActive: true
        },
        orderBy: { name: 'asc' }
      }),
      User.getUserStatistics(userId)
    ]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Build real export data
    const realUserData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        format: format.toUpperCase(),
        userId: user.id,
        userName: user.fullName,
        totalTransactions: transactions.transactions.length,
        totalCategories: categories.length
      },
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      statistics: userStats,
      transactions: transactions.transactions.map(t => ({
        id: t.id,
        amount: parseFloat(t.amount),
        type: t.type,
        description: t.description,
        date: t.date,
        category: t.category,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      })),
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        isDefault: cat.isDefault,
        isActive: cat.isActive,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      }))
    };
    
    if (format.toLowerCase() === 'csv') {
      // Generate comprehensive CSV content
      let csvContent = '';
      
      // Export Information
      csvContent += 'EXPORT INFORMATION\n';
      csvContent += 'Field,Value\n';
      csvContent += `Export Date,${realUserData.exportInfo.exportDate}\n`;
      csvContent += `Format,${realUserData.exportInfo.format}\n`;
      csvContent += `User ID,${realUserData.exportInfo.userId}\n`;
      csvContent += `User Name,${realUserData.exportInfo.userName}\n`;
      csvContent += `Total Transactions,${realUserData.exportInfo.totalTransactions}\n`;
      csvContent += `Total Categories,${realUserData.exportInfo.totalCategories}\n`;
      csvContent += '\n';
      
      // User Information
      csvContent += 'USER INFORMATION\n';
      csvContent += 'Field,Value\n';
      csvContent += `ID,${realUserData.user.id}\n`;
      csvContent += `First Name,${realUserData.user.firstName}\n`;
      csvContent += `Last Name,${realUserData.user.lastName}\n`;
      csvContent += `Email,${realUserData.user.email}\n`;
      csvContent += `Active,${realUserData.user.isActive}\n`;
      csvContent += `Created At,${realUserData.user.createdAt}\n`;
      csvContent += `Updated At,${realUserData.user.updatedAt}\n`;
      csvContent += '\n';
      
      // Financial Statistics
      csvContent += 'FINANCIAL STATISTICS\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Income,$${realUserData.statistics.totalIncome}\n`;
      csvContent += `Total Expenses,$${realUserData.statistics.totalExpenses}\n`;
      csvContent += `Current Balance,$${realUserData.statistics.balance}\n`;
      csvContent += `Savings Rate,${realUserData.statistics.savingsRate.toFixed(2)}%\n`;
      csvContent += `Transaction Count,${realUserData.statistics.transactionCount}\n`;
      csvContent += `Average Income,$${realUserData.statistics.averageIncome}\n`;
      csvContent += `Average Expense,$${realUserData.statistics.averageExpense}\n`;
      csvContent += '\n';
      
      // Transactions
      csvContent += 'TRANSACTIONS\n';
      csvContent += 'ID,Amount,Type,Description,Category,Date,Created At\n';
      realUserData.transactions.forEach(transaction => {
        const description = (transaction.description || '').replace(/"/g, '""');
        const categoryName = transaction.category?.name || 'Unknown';
        csvContent += `${transaction.id},${transaction.amount},${transaction.type},"${description}",${categoryName},${transaction.date},${transaction.createdAt}\n`;
      });
      csvContent += '\n';
      
      // Categories
      csvContent += 'CATEGORIES\n';
      csvContent += 'ID,Name,Type,Description,Color,Icon,Is Default,Is Active\n';
      realUserData.categories.forEach(category => {
        const description = (category.description || '').replace(/"/g, '""');
        csvContent += `${category.id},${category.name},${category.type},"${description}",${category.color || ''},${category.icon || ''},${category.isDefault},${category.isActive}\n`;
      });
      
      // Set headers and return raw CSV data
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="finance-data-${user.firstName}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
      
    } else {
      // Return raw JSON data
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="finance-data-${user.firstName}-${new Date().toISOString().split('T')[0]}.json"`);
      res.send(JSON.stringify(realUserData, null, 2));
    }
    
    console.log(`${format.toUpperCase()} export completed for user ${userId}`);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export data',
      error: error.message 
    });
  }
});

// DELETE /api/user/data
router.delete('/data', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`Deleting all data for user ${userId}...`);
    
    // Delete all user data from database
    await prisma.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: { userId }
      });
      
      // Delete user categories (not default ones)
      await tx.category.deleteMany({
        where: { 
          userId,
          isDefault: false 
        }
      });
      
      // Reset user preferences to defaults
      await tx.user.update({
        where: { id: userId },
        data: {
          preferences: {
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            theme: 'light',
            language: 'en'
          }
        }
      });
    });
    
    console.log(`All data deleted for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'All user data has been deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user data',
      error: error.message 
    });
  }
});

// PUT /api/user/auto-backup
router.put('/auto-backup', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;
    
    // Update auto-backup setting in user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const currentPreferences = user.preferences || {};
    await user.updatePreferences({
      ...currentPreferences,
      data: {
        ...currentPreferences.data,
        autoBackup: enabled
      }
    });
    
    res.json({ 
      success: true, 
      data: { autoBackup: enabled },
      message: `Auto backup ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error updating auto backup setting:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update auto backup setting',
      error: error.message 
    });
  }
});

module.exports = router;