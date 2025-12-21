<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
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
        $foodCategory = Category::where('name', 'Food & Dining')->where('is_default', true)->first();
        $transportCategory = Category::where('name', 'Transportation')->where('is_default', true)->first();
        $entertainmentCategory = Category::where('name', 'Entertainment')->where('is_default', true)->first();
        $shoppingCategory = Category::where('name', 'Shopping')->where('is_default', true)->first();
        $billsCategory = Category::where('name', 'Bills & Utilities')->where('is_default', true)->first();

        $budgets = [
            [
                'user_id' => $demoUser->id,
                'name' => 'Monthly Food Budget',
                'amount' => 1500.00,
                'period' => 'monthly',
                'category_id' => $foodCategory?->id,
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'alert_threshold' => 80,
                'is_active' => true,
            ],
            [
                'user_id' => $demoUser->id,
                'name' => 'Transportation Budget',
                'amount' => 500.00,
                'period' => 'monthly',
                'category_id' => $transportCategory?->id,
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'alert_threshold' => 75,
                'is_active' => true,
            ],
            [
                'user_id' => $demoUser->id,
                'name' => 'Entertainment Budget',
                'amount' => 300.00,
                'period' => 'monthly',
                'category_id' => $entertainmentCategory?->id,
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'alert_threshold' => 80,
                'is_active' => true,
            ],
            [
                'user_id' => $demoUser->id,
                'name' => 'Shopping Budget',
                'amount' => 400.00,
                'period' => 'monthly',
                'category_id' => $shoppingCategory?->id,
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'alert_threshold' => 70,
                'is_active' => true,
            ],
            [
                'user_id' => $demoUser->id,
                'name' => 'Bills & Utilities',
                'amount' => 600.00,
                'period' => 'monthly',
                'category_id' => $billsCategory?->id,
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'alert_threshold' => 90,
                'is_active' => true,
            ],
            [
                'user_id' => $demoUser->id,
                'name' => 'Annual Food Budget',
                'amount' => 18000.00,
                'period' => 'yearly',
                'category_id' => $foodCategory?->id,
                'start_date' => Carbon::now()->startOfYear(),
                'end_date' => Carbon::now()->endOfYear(),
                'alert_threshold' => 85,
                'is_active' => true,
            ],
        ];

        foreach ($budgets as $budget) {
            Budget::create($budget);
        }

        $this->command->info('Created ' . count($budgets) . ' budgets for demo user.');
    }
}
