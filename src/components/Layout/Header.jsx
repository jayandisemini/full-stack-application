import React from 'react';
import { Search, Plus, Filter, AlertCircle, Radio } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import './Header.css';

export default function Header({ activeTab }) {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
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
            {teamMembers.slice(0, 6).map(member => (
              <div
                key={member.id}
                className="avatar-stack-item"
                style={{ backgroundColor: member.color }}
                title={`${member.name} (${member.role})`}
              >
                {member.initials}
              </div>
            ))}
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

          {/* Overdue Badge */}
          <div className="overdue-badge">
            <span className="overdue-dot"></span>
            <span>Overdue {stats.overdueCount}</span>
          </div>
        </div>

        {/* Right Side: Create Button & Status Badge */}
        <div className="header-right">
          <button className="btn-primary create-task-btn" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Create New Task</span>
            <kbd className="kbd-shortcut">⌘K</kbd>
          </button>

          <div className="live-status-pill">
            <span className="live-dot"></span>
            <span>Live • SyncBoard v2.4.1</span>
          </div>
        </div>
      </div>
    </header>
  );
}
