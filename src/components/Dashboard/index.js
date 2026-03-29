import { useEffect, useState } from "react";
import * as taskService from "../../services/taskService";
import "./index.css";

// Try to infer the owner id from different possible backend field names
function getTaskOwnerId(task) {
  return (
    task.ownerId ||
    task.userId ||
    (task.user && (task.user._id || task.user.id)) ||
    task.owner ||
    null
  );
}

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  console.log(tasks);

  const loadTasks = async () => {
    setError("");
    try {
      const list = await taskService.getAllTasks();
      setTasks(list);
      console.log(list)
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem("token");
        onLogout();
        return;
      }
      setError(err.body?.message || err.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
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
      setError(err.body?.message || err.message || "Failed to create task");
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
      setError(err.body?.message || err.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    setError("");
    try {
      await taskService.deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(err.body?.message || err.message || "Failed to delete task");
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
        {role && <span className="dashboard-role">Role: {role}</span>}
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
          {tasks.map((task) => {
            const ownerId = getTaskOwnerId(task);
            const isOwner = userId && ownerId && String(ownerId) === String(userId);
            const canDelete = role === "admin" || isOwner;

            return (
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
                        disabled={!canDelete}
                        title={
                          canDelete
                            ? "Delete task"
                            : "Only admins or task owners can delete"
                        }
                        onClick={() => canDelete && deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && tasks.length === 0 && !error && (
        <p className="dashboard-empty">No tasks yet. Create one above.</p>
      )}
    </div>
  );
}

export default Dashboard;
