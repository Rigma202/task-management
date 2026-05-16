<?php

namespace App\Enums;

enum TaskPriority: string
{
    case LOW = 'low';

    case MEDIUM = 'medium';

    case HIGH = 'high';

    public function label(): string
    {
        return match($this) {

            self::LOW => 'Low',

            self::MEDIUM => 'Medium',

            self::HIGH => 'High',
        };
    }

    public static function options(): array
    {
        return array_map(

            fn ($priority) => [

                'value' => $priority->value,

                'label' => $priority->label(),
            ],

            self::cases()
        );
    }
}