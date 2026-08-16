import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthModal from './GoogleAuthModal';
import './AuthForm.css';

export default function LoginForm() {
  const { login, setAuthView } = useAuth();
  const [email, setEmail] = useState('you@company.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <>
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      <div className="auth-card glass-panel">
        {/* Top indicator bar */}
        <div className="card-top-bar"></div>

        <div className="auth-card-body">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to your SyncBoard workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Input */}
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

            {/* Password Input */}
            <div className="form-group">
              <div className="label-row">
                <label>PASSWORD</label>
                <a href="#forgot" onClick={e => e.preventDefault()} className="forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="checkbox-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary auth-submit-btn">
              Sign In to SyncBoard
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Social Buttons */}
          <div className="social-buttons-grid">
            <button type="button" onClick={() => login('github.user@company.com', '123')} className="social-btn">
              <Github size={18} />
              <span>GitHub</span>
            </button>
            <button type="button" onClick={() => setIsGoogleModalOpen(true)} className="social-btn">
              <svg size={18} width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
          </div>

        {/* Auth View Switcher */}
        <div className="auth-footer-link">
          <span>Don't have an account? </span>
          <button type="button" onClick={() => setAuthView('register')} className="link-btn">
            Create account
          </button>
        </div>

        {/* App Version Tag */}
        <div className="app-version-tag">
          SyncBoard • Engineering Team • v2.4.1
        </div>
      </div>
    </div>
  </>
);
}
