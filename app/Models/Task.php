<?php

namespace App\Models;

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

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
