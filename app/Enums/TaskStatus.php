<?php

namespace App\Enums;

enum TaskStatus: string
{
    case PENDING = 'pending';

    case IN_PROGRESS = 'in_progress';

    case COMPLETED = 'completed';

    public function label(): string
    {
        return match($this) {

            self::PENDING => 'Pending',

            self::IN_PROGRESS => 'In Progress',

            self::COMPLETED => 'Completed',
        };
    }

    public static function options(): array
    {
        return array_map(

            fn ($status) => [

                'value' => $status->value,

                'label' => $status->label(),
            ],

            self::cases()
        );
    }
}