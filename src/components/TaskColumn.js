import React from 'react';
import Task from './Task';
import './TaskColumn.css';

const TaskColumn = ({ title, tasks, onEdit, onDelete }) => {
  return (
    <div className="task-column">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskColumn;
