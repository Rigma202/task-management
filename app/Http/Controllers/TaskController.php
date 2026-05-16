<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService) {}


    public function index(Request $request)
    {
        $tasks = $this->taskService->getAllTasks(); // Assuming you have a `getAll` method in your repository
        return response()->json(['data' => $tasks]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);

        $validated['user_id'] = Auth::id();

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

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:Low,Medium,High',
            'status' => 'nullable|in:In Progress,Completed,Pending',
            'due_date' => 'nullable|date',
        ]);

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

    public function getAISummary(int $id)
    {
        try {
            $task = $this->taskService->getTask($id);

            return response()->json([
                'ai_summary' => $task->ai_summary,
                'ai_tags' => $task->ai_tags ?? []
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch AI summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
