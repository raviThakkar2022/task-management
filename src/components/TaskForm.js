import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [stage, setStage] = useState(0);
  const [priority, setPriority] = useState('low');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    console.log(e,'subit')
    e.preventDefault();
    const task = {
      name,
      stage,
      priority,
      deadline
    };
    // onSubmit(task);
    setName('');
    setStage(0);
    setPriority('low');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={stage} onChange={(e) => setStage(Number(e.target.value))}>
        <option value={0}>Backlog</option>
        <option value={1}>To Do</option>
        <option value={2}>Ongoing</option>
        <option value={3}>Done</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
