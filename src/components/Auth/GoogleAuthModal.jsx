import React, { useState } from 'react';
import { X, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './GoogleAuthModal.css';

export default function GoogleAuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const sampleAccounts = [
    { name: 'Jayandi Semini', email: 'jayandisemini@gmail.com', initials: 'JS', color: '#4285F4' },
    { name: 'Sarah Chen', email: 'sarah.chen@gmail.com', initials: 'SC', color: '#34A853' },
    { name: 'Alex Rivers', email: 'alex.rivers@gmail.com', initials: 'AR', color: '#EA4335' }
  ];

  const handleSelectAccount = (email) => {
    login(email, 'google-oauth-pass');
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    let formattedEmail = customEmail.trim();
    if (!formattedEmail.includes('@')) {
      formattedEmail += '@gmail.com';
    }
    login(formattedEmail, 'google-oauth-pass');
    onClose();
  };

  return (
    <div className="google-modal-overlay" onClick={onClose}>
      <div className="google-modal-card" onClick={e => e.stopPropagation()}>
        {/* Google Header Logo */}
        <div className="google-modal-header">
          <div className="google-brand-row">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </div>
          <button className="google-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="google-modal-body">
          <h3>Choose an account</h3>
          <p className="google-subtext">to continue to SyncBoard Workspace</p>

          {/* Account List */}
          <div className="google-account-list">
            {sampleAccounts.map((acc, index) => (
              <button
                key={index}
                className="google-account-item"
                onClick={() => handleSelectAccount(acc.email)}
              >
                <div className="google-avatar-circle" style={{ backgroundColor: acc.color }}>
                  {acc.initials}
                </div>
                <div className="google-account-info">
                  <span className="google-acc-name">{acc.name}</span>
                  <span className="google-acc-email">{acc.email}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="google-divider">
            <span>or enter your own Gmail</span>
          </div>

          {/* Custom Gmail Input */}
          <form onSubmit={handleCustomSubmit} className="google-custom-form">
            <div className="google-input-wrapper">
              <User size={16} className="google-icon" />
              <input
                type="text"
                placeholder="Enter your Gmail address..."
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="google-submit-btn">
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
