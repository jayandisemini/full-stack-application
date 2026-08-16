import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default logged in as Sarah Chen (Frontend Lead) as in the screenshots
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('syncboard_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Sarah Chen',
      email: 'sarah.chen@syncboard.dev',
      role: 'Frontend Lead',
      initials: 'SC'
    };
  });

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('syncboard_logged_in');
    return saved === null ? true : saved === 'true';
  });

  const login = (email, password) => {
    const namePart = email.split('@')[0];
    const nameFormatted = namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, str => str.toUpperCase());
    const newUser = {
      name: nameFormatted || 'Sarah Chen',
      email,
      role: 'Engineering Lead',
      initials: (namePart.substring(0, 2) || 'SC').toUpperCase()
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('syncboard_user', JSON.stringify(newUser));
    localStorage.setItem('syncboard_logged_in', 'true');
  };

  const register = (fullName, email, role) => {
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SC';
    const newUser = { name: fullName, email, role: role || 'Software Engineer', initials };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('syncboard_user', JSON.stringify(newUser));
    localStorage.setItem('syncboard_logged_in', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('syncboard_logged_in', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authView,
        setAuthView,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
