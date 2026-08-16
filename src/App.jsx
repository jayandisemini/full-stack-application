import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import AuthLayout from './components/Auth/AuthLayout';
import AppLayout from './components/Layout/AppLayout';

function MainAppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppLayout /> : <AuthLayout />;
}

export default function App() {
  const googleClientId = "123456789-example.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <TasksProvider>
            <MainAppContent />
          </TasksProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
