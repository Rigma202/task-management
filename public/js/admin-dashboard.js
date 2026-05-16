let tasks = [
  { id: 1, title: 'Launch New Marketing Campaign', status: 'In Progress', priority: 'High', assigned: 'Jane Doe', due: '2024-12-31', desc: 'Plan and execute a multi-channel marketing campaign for the new product launch, including email, social, and content creation pipelines.', ai: 'Comprehensive campaign covering multi-channel outreach including email, social media, and content marketing to support the new product launch.' },
  { id: 2, title: 'Develop API Marketing Platform', status: 'In Progress', priority: 'High', assigned: 'Jim Bard', due: '2024-12-31', desc: 'Build robust REST API endpoints for the marketing analytics platform with full authentication and rate limiting.', ai: 'REST API development for analytics platform with authentication, rate limiting, and comprehensive endpoint documentation.' },
  { id: 3, title: 'Develop API Endpoints', status: 'In Progress', priority: 'High', assigned: 'Jane Doe', due: '2024-12-05', desc: 'Create and document core API endpoints for user management, task operations, and reporting modules.', ai: 'Core API endpoints covering user management, task CRUD operations, and reporting with OpenAPI documentation.' },
  { id: 4, title: 'Develop API Endpoints v2', status: 'In Progress', priority: 'High', assigned: 'Jane Doe', due: '2024-12-31', desc: 'Second iteration of API development focusing on performance optimization and caching strategies.', ai: 'Second-phase API work addressing performance bottlenecks, implementing Redis caching, and adding GraphQL support.' },
  { id: 5, title: 'Refactor API Endpoints', status: 'Completed', priority: 'Low', assigned: 'Jane Doe', due: '2024-12-31', desc: 'Refactor existing API codebase to follow DRY principles, improve error handling, and add unit test coverage.', ai: 'Codebase refactor improving maintainability with DRY principles, comprehensive error handling, and 80% unit test coverage.' },
  { id: 6, title: 'Develop API Endpoints v3', status: 'Completed', priority: 'Low', assigned: 'Jim Bard', due: '2024-12-31', desc: 'Final API endpoints for third-party integrations including Stripe payment processing and Mailchimp sync.', ai: 'Third-party integration endpoints for Stripe payments and Mailchimp sync with webhook support and retry logic.' },
];
let nextId = 7;
let currentEditId = null;
let currentViewId = null;

function renderTasks(list) {
  const grid = document.getElementById('task-grid');
  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;font-size:14px">No tasks found.</div>';
    return;
  }
  grid.innerHTML = list.map(t => {
    const pClass = t.priority === 'High' ? 'badge-red' : t.priority === 'Medium' ? 'badge-yellow' : 'badge-green';
    const sClass = t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow';
    const pfClass = t.priority === 'High' ? 'priority-high' : t.priority === 'Medium' ? 'priority-medium' : 'priority-low';
    const done = t.status === 'Completed';
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
      <div class="task-desc">${t.desc.substring(0,90)}…</div>
      <div class="task-meta">
        <span>👤 ${t.assigned}</span>
        <span>📅 Due ${t.due}</span>
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

function createTask() {
  const title = document.getElementById('new-title').value.trim();
  if (!title) { alert('Please enter a task title.'); return; }
  const t = {
    id: nextId++,
    title,
    desc: document.getElementById('new-desc').value || 'No description provided.',
    priority: document.getElementById('new-priority').value,
    due: document.getElementById('new-due').value || '—',
    assigned: document.getElementById('new-assigned').value || 'Unassigned',
    status: 'In Progress',
    ai: `New task: ${title}. Priority: ${document.getElementById('new-priority').value}.`
  };
  tasks.unshift(t);
  closeModal('new-task-modal');
  filterTasks();
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
renderTasks(tasks);
renderBarChart();

