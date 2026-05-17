<?php

namespace App\Models;
use App\Enums\TaskStatus;
use App\Enums\TaskPriority;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'assigned_to',
        'ai_summary',
        'ai_priority',
        'priority',
    ];
    protected $casts = [

        'status' => TaskStatus::class,

        'priority' => TaskPriority::class,
              
        'ai_priority' => TaskPriority::class,
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
