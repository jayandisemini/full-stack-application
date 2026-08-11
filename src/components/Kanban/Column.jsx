import React, { useState } from 'react';
import { Plus, MoreHorizontal, Minus } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../../context/TasksContext';
import './Kanban.css';

export default function Column({ column, tasks }) {
  const { moveTask, openCreateModal } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

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
          <span className="column-count-pill">{tasks.length}</span>
        </div>
        <div className="column-actions">
          <button className="col-btn" onClick={openCreateModal} title="Add Task">
            <Plus size={15} />
          </button>
          <button className="col-btn" title="Column options">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="column-cards-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="empty-column-placeholder">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
