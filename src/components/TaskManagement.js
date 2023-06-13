import React, { useState, useEffect } from "react";
import axios from "axios";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import update from "immutability-helper";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    priority: "medium",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:3001/tasks");
    setTasks(response.data);
  };

  const updateTaskStatus = async (taskId, status) => {
    await axios.patch(`http://localhost:3001/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newTask.name.trim() ||
      !newTask.priority.trim() ||
      !newTask.deadline.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (editTaskId) {
      await axios.patch(`http://localhost:3001/tasks/${editTaskId}`, newTask);
    } else {
      const createdTask = {
        name: newTask.name,
        priority: newTask.priority,
        deadline: newTask.deadline,
        status: "backlog",
        index: 0,
      };
      await axios.post("http://localhost:3001/tasks", createdTask);
    }

    fetchTasks();
    setShowModal(false);
    setEditModal(false);
    setEditTaskId(null);
    setNewTask({
      name: "",
      priority: "medium",
      deadline: "",
    });
    setError("");
  };

  const openEditModal = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      setNewTask({
        name: task.name,
        priority: task.priority,
        deadline: task.deadline,
      });
      setEditModal(true);
      setEditTaskId(taskId);
    }
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`http://localhost:3001/tasks/${taskId}`);
    fetchTasks();
  };

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      item: { id: task.id },
      type: "TASK",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const handleDeleteClick = () => {
      setConfirmDelete(true);
      setDraggedTaskId(task.id);
    };

    const handleDeleteConfirm = () => {
      deleteTask(draggedTaskId);
      setConfirmDelete(false);
    };

    const handleDeleteCancel = () => {
      setConfirmDelete(false);
    };

    const handleMoveForward = () => {
      // const currentIndex = tasks.findIndex((t) => t.id === task.id);
      // console.log(tasks.find((t) => t.id === task.id))
      // if (currentIndex !== -1 && currentIndex < tasks.length - 1) {
      //   const updatedTasks = update(tasks, {
      //     $splice: [
      //       [currentIndex, 1],
      //       [currentIndex + 1, 0, task],
      //     ],
      //   });
      //   setTasks(updatedTasks);
      //   updateTaskStatus(task.id, updatedTasks[currentIndex + 1].status);
      // }
      let findData = tasks.find((t) => t.id === task.id)
      if(findData.status === 'backlog'){
        findData.status = 'todo';
      }
      else if(findData.status === 'todo'){
        findData.status = 'ongoing';
      }
      else if(findData.status === 'ongoing'){
        findData.status = 'done';
      }
      
     updateTaskStatus(findData.id, findData.status);


    };

    const handleMoveBack = () => {
      // const currentIndex = tasks.findIndex((t) => t.id === task.id);
      // if (currentIndex !== -1 && currentIndex > 0) {
      //   const updatedTasks = update(tasks, {
      //     $splice: [
      //       [currentIndex, 1],
      //       [currentIndex - 1, 0, task],
      //     ],
      //   });
      //   setTasks(updatedTasks);
      //   updateTaskStatus(task.id, updatedTasks[currentIndex - 1].status);
      // }

      let findData = tasks.find((t) => t.id === task.id)
      if(findData.status === 'done'){
        findData.status = 'ongoing';
      }
      else if(findData.status === 'ongoing'){
        findData.status = 'todo';
      }
      else if(findData.status === 'todo'){
        findData.status = 'backlog';
      }
      
     updateTaskStatus(findData.id, findData.status);
    };

    return (

      <div
        className={`task ${isDragging ? "dragging" : ""} border border-dark`}
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >

        
        <span className="mb-3">{task.name}</span>
        <div className="task-buttons">
          <button onClick={handleMoveBack} className="mr-2 btn btn-primary" disabled={task.status === "backlog"}>
            Back
          </button>
          <button onClick={handleMoveForward} className="mr-2 btn btn-primary" disabled={task.status === "done"}>
            Forward
          </button>
          <button onClick={() => openEditModal(task.id)} className="mr-2 btn btn-primary">Edit</button>
          <button onClick={handleDeleteClick} className="mr-2 btn btn-danger" >Delete</button>
        </div>
    

        {confirmDelete && (
          <div className="popup mt-3 border border-dark">
            <div className="popup-content">
              <p className="ml-3">Are you sure you want to delete this task?</p>
              <div className="popup-buttons ml-3 mb-2">
                <button className="btn btn-primary mr-2"  onClick={handleDeleteConfirm}>Yes</button>
                <button  className="btn btn-primary" onClick={handleDeleteCancel}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TrashBin = () => {
    const [{ isOver }, drop] = useDrop({
      accept: "TASK",
      drop: (item) => {
        setConfirmDelete(true);
        setDraggedTaskId(item.id);
        setShowTrash(true)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div className={`trash-bin ${isOver ? "highlight" : ""}`} ref={drop}>
        <span>Trash Bin</span>
      </div>
    );
  };

  const TaskColumn = ({ title, status, index }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
      accept: "TASK",
      drop: (item) => {
        const updatedTask = { ...item, status, index };
        updateTaskStatus(item.id, status, index);
        const updatedTasks = tasks.filter((task) => task.id !== item.id);
        const insertIndex = updatedTasks.findIndex(
          (task) => task.status === status
        );
        updatedTasks.splice(insertIndex, 0, updatedTask);
        setTasks(updatedTasks);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    return (
      <div
        className={`column ${isOver && canDrop ? "highlight" : ""}`}
        ref={drop}
      >
        <h3>{title}</h3>
        <div className="task">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          </div>
      </div>
    );
  };

  const handleAddTaskClick = () => {
    setShowModal(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-management">
        <div className="header">
          <h2>Task Management</h2>
          <button onClick={handleAddTaskClick} className="create-task">
            Create Task +{" "}
          </button>
        </div>

        {showModal && (
          <div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTask.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="priority">Priority:</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deadline">Deadline:</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={newTask.deadline}
                    onChange={handleInputChange}
                  />
                </div>

                {error && <div className="error">{error}</div>}

                <div className="button-wrapper">
                  <button
                    onClick={() => setShowModal(false)}
                    className="close-modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-button">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editModal && (
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTask.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="priority">Priority:</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deadline">Deadline:</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={newTask.deadline}
                    onChange={handleInputChange}
                  />
                </div>

                {error && <div className="error">{error}</div>}

                <div className="button-wrapper">
                  <button
                    onClick={() => setEditModal(false)}
                    className="close-modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-button">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTrash && <TrashBin />}

        <div className="row">
          <div className="col">
            {" "}
            <TaskColumn title="Backlog" status="backlog" index={0} />
          </div>
          <div className="col">
            {" "}
            <TaskColumn title="To Do" status="todo" index={1} />
          </div>
          <div className="col">
            {" "}
            <TaskColumn title="Ongoing" status="ongoing" index={2} />
          </div>
          <div className="col">
            {" "}
            <TaskColumn title="Done" status="done" index={3} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskManagement;
