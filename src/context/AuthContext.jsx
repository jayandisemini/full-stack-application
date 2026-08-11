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
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (email, password) => {
    const newUser = {
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email,
      role: 'Engineering Team',
      initials: email.substring(0, 2).toUpperCase()
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('syncboard_user', JSON.stringify(newUser));
  };

  const register = (fullName, email, role) => {
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const newUser = { name: fullName, email, role, initials };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('syncboard_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
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
