"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Inline simple notification system
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

const NotificationContext = createContext<{
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
} | undefined>(undefined);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      {/* Simple notification display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-black' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="font-semibold">{notification.title}</div>
            {notification.message && <div className="text-sm">{notification.message}</div>}
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 text-lg font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Inline simple auth context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
}

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login for demo
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'demo@cyberscope.com',
        role: 'admin',
        avatar: 'DU'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  
  if (!auth) return null;
  
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-slate-900">
            {children}
          </div>
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
