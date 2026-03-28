'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mocking a logged-in user for demonstration
  const [user, setUser] = useState<User | null>({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Aman Husain',
    email: 'demo@knowledgeforge.ai',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const login = () => setUser({ id: '1', name: 'Aman', email: 'demo@knowledgeforge.ai', role: 'admin' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
