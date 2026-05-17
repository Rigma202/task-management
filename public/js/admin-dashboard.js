
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

        <div class="task-menu" onclick="deleteTask(${t.id})">···</div>
      </div>
      <div class="task-title">${t.title}</div>
      <div class="task-badges">
        <span class="badge ${sClass}">${t.status.label}</span>
        <span class="badge ${pClass}">Priority ${t.priority.label}</span>
      </div>
      <div class="task-desc">${t.description.substring(0, 90)}…</div>
      <div class="task-meta">
        <span>👤 ${t.assigned_to?.name || 'Unassigned'}</span>
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
document.addEventListener(
    'DOMContentLoaded',
    () => {
        const today =
            new Date()
                .toISOString()
                .split('T')[0];
        document.getElementById(
            'new-due'
        ).min = today;
        document.getElementById(
            'edit-due'
        ).min = today;
    }
);

function openView(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  currentViewId = id;
  document.getElementById('view-modal-title').textContent = t.title;
  const pClass = t.priority.value;
  const sClass = t.status.value;
  document.getElementById('view-modal-badges').innerHTML =
    `<span>${t.status.label}</span><span">Priority ${t.priority.label}</span>`;
  document.getElementById('view-assigned').textContent = t.assigned_to?.name;
  document.getElementById('view-due').textContent = t.due_date;
  document.getElementById('view-desc').textContent = t.description;
  document.getElementById('view-ai-priority').textContent = t.ai_priority|| 'No AI priority available';
  document.getElementById('view-ai-summary').textContent = t.ai_summary || 'No AI summary available';
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
  document.getElementById('edit-desc').value = t.description;
  document.getElementById('edit-due').value = t.due_date;
  document.getElementById('edit-assigned').value = t.assigned_to?.id;
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
            if (btn.textContent
                    .trim()
                    .toLowerCase()
                === priority.toLowerCase()
            ) {btn.classList.add(`sel-${priority}`);
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
  document.getElementById('new-priority').value = 'low';
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
    document.getElementById('view-' + n).style.display =
      n === v ? '' : 'none';
  });

  document.querySelectorAll('.sidebar-link').forEach((el, i) => {
    el.classList.toggle(
      'active',
      ['tasks','analytics','users'][i] === v
    );
  });
  if (v === 'analytics') {
    loadAnalytics();
  }
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
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Task title is required'
    });
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

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Task created successfully!',
          timer: 1800,
          showConfirmButton: false
        });
        closeModal('new-task-modal');
        addTaskToGrid(data.data);
        resetNewTaskForm();
        getAISummary(data.data.id);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Unknown error'
        });

      }

    },
    error: function (response) {

      console.error('Error:', response);

      Swal.fire({
        icon: 'error',
        title: 'Request Failed.Please fill all the fileds and try again',
        text: 'Unable to create task.'
      });

    }

  });
}

function getAISummary(taskId)
{
    $.ajax({
        url: `/api/tasks/${taskId}/ai-summary`,
        method: 'GET',
        success: function(response)
        {
            document.getElementById(
                'result-ai-summary'
            ).textContent = response.ai_summary;

            document.getElementById(
                'result-ai-priority'
            ).textContent =
                response.ai_priority?.label || 'No priority';
        },
        error: function(error)
        {
            console.error(error);
        }
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderTasks();
});


function addTaskToGrid(task) {
  const pClass = task.priority.value;
  const sClass = task.status.value;
  const pfClass = task.priority.value;

  const taskCard = `<div class="task-card" data-id="${task.id}">
    <div class="task-card-header">
      <div class="task-status-dot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-menu" onclick="deleteTask(${task.id})">···</div>
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
  const assigned = document.getElementById('edit-assigned').value.trim();

  $.ajax({
    url: `${API_BASE}/tasks/${id}`,
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': CSRF_TOKEN,
      'Accept': 'application/json'
    },
    data: {
      _method: 'PATCH',
      title: title,
      description: desc,
      due_date: due,
      status: status,
      priority: priority,
      assigned_to: assigned
    },

    success: function(response) {

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Task updated successfully!',
        timer: 1800,
        showConfirmButton: false
      });
      closeModal('edit-modal');
      fetchAndRenderTasks();
    },
    error: function(xhr) {
      let message = 'Unable to update task.';
      if (xhr.responseJSON?.errors) {

        message = Object.values(
          xhr.responseJSON.errors
        )[0][0];

      }

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message
      });

    }

  });

}

function deleteTask(id) {

  Swal.fire({
    title: 'Delete Task?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (!result.isConfirmed) return;
    $.ajax({
      url: `${API_BASE}/tasks/${id}`,
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': CSRF_TOKEN,
        'Accept': 'application/json'
      },
      data: {
        _method: 'DELETE'
      },
      success: function(response) {

        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Task deleted successfully!',
          timer: 1800,
          showConfirmButton: false
        });
        document
          .querySelector(`[data-id="${id}"]`)
          ?.remove();
        fetchAndRenderTasks();
      },
      error: function(xhr) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Unable to delete task.'
        });

      }

    });

  });

}


let taskChartInstance = null;

async function loadAnalytics() {

  try {

    const response = await fetch('/api/tasks/analytics');
    const data = await response.json();
    document.getElementById('total-tasks').textContent =
      data.stats.total_tasks;
    document.getElementById('completed-tasks').textContent =
      data.stats.completed_tasks;
    document.getElementById('pending-tasks').textContent =
      data.stats.pending_tasks;
    document.getElementById('high-priority').textContent =
      data.stats.high_priority_tasks;
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyData = Array(12).fill(0);

    data.monthly_completion.forEach(item => {
      monthlyData[item.month - 1] = item.total;
    });

    if (taskChartInstance) {
      taskChartInstance.destroy();
    }

    taskChartInstance = new Chart(
      document.getElementById('taskChart'),
      {
        type: 'line',

        data: {
          labels: monthNames,

          datasets: [
            {
              label: 'Completed Tasks',
              data: monthlyData,
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        },

options: {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: true
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}
      }
    );

  } catch (error) {

    console.error('Analytics load failed:', error);

  }

}


