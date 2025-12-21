<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $demoUser = User::where('email', 'demo@example.com')->first();

        if (!$demoUser) {
            $this->command->warn('Demo user not found. Please run UserSeeder first.');
            return;
        }

        // Get categories
        $salaryCategory = Category::where('name', 'Salary')->where('is_default', true)->first();
        $freelanceCategory = Category::where('name', 'Freelance')->where('is_default', true)->first();
        $foodCategory = Category::where('name', 'Food & Dining')->where('is_default', true)->first();
        $transportCategory = Category::where('name', 'Transportation')->where('is_default', true)->first();
        $entertainmentCategory = Category::where('name', 'Entertainment')->where('is_default', true)->first();
        $billsCategory = Category::where('name', 'Bills & Utilities')->where('is_default', true)->first();
        $shoppingCategory = Category::where('name', 'Shopping')->where('is_default', true)->first();

        $transactions = [
            // December 2025 - Current month
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 5000.00,
                'description' => 'Monthly salary payment',
                'category_id' => $salaryCategory?->id,
                'date' => Carbon::now()->startOfMonth()->addHours(9),
                'status' => 'completed',
                'notes' => 'December salary',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 1200.00,
                'description' => 'Grocery shopping',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subDays(13)->setTime(14, 30),
                'status' => 'completed',
                'notes' => 'Monthly groceries at Whole Foods',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 800.00,
                'description' => 'Gas and car maintenance',
                'category_id' => $transportCategory?->id,
                'date' => Carbon::now()->subDays(12)->setTime(10, 15),
                'status' => 'completed',
                'notes' => 'Oil change and gas fill-up',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 500.00,
                'description' => 'Web development project',
                'category_id' => $freelanceCategory?->id,
                'date' => Carbon::now()->subDays(11)->setTime(16, 45),
                'status' => 'completed',
                'notes' => 'Freelance website project for local business',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 150.00,
                'description' => 'Movie tickets and dinner',
                'category_id' => $entertainmentCategory?->id,
                'date' => Carbon::now()->subDays(10)->setTime(19, 30),
                'status' => 'completed',
                'notes' => 'Date night',
            ],

            // More December transactions
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 120.00,
                'description' => 'Internet and phone bill',
                'category_id' => $billsCategory?->id,
                'date' => Carbon::now()->subDays(9)->setTime(8, 0),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 85.50,
                'description' => 'Restaurant lunch',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subDays(8)->setTime(12, 30),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 250.00,
                'description' => 'New shoes and clothing',
                'category_id' => $shoppingCategory?->id,
                'date' => Carbon::now()->subDays(7)->setTime(15, 20),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 45.00,
                'description' => 'Coffee shop',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subDays(5)->setTime(9, 15),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 300.00,
                'description' => 'Consulting work',
                'category_id' => $freelanceCategory?->id,
                'date' => Carbon::now()->subDays(3)->setTime(17, 0),
                'status' => 'completed',
            ],

            // November 2025
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 5000.00,
                'description' => 'Monthly salary payment',
                'category_id' => $salaryCategory?->id,
                'date' => Carbon::now()->subMonth()->startOfMonth()->addHours(9),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 1100.00,
                'description' => 'Grocery shopping',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subMonth()->addDays(4)->setTime(15, 0),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 150.00,
                'description' => 'Electric bill',
                'category_id' => $billsCategory?->id,
                'date' => Carbon::now()->subMonth()->addDays(9)->setTime(10, 0),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 75.00,
                'description' => 'Gas',
                'category_id' => $transportCategory?->id,
                'date' => Carbon::now()->subMonth()->addDays(14)->setTime(16, 30),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 800.00,
                'description' => 'Freelance design work',
                'category_id' => $freelanceCategory?->id,
                'date' => Carbon::now()->subMonth()->addDays(19)->setTime(14, 0),
                'status' => 'completed',
            ],

            // October 2025
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 5000.00,
                'description' => 'Monthly salary payment',
                'category_id' => $salaryCategory?->id,
                'date' => Carbon::now()->subMonths(2)->startOfMonth()->addHours(9),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 950.00,
                'description' => 'Grocery shopping',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subMonths(2)->addDays(7)->setTime(13, 45),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 200.00,
                'description' => 'Concert tickets',
                'category_id' => $entertainmentCategory?->id,
                'date' => Carbon::now()->subMonths(2)->addDays(14)->setTime(20, 0),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 500.00,
                'description' => 'Car insurance',
                'category_id' => $transportCategory?->id,
                'date' => Carbon::now()->subMonths(2)->addDays(19)->setTime(11, 30),
                'status' => 'completed',
            ],

            // September 2025
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 5000.00,
                'description' => 'Monthly salary payment',
                'category_id' => $salaryCategory?->id,
                'date' => Carbon::now()->subMonths(3)->startOfMonth()->addHours(9),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 1050.00,
                'description' => 'Grocery shopping',
                'category_id' => $foodCategory?->id,
                'date' => Carbon::now()->subMonths(3)->addDays(4)->setTime(16, 15),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'EXPENSE',
                'amount' => 300.00,
                'description' => 'New laptop accessories',
                'category_id' => $shoppingCategory?->id,
                'date' => Carbon::now()->subMonths(3)->addDays(11)->setTime(14, 30),
                'status' => 'completed',
            ],
            [
                'user_id' => $demoUser->id,
                'type' => 'INCOME',
                'amount' => 1200.00,
                'description' => 'Freelance app development',
                'category_id' => $freelanceCategory?->id,
                'date' => Carbon::now()->subMonths(3)->addDays(24)->setTime(18, 0),
                'status' => 'completed',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }

        $this->command->info('Created ' . count($transactions) . ' transactions for demo user.');
    }
}
