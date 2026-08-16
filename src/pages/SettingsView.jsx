import React, { useState } from 'react';
import { Sliders, Bell, Shield, Palette, Database, Tag, Download, RefreshCw, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import '../components/Settings/Settings.css';

export default function SettingsView() {
  const { theme, toggleTheme, isMockMode, toggleMockMode } = useTheme();
  const { user } = useAuth();
  const { tasks, teamMembers } = useTasks();

  const [categories, setCategories] = useState(['Frontend', 'Backend', 'Design', 'DevOps', 'Testing', 'Database']);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) return;
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
  };

  const handleExportBackup = () => {
    const data = {
      workspace: 'SyncBoard',
      version: '2.4.1',
      exportDate: new Date().toISOString(),
      tasks,
      teamMembers
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `syncboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset local workspace data to defaults? This will clear browser storage.')) {
      localStorage.removeItem('syncboard_tasks');
      localStorage.removeItem('syncboard_team_members');
      window.location.reload();
    }
  };

  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <h2>Workspace Settings</h2>
        <p className="settings-sub">Configure SyncBoard workspace preferences and environment settings.</p>
      </div>

      <div className="settings-sections">
        {/* Profile Card */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <Shield size={20} className="card-icon" />
            <div>
              <h3>User Profile</h3>
              <p>Your current workspace account settings</p>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Name</span>
              <span className="item-desc">{user?.name}</span>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Email</span>
              <span className="item-desc">{user?.email}</span>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Role</span>
              <span className="item-desc">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <Palette size={20} className="card-icon" />
            <div>
              <h3>Appearance &amp; Theme</h3>
              <p>Customize the UI color mode</p>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Theme Mode</span>
              <span className="item-desc">Current theme is <strong>{theme.toUpperCase()}</strong></span>
            </div>
            <button className="btn-secondary" onClick={toggleTheme}>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Category Tags Manager */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <Tag size={20} className="card-icon" />
            <div>
              <h3>Workspace Tag Categories</h3>
              <p>Manage task classification labels</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0' }}>
            {categories.map(cat => (
              <span key={cat} className="tag-pill tag-frontend" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                {cat}
              </span>
            ))}
          </div>

          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="New category name..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.4rem 0.75rem',
                color: 'var(--text-main)',
                fontSize: '0.825rem'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.85rem' }}>
              <Plus size={14} /> Add Tag
            </button>
          </form>
        </div>

        {/* API & Backend Settings */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <Database size={20} className="card-icon" />
            <div>
              <h3>API Connection Mode</h3>
              <p>Toggle between simulated Mock Data mode and Live API connection</p>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">API Mode</span>
              <span className="item-desc">
                {isMockMode ? 'Mock Mode (Local state API v1)' : 'Live API (Connecting to server)'}
              </span>
            </div>
            <button className="btn-secondary" onClick={toggleMockMode}>
              Toggle Mock Mode
            </button>
          </div>
        </div>

        {/* Data Backup & Maintenance */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <RefreshCw size={20} className="card-icon" />
            <div>
              <h3>Data Management &amp; Backup</h3>
              <p>Backup workspace state or reset storage</p>
            </div>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Export Database Backup</span>
              <span className="item-desc">Download full JSON backup of all tasks and members</span>
            </div>
            <button className="btn-secondary" onClick={handleExportBackup}>
              <Download size={14} style={{ marginRight: 4 }} /> Export JSON
            </button>
          </div>

          <div className="setting-item">
            <div>
              <span className="item-title">Reset Workspace Data</span>
              <span className="item-desc">Clear local cache and restore default initial state</span>
            </div>
            <button className="btn-secondary" onClick={handleResetData} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
              Reset Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
