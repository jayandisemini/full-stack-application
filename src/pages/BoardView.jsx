import React from 'react';
import Column from '../components/Kanban/Column';
import { useTasks } from '../context/TasksContext';
import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';
import '../components/Kanban/Kanban.css';

export default function BoardView() {
  const { tasks, filteredTasks, stats, previewState } = useTasks();

  const columns = [
    { id: 'backlog', title: 'Backlog', dotColor: '#94a3b8' },
    { id: 'todo', title: 'To Do', dotColor: '#3b82f6' },
    { id: 'inprogress', title: 'In Progress', dotColor: '#a855f7' },
    { id: 'completed', title: 'Completed', dotColor: '#10b981' }
  ];

  // Preview States Logic
  if (previewState === 'loading') {
    return (
      <div className="board-view-container">
        <div className="preview-loading-box">
          <Loader2 size={36} className="animate-spin text-purple" />
          <h3>Loading SyncBoard Workspace...</h3>
          <p>Fetching real-time board state and sprint tasks</p>
        </div>
      </div>
    );
  }

  if (previewState === 'error') {
    return (
      <div className="board-view-container">
        <div className="preview-error-box">
          <AlertTriangle size={42} className="text-amber" />
          <h3>Sync Error (API v1)</h3>
          <p>Failed to establish WebSocket connection with SyncBoard server. Please check network settings.</p>
        </div>
      </div>
    );
  }

  if (previewState === '404') {
    return (
      <div className="board-view-container">
        <div className="preview-404-box">
          <HelpCircle size={42} className="text-muted" />
          <h3>404 Task Not Found</h3>
          <p>The requested task ID or board sprint view does not exist in this workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="board-view-container">
      {/* Sprint Header Title & Counter */}
      <div className="board-main-header">
        <h2 className="board-main-title">Main Sprint</h2>
        <span className="board-match-subtext">
          {filteredTasks.length} of {tasks.length} tasks match filters
        </span>
      </div>

      {/* Columns Grid */}
      <div className="kanban-grid">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.columnId === col.id);
          const totalColTasks = tasks.filter(t => t.columnId === col.id).length;
          return (
            <Column
              key={col.id}
              column={col}
              tasks={colTasks}
              totalCount={totalColTasks}
            />
          );
        })}
      </div>
    </div>
  );
}
