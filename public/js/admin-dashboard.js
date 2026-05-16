
const API_BASE = '/api';
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

function renderTasks(list) {
  const grid = document.getElementById('task-grid');
  const totalTasks = list.data.length;
  const completedTasks = list.data.filter(task => task.status === 'completed').length;
  const inProgressTasks = list.data.filter(task => task.status === 'pending').length;
  const highPriorityTasks = list.data.filter(task => task.priority === 'high').length;

  document.getElementById('total-tasks-count').textContent = totalTasks;
  document.getElementById('completed-tasks-count').textContent = completedTasks;
  document.getElementById('pending-tasks-count').textContent = inProgressTasks;
  document.getElementById('high-priority-tasks-count').textContent = highPriorityTasks;

  if (!list.data.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;font-size:14px">No tasks found.</div>';
    return;
  }
  grid.innerHTML = list.data.map(t => {
    const pClass = t.priority === 'high' ? 'badge-red' : t.priority === 'medium' ? 'badge-yellow' : 'badge-green';
    const sClass = t.status === 'completed' ? 'badge-green' : t.status === 'in progress' ? 'badge-blue' : 'badge-yellow';
    const pfClass = t.priority === 'high' ? 'priority-high' : t.priority === 'medium' ? 'priority-medium' : 'priority-low';
    const done = t.status === 'completed';
    return `<div class="task-card" data-id="${t.id}">
      <div class="task-card-header">
        <div class="task-status-dot ${done ? 'done' : ''}">
          ${done ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="task-menu" onclick="openMenu(event,${t.id})">···</div>
      </div>
      <div class="task-title">${t.title}</div>
      <div class="task-badges">
        <span class="badge ${sClass}">${t.status}</span>
        <span class="badge ${pClass}">Priority ${t.priority}</span>
      </div>
      <div class="task-desc">${t.description.substring(0, 90)}…</div>
      <div class="task-meta">
        <span>👤 ${t.user?.name || 'Unassigned'}</span>
        <span>📅 Due ${t.due_date || '—'}</span>
      </div>
      <div class="task-footer">
        <span class="priority-badge ${pfClass}">${t.priority}</span>
        <div class="task-actions">
          <button class="task-btn task-btn-outline" onclick="openEdit(${t.id})">Edit</button>
          <button class="task-btn task-btn-fill" onclick="openView(${t.id})">View</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterTasks() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const s = document.getElementById('status-filter').value;
  const p = document.getElementById('priority-filter').value;
  const filtered = tasks.filter(t =>
    (t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) &&
    (!s || t.status === s) &&
    (!p || t.priority === p)
  );
  renderTasks(filtered);
}


const months = ['Jan','Feb','Mar','Apr','May','Jun'];
const vals = [120, 98, 145, 160, 135, 170];
const max = Math.max(...vals);
function renderBarChart() {
  const el = document.getElementById('bar-chart');
  el.innerHTML = months.map((m, i) => {
    const h = Math.round((vals[i] / max) * 56);
    const dim = i < months.length - 1 ? 'dim' : '';
    return `<div class="bar-wrap">
      <div class="bar ${dim}" style="height:${h}px"></div>
      <div class="bar-label">${m}</div>
    </div>`;
  }).join('');
}


function openView(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  currentViewId = id;
  document.getElementById('view-modal-title').textContent = t.title;
  const pClass = t.priority === 'High' ? 'badge-red' : t.priority === 'Medium' ? 'badge-yellow' : 'badge-green';
  const sClass = t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow';
  document.getElementById('view-modal-badges').innerHTML =
    `<span class="badge ${sClass}">${t.status}</span><span class="badge ${pClass}">Priority ${t.priority}</span>`;
  document.getElementById('view-assigned').textContent = t.assigned;
  document.getElementById('view-due').textContent = t.due;
  document.getElementById('view-desc').textContent = t.desc;
  document.getElementById('view-ai-summary').textContent = t.ai;
  openModal('view-modal');
}

function switchToEdit() {
  closeModal('view-modal');
  openEdit(currentViewId);
}


function openEdit(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  currentEditId = id;
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = t.title;
  document.getElementById('edit-desc').value = t.desc;
  document.getElementById('edit-due').value = t.due;
  document.getElementById('edit-assigned').value = t.assigned;
  document.getElementById('edit-status').value = t.status;
  document.getElementById('edit-priority').value = t.priority;
  updatePriorityBtns('.priority-options:first-of-type .priority-opt', t.priority, 'edit');
  openModal('edit-modal');
}

function setPriority(val) {
  document.getElementById('edit-priority').value = val;
  document.querySelectorAll('#edit-modal .priority-opt').forEach(b => {
    b.className = 'priority-opt';
    if (b.textContent === val) b.classList.add('sel-' + val.toLowerCase());
  });
}

function saveTask() {
  const id = parseInt(document.getElementById('edit-id').value);
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.title = document.getElementById('edit-title').value;
  t.desc = document.getElementById('edit-desc').value;
  t.due = document.getElementById('edit-due').value;
  t.assigned = document.getElementById('edit-assigned').value;
  t.status = document.getElementById('edit-status').value;
  t.priority = document.getElementById('edit-priority').value;
  t.ai = `Updated: ${t.title}. Priority: ${t.priority}. Assigned to ${t.assigned}. Due ${t.due}.`;
  closeModal('edit-modal');
  filterTasks();
}


function openNew() {
  document.getElementById('new-title').value = '';
  document.getElementById('new-desc').value = '';
  document.getElementById('new-due').value = '';
  document.getElementById('new-assigned').value = '';
  document.getElementById('new-priority').value = 'Low';
  document.querySelectorAll('#new-task-modal .priority-opt').forEach(b => {
    b.className = 'priority-opt';
  });
  document.querySelectorAll('#new-task-modal .priority-opt')[0].classList.add('sel-low');
  openModal('new-task-modal');
}

function setNewPriority(val) {
  document.getElementById('new-priority').value = val;
  document.querySelectorAll('#new-task-modal .priority-opt').forEach(b => {
    b.className = 'priority-opt';
    if (b.textContent === val) b.classList.add('sel-' + val.toLowerCase());
  });
}


function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});


function showView(v) {
  ['tasks','analytics','users'].forEach(n => {
    document.getElementById('view-' + n).style.display = n === v ? '' : 'none';
  });
  document.querySelectorAll('.sidebar-link').forEach((el, i) => {
    el.classList.toggle('active', ['tasks','analytics','users'][i] === v);
  });
}


function openMenu(e, id) {
  e.stopPropagation();
  openEdit(id);
}

/* ── Init ── */
function createTask() {
  const title = document.getElementById('new-title').value.trim();
  const titleError = document.getElementById('title-error');
  const desc = document.getElementById('new-desc').value.trim();
  const priority = document.getElementById('new-priority').value;
  const due = document.getElementById('new-due').value;
  const assigned = document.getElementById('new-assigned').value.trim();

  if (!title) {
    titleError.style.display = 'block';
    return;
  }
  titleError.style.display = 'none';

 $.ajax({
    url: `${API_BASE}/tasks`,
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: {
        'X-CSRF-TOKEN': CSRF_TOKEN
    },
    data: JSON.stringify({
        title,
        description: desc,
        priority,
        due_date: due || null,
        assigned_to: assigned || null
    }),
    success: function (data) {
      if (data.data) {
        alert('Task created successfully!');
        closeModal('new-task-modal');
        addTaskToGrid(data.data);
        resetNewTaskForm();
        window.location.reload(); 
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    },
    error: function (response) {
      console.error('Error:', response);
      alert('Unable to create task.');
    }
  });
}

/* ── Fetch and Render Tasks ── */
function fetchAndRenderTasks() {
  fetch(`${API_BASE}/tasks`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-CSRF-TOKEN': CSRF_TOKEN
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.data) {
        console.log('Fetched tasks:', data.data);
      tasks = data.data; // Update the global tasks array
      renderTasks(tasks); // Render the tasks
    } else {
      console.error('Error fetching tasks:', data.error || 'Unknown error');
    }
  })
  .catch(error => console.error('Error:', error));
}

/* ── Initialize Task List on Page Load ── */
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderTasks(); // Fetch and render tasks on page load
});

/* ── Add Task to Grid ── */
function addTaskToGrid(task) {
  const pClass = task.priority === 'High' ? 'badge-red' : task.priority === 'Medium' ? 'badge-yellow' : 'badge-green';
  const sClass = task.status === 'Completed' ? 'badge-green' : 'badge-blue';
  const pfClass = task.priority === 'High' ? 'priority-high' : task.priority === 'Medium' ? 'priority-medium' : 'priority-low';

  const taskCard = `<div class="task-card" data-id="${task.id}">
    <div class="task-card-header">
      <div class="task-status-dot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-menu" onclick="openMenu(event,${task.id})">···</div>
    </div>
    <div class="task-title">${task.title}</div>
    <div class="task-badges">
      <span class="badge ${sClass}">${task.status || 'In Progress'}</span>
      <span class="badge ${pClass}">Priority ${task.priority}</span>
    </div>
    <div class="task-desc">${(task.description || '').substring(0, 90)}…</div>
    <div class="task-meta">
      <span>👤 ${task.assigned_to || 'Unassigned'}</span>
      <span>📅 Due ${task.due_date || '—'}</span>
    </div>
    <div class="task-footer">
      <span class="priority-badge ${pfClass}">${task.priority}</span>
      <div class="task-actions">
        <button class="task-btn task-btn-outline" onclick="openEdit(${task.id})">Edit</button>
        <button class="task-btn task-btn-fill" onclick="openView(${task.id})">View</button>
      </div>
    </div>
  </div>`;

  const grid = document.getElementById('task-grid');
  grid.insertAdjacentHTML('afterbegin', taskCard);
}


/* ── Reset New Task Form ── */
function resetNewTaskForm() {
  document.getElementById('new-title').value = '';
  document.getElementById('new-desc').value = '';
  document.getElementById('new-due').value = '';
  document.getElementById('new-assigned').value = '';
  document.getElementById('new-priority').value = 'Low';
  document.querySelectorAll('#new-task-modal .priority-opt').forEach(b => {
    b.className = 'priority-opt';
  });
  document.querySelectorAll('#new-task-modal .priority-opt')[0].classList.add('sel-low');
}


function saveTask() {
  const id = parseInt(document.getElementById('edit-id').value);
  const title = document.getElementById('edit-title').value;
  const desc = document.getElementById('edit-desc').value;
  const due = document.getElementById('edit-due').value;
  const status = document.getElementById('edit-status').value;
  const priority = document.getElementById('edit-priority').value;

  fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': CSRF_TOKEN,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      title,
      description: desc,
      due_date: due,
      status,
      priority
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.data) {
      alert('Task updated successfully!');
      closeModal('edit-modal');
      location.reload(); // Refresh tasks
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => console.error('Error:', error));
}

/* ── Delete Task via AJAX ── */
function deleteTask(id) {
  if (!confirm('Delete this task?')) return;

  fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': CSRF_TOKEN,
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    alert('Task deleted successfully!');
    document.querySelector(`[data-id="${id}"]`)?.remove();
  })
  .catch(error => console.error('Error:', error));
}

