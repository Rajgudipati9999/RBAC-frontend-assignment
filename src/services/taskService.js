import API from "./api";

/**
 * Fetch all tasks. Uses JWT from localStorage via API interceptor.
 * @returns {Promise<Array>} List of tasks
 */

export async function getAllTasks() {
  const res = await API.get("/tasks");
  const data = res.data;
  return Array.isArray(data) ? data : (data?.tasks || []);
}

/**
 * Create a new task.
 * @param {string} title - Task title
 * @returns {Promise<Object>} Created task from API
 */

export async function createTask(title) {
  const res = await API.post("/tasks", { title: title.trim() });
  return res.data;
}

/**
 * Update an existing task by id.
 * @param {string} id - Task _id
 * @param {string} title - New title
 * @returns {Promise<Object>} Updated task from API
 */

export async function updateTask(id, title) {
  const res = await API.patch(`/tasks/${id}`, { title: title.trim() });
  return res.data;
}

/**
 * Delete a task by id.
 * @param {string} id - Task _id
 * @returns {Promise<void>}
 */

export async function deleteTask(id) {
  await API.delete(`/tasks/${id}`);
}
