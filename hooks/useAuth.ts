import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginFormData, RegisterFormData } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('認證檢查錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        router.push('/dashboard');
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error('登錄錯誤:', error);
      return { success: false, message: '登錄過程中發生錯誤' };
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        router.push('/dashboard');
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error('註冊錯誤:', error);
      return { success: false, message: '註冊過程中發生錯誤' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('登出錯誤:', error);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
} 