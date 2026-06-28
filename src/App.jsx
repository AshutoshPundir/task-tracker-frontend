import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
  };

  const handleCreate = async (form) => {
    try {
      const { data } = await createTask(form);
      setTasks([data, ...tasks]);
      setShowForm(false);
      toast.success('Task created!');
    } catch { toast.error('Failed to create task'); }
  };

  const handleUpdate = async (form) => {
    try {
      const { data } = await updateTask(editingTask._id, form);
      setTasks(tasks.map(t => t._id === data._id ? data : t));
      setEditingTask(null);
      toast.success('Task updated!');
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted!');
    } catch { toast.error('Failed to delete task'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await updateTask(id, { status });
      setTasks(tasks.map(t => t._id === data._id ? data : t));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="app">
      <Toaster position="top-right" />
    <header>
      <div className="header-left">
        <div className="logo-icon">TT</div>
        <h1>Task Tracker</h1>
      </div>
      <button className="add-btn" onClick={() => setShowForm(true)}>New Task</button>
    </header>

    <p className="header-date">
      {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    </p>

    <div className="stats-row">
      <div className="stat-card"><div className="num">{tasks.length}</div><div className="lbl">Total tasks</div></div>
      <div className="stat-card"><div className="num">{tasks.filter(t => t.status === 'todo').length}</div><div className="lbl">To do</div></div>
      <div className="stat-card"><div className="num">{tasks.filter(t => t.status === 'in-progress').length}</div><div className="lbl">In progress</div></div>
      <div className="stat-card"><div className="num">{tasks.filter(t => t.status === 'done').length}</div><div className="lbl">Done</div></div>
    </div>

      {(showForm || editingTask) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <TaskForm
              onSubmit={editingTask ? handleUpdate : handleCreate}
              initial={editingTask || {}}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
            />
          </div>
        </div>
      )}

      <div className="controls">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-tabs">
          {['all', 'todo', 'in-progress', 'done'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      <div className="task-grid">
        {filtered.length === 0
          ? <p className="empty">No tasks found. Add one!</p>
          : filtered.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onEdit={setEditingTask}
              onStatusChange={handleStatusChange}
            />
          ))
        }
      </div>
    </div>
  );
}