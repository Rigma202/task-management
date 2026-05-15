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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', [
                        'pending',
                        'in_progress',
                        'completed'])
                    ->default('pending');
            $table->date('due_date');
            $table->foreignId('assigned_to')
                    ->constrained('users')
                    ->cascadeOnDelete();
            $table->text('ai_summary')->nullable();
            $table->enum('ai_priority', [
                'low',
                'medium',
                'high'
            ])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
