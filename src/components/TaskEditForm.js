import React, { useState } from 'react';
import './TaskEditForm.css';

const TaskEditForm = ({ task, onSave, onCancel }) => {
  const [name, setName] = useState(task.name);
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(task.deadline);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedTask = { ...task, name, priority, deadline };
    onSave(updatedTask);
  };

  return (
    <form className="task-edit-form" onSubmit={handleSave}>
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TaskEditForm;
