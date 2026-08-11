import React from 'react';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import './Kanban.css';

export default function TaskCard({ task }) {
  const { openEditModal, teamMembers } = useTasks();

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

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => openEditModal(task)}
    >
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
        <span className="tag-pill">{task.category}</span>
        {task.extraTag && (
          <span className="tag-pill tag-extra">{task.extraTag}</span>
        )}
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
          <Calendar size={13} />
          <span>{task.dueDate.replace(', 2026', '')}</span>
        </div>
      </div>
    </div>
  );
}
