import React from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
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

        {/* Right Side: Create Button & Status Badge */}
        <div className="header-right">
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
