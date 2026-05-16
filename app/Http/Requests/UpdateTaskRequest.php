<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'title' => 'sometimes|string|max:255',

            'description' => 'sometimes|string',

            'priority' => [
                'sometimes',
                new Enum(TaskPriority::class)
            ],

            'status' => [
                'sometimes',
                new Enum(TaskStatus::class)
            ],

            'due_date' =>
                'sometimes|date|after_or_equal:today',

            'assigned_to' =>
                'sometimes|exists:users,id',
        ];
    }
}