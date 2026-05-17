<?php

namespace App\Jobs;

use App\Models\Task;
use App\Services\AIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateTaskSummaryJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task
    ) {}

    public function handle(AIService $aiService): void
    {
        $aiData = $aiService->generateSummary($this->task);

        $this->task->update($aiData);
    }
}