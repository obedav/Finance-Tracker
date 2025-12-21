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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('currency')->default('USD');
            $table->string('date_format')->default('MM/DD/YYYY');
            $table->string('theme')->default('light'); // light, dark, system
            $table->string('language')->default('en');
            $table->boolean('email_notifications')->default(true);
            $table->boolean('budget_alerts')->default(true);
            $table->boolean('monthly_reports')->default(true);
            $table->boolean('goal_reminders')->default(false);
            $table->boolean('data_sharing')->default(false);
            $table->boolean('analytics')->default(true);
            $table->boolean('marketing_emails')->default(false);
            $table->boolean('auto_backup')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
