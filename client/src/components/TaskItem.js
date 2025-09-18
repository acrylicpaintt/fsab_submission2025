import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDeleteTask }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
        />
        <span className="task-text">{task.text}</span>
      </div>
      <button
        onClick={() => onDeleteTask(task.id)}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;