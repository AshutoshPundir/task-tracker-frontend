export default function TaskCard({ task, onDelete, onEdit, onStatusChange }) {
  const priorityColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className={`task-card status-${task.status}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority-badge ${task.priority}`}>
            {task.priority}
        </span>
      </div>
      {task.description && <p>{task.description}</p>}
      <div className="task-footer">
        <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}