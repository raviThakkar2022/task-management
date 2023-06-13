import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, task) => {
  try {
    const response = await axios.patch(`${BASE_URL}/tasks/${taskId}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

export const deleteTaskById = async (taskId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

export const fetchTotalTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`);
      return response.data.length;
    } catch (error) {
      console.error('Error fetching total tasks:', error);
      throw error;
    }
  };
