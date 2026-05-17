<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Http;

class AIService
{
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    private string $model   = 'gemini-2.5-flash';

  public function generateSummary(Task $task): array
    {
        try {

            $prompt = <<<PROMPT
            Analyze this task.

            Title:
            {$task->title}

            Description:
            {$task->description}

            Return ONLY valid JSON in this format:

            {
              "summary": "",
              "priority": "low|medium|high",
              "complexity": "simple|moderate|complex",
              "action_steps": [],
              "risks": []
            }

            Do not include markdown.
            Do not include ```json.
            PROMPT;

            $response = Http::timeout(30)->post(
                "{$this->baseUrl}/{$this->model}:generateContent?key=" . config('services.gemini.key'),
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]
            );

            $result = $response->json();
            $content = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            $content = preg_replace('/```json|```/', '', $content);
            $data = json_decode(trim($content), true);
            if (!is_array($data)) {
                return $this->mockResponse($task);
            }

            return [
                'ai_summary'      => $data['summary'] ?? null,
                'ai_priority'     => $data['priority'] ?? 'medium',
                'ai_complexity'   => $data['complexity'] ?? 'moderate',
                'ai_action_steps' => json_encode($data['action_steps'] ?? []),
                'ai_risks'        => json_encode($data['risks'] ?? []),
            ];

        } catch (\Exception $e) {

            return $this->mockResponse($task);
        }
    }


    private function mockResponse(Task $task): array
    {
        $priority = match (true) {
            str_contains(strtolower($task->title), 'urgent') => 'high',
            str_contains(strtolower($task->title), 'api')    => 'medium',
            default                                          => 'medium',
        };

        return [
            'ai_summary'      => "[Mock] Task '{$task->title}' requires attention.",
            'ai_priority'     => $priority,
            'ai_complexity'   => 'moderate',
            'ai_action_steps' => json_encode([
                'Review task requirements',
                'Assign responsible person',
                'Track completion progress'
            ]),
            'ai_risks'        => json_encode([
                'Possible delay in completion',
                'Need additional clarification'
            ]),
        ];
    }
}
