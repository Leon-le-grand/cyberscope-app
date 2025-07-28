import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  lastLogin?: string;
  scanQuota?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check localStorage for stored user data
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('cyberscope_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data - in real app, this would come from your backend
      const mockUser: User = {
        id: '1',
        name: email === 'admin@cyberscope.com' ? 'Admin User' : 'John Doe',
        email,
        role: email === 'admin@cyberscope.com' ? 'admin' : 'user',
        avatar: email === 'admin@cyberscope.com' ? 'AU' : 'JD',
        lastLogin: new Date().toISOString(),
        scanQuota: email === 'admin@cyberscope.com' ? 1000 : 100
      };

      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('cyberscope_user', JSON.stringify(mockUser));
        localStorage.setItem('cyberscope_token', 'mock-jwt-token');
      }
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'user',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        lastLogin: new Date().toISOString(),
        scanQuota: 100
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('cyberscope_user', JSON.stringify(newUser));
        localStorage.setItem('cyberscope_token', 'mock-jwt-token');
      }
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cyberscope_user');
      localStorage.removeItem('cyberscope_token');
      localStorage.removeItem('scanHistory');
      localStorage.removeItem('savedTargets');
    }
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberscope_user', JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}> = ({ children, requiredRole }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // For demo purposes, auto-login with default user
    // In real app, redirect to login page
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Demo Mode</h1>
          <p className="text-slate-400 mb-4">Dashboard will load with demo user</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
