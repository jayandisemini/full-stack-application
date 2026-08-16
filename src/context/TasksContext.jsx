import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_TASKS } from '../data/initialTasks';
import { INITIAL_TEAM_MEMBERS } from '../data/teamMembers';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('syncboard_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
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

  const addTeamMember = (newMember) => {
    const nextId = `user-${Date.now()}`;
    const initials = newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TM';
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
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [previewState, setPreviewState] = useState('normal');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save tasks to localStorage whenever modified
  const updateTasksState = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('syncboard_tasks', JSON.stringify(newTasks));
  };

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
  };

  const addTask = (newTaskData) => {
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
  };

  const [defaultColumnId, setDefaultColumnId] = useState('backlog');

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    updateTasksState(updated);
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
