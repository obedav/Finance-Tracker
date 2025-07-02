// seeds/index.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create default categories
    const defaultCategories = [
      // Income Categories
      {
        name: 'Salary',
        description: 'Regular employment income',
        type: 'INCOME',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
        color: '#10B981',
        isDefault: true
      },
      {
        name: 'Freelance',
        description: 'Freelance work and consulting',
        type: 'INCOME',
        icon: 'M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z',
        color: '#059669',
        isDefault: true
      },
      {
        name: 'Business Income',
        description: 'Business income and profits',
        type: 'INCOME',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        color: '#047857',
        isDefault: true
      },
      {
        name: 'Investment Returns',
        description: 'Investment returns and dividends',
        type: 'INCOME',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        color: '#065F46',
        isDefault: true
      },
      {
        name: 'Gift Received',
        description: 'Gifts and monetary presents',
        type: 'INCOME',
        icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
        color: '#34D399',
        isDefault: true
      },
      {
        name: 'Other Income',
        description: 'Other sources of income',
        type: 'INCOME',
        icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z',
        color: '#6EE7B7',
        isDefault: true
      },

      // Expense Categories
      {
        name: 'Food & Dining',
        description: 'Groceries, restaurants, and food delivery',
        type: 'EXPENSE',
        icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01',
        color: '#F59E0B',
        isDefault: true
      },
      {
        name: 'Transportation',
        description: 'Gas, public transport, car maintenance',
        type: 'EXPENSE',
        icon: 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h3m10 0h3m-17 3h18',
        color: '#D97706',
        isDefault: true
      },
      {
        name: 'Shopping',
        description: 'Clothes, electronics, and general shopping',
        type: 'EXPENSE',
        icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z',
        color: '#B45309',
        isDefault: true
      },
      {
        name: 'Entertainment',
        description: 'Movies, games, hobbies, and fun activities',
        type: 'EXPENSE',
        icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        color: '#92400E',
        isDefault: true
      },
      {
        name: 'Bills & Utilities',
        description: 'Electricity, water, internet, phone bills',
        type: 'EXPENSE',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        color: '#78350F',
        isDefault: true
      },
      {
        name: 'Healthcare',
        description: 'Medical expenses, insurance, pharmacy',
        type: 'EXPENSE',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        color: '#EF4444',
        isDefault: true
      },
      {
        name: 'Education',
        description: 'Courses, books, school fees',
        type: 'EXPENSE',
        icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
        color: '#DC2626',
        isDefault: true
      },
      {
        name: 'Travel',
        description: 'Vacation, business travel, accommodation',
        type: 'EXPENSE',
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        color: '#B91C1C',
        isDefault: true
      },
      {
        name: 'Personal Care',
        description: 'Haircuts, cosmetics, gym membership',
        type: 'EXPENSE',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        color: '#991B1B',
        isDefault: true
      },
      {
        name: 'Other Expenses',
        description: 'Miscellaneous expenses',
        type: 'EXPENSE',
        icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z',
        color: '#7C2D12',
        isDefault: true
      }
    ]

    console.log('📦 Creating default categories...')
    
    // Use upsert to avoid duplicates
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      })
    }

    console.log(`✅ Created ${defaultCategories.length} default categories`)

    // Create a demo user
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@financetracker.com' },
      update: {},
      create: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@financetracker.com',
        password: hashedPassword,
        preferences: {
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          theme: 'light'
        }
      }
    })

    console.log('👤 Created demo user: demo@financetracker.com (password: password123)')

    // Create sample transactions for demo user
    const categories = await prisma.category.findMany({
      where: { isDefault: true }
    })

    const salaryCategory = categories.find(c => c.name === 'Salary')
    const foodCategory = categories.find(c => c.name === 'Food & Dining')
    const transportCategory = categories.find(c => c.name === 'Transportation')
    const freelanceCategory = categories.find(c => c.name === 'Freelance')
    const billsCategory = categories.find(c => c.name === 'Bills & Utilities')

    const sampleTransactions = [
      {
        amount: 5000,
        type: 'INCOME',
        description: 'Monthly salary',
        categoryId: salaryCategory?.id,
        userId: demoUser.id,
        date: new Date('2024-01-01')
      },
      {
        amount: 800,
        type: 'INCOME',
        description: 'Freelance project',
        categoryId: freelanceCategory?.id,
        userId: demoUser.id,
        date: new Date('2024-01-15')
      },
      {
        amount: 1200,
        type: 'EXPENSE',
        description: 'Monthly rent',
        categoryId: billsCategory?.id,
        userId: demoUser.id,
        date: new Date('2024-01-02')
      },
      {
        amount: 450,
        type: 'EXPENSE',
        description: 'Groceries and dining',
        categoryId: foodCategory?.id,
        userId: demoUser.id,
        date: new Date('2024-01-05')
      },
      {
        amount: 150,
        type: 'EXPENSE',
        description: 'Gas and public transport',
        categoryId: transportCategory?.id,
        userId: demoUser.id,
        date: new Date('2024-01-07')
      }
    ]

    console.log('💰 Creating sample transactions...')
    
    for (const transaction of sampleTransactions) {
      if (transaction.categoryId) {
        await prisma.transaction.create({
          data: transaction
        })
      }
    }

    console.log(`✅ Created ${sampleTransactions.length} sample transactions`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('Demo login credentials:')
    console.log('Email: demo@financetracker.com')
    console.log('Password: password123')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })