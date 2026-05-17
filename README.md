Task Management System

A Laravel-based Task Management System with AI-powered summaries, role-based access, and clean Repository Pattern architecture.

---

 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 10+ |
| Database | MySQL |
| Frontend | Blade + Tailwind CSS |
| AI | OpenAI / Gemini / Claude (mock fallback) |
| Auth | Laravel Breeze |

---

Project Structure

```
app/
├── Http/
│   ├── Controllers/       # Thin controllers only
│   ├── Requests/          # Form validation
│   └── Resources/         # API response formatting
├── Models/
├── Repositories/
│   ├── Contracts/         # TaskRepositoryInterface
│   └── Eloquent/          # TaskRepository
├── Services/
│   ├── TaskService.php    # Business logic
│   └── AIService.php      # AI prompt & response
├── Policies/              # Role-based access
├── Enums/                 # Status & Priority enums
└── Providers/
    └── RepositoryServiceProvider.php


 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Install dependencies
composer install
npm install

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Configure your database in .env, then run migrations
php artisan migrate --seed

# 5. Add your AI key in .env
OPENAI_API_KEY=your_key_here

# 6. Start the app
npm run dev
php artisan serve
```

---

 AI Integration

AI is triggered inside `TaskService` which calls `AIService`. It is **never called directly from the controller**.
> If no API key is set, a mock response is returned automatically.

---

API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/{id}/status` | Update task status |
| GET | `/api/tasks/{id}/ai-summary` | Get AI summary |

---

Roles & Access

| Role | What they can do |
|------|-----------------|
| **Admin** | View, create, edit, delete all tasks |
| **User** | View and manage only assigned tasks |


Features
- [x] Repository Pattern with Interface binding
- [x] Service Layer for business logic
- [x] AI-generated task summary and priority
- [x] Role-based access (Admin / User)
- [x] REST API with proper status codes
- [x] Form Request validation
- [x] Laravel Policies for security

---
