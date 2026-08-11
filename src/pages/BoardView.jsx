import React from 'react';
import Column from '../components/Kanban/Column';
import { useTasks } from '../context/TasksContext';
import '../components/Kanban/Kanban.css';

export default function BoardView() {
  const { filteredTasks, stats } = useTasks();

  const columns = [
    { id: 'backlog', title: 'Backlog', dotColor: '#94a3b8' },
    { id: 'todo', title: 'To Do', dotColor: '#3b82f6' },
    { id: 'inprogress', title: 'In Progress', dotColor: '#a855f7' },
    { id: 'completed', title: 'Completed', dotColor: '#10b981' }
  ];

  return (
    <div className="board-view-container">
      {/* Subheader Banner */}
      <div className="sprint-subheader">
        <div className="sprint-title-group">
          <h2>Main Sprint</h2>
          <div className="sprint-progress-box">
            <span className="progress-text">
              <strong>{stats.completed}</strong> of <strong>{stats.total}</strong> tasks completed
            </span>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <span className="progress-percent">{stats.completionRate}%</span>
          </div>
        </div>

        <div className="sprint-week-badge">
          <span>⚡ Q3 Sprint • Week 6</span>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="kanban-grid">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.columnId === col.id);
          return <Column key={col.id} column={col} tasks={colTasks} />;
        })}
      </div>
    </div>
  );
}
