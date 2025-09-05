import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { type User } from '../types';

interface AuthContextType {
  user: User | null;
  register: (email: string, password: string, phone: string, role: 'client' | 'service') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiClient.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user', error);
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Загрузка данных пользователя при наличии токена
      loadUser();
    }
  }, [loadUser]);

  const register = async (email: string, password: string, phone: string, role: 'client' | 'service') => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      phone,
      role
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
    <AuthContext.Provider value={{ user, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
