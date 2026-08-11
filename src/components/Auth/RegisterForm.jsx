import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthForm.css';

export default function RegisterForm() {
  const { register, setAuthView } = useAuth();
  const [fullName, setFullName] = useState('Sarah Chen');
  const [email, setEmail] = useState('you@company.com');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [role, setRole] = useState('Frontend Lead');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    register(fullName, email, role);
  };

  return (
    <div className="auth-card glass-panel">
      {/* Top indicator bar */}
      <div className="card-top-bar"></div>

      <div className="auth-card-body">
        <div className="auth-header">
          <h2>Create account</h2>
          <p>Join your team on SyncBoard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label>FULL NAME</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="e.g. Sarah Chen"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Work Email */}
          <div className="form-group">
            <label>WORK EMAIL</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password & Confirm Side-by-Side */}
          <div className="form-row-2">
            <div className="form-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>CONFIRM</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>ROLE</label>
            <div className="input-wrapper">
              <Briefcase size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Frontend Lead"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary auth-submit-btn">
            Create Account &amp; Join Team
          </button>
        </form>

        {/* Terms Disclaimer */}
        <div className="terms-disclaimer">
          By creating an account you agree to our{' '}
          <a href="#terms" onClick={e => e.preventDefault()}>
            Terms of Service
          </a>
        </div>

        {/* Auth View Switcher */}
        <div className="auth-footer-link">
          <span>Already have an account? </span>
          <button type="button" onClick={() => setAuthView('login')} className="link-btn">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
