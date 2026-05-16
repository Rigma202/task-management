
const API_BASE = '/api';
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';
let tasks = [];
const TASK_STATUS = {

    PENDING: 'pending',

    IN_PROGRESS: 'in_progress',

    COMPLETED: 'completed'
};

const TASK_PRIORITY = {

    LOW: 'low',

    MEDIUM: 'medium',

    HIGH: 'high'
};
function renderTasks(list) {
  const grid = document.getElementById('task-grid');
  const totalTasks = list.length;
  
  const completedTasks = list.filter(task => task.status.value === TASK_STATUS.COMPLETED).length;
  const inPendingTasks = list.filter(task => task.status.value === TASK_STATUS.PENDING).length;
  const highPriorityTasks = list.filter(task => task.priority.value === TASK_PRIORITY.HIGH).length;

  document.getElementById('total-tasks-count').textContent = totalTasks;
  document.getElementById('completed-tasks-count').textContent = completedTasks;
  document.getElementById('pending-tasks-count').textContent = inPendingTasks;
  document.getElementById('high-priority-tasks-count').textContent = highPriorityTasks;

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;font-size:14px">No tasks found.</div>';
    return;
  }
  grid.innerHTML = list.map(t => {
    const pClass = t.priority.value;
    const sClass = t.status.value;
    const pfClass = t.priority.value;
    const done = t.status.value === TASK_STATUS.COMPLETED;
    return `<div class="task-card" data-id="${t.id}">
      <div class="task-card-header">
        <div class="task-status-dot ${done ? 'done' : ''}">
          ${done ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="task-menu" onclick="openMenu(event,${t.id})">···</div>
      </div>
      <div class="task-title">${t.title}</div>
      <div class="task-badges">
        <span class="badge ${sClass}">${t.status.label}</span>
        <span class="badge ${pClass}">Priority ${t.priority.label}</span>
      </div>
      <div class="task-desc">${t.description.substring(0, 90)}…</div>
      <div class="task-meta">
        <span>👤 ${t.user?.name || 'Unassigned'}</span>
        <span>📅 Due ${t.due_date || '—'}</span>
      </div>
      <div class="task-footer">
        <span class="priority-badge ${pfClass}">${t.priority.label}</span>
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
    (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
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
  const pClass = t.priority.value;
  const sClass = t.status.value;
  document.getElementById('view-modal-badges').innerHTML =
    `<span class="badge ${sClass}">${t.status.label}</span><span class="badge ${pClass}">Priority ${t.priority.label}</span>`;
  document.getElementById('view-assigned').textContent = t.assigned_to;
  document.getElementById('view-due').textContent = t.due_date;
  openModal('view-modal');
}

function switchToEdit() {
  closeModal('view-modal');
  openEdit(currentViewId);
}


function openEdit(id) {
    console.log(id);
    
  const t = tasks.find(x => x.id === id);
  console.log(t);
  
  if (!t) return;
  currentEditId = id;
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = t.title;
  document.getElementById('edit-desc').value = t.description;
  document.getElementById('edit-due').value = t.due_date;
  document.getElementById('edit-assigned').value = t.assigned_to;
  document.getElementById('edit-status').value = t.status.value;
  document.getElementById('edit-priority').value = t.priority.value;
  updatePriorityBtns('#edit-modal .priority-opt',t.priority.value);
  openModal('edit-modal');
}
function updatePriorityBtns(selector, priority) {

    document.querySelectorAll(selector)
        .forEach(btn => {

            btn.classList.remove(
                'sel-low',
                'sel-medium',
                'sel-high'
            );

            if (
                btn.textContent
                    .trim()
                    .toLowerCase()
                === priority.toLowerCase()
            ) {

                btn.classList.add(
                    `sel-${priority}`
                );
            }
        });
}
function setPriority(val) {
  document.getElementById('edit-priority').value = val;
  document.querySelectorAll('#edit-modal .priority-opt').forEach(b => {
    b.className = 'priority-opt';
    if (b.textContent === val) b.classList.add('sel-' + val.toLowerCase());
  });
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

function setNewPriority(priority) {

    document.getElementById(
        'new-priority'
    ).value = priority;
    document.querySelectorAll(
        '#new-task-modal .priority-opt'
    ).forEach(btn => {
        btn.classList.remove(
            'sel-low','sel-medium','sel-high'
        );
        if (btn.textContent.toLowerCase()=== priority
        ) {
            btn.classList.add(
                `sel-${priority}`
            );
        }
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
      tasks = data.data; 
      renderTasks(tasks); 
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
  const pClass = task.priority.value;
  const sClass = task.status.value;
  const pfClass = task.priority.value;

  const taskCard = `<div class="task-card" data-id="${task.id}">
    <div class="task-card-header">
      <div class="task-status-dot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-menu" onclick="openMenu(event,${task.id})">···</div>
    </div>
    <div class="task-title">${task.title}</div>
    <div class="task-badges">
      <span class="badge ${sClass}">${task.status.label || 'In Progress'}</span>
      <span class="badge ${pClass}">Priority ${task.priority.label}</span>
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

