const API_BASE = "/api";
const state = { tasks: [], filter: "all", search: "", selectedTaskId: null };

const elements = {
  taskList: document.querySelector("#task-list"),
  total: document.querySelector("#total-count"),
  completed: document.querySelector("#completed-count"),
  inProgress: document.querySelector("#progress-count"),
  pending: document.querySelector("#pending-count"),
  percent: document.querySelector("#progress-percent"),
  fill: document.querySelector("#progress-fill"),
  summary: document.querySelector("#progress-summary"),
  fraction: document.querySelector("#progress-fraction"),
  allCount: document.querySelector("#all-filter-count"),
  apiIndicator: document.querySelector("#api-indicator"),
  apiText: document.querySelector("#api-status-text"),
  retry: document.querySelector("#retry-button"),
  modal: document.querySelector("#task-modal"),
  createModal: document.querySelector("#create-modal"),
  toast: document.querySelector("#toast")
};

const statusLabels = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started"
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload;
}

function setApiStatus(online, message) {
  elements.apiIndicator.className = `api-indicator ${online ? "online" : "offline"}`;
  elements.apiText.textContent = message;
  elements.retry.hidden = online;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function getCounts() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.status === "completed").length;
  const inProgress = state.tasks.filter((task) => task.status === "in-progress").length;
  const pending = state.tasks.filter((task) => task.status === "not-started").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, inProgress, pending, percent };
}

function renderStats() {
  const counts = getCounts();
  elements.total.textContent = counts.total;
  elements.completed.textContent = counts.completed;
  elements.inProgress.textContent = counts.inProgress;
  elements.pending.textContent = counts.pending;
  elements.percent.textContent = `${counts.percent}%`;
  elements.fill.style.width = `${counts.percent}%`;
  elements.summary.textContent = counts.total
    ? counts.percent === 100 ? "All tasks completed. Excellent work!" : "Keep going — every completed task moves you forward."
    : "No tasks available yet.";
  elements.fraction.textContent = `${counts.completed} / ${counts.total} completed`;
  elements.allCount.textContent = counts.total;
}

function filteredTasks() {
  return state.tasks.filter((task) => {
    const matchesFilter = state.filter === "all" || task.status === state.filter;
    const term = state.search.toLowerCase();
    const matchesSearch = !term || `${task.title} ${task.description} ${task.technologies.join(" ")}`.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });
}

function taskCard(task) {
  const status = statusLabels[task.status] || task.status;
  return `
    <article class="task-card">
      <div class="task-card-top">
        <span class="task-number">TASK ${String(task.id).padStart(2, "0")}</span>
        <span class="status-pill ${escapeHTML(task.status)}">${escapeHTML(status)}</span>
      </div>
      <h3>${escapeHTML(task.title)}</h3>
      <p>${escapeHTML(task.description)}</p>
      <div class="task-card-bottom">
        <span class="task-timing">${escapeHTML(task.timing || "Internship milestone")}</span>
        <div class="task-actions">
          <button class="text-button" data-view="${task.id}" type="button">View task ↗</button>
          ${task.status === "completed"
            ? '<button class="text-button" disabled type="button">✓ Done</button>'
            : `<button class="text-button" data-complete="${task.id}" type="button">Complete</button>`}
        </div>
      </div>
    </article>`;
}

function renderTasks() {
  const tasks = filteredTasks();
  if (!tasks.length) {
    elements.taskList.innerHTML = `<div class="empty-state"><strong>No tasks found</strong><p>Try another filter or search term.</p></div>`;
    return;
  }
  elements.taskList.innerHTML = tasks.map(taskCard).join("");
}

async function loadTasks() {
  elements.taskList.innerHTML = '<div class="loading-state"><span class="spinner"></span><strong>Loading your tasks</strong><p>Connecting to the TechBridge API…</p></div>';
  try {
    const result = await apiRequest("/tasks");
    state.tasks = result.data;
    setApiStatus(true, "Backend status: Connected");
    renderStats();
    renderTasks();
  } catch (error) {
    setApiStatus(false, "Backend status: Offline — unable to load tasks.");
    elements.taskList.innerHTML = `<div class="empty-state"><strong>Unable to load tasks</strong><p>${escapeHTML(error.message)}. Check that the backend is running, then retry.</p></div>`;
  }
}

async function viewTask(id) {
  try {
    const result = await apiRequest(`/tasks/${id}`);
    const task = result.data;
    state.selectedTaskId = task.id;
    document.querySelector("#modal-task-number").textContent = `TASK ${String(task.id).padStart(2, "0")} · ${escapeHTML(task.difficulty || "INTERNSHIP")}`;
    document.querySelector("#modal-title").textContent = task.title;
    document.querySelector("#modal-description").textContent = task.description;
    document.querySelector("#modal-details").textContent = task.details || task.description;
    const status = document.querySelector("#modal-status");
    status.className = `status-pill ${task.status}`;
    status.textContent = statusLabels[task.status] || task.status;
    document.querySelector("#modal-meta").innerHTML = `<span class="meta-chip">${escapeHTML(task.timing || "Internship task")}</span><span class="meta-chip">${escapeHTML(task.difficulty || "Task")}</span>`;
    document.querySelector("#modal-technologies").innerHTML = (task.technologies || []).map((tech) => `<span class="tech-chip">${escapeHTML(tech)}</span>`).join("");
    const completeButton = document.querySelector("#modal-complete-button");
    completeButton.hidden = task.status === "completed";
    completeButton.textContent = "Mark as completed";
    elements.modal.hidden = false;
  } catch (error) {
    showToast(error.message);
  }
}

async function markCompleted(id) {
  try {
    await apiRequest(`/tasks/${id}`, { method: "PUT", body: JSON.stringify({ status: "completed" }) });
    showToast("Task marked as completed.");
    elements.modal.hidden = true;
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
}

async function createTask(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = "Saving…";
  try {
    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description")
      })
    });
    form.reset();
    elements.createModal.hidden = true;
    showToast("New task created.");
    state.filter = "all";
    document.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  } finally {
    submit.disabled = false;
    submit.textContent = "Create task";
  }
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

document.querySelector("#task-search").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderTasks();
});

elements.taskList.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  const completeButton = event.target.closest("[data-complete]");
  if (viewButton) viewTask(Number(viewButton.dataset.view));
  if (completeButton) markCompleted(Number(completeButton.dataset.complete));
});

document.querySelector("#modal-complete-button").addEventListener("click", () => {
  if (state.selectedTaskId !== null) markCompleted(state.selectedTaskId);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => { elements.modal.hidden = true; }));
document.querySelectorAll("[data-close-create]").forEach((button) => button.addEventListener("click", () => { elements.createModal.hidden = true; }));
elements.modal.addEventListener("click", (event) => { if (event.target === elements.modal) elements.modal.hidden = true; });
elements.createModal.addEventListener("click", (event) => { if (event.target === elements.createModal) elements.createModal.hidden = true; });
document.querySelector("#add-task-button").addEventListener("click", () => { elements.createModal.hidden = false; });
document.querySelector("#create-task-form").addEventListener("submit", createTask);
elements.retry.addEventListener("click", loadTasks);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    elements.modal.hidden = true;
    elements.createModal.hidden = true;
  }
});

const date = new Intl.DateTimeFormat("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
document.querySelector("#current-date").textContent = date.format(new Date());
loadTasks();
