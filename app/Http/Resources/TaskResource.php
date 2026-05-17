<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],

            'priority' => [
                'value' => $this->priority->value,
                'label' => $this->priority->label(),
            ],
            'due_date' => $this->due_date,
            'assigned_to' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'ai_summary' => $this->ai_summary,
            'ai_priority' => $this->ai_priority,
        ];
    }
}
