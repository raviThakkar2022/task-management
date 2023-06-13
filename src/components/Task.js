import React from 'react';
import './Task.css';

const Task = ({ task, onEdit, onDelete }) => {
  const { name, stage, priority, deadline } = task;

  return (
    <div className="task">
      <div className="task-info">
        <h3>{name}</h3>
        <p>Stage: {stage}</p>
        <p>Priority: {priority}</p>
        <p>Deadline: {deadline}</p>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
};

export default Task;
