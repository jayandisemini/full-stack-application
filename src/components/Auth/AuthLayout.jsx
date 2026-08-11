import React from 'react';
import { Activity, CheckCircle2, Layout, BarChart2, Zap, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthLayout.css';

export default function AuthLayout() {
  const { authView } = useAuth();

  return (
    <div className="auth-container">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          {/* Logo */}
          <div className="brand-logo-row">
            <div className="logo-icon-box">
              <Activity className="logo-icon" size={24} />
            </div>
            <span className="logo-title">SyncBoard</span>
          </div>

          {/* Mini Interactive Kanban Preview Card */}
          <div className="preview-card glass-panel">
            <div className="preview-columns">
              <div className="mini-col">
                <div className="mini-col-header">
                  <span className="col-dot dot-backlog"></span>
                  <span>Backlog</span>
                </div>
                <div className="mini-line w-80"></div>
                <div className="mini-line w-50"></div>
              </div>
              <div className="mini-col">
                <div className="mini-col-header">
                  <span className="col-dot dot-inprogress"></span>
                  <span>In Progress</span>
                </div>
                <div className="mini-line w-90 purple"></div>
                <div className="mini-line w-60 purple"></div>
              </div>
              <div className="mini-col">
                <div className="mini-col-header">
                  <span className="col-dot dot-done"></span>
                  <span>Done</span>
                </div>
                <div className="mini-line w-100 green"></div>
                <div className="mini-line w-70 green"></div>
              </div>
            </div>

            {/* Live Indicator Bar */}
            <div className="preview-status-bar">
              <span className="green-pulse"></span>
              <span className="status-text">
                <strong>3 team members online</strong> • 2 tasks updated just now
              </span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="hero-typography">
            <h1 className="hero-title">
              Real-Time Team <br />
              <span className="gradient-text">Collaboration &amp;</span> <br />
              Work Management.
            </h1>
            <p className="hero-subtitle">
              Plan sprints, track progress, and ship faster. Purpose-built for engineering teams.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="feature-pills-row">
            <div className="pill-item">
              <CheckCircle2 size={14} className="pill-icon" />
              <span>Kanban Boards</span>
            </div>
            <div className="pill-item">
              <CheckCircle2 size={14} className="pill-icon" />
              <span>Sprint Analytics</span>
            </div>
            <div className="pill-item">
              <CheckCircle2 size={14} className="pill-icon" />
              <span>Live Sync</span>
            </div>
            <div className="pill-item">
              <CheckCircle2 size={14} className="pill-icon" />
              <span>Team Directory</span>
            </div>
          </div>

          {/* Trusted Companies Footer */}
          <div className="trusted-footer">
            <span className="trusted-label">TRUSTED BY ENGINEERING TEAMS</span>
            <div className="company-logos">
              <span>Acme Corp</span>
              <span>ByteWave</span>
              <span>NexaTech</span>
              <span>CodeLabs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        {authView === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
