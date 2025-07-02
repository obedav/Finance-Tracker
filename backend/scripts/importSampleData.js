const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importSampleData() {
  try {
    // Sample user ID - replace with your actual user ID
    const userId = 'cmbjdnxms0002114gw7rlbr0y';
    
    console.log('Starting import for user:', userId);
    
    // First, ensure we have the required categories
    const categories = [];
    
    // Create categories one by one to avoid unique constraint issues
    const categoryData = [
      { name: 'Salary', type: 'INCOME', color: '#10b981', icon: '💰' },
      { name: 'Freelance', type: 'INCOME', color: '#3b82f6', icon: '💻' },
      { name: 'Gift', type: 'INCOME', color: '#8b5cf6', icon: '🎁' },
      { name: 'Bills & Utilities', type: 'EXPENSE', color: '#ef4444', icon: '⚡' },
      { name: 'Food & Dining', type: 'EXPENSE', color: '#f59e0b', icon: '🍽️' },
      { name: 'Transportation', type: 'EXPENSE', color: '#6b7280', icon: '🚗' },
      { name: 'Entertainment', type: 'EXPENSE', color: '#ec4899', icon: '🎬' }
    ];
    
    for (const catData of categoryData) {
      try {
        // First, try to find existing category
        let category = await prisma.category.findFirst({
          where: { 
            name: catData.name,
            isDefault: true 
          }
        });
        
        if (!category) {
          // Create new category if it doesn't exist
          category = await prisma.category.create({
            data: {
              name: catData.name,
              type: catData.type,
              color: catData.color,
              icon: catData.icon,
              isDefault: true,
              isActive: true
            }
          });
          console.log('Created category:', catData.name);
        } else {
          console.log('Using existing category:', catData.name);
        }
        
        categories.push(category);
      } catch (error) {
        console.error('Error with category:', catData.name, error.message);
      }
    }
    
    console.log('Categories ready:', categories.length);
    
    // Create a category lookup
    const categoryLookup = {};
    categories.forEach(cat => {
      categoryLookup[cat.name] = cat.id;
    });
    
    // Sample transactions data
    const transactionsData = [
      {
        type: 'EXPENSE',
        amount: 1530,
        category: 'Bills & Utilities',
        description: 'Household expenses',
        date: '2025-06-11'
      },
      {
        type: 'INCOME',
        amount: 150,
        category: 'Freelance',
        description: 'Software development',
        date: '2025-06-11'
      },
      {
        type: 'INCOME',
        amount: 50,
        category: 'Gift',
        description: '',
        date: '2025-06-06'
      },
      {
        type: 'INCOME',
        amount: 5000,
        category: 'Salary',
        description: 'Monthly salary payment',
        date: '2025-05-31'
      },
      {
        type: 'EXPENSE',
        amount: 1200,
        category: 'Food & Dining',
        description: 'Grocery shopping',
        date: '2025-05-01'
      },
      {
        type: 'EXPENSE',
        amount: 800,
        category: 'Transportation',
        description: 'Gas and car maintenance',
        date: '2025-04-02'
      },
      {
        type: 'INCOME',
        amount: 500,
        category: 'Freelance',
        description: 'Web development project',
        date: '2025-03-03'
      },
      {
        type: 'EXPENSE',
        amount: 150,
        category: 'Entertainment',
        description: 'Movie tickets and dinner',
        date: '2025-02-04'
      }
    ];
    
    // Import transactions
    const createdTransactions = [];
    for (const txData of transactionsData) {
      const categoryId = categoryLookup[txData.category];
      if (!categoryId) {
        console.warn('Category not found:', txData.category);
        continue;
      }
      
      try {
        const transaction = await prisma.transaction.create({
          data: {
            amount: txData.amount,
            type: txData.type,
            description: txData.description || null,
            date: new Date(txData.date),
            userId: userId,
            categoryId: categoryId
          },
          include: {
            category: true
          }
        });
        
        createdTransactions.push(transaction);
        console.log(`Created transaction: ${transaction.type} $${transaction.amount} - ${transaction.category.name}`);
      } catch (error) {
        console.error('Error creating transaction:', error.message);
      }
    }
    
    console.log(`\n✅ Successfully imported ${createdTransactions.length} transactions!`);
    
    // Calculate summary
    const totalIncome = createdTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const totalExpenses = createdTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    console.log(`\n📊 Summary:`);
    console.log(`Total Income: $${totalIncome}`);
    console.log(`Total Expenses: $${totalExpenses}`);
    console.log(`Net Balance: $${totalIncome - totalExpenses}`);
    
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importSampleData();