<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TaskResource;
use App\Http\Requests\TaskRequest;
use App\Http\Requests\UpdateTaskRequest;
class TaskController extends Controller
{
    public function __construct(private TaskService $taskService) {}


    public function index(Request $request)
    {
        $tasks = $this->taskService->getAllTasks(); 
        return TaskResource::collection($tasks);
    }

    public function store(TaskRequest $request)
    {

        $validated = $request->validated();
        try {
            $task = $this->taskService->store($validated);

            return response()->json([
                'message' => 'Task created successfully',
                'data' => $task
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $task = $this->taskService->getTask($id);

            return response()->json($task, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Task not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(UpdateTaskRequest $request, int $id)
    {
        $validated = $request->validated();
        try {
            $task = $this->taskService->updateTask($id, $validated);

            return response()->json([
                'message' => 'Task updated successfully',
                'data' => $task
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->taskService->deleteTask($id);

            return response()->json([
                'message' => 'Task deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function aiSummary(int $id)
    {
        $task = $this->taskService->getTask($id);

        return response()->json([

            'task_id' => $task->id,

            'title' => $task->title,

            'ai_summary' => $task->ai_summary,
            'ai_priority' => [

                'value' => $task->ai_priority?->value,

                'label' => $task->ai_priority?->label(),
            ],
        ]);
    }
    public function analytics()
    {
        try {
            return response()->json(
                $this->taskService->analytics()
            );
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to load analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
