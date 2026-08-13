import React, { useState, useRef, useEffect } from 'react';
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
  Radio,
  Check,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TasksContext';
import './Sidebar.css';

const teamsData = [
  { id: 'et', badge: 'ET', name: 'Engineering Team', plan: 'Pro Plan • 8 members', color: '#4f46e5' },
  { id: 'pd', badge: 'PD', name: 'Product & Design', plan: 'Growth Plan • 5 members', color: '#ec4899' },
  { id: 'ds', badge: 'DS', name: 'DevOps & Infra', plan: 'Enterprise • 12 members', color: '#10b981' },
  { id: 'qa', badge: 'QA', name: 'Quality Assurance', plan: 'Pro Plan • 4 members', color: '#f59e0b' }
];

const boardsData = [
  { id: 'q3', name: 'Q3 Sprint Board', tag: 'Main Sprint', dotColor: '#6366f1' },
  { id: 'q4', name: 'Q4 Product Roadmap', tag: 'Upcoming', dotColor: '#3b82f6' },
  { id: 'backlog', name: 'Backlog Grooming', tag: 'Continuous', dotColor: '#a855f7' },
  { id: 'triage', name: 'Bug Triage & Hotfixes', tag: 'Active', dotColor: '#ef4444' }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme, isMockMode, toggleMockMode } = useTheme();
  const { user, logout } = useAuth();
  const { teamMembers } = useTasks();

  const [currentTeam, setCurrentTeam] = useState(teamsData[0]);
  const [currentBoard, setCurrentBoard] = useState(boardsData[0]);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

  const teamRef = useRef(null);
  const boardRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (teamRef.current && !teamRef.current.contains(e.target)) {
        setIsTeamMenuOpen(false);
      }
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setIsBoardMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'board', label: 'Board View', icon: LayoutGrid },
    { id: 'list', label: 'List View', icon: List },
    { id: 'analytics', label: 'Analytics / Reports', icon: BarChart2 },
    { id: 'team', label: 'Team Members', icon: Users, badge: teamMembers.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="app-sidebar">
      {/* Workspace Header Switcher */}
      <div className="sidebar-workspace-header-wrapper" ref={teamRef}>
        <button
          className={`sidebar-workspace-header ${isTeamMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsTeamMenuOpen(prev => !prev);
            setIsBoardMenuOpen(false);
          }}
        >
          <div className="team-badge" style={{ backgroundColor: currentTeam.color }}>
            {currentTeam.badge}
          </div>
          <div className="team-info">
            <div className="team-name-row">
              <span className="team-name">{currentTeam.name}</span>
              <ChevronDown size={14} className={`dropdown-arrow ${isTeamMenuOpen ? 'open' : ''}`} />
            </div>
            <span className="team-plan">{currentTeam.plan}</span>
          </div>
        </button>

        {/* Team Switcher Dropdown Menu */}
        {isTeamMenuOpen && (
          <div className="sidebar-dropdown-menu">
            <div className="dropdown-section-title">SWITCH WORKSPACE</div>
            {teamsData.map(team => (
              <button
                key={team.id}
                className={`sidebar-dropdown-item ${currentTeam.id === team.id ? 'selected' : ''}`}
                onClick={() => {
                  setCurrentTeam(team);
                  setIsTeamMenuOpen(false);
                }}
              >
                <div className="dropdown-item-badge" style={{ backgroundColor: team.color }}>
                  {team.badge}
                </div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-name">{team.name}</span>
                  <span className="dropdown-item-sub">{team.plan}</span>
                </div>
                {currentTeam.id === team.id && <Check size={14} className="check-icon" />}
              </button>
            ))}
            <div className="dropdown-divider"></div>
            <button className="dropdown-item-action" onClick={() => setIsTeamMenuOpen(false)}>
              <Plus size={14} />
              <span>Create New Workspace</span>
            </button>
          </div>
        )}
      </div>

      {/* App Logo & Board Selector */}
      <div className="sidebar-board-selector">
        <div className="board-brand-row">
          <div className="brand-icon-square">
            <Activity size={16} />
          </div>
          <span className="brand-title">SyncBoard</span>
        </div>

        <div className="sprint-dropdown-wrapper" ref={boardRef}>
          <button
            className={`sprint-dropdown-btn ${isBoardMenuOpen ? 'active' : ''}`}
            onClick={() => {
              setIsBoardMenuOpen(prev => !prev);
              setIsTeamMenuOpen(false);
            }}
          >
            <span className="sprint-dot" style={{ backgroundColor: currentBoard.dotColor }}></span>
            <span className="sprint-name">{currentBoard.name}</span>
            <ChevronDown size={14} className={`dropdown-arrow ${isBoardMenuOpen ? 'open' : ''}`} />
          </button>

          {/* Board Selector Dropdown Menu */}
          {isBoardMenuOpen && (
            <div className="sidebar-dropdown-menu board-menu">
              <div className="dropdown-section-title">SWITCH SPRINT BOARD</div>
              {boardsData.map(board => (
                <button
                  key={board.id}
                  className={`sidebar-dropdown-item ${currentBoard.id === board.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentBoard(board);
                    setIsBoardMenuOpen(false);
                  }}
                >
                  <span className="sprint-dot" style={{ backgroundColor: board.dotColor }}></span>
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-name">{board.name}</span>
                    <span className="dropdown-item-tag">{board.tag}</span>
                  </div>
                  {currentBoard.id === board.id && <Check size={14} className="check-icon" />}
                </button>
              ))}
              <div className="dropdown-divider"></div>
              <button className="dropdown-item-action" onClick={() => setIsBoardMenuOpen(false)}>
                <Plus size={14} />
                <span>Create New Board</span>
              </button>
            </div>
          )}
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
                {item.badge ? (
                  <span className="nav-count-badge">{item.badge}</span>
                ) : isActive ? (
                  <span className="active-dot-indicator"></span>
                ) : null}
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
              <span>{user?.role || 'Frontend Lead'} •</span>
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
