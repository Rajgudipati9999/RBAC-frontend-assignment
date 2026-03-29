import { apiFetch } from "./api";

/**
 * Fetch all tasks. Uses JWT from localStorage via Authorization header.
 * @returns {Promise<Array>} List of tasks
 */
export async function getAllTasks() {
  const data = await apiFetch("/tasks");
  return Array.isArray(data) ? data : data?.tasks || [];
}

/**
 * Create a new task.
 * @param {string} title - Task title
 * @returns {Promise<Object>} Created task from API
 */
export async function createTask(title) {
  return apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ title: title.trim() }),
  });
}

/**
 * Update an existing task by id.
 * @param {string} id - Task _id
 * @param {string} title - New title
 * @returns {Promise<Object>} Updated task from API
 */
export async function updateTask(id, title) {
  return apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title: title.trim() }),
  });
}

/**
 * Delete a task by id.
 * @param {string} id - Task _id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  await apiFetch(`/tasks/${id}`, {
    method: "DELETE",
  });
}
