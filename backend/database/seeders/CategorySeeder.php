<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Income Categories
            [
                'name' => 'Salary',
                'type' => 'INCOME',
                'icon' => '💰',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Freelance',
                'type' => 'INCOME',
                'icon' => '💼',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Business',
                'type' => 'INCOME',
                'icon' => '🏢',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Investment',
                'type' => 'INCOME',
                'icon' => '📈',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Gift',
                'type' => 'INCOME',
                'icon' => '🎁',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Other Income',
                'type' => 'INCOME',
                'icon' => '💵',
                'color' => '#10B981',
                'is_default' => true,
                'user_id' => null,
            ],

            // Expense Categories
            [
                'name' => 'Food & Dining',
                'type' => 'EXPENSE',
                'icon' => '🍽️',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Transportation',
                'type' => 'EXPENSE',
                'icon' => '🚗',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Shopping',
                'type' => 'EXPENSE',
                'icon' => '🛍️',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Entertainment',
                'type' => 'EXPENSE',
                'icon' => '🎬',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Bills & Utilities',
                'type' => 'EXPENSE',
                'icon' => '📄',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Healthcare',
                'type' => 'EXPENSE',
                'icon' => '🏥',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Education',
                'type' => 'EXPENSE',
                'icon' => '📚',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
            [
                'name' => 'Other Expenses',
                'type' => 'EXPENSE',
                'icon' => '💸',
                'color' => '#F59E0B',
                'is_default' => true,
                'user_id' => null,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
