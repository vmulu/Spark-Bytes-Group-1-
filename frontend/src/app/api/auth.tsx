"use client";

import { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

// Define the User interface matching the backend User model
export interface User {
  user_id: string;
  created_at: number;
  is_vegan: boolean;
  is_halal: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateUser = (user: User | null) => {
    setUser(user);
  };

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/protected', { withCredentials: true });
      setUser(response.data as User);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const logout = async () => {
  await axiosInstance.get('/logout', { withCredentials: true });
};
