import { useEffect, useState } from "react";
import * as taskService from "../../services/taskService";
import "./index.css";

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const loadTasks = async () => {
    setError("");
    try {
      const list = await taskService.getAllTasks();
      setTasks(list);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        onLogout();
        return;
      }
      setError(err.response?.data?.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      await taskService.createTask(title);
      setTitle("");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateTask = async (id) => {
    if (editingTitle.trim() === "") return;
    setError("");
    try {
      await taskService.updateTask(id, editingTitle);
      setEditingId(null);
      setEditingTitle("");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    setError("");
    try {
      await taskService.deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Tasks</h1>
        <button type="button" className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-create">
        <form onSubmit={createTask} className="create-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="create-input"
          />
          <button type="submit" className="btn-primary">
            Create task
          </button>
        </form>
      </section>

      {error && <p className="dashboard-error">{error}</p>}

      {loading ? (
        <p className="dashboard-loading">Loading tasks…</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingId === task._id ? (
                <div className="task-edit">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-save"
                    onClick={() => updateTask(task._id)}
                  >
                    Save
                  </button>
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => startEdit(task)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && tasks.length === 0 && !error && (
        <p className="dashboard-empty">No tasks yet. Create one above.</p>
      )}
    </div>
  );
}

export default Dashboard;
