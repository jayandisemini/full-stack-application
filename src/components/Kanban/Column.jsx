import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  MoreHorizontal,
  Search,
  ArrowUpDown,
  Calendar,
  ArrowRight,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../../context/TasksContext';
import './Kanban.css';

export default function Column({ column, tasks, totalCount }) {
  const { moveTask, openCreateModal, activeFilterCount, deleteTask } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, column.id);
    }
  };

  const nextColumnMap = {
    backlog: 'todo',
    todo: 'inprogress',
    inprogress: 'completed',
    completed: 'backlog'
  };

  const handleMoveAllNext = () => {
    const nextCol = nextColumnMap[column.id];
    tasks.forEach(t => moveTask(t.id, nextCol));
    setIsMenuOpen(false);
  };

  const handleClearCompleted = () => {
    if (column.id === 'completed') {
      tasks.forEach(t => deleteTask(t.id));
    }
    setIsMenuOpen(false);
  };

  // Sort tasks logic
  const priorityRank = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  if (isCollapsed) {
    return (
      <div className="kanban-column collapsed" onClick={() => setIsCollapsed(false)}>
        <div className="collapsed-content">
          <span className="column-dot" style={{ backgroundColor: column.dotColor }}></span>
          <span className="collapsed-title">{column.title}</span>
          <span className="column-count-pill">{totalCount || tasks.length}</span>
          <Maximize2 size={14} className="expand-icon" title="Expand Column" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-group">
          <span className="column-dot" style={{ backgroundColor: column.dotColor }}></span>
          <span className="column-name">{column.title}</span>
          <span className="column-count-pill">{totalCount || tasks.length}</span>
        </div>

        <div className="column-actions" ref={menuRef}>
          <button className="col-btn" onClick={() => openCreateModal(column.id)} title="Add Task to Column">
            <Plus size={15} />
          </button>
          
          <button
            className={`col-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(prev => !prev)}
            title="Column options"
          >
            <MoreHorizontal size={15} />
          </button>

          {/* Interactive Column Options Dropdown Menu */}
          {isMenuOpen && (
            <div className="column-options-menu">
              <div className="menu-header-label">COLUMN OPTIONS</div>
              
              <button
                className="menu-option-btn"
                onClick={() => {
                  openCreateModal(column.id);
                  setIsMenuOpen(false);
                }}
              >
                <Plus size={14} />
                <span>Add Task to {column.title}</span>
              </button>

              <div className="menu-divider"></div>

              <button
                className={`menu-option-btn ${sortBy === 'priority' ? 'selected' : ''}`}
                onClick={() => {
                  setSortBy(prev => (prev === 'priority' ? null : 'priority'));
                  setIsMenuOpen(false);
                }}
              >
                <ArrowUpDown size={14} />
                <span>Sort by Priority {sortBy === 'priority' && '✓'}</span>
              </button>

              <button
                className={`menu-option-btn ${sortBy === 'dueDate' ? 'selected' : ''}`}
                onClick={() => {
                  setSortBy(prev => (prev === 'dueDate' ? null : 'dueDate'));
                  setIsMenuOpen(false);
                }}
              >
                <Calendar size={14} />
                <span>Sort by Due Date {sortBy === 'dueDate' && '✓'}</span>
              </button>

              <div className="menu-divider"></div>

              {tasks.length > 0 && (
                <button className="menu-option-btn" onClick={handleMoveAllNext}>
                  <ArrowRight size={14} />
                  <span>Move All to Next Column</span>
                </button>
              )}

              {column.id === 'completed' && tasks.length > 0 && (
                <button className="menu-option-btn danger" onClick={handleClearCompleted}>
                  <Trash2 size={14} />
                  <span>Clear Completed Tasks</span>
                </button>
              )}

              <button
                className="menu-option-btn"
                onClick={() => {
                  setIsCollapsed(true);
                  setIsMenuOpen(false);
                }}
              >
                <Minimize2 size={14} />
                <span>Collapse Column</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="column-cards-list">
        {sortedTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {sortedTasks.length === 0 && (
          <div className="empty-column-placeholder">
            <div className="empty-icon-circle">
              <Search size={22} className="empty-search-icon" />
            </div>
            <span className="empty-text">
              {activeFilterCount > 0 ? 'No matches for current filters' : 'Drop tasks here'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
