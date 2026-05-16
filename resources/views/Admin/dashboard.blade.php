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
    <div class="sidebar-label" style="margin-top:16px">Admin</div>
    <a class="sidebar-link" onclick="showView('users')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <span>Users</span>
    </a>
  </div>
  <div class="sidebar-bottom">
    <div class="user-info">
      <div class="user-avatar">A</div>
      <div>
        <div class="user-name">Admin User</div>
        <div class="user-role">Administrator</div>
      </div>
    </div>
  </div>
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
        <div class="stat-value blue">150</div>
        <div class="stat-sub">All time</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed</div>
        <div class="stat-value green">90</div>
        <div class="stat-sub">60% done</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">In Progress</div>
        <div class="stat-value yellow">90</div>
        <div class="stat-sub">Active now</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Overdue</div>
        <div class="stat-value red">12</div>
        <div class="stat-sub">Needs attention</div>
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

        <div class="panel-card">
          <div class="chart-section-label">Monthly Task Completion</div>
          <div class="donut-row">
            <div class="donut-item">
              <svg class="donut" width="52" height="52" viewBox="0 0 52 52">
                <circle class="donut-track" cx="26" cy="26" r="20"/>
                <circle class="donut-fill" cx="26" cy="26" r="20" stroke="#3b82f6"
                  stroke-dasharray="75.4 125.7"/>
              </svg>
              <div class="donut-value">150</div>
              <div class="donut-label">Total</div>
            </div>
            <div class="donut-item">
              <svg class="donut" width="52" height="52" viewBox="0 0 52 52">
                <circle class="donut-track" cx="26" cy="26" r="20"/>
                <circle class="donut-fill" cx="26" cy="26" r="20" stroke="#22c55e"
                  stroke-dasharray="56.5 125.7"/>
              </svg>
              <div class="donut-value">90</div>
              <div class="donut-label">Done</div>
            </div>
            <div class="donut-item">
              <svg class="donut" width="52" height="52" viewBox="0 0 52 52">
                <circle class="donut-track" cx="26" cy="26" r="20"/>
                <circle class="donut-fill" cx="26" cy="26" r="20" stroke="#f59e0b"
                  stroke-dasharray="45.2 125.7"/>
              </svg>
              <div class="donut-value">90</div>
              <div class="donut-label">Progress</div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="chart-section-label">Monthly Completion</div>
          <div class="bar-chart" id="bar-chart"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Analytics View (placeholder) -->
  <div id="view-analytics" style="display:none">
    <div class="topbar"><div class="page-title">Analytics <span>Overview</span></div></div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:40px;text-align:center;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">📊</div>
      <div style="font-size:16px;font-weight:600;color:var(--text-secondary)">Analytics coming soon</div>
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
      <div class="field-label">Description</div>
      <div class="detail-field"><strong>Assigned to:</strong> <span id="view-assigned"></span></div>
      <div class="detail-field"><strong>Due Date:</strong> <span id="view-due"></span></div>
      <div class="detail-field" id="view-desc" style="margin-top:8px;line-height:1.65;color:var(--text-secondary);font-size:13px"></div>
    </div>
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
        <button class="priority-opt" onclick="setPriority('Low')">Low</button>
        <button class="priority-opt" onclick="setPriority('Medium')">Medium</button>
        <button class="priority-opt" onclick="setPriority('High')">High</button>
      </div>
      <input type="hidden" id="edit-priority" value="Low">
    </div>
    <div class="field-group">
      <div class="field-label">Due Date</div>
      <input class="field-input" type="date" id="edit-due">
    </div>
    <div class="field-group">
      <div class="field-label">Assigned To</div>
      <input class="field-input" type="text" id="edit-assigned" placeholder="Team member name">
    </div>
    <div class="field-group">
      <div class="field-label">Status</div>
      <select class="field-input" id="edit-status">
        <option>In Progress</option>
        <option>Completed</option>
        <option>Pending</option>
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
    </div>
    <div class="field-group">
      <div class="field-label">Description</div>
      <textarea class="field-input" id="new-desc" placeholder="Describe the task…"></textarea>
    </div>
    <div class="field-group">
      <div class="field-label">Priority</div>
      <div class="priority-options">
        <button class="priority-opt sel-low" onclick="setNewPriority('Low')">Low</button>
        <button class="priority-opt" onclick="setNewPriority('Medium')">Medium</button>
        <button class="priority-opt" onclick="setNewPriority('High')">High</button>
      </div>
      <input type="hidden" id="new-priority" value="Low">
    </div>
    <div class="field-group">
      <div class="field-label">Due Date</div>
      <input class="field-input" type="date" id="new-due">
    </div>
    <div class="field-group">
      <div class="field-label">Assigned To</div>
      <input class="field-input" type="text" id="new-assigned" placeholder="Team member name">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal('new-task-modal')">Cancel</button>
      <button class="btn btn-primary" onclick="createTask()">Create Task</button>
    </div>
  </div>
</div>
<script src="{{ asset('js/admin-dashboard.js') }}"></script>
</body>
</html>
