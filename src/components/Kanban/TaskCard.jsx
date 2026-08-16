import React from 'react';
import { AlertTriangle, Clock, ArrowRight, Trash2, CheckSquare } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import './Kanban.css';

export default function TaskCard({ task }) {
  const { openEditModal, teamMembers, moveTask, deleteTask } = useTasks();

  const nextColumnMap = {
    backlog: 'todo',
    todo: 'inprogress',
    inprogress: 'completed',
    completed: 'backlog'
  };

  const handleQuickNext = (e) => {
    e.stopPropagation();
    const nextCol = nextColumnMap[task.columnId];
    if (nextCol) moveTask(task.id, nextCol);
  };

  const handleQuickDelete = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const assignee = teamMembers.find(m => m.id === task.assigneeId) || {
    initials: task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : 'SC',
    color: '#6366f1'
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getCategoryTagClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'design': return 'tag-design';
      case 'frontend': return 'tag-frontend';
      case 'backend': return 'tag-backend';
      case 'database': return 'tag-database';
      default: return 'tag-default';
    }
  };

  const getCardAccentStyle = () => {
    if (task.notice && task.notice.includes('Conflict')) {
      return { borderLeft: '3px solid #f59e0b' };
    }
    if (task.priority === 'HIGH') {
      return { borderLeft: '3px solid #f59e0b' };
    }
    if (task.priority === 'URGENT') {
      return { borderLeft: '3px solid #ef4444' };
    }
    return { borderLeft: '3px solid #3b82f6' };
  };

  return (
    <div
      className="task-card"
      style={getCardAccentStyle()}
      draggable
      onDragStart={handleDragStart}
      onClick={() => openEditModal(task)}
    >
      {/* Quick Action Overlay Buttons */}
      <div className="card-quick-actions">
        <button
          className="quick-act-btn next"
          onClick={handleQuickNext}
          title={`Move to ${nextColumnMap[task.columnId] || 'next column'}`}
        >
          <ArrowRight size={12} />
        </button>
        <button
          className="quick-act-btn delete"
          onClick={handleQuickDelete}
          title="Delete task"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Top Header Row */}
      <div className="card-header-row">
        <span className="task-id">{task.id}</span>
        <div className="card-badges">
          {task.notice && (
            <span className={`notice-pill ${task.notice.includes('Conflict') ? 'warning' : 'due'}`}>
              {task.notice.includes('Conflict') ? (
                <AlertTriangle size={11} />
              ) : (
                <Clock size={11} />
              )}
              {task.notice}
            </span>
          )}
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <h4 className="task-title">{task.title}</h4>
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Category / Tags */}
      <div className="task-tags-row">
        <span className={`tag-pill ${getCategoryTagClass(task.category)}`}>
          {task.category}
        </span>
        {task.extraTag && (
          <span className="tag-pill tag-extra">
            <AlertTriangle size={10} style={{ marginRight: 3 }} />
            {task.extraTag}
          </span>
        )}
        <span className="tag-pill tag-subtask-count">
          <CheckSquare size={10} style={{ marginRight: 3 }} />
          2/3 subtasks
        </span>
      </div>

      {/* Card Footer: Assignee & Due Date */}
      <div className="card-footer-row">
        <div className="assignee-block">
          <div
            className="avatar task-avatar"
            style={{ backgroundColor: assignee.color || '#6366f1' }}
          >
            {assignee.initials}
          </div>
          <span className="assignee-name">{task.assigneeName.split(' ')[0]}</span>
        </div>

        <div className={`due-date-block ${task.isOverdue ? 'overdue-text' : ''}`}>
          <Clock size={12} />
          <span>{task.dueDate.replace(', 2026', '')}</span>
        </div>
      </div>
    </div>
  );
}
