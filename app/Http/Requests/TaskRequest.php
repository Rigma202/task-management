<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'title' => [
                'required',
                'string',
                'max:150'
            ],

            'description' => [
                'required',
                'string',
                'max:255'
            ],

            'priority' => [
                'required',
                'in:low,medium,high'
            ],

            'due_date' => [
                'required',
                'date'
            ],

            'assigned_to' => [
                'required',
                'integer',
                'exists:users,id'
            ],
        ];
    }


    public function messages(): array
    {
        return [

        ];
    }
}