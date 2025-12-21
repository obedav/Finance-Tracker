<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed default categories
        // Users can register their own accounts and add real data
        $this->call([
            CategorySeeder::class,
        ]);
    }
}
