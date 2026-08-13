import React, { useState, useEffect } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  BarChart2,
  Users,
  Settings,
  Moon,
  Sun,
  Radio,
  Clock,
  Filter,
  X,
  Command
} from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { useTheme } from '../context/ThemeContext';
import './CommandPalette.css';

export default function CommandPalette({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const {
    openCreateModal,
    setPriorityFilter,
    toggleOverdueFilter,
    tasks,
    openEditModal
  } = useTasks();
  
  const { theme, toggleTheme, isMockMode, toggleMockMode } = useTheme();
  const [query, setQuery] = useState('');

  // Global Keyboard Listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'create-task',
      label: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      run: () => openCreateModal()
    },
    {
      id: 'nav-board',
      label: 'Go to Board View',
      category: 'Navigation',
      icon: LayoutGrid,
      run: () => setActiveTab('board')
    },
    {
      id: 'nav-list',
      label: 'Go to List View',
      category: 'Navigation',
      icon: List,
      run: () => setActiveTab('list')
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics & Reports',
      category: 'Navigation',
      icon: BarChart2,
      run: () => setActiveTab('analytics')
    },
    {
      id: 'nav-team',
      label: 'Go to Team Directory',
      category: 'Navigation',
      icon: Users,
      run: () => setActiveTab('team')
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      run: () => setActiveTab('settings')
    },
    {
      id: 'filter-urgent',
      label: 'Filter High Priority Tasks',
      category: 'Filters',
      icon: Filter,
      run: () => setPriorityFilter('HIGH')
    },
    {
      id: 'filter-overdue',
      label: 'Filter Overdue Tasks',
      category: 'Filters',
      icon: Clock,
      run: () => toggleOverdueFilter()
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Preferences',
      icon: theme === 'dark' ? Sun : Moon,
      run: () => toggleTheme()
    },
    {
      id: 'toggle-mock',
      label: `Toggle API Mode (${isMockMode ? 'Mock' : 'Live'})`,
      category: 'Preferences',
      icon: Radio,
      run: () => toggleMockMode()
    }
  ];

  // Match tasks by query
  const matchingTasks = query.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredActions = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectAction = (actionFn) => {
    actionFn();
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectTask = (task) => {
    openEditModal(task);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="palette-modal" onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className="palette-header">
          <Command size={18} className="palette-cmd-icon" />
          <input
            type="text"
            className="palette-input"
            placeholder="Type a command or search tasks (⌘K)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button className="palette-close-btn" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="palette-body">
          {/* Matching Tasks Section */}
          {matchingTasks.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">TASKS</span>
              {matchingTasks.slice(0, 4).map(task => (
                <button
                  key={task.id}
                  className="palette-item"
                  onClick={() => handleSelectTask(task)}
                >
                  <span className="task-item-id">{task.id}</span>
                  <span className="task-item-title">{task.title}</span>
                  <span className="task-item-tag">{task.category}</span>
                </button>
              ))}
            </div>
          )}

          {/* Matching Actions Section */}
          {filteredActions.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">COMMANDS</span>
              {filteredActions.map(act => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    className="palette-item"
                    onClick={() => handleSelectAction(act.run)}
                  >
                    <div className="palette-item-left">
                      <Icon size={16} className="item-icon" />
                      <span>{act.label}</span>
                    </div>
                    <span className="palette-badge">{act.category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredActions.length === 0 && matchingTasks.length === 0 && (
            <div className="palette-empty">
              No matching commands or tasks found for "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts tip */}
        <div className="palette-footer">
          <div className="shortcut-tip">
            <kbd>ESC</kbd> to close
          </div>
          <div className="shortcut-tip">
            <kbd>⌘K</kbd> to toggle
          </div>
        </div>
      </div>
    </div>
  );
}
