import React, { useEffect } from 'react';
import Column from '../components/Kanban/Column';
import { useTasks } from '../context/TasksContext';
import { AlertTriangle, HelpCircle, Loader2, Plus } from 'lucide-react';
import '../components/Kanban/Kanban.css';

export default function BoardView() {
  const { tasks, filteredTasks, stats, previewState, columns, addColumn, openCreateModal } = useTasks();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        openCreateModal('backlog');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateModal]);

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
        
        {/* Add Column Button */}
        <div className="add-column-wrapper" style={{ minWidth: '280px', display: 'flex', alignItems: 'flex-start', padding: '10px' }}>
          <button 
            onClick={() => {
              const name = window.prompt("Enter new column name:");
              if (name) {
                const { addColumn } = require('../context/TasksContext'); // Wait, useTasks already has addColumn
              }
            }}
            style={{ display: 'none' }} 
          />
          <button
            onClick={() => {
              const name = window.prompt("Enter new column name:");
              if (name && name.trim()) {
                const colors = ['#94a3b8', '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                // Note: we extract addColumn from useTasks hook above
                addColumn(name.trim(), randomColor);
              }
            }}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', 
              backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)',
              color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Plus size={16} />
            <span>Add Column</span>
          </button>
        </div>
      </div>
    </div>
  );
}
