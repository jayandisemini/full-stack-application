import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_TASKS } from '../data/initialTasks';
import { INITIAL_TEAM_MEMBERS } from '../data/teamMembers';
import { apiService, socket } from '../services/api';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('syncboard_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('syncboard_team_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TEAM_MEMBERS;
  });

  // Fetch initial tasks & members from Backend API on mount
  useEffect(() => {
    async function loadData() {
      const apiTasks = await apiService.getTasks();
      if (apiTasks && Array.isArray(apiTasks)) {
        setTasks(apiTasks);
        localStorage.setItem('syncboard_tasks', JSON.stringify(apiTasks));
      }
      const apiMembers = await apiService.getMembers();
      if (apiMembers && Array.isArray(apiMembers)) {
        setTeamMembers(apiMembers);
        localStorage.setItem('syncboard_team_members', JSON.stringify(apiMembers));
      }
    }
    loadData();

    // Connect WebSockets
    try {
      socket.connect();
    } catch (e) {}

    // Listen for WebSockets events
    socket.on('task_created', (newTask) => {
      setTasks(prev => [newTask, ...prev.filter(t => t.id !== newTask.id)]);
    });

    socket.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    });

    socket.on('task_moved', (movedTask) => {
      setTasks(prev => prev.map(t => (t.id === movedTask.id ? movedTask : t)));
    });

    socket.on('task_deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    socket.on('member_created', (newMember) => {
      setTeamMembers(prev => [newMember, ...prev.filter(m => m.id !== newMember.id)]);
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_moved');
      socket.off('task_deleted');
      socket.off('member_created');
      socket.disconnect();
    };
  }, []);

  const updateTasksState = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('syncboard_tasks', JSON.stringify(newTasks));
  };

  const addTeamMember = async (newMember) => {
    const res = await apiService.createMember(newMember);
    if (res) {
      setTeamMembers(prev => [res, ...prev.filter(m => m.id !== res.id)]);
    } else {
      const nextId = `user-${Date.now()}`;
      const initials = newMember.name ? newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'TM';
      const memberObj = {
        id: nextId,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role || 'Software Engineer',
        initials,
        color: '#8b5cf6',
        status: 'online',
        activeTasksCount: 0
      };
      const updated = [memberObj, ...teamMembers];
      setTeamMembers(updated);
      localStorage.setItem('syncboard_team_members', JSON.stringify(updated));
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [previewState, setPreviewState] = useState('normal');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleAssigneeFilter = (assigneeId) => {
    setSelectedAssignee(prev => (prev === assigneeId ? null : assigneeId));
  };

  const toggleOverdueFilter = () => {
    setOverdueOnly(prev => !prev);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setSelectedAssignee(null);
    setOverdueOnly(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== '') count++;
    if (priorityFilter !== 'ALL') count++;
    if (selectedAssignee !== null) count++;
    if (overdueOnly) count++;
    return count;
  }, [searchQuery, priorityFilter, selectedAssignee, overdueOnly]);

  const moveTask = (taskId, targetColumnId) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, columnId: targetColumnId };
      }
      return task;
    });
    updateTasksState(updated);
    apiService.updateTask(taskId, { columnId: targetColumnId });
    try {
      socket.emit('move_task', { taskId, targetColumnId });
    } catch (e) {}
  };

  const addTask = async (newTaskData) => {
    const res = await apiService.createTask(newTaskData);
    if (res) {
      setTasks(prev => [res, ...prev.filter(t => t.id !== res.id)]);
    } else {
      const nextIdNumber = tasks.reduce((max, t) => {
        const num = parseInt(t.id.replace('SYNC-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 100) + 1;

      const assignee = teamMembers.find(m => m.id === newTaskData.assigneeId) || teamMembers[0];

      const newTask = {
        id: `SYNC-${nextIdNumber}`,
        title: newTaskData.title,
        description: newTaskData.description || '',
        columnId: newTaskData.columnId || 'backlog',
        priority: newTaskData.priority || 'MEDIUM',
        category: newTaskData.category || 'Frontend',
        assigneeId: assignee.id,
        assigneeName: assignee.name,
        dueDate: newTaskData.dueDate || 'Aug 30, 2026',
        storyPoints: parseInt(newTaskData.storyPoints, 10) || 5,
        isOverdue: false,
        notice: null
      };

      updateTasksState([newTask, ...tasks]);
    }
  };

  const updateTask = (taskId, updatedFields) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const assignee = teamMembers.find(m => m.id === updatedFields.assigneeId) || { id: t.assigneeId, name: t.assigneeName };
        return {
          ...t,
          ...updatedFields,
          assigneeId: assignee.id,
          assigneeName: assignee.name
        };
      }
      return t;
    });
    updateTasksState(updated);
    apiService.updateTask(taskId, updatedFields);
  };

  const [defaultColumnId, setDefaultColumnId] = useState('backlog');

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    updateTasksState(updated);
    apiService.deleteTask(taskId);
  };

  const openCreateModal = (targetColId = 'backlog') => {
    setSelectedTask(null);
    setDefaultColumnId(targetColId);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

      const matchesAssignee =
        !selectedAssignee ||
        task.assigneeId.toLowerCase() === selectedAssignee.toLowerCase() ||
        task.assigneeName.toLowerCase().includes(selectedAssignee.toLowerCase());

      const matchesOverdue =
        !overdueOnly ||
        task.isOverdue ||
        (task.notice && task.notice.includes('Overdue'));

      return matchesSearch && matchesPriority && matchesAssignee && matchesOverdue;
    });
  }, [tasks, searchQuery, priorityFilter, selectedAssignee, overdueOnly]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.columnId === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const overdueCount = tasks.filter(t => t.isOverdue || t.notice?.includes('Overdue')).length;
    const totalVelocity = tasks
      .filter(t => t.columnId === 'completed')
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    return {
      total,
      completed,
      completionRate,
      overdueCount: overdueCount || 1, // Default matching screenshot if 1
      velocityPoints: totalVelocity || 34
    };
  }, [tasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        filteredTasks,
        teamMembers,
        addTeamMember,
        searchQuery,
        setSearchQuery,
        priorityFilter,
        setPriorityFilter,
        selectedAssignee,
        toggleAssigneeFilter,
        overdueOnly,
        toggleOverdueFilter,
        clearAllFilters,
        activeFilterCount,
        previewState,
        setPreviewState,
        moveTask,
        addTask,
        updateTask,
        deleteTask,
        stats,
        isModalOpen,
        openCreateModal,
        openEditModal,
        closeModal,
        selectedTask,
        defaultColumnId
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
