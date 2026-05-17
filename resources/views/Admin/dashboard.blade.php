<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Task Manager Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{{ asset('css/admin-dashboard.css') }}">

</head>
<body>
<!-- ══ Sidebar ══ -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <span>⬡</span><span>TaskFlow</span>
  </div>
  <div class="sidebar-section">
    <div class="sidebar-label">Menu</div>
    <a class="sidebar-link active" onclick="showView('tasks')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      <span>Task List</span>
    </a>
    <a class="sidebar-link" onclick="showView('analytics')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      <span>Analytics</span>
    </a>
    
</aside>

<!-- ══ Main ══ -->
<main class="main">

  <!-- Task List View -->
  <div id="view-tasks">
    <div class="topbar">
      <div class="page-title">Task <span>Manager</span></div>
      <div class="topbar-right">
        <button class="btn btn-primary" onclick="openNew()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Task
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Tasks</div>
        <div class="stat-value blue" id="total-tasks-count">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed</div>
        <div class="stat-value green" id="completed-tasks-count">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending Task</div>
        <div class="stat-value yellow" id="pending-tasks-count">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">High Priority Task</div>
        <div class="stat-value red" id="high-priority-tasks-count">0</div>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search tasks…" id="search-input" oninput="filterTasks()">
      </div>
      <select class="select-box" id="status-filter" onchange="filterTasks()">
        <option value="">All Status</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>
      <select class="select-box" id="priority-filter" onchange="filterTasks()">
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>

    <!-- Content grid -->
    <div class="content-grid">
      <div id="task-grid" class="task-grid"></div>

      <!-- Side panel -->
      <div class="side-panel">
        <div class="panel-card">
          <div class="panel-user">
            <div class="user-avatar" style="width:40px;height:40px;font-size:15px">A</div>
            <div class="panel-user-info">
              @auth
                <div class="name">{{ auth()->user()->name }}</div>
              @endauth
              <div class="role">Administrator</div>
            </div>
          </div>
          <div class="panel-nav">
            <div class="panel-nav-item active">Tasks</div>
            <div class="panel-nav-item">Users <span class="only-admin">(Admin only)</span></div>
          </div>
<form method="POST" action="{{ route('logout') }}">
    @csrf

    <button type="submit" class="logout-btn flex items-center gap-2">
        <span>Sign Out</span>
    </button>
</form>
        </div>


      </div>
    </div>
  </div>

  <!-- Analytics View (placeholder) -->
  <div id="view-analytics" class="analytics-page" style="display:none">

  <div class="topbar">
    <div class="page-title">
      Analytics <span>Overview</span>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="analytics-grid">

    <div class="analytics-card">
      <div class="analytics-icon"></div>
      <div class="analytics-value" id="total-tasks">0</div>
      <div class="analytics-label">Total Tasks</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-icon"></div>
      <div class="analytics-value" id="completed-tasks">0</div>
      <div class="analytics-label">Completed Tasks</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-icon"></div>
      <div class="analytics-value" id="pending-tasks">0</div>
      <div class="analytics-label">Pending Tasks</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-icon"></div>
      <div class="analytics-value" id="high-priority">0</div>
      <div class="analytics-label">High Priority</div>
    </div>

  </div>

  <!-- Chart -->
  <div class="chart-card">

    <div class="chart-title">
      Monthly Task Completion
    </div>

    <canvas id="taskChart"></canvas>

  </div>

</div>

  <!-- Users View (placeholder) -->
  <div id="view-users" style="display:none">
    <div class="topbar"><div class="page-title">User <span>Management</span></div></div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:40px;text-align:center;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">👥</div>
      <div style="font-size:16px;font-weight:600;color:var(--text-secondary)">User management panel</div>
    </div>
  </div>

</main>

<!-- ══ View Task Modal ══ -->
<div class="modal-overlay" id="view-modal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="view-modal-title">Task Detail</div>
      <button class="modal-close" onclick="closeModal('view-modal')">✕</button>
    </div>
    <div class="detail-row" id="view-modal-badges"></div>
    <div class="field-group">
      
      <div class="detail-field"><strong>Assigned to:</strong> <span id="view-assigned"></span></div>
      <div class="detail-field"><strong>Due Date:</strong> <span id="view-due"></span></div>
      <div class="detail-field" id="view-desc" style="margin-top:8px;line-height:1.65;color:var(--text-secondary);font-size:13px"></div>
    </div>
    <div class="detail-field"><strong>AI priority:</strong> <span id="view-ai-priority"></span></div>
    <div class="field-group">
      <div class="ai-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        AI-Generated Summary
      </div>
      <div class="ai-box" id="view-ai-summary">Generating summary…</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="switchToEdit()">Edit Task</button>
      <button class="btn btn-primary" onclick="closeModal('view-modal')">Close</button>
    </div>
  </div>
</div>

<!-- ══ Edit Task Modal ══ -->
<div class="modal-overlay" id="edit-modal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Edit Task</div>
      <button class="modal-close" onclick="closeModal('edit-modal')">✕</button>
    </div>
    <input type="hidden" id="edit-id">
    <div class="field-group">
      <div class="field-label">Task Title</div>
      <input class="field-input" type="text" id="edit-title" placeholder="e.g. Launch New Campaign">
    </div>
    <div class="field-group">
      <div class="field-label">Description</div>
      <textarea class="field-input" id="edit-desc" placeholder="Describe the task…"></textarea>
    </div>
    <div class="field-group">
      <div class="field-label">Priority</div>
      <div class="priority-options">
        <button class="priority-opt" onclick="setPriority('low')">Low</button>
        <button class="priority-opt" onclick="setPriority('medium')">Medium</button>
        <button class="priority-opt" onclick="setPriority('high')">High</button>
      </div>
      <input type="hidden" id="edit-priority" value="Low">
    </div>
    <div class="field-group">
      <div class="field-label">Due Date</div>
      <input class="field-input" type="date" id="edit-due">
    </div>
    <div class="field-group">
      <div class="field-label">Assigned To</div>
      <select class="field-input" id="edit-assigned">
        <option value="">Select person to assign task</option>
        @foreach($users as $user)
            <option value="{{ $user->id }}">{{ $user->name }}</option>
        @endforeach
      </select>
    </div>
    <div class="field-group">
      <div class="field-label">Status</div>
      <select class="field-input" id="edit-status">
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal('edit-modal')">Cancel</button>
      <button class="btn btn-primary" onclick="saveTask()">Save Changes</button>
    </div>
  </div>
</div>

<!-- ══ New Task Modal ══ -->
<div class="modal-overlay" id="new-task-modal">
  <div class="modal" style="max-width:460px">
    <div class="modal-header">
      <div class="modal-title">New Task</div>
      <button class="modal-close" onclick="closeModal('new-task-modal')">✕</button>
    </div>
    <div class="field-group">
      <div class="field-label">Task Title</div>
      <input class="field-input" type="text" id="new-title" placeholder="e.g. Launch New Campaign">
    <div class="error-message" id="title-error" style="display:none;color:#ef4444;font-size:12px;margin-top:6px;">Please enter a task title</div>
    </div>
    <div class="field-group">
      <div class="field-label">Description</div>
      <textarea class="field-input" id="new-desc" placeholder="Describe the task…"></textarea>
    </div>
    <div class="field-group">
      <div class="field-label">Priority</div>
      <div class="priority-options">
        <button class="priority-opt sel-low" onclick="setNewPriority('low')">Low</button>
        <button class="priority-opt" onclick="setNewPriority('medium')">Medium</button>
        <button class="priority-opt" onclick="setNewPriority('high')">High</button>
      </div>
      <input type="hidden" id="new-priority" value="low">
    </div>
    <div class="field-group">
      <div class="field-label">Due Date</div>
      <input class="field-input" type="date" id="new-due">
    </div>
    <div class="field-group">
    <select class="field-input" id="new-assigned">
    <option value="">Select person to assign task</option>
    @foreach($users as $user)
        <option value="{{ $user->id }}">{{ $user->name }}</option>
    @endforeach
    </select>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal('new-task-modal')">Cancel</button>
      <button class="btn btn-primary" onclick="createTask()">Create Task</button>
    </div>
  </div>
</div>
<script src="{{ asset('js/admin-dashboard.js') }}"></script>
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</body>
</html>
