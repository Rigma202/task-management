<?php

namespace App\Services;

use App\Repositories\TaskRepositoryInterface;
use App\Jobs\GenerateTaskSummaryJob;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function __construct(
        private TaskRepositoryInterface $taskRepository,
    ) {}

    public function store(array $data)
    {
        $task = DB::transaction(function () use ($data) {
            return $this->taskRepository->create($data);
        });

        GenerateTaskSummaryJob::dispatch($task);

        return $task->load('user');
    }

    public function getAllTasks(array $filters = [])
    {
        return $this->taskRepository->all($filters);
    }

    public function getTask(int $id)
    {
        return $this->taskRepository->find($id);
    }

    public function updateTask(int $id, array $data)
    {
        $task = $this->taskRepository->update($id, $data);
        GenerateTaskSummaryJob::dispatch($task);

        return $task;
    }

    public function deleteTask(int $id)
    {
        return $this->taskRepository->delete($id);
    }
    public function analytics()
    {
        return $this->taskRepository->analytics();
    }
}
