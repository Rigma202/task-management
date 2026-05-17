<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository implements TaskRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Task::query()->with('user');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->paginate(10);
    }

    public function find(int $id)
    {
        return Task::with('user')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Task::create($data);
    }

    public function update(int $id, array $data)
    {
        $task = $this->find($id);
        $task->update($data);
        return $task;
    }

    public function delete(int $id)
    {
        return Task::destroy($id);
    }
        public function analytics()
    {
    
        $totalTasks = Task::count();
        $completedTasks = Task::where('status', 'completed')->count();
        $pendingTasks = Task::where('status', 'pending')->count();
        $highPriorityTasks = Task::where('priority', 'high')->count();

        $monthlyStats = Task::selectRaw("
                MONTH(created_at) as month,
                COUNT(*) as total
            ")
            ->where('status', 'completed')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return [
            'stats' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'pending_tasks' => $pendingTasks,
                'high_priority_tasks' => $highPriorityTasks,
            ],

            'monthly_completion' => $monthlyStats,
        ];
    }
}
