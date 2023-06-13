import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import { getAllTasks, createTask, updateTask, deleteTaskById } from '../API/api';

import TaskForm from './TaskForm';

import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTaskIndex, setDeletingTaskIndex] = useState(null);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const tasks = await getAllTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleMoveTask = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceStage = parseInt(source.droppableId, 10);
      const destinationStage = parseInt(destination.droppableId, 10);
      const movedTask = tasks.find((task) => task.id === parseInt(result.draggableId, 10));
      movedTask.stage = destinationStage;
      setTasks([...tasks]);
    }
  };

  const handleDeleteTask = async (index) => {
    setIsDeleteModalOpen(true);
    setDeletingTaskIndex(index);
  };

  const confirmDeleteTask = async () => {
    if (deletingTaskIndex !== null) {
      const taskId = tasks[deletingTaskIndex].id;
      try {
        await deleteTaskById(taskId);
        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          updatedTasks.splice(deletingTaskIndex, 1);
          return updatedTasks;
        });
        setIsDeleteModalOpen(false);
        setDeletingTaskIndex(null);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddTask = async (task) => {
    try {
      const createdTask = await createTask(task);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };


//   const handleDeleteTask = async (index) => {
//     setIsDeleteModalOpen(true);
//     setDeletingTaskIndex(index);
//   };

//   const confirmDeleteTask = async () => {
//     if (deletingTaskIndex !== null) {
//       const taskId = tasks[deletingTaskIndex].id;
//       try {
//         await deleteTask(taskId);
//         setTasks((prevTasks) => {
//           const updatedTasks = [...prevTasks];
//           updatedTasks.splice(deletingTaskIndex, 1);
//           return updatedTasks;
//         });
//         setIsDeleteModalOpen(false);
//         setDeletingTaskIndex(null);
//       } catch (error) {
//         console.error('Error deleting task:', error);
//       }
//     }
//   };

  const handleEditTask = (index) => {
    setEditingTask(index);
  };

  const handleSaveTask = (index, updatedTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index] = updatedTask;
      return updatedTasks;
    });
    setEditingTask(null);
  };

  const handleCancelEditTask = () => {
    setEditingTask(null);
  };

//   const handleAddTask = (newTask) => {
//     setTasks((prevTasks) => [...prevTasks, newTask]);
//   };

  const onDragStart = () => {
    setIsDeleteModalOpen(false);
  };

  const onDragEnd = (result) => {
    handleMoveTask(result);
  };

  return (
    <div>
      <TaskForm onAddTask={handleAddTask} />
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="kanban-board">
          <Droppable droppableId="0">
            {(provided) => (
              <div className="column backlog" ref={provided.innerRef} {...provided.droppableProps}>
                <h2>Backlog</h2>
                {tasks
                  .filter((task) => task.stage === 0)
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          className="task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task
                            task={task}
                            index={index}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* ... Repeat Droppable and Draggable for other stages */}
        </div>
      </DragDropContext>
      {editingTask !== null && (
        <TaskEditForm
          task={tasks[editingTask]}
          onSave={(updatedTask) => handleSaveTask(editingTask, updatedTask)}
          onCancel={handleCancelEditTask}
        />
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Task Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this task?</p>
        <button className="delete-button" onClick={confirmDeleteTask}>Delete</button>
        <button className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
