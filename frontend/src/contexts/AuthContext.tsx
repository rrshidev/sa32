import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { type User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, phone: string, role: 'client' | 'service', city?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('AuthContext: loadUser called, token present:', !!token);
      if (token) {
        console.log('AuthContext: Fetching user profile with token');
        const response = await apiClient.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('AuthContext: User profile loaded:', response.data);
        setUser(response.data);
      } else {
        console.log('AuthContext: No token found, user not loaded');
      }
    } catch (error) {
      console.error('AuthContext: Failed to load user', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('AuthContext - Initial useEffect:', { token: !!token, loading });
    if (token) {
      // Загрузка данных пользователя при наличии токена
      loadUser();
    } else {
      console.log('AuthContext - No token, setting loading to false');
      setLoading(false);
    }
  }, [loadUser]);

  const register = async (email: string, password: string, phone: string, role: 'client' | 'service', city?: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      phone,
      role,
      city
    });
    localStorage.setItem('authToken', response.data.access_token);
    await loadUser();
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('authToken', response.data.access_token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
