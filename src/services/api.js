import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 3
});

export const apiService = {
  // Fetch All Tasks
  async getTasks() {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Backend API offline, falling back to local state:', err.message);
      return null;
    }
  },

  // Create Task
  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Failed to post task to backend:', err.message);
      return null;
    }
  },

  // Update Task
  async updateTask(taskId, updatedFields) {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Failed to update task on backend:', err.message);
      return null;
    }
  },

  // Delete Task
  async deleteTask(taskId) {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Failed to delete task on backend:', err.message);
      return null;
    }
  },

  // Fetch Team Members
  async getMembers() {
    try {
      const res = await fetch(`${API_BASE_URL}/members`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Failed to fetch members:', err.message);
      return null;
    }
  },

  // Create Member
  async createMember(memberData) {
    try {
      const res = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Service] Failed to post member to backend:', err.message);
      return null;
    }
  }
};
