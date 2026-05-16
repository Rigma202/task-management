<?php

namespace App\Services;

use App\Repositories\TaskRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function __construct(
        private TaskRepositoryInterface $taskRepository,

    ) {}

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $task = $this->taskRepository->create($data);
            return $this->taskRepository->find($task->id);
        });
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
        return $this->taskRepository->update($id, $data);
    }

    public function deleteTask(int $id)
    {
        return $this->taskRepository->delete($id);
    }

}
