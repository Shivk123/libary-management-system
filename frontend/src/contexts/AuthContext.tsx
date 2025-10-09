import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, UserRole, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (email: string, password: string) => {
    // Mock authentication logic
    const role: UserRole = email.includes('admin') || email === 'admin@library.com' ? 'admin' : 'user';
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role
    };
    
    setUser(mockUser);
    navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}