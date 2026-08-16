import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, X, Bell, AlertTriangle, Clock } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import './Header.css';

export default function Header({ activeTab, onOpenPalette }) {
  const {
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
    teamMembers,
    stats,
    openCreateModal
  } = useTasks();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const tabTitles = {
    board: 'Main Sprint',
    list: 'List View',
    analytics: 'Analytics',
    team: 'Team Directory',
    settings: 'Settings'
  };

  const currentTitle = tabTitles[activeTab] || 'Main Sprint';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left Side: Breadcrumb & Search */}
        <div className="header-left">
          <div className="breadcrumb-nav">
            <span className="bc-muted">Workspaces</span>
            <span className="bc-sep">/</span>
            <span className="bc-muted">SyncBoard</span>
            <span className="bc-sep">/</span>
            <span className="bc-current">{currentTitle}</span>
          </div>

          <div className="header-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, assignee, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Middle: Avatars & Priority Filters */}
        <div className="header-middle">
          {/* Team Member Avatars Stack */}
          <div className="avatar-stack">
            {teamMembers.slice(0, 6).map(member => {
              const isSelected = selectedAssignee === member.id;
              return (
                <button
                  key={member.id}
                  onClick={() => toggleAssigneeFilter(member.id)}
                  className={`avatar-stack-item ${isSelected ? 'selected' : ''}`}
                  style={{ backgroundColor: member.color }}
                  title={`Filter by ${member.name}`}
                >
                  {member.initials}
                </button>
              );
            })}
          </div>

          {/* Priority Filter Dropdown */}
          <div className="priority-filter-box">
            <Filter size={14} className="filter-icon" />
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="priority-select"
            >
              <option value="ALL">Priority</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Overdue Badge Toggle */}
          <button
            onClick={toggleOverdueFilter}
            className={`overdue-badge-btn ${overdueOnly ? 'active' : ''}`}
            title="Toggle Overdue Filter"
          >
            <span className="overdue-dot"></span>
            <span>Overdue {stats.overdueCount}</span>
          </button>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="clear-filters-btn">
              <X size={13} />
              <span>Clear {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}</span>
            </button>
          )}
        </div>

        {/* Right Side: Notifications & Create Button */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
            </button>

            {isNotifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '300px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  WORKSPACE NOTIFICATIONS
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>
                  <AlertTriangle size={15} color="#ef4444" style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>SYNC-103 Overdue</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Payment Gateway integration past due</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.5rem', background: 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
                  <Clock size={15} color="#f59e0b" style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>Conflict Warning</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>SYNC-102 DB schema merge collision</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="btn-primary create-task-btn" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Create New Task</span>
            <kbd
              className="kbd-shortcut"
              title="Open Command Palette (⌘K)"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenPalette) onOpenPalette();
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Sub-Header Bar: Preview States Switcher */}
      <div className="preview-states-bar">
        <span className="preview-label">Preview states:</span>
        <button
          className={`preview-link ${previewState === 'normal' ? 'active' : ''}`}
          onClick={() => setPreviewState('normal')}
        >
          Normal
        </button>
        <button
          className={`preview-link ${previewState === 'loading' ? 'active' : ''}`}
          onClick={() => setPreviewState('loading')}
        >
          Loading
        </button>
        <button
          className={`preview-link ${previewState === 'error' ? 'active' : ''}`}
          onClick={() => setPreviewState('error')}
        >
          Error
        </button>
        <button
          className={`preview-link ${previewState === '404' ? 'active' : ''}`}
          onClick={() => setPreviewState('404')}
        >
          404 Task
        </button>
      </div>
    </header>
  );
}
