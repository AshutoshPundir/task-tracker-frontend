import { useState } from 'react';

export default function TaskForm({ onSubmit, initial = {}, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    status: initial.status || 'todo',
    priority: initial.priority || 'medium',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    setError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Task title *"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <div className="form-actions">
        <button type="submit">{initial._id ? 'Update' : 'Add Task'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}