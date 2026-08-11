import React from 'react';
import {
  LayoutGrid,
  List,
  BarChart2,
  Users,
  Settings,
  ChevronDown,
  Activity,
  Sun,
  Moon,
  LogOut,
  Radio
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TasksContext';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme, isMockMode, toggleMockMode } = useTheme();
  const { user, logout } = useAuth();
  const { teamMembers } = useTasks();

  const navItems = [
    { id: 'board', label: 'Board View', icon: LayoutGrid },
    { id: 'list', label: 'List View', icon: List },
    { id: 'analytics', label: 'Analytics / Reports', icon: BarChart2 },
    { id: 'team', label: 'Team Members', icon: Users, badge: teamMembers.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="app-sidebar">
      {/* Workspace Header */}
      <div className="sidebar-workspace-header">
        <div className="team-badge">ET</div>
        <div className="team-info">
          <div className="team-name-row">
            <span className="team-name">Engineering Team</span>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>
          <span className="team-plan">Pro Plan • 8 members</span>
        </div>
      </div>

      {/* App Logo & Board Selector */}
      <div className="sidebar-board-selector">
        <div className="board-brand-row">
          <div className="brand-icon-square">
            <Activity size={16} />
          </div>
          <span className="brand-title">SyncBoard</span>
        </div>
        <div className="sprint-dropdown-btn">
          <span className="sprint-dot"></span>
          <span className="sprint-name">Q3 Sprint Board</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-nav-section">
        <span className="nav-section-label">WORKSPACE</span>
        <nav className="nav-menu">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-left">
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="nav-count-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Controls */}
      <div className="sidebar-footer">
        {/* Mock API Mode Indicator Toggle */}
        <button className="mock-mode-pill" onClick={toggleMockMode}>
          <Radio size={14} className={`mock-radio ${isMockMode ? 'live' : ''}`} />
          <span>{isMockMode ? 'Mock Mode (API v1)' : 'Live API (v2.4)'}</span>
        </button>

        {/* Theme Toggle Switch */}
        <div className="theme-toggle-row">
          <div className="theme-label-group">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <span>Light Mode</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* User Profile Block */}
        <div className="user-profile-block">
          <div className="user-avatar-initials">{user?.initials || 'SC'}</div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'Sarah Chen'}</span>
            <div className="user-role-line">
              <span>{user?.role || 'Frontend Lead'}</span>
              <button onClick={logout} className="signout-btn" title="Sign Out">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
