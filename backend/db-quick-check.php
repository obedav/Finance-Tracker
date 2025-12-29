#!/usr/bin/env php
<?php

// Quick database check script
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Budget;

echo "\n=== Finance Tracker Database Status ===\n\n";

echo "Users: " . User::count() . "\n";
echo "Transactions: " . Transaction::count() . "\n";
echo "Categories: " . Category::count() . "\n";
echo "Budgets: " . Budget::count() . "\n";

echo "\n=== Recent Users ===\n";
User::latest()->take(5)->get()->each(function($user) {
    echo "- {$user->first_name} {$user->last_name} ({$user->email})\n";
});

echo "\n=== Recent Transactions ===\n";
Transaction::with('category')->latest()->take(5)->get()->each(function($tx) {
    $type = $tx->type === 'income' ? '💰' : '💸';
    $category = $tx->category->name ?? 'N/A';
    echo "{$type} \${$tx->amount} - {$tx->description} [{$category}]\n";
});

echo "\n=== Database Connection ===\n";
echo "Driver: " . config('database.default') . "\n";
echo "Host: " . config('database.connections.pgsql.host') . "\n";
echo "Database: " . config('database.connections.pgsql.database') . "\n";
echo "\n";
