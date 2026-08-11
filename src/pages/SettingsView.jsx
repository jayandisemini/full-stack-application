import React from 'react';
import { Sliders, Bell, Shield, Palette, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../components/Settings/Settings.css';

export default function SettingsView() {
  const { theme, toggleTheme, isMockMode, toggleMockMode } = useTheme();
  const { user } = useAuth();

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
      </div>
    </div>
  );
}
