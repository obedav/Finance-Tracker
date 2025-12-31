<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->enum('type', [
                'savings',
                'debt_payoff',
                'investment',
                'emergency_fund',
                'vacation',
                'purchase',
                'other'
            ]);
            $table->decimal('target_amount', 10, 2);
            $table->decimal('current_amount', 10, 2)->default(0);
            $table->date('target_date')->nullable();
            $table->date('start_date');
            $table->enum('status', ['active', 'completed', 'abandoned', 'paused'])->default('active');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better query performance
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'priority']);
            $table->index('target_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
