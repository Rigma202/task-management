AI Task Management System

A production-ready AI-assisted Task Management System built with Laravel, following Repository Pattern, Service Layer Architecture, and clean coding practices.

Features
Authentication & Role Management (Admin / User)
Task CRUD Operations
AI-generated Task Summary & Priority
Repository Pattern Implementation
Service Layer Architecture
Dashboard Analytics
REST API Support
Responsive UI with Tailwind CSS
Task Policies & Authorization
Tech Stack
Laravel 12
MySQL
Blade + Tailwind CSS
Chart.js
OpenAI/Gemini (Mocked AI Service)
Architecture
app/
├── Http/
├── Models/
├── Repositories/
├── Services/
├── Policies/
├── Enums/
└── Providers/
Repository Pattern
Controllers never directly access models.
All database operations are handled through repositories.
Service Layer
Business logic handled inside services.
AI processing triggered via AIService.
AI Integration

AI is used to:

Generate short task summaries
Predict task priority

Example Prompt:

Analyze the following task and return:
1. Short summary
2. Priority level (low, medium, high)
API Endpoints
Method	Endpoint
GET	/api/tasks
POST	/api/tasks
PATCH	/api/tasks/{id}/status
GET	/api/tasks/{id}/ai-summary
Installation
git clone <repo-url>

cd project-name

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate --seed

npm install && npm run dev

php artisan serve
Default Roles
Admin → Full Access
User → Assigned Tasks Only
