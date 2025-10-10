import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/userService';
import type { User, UserRole, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { user } = await userService.signIn(email, password);
      const role: UserRole = (user.role as UserRole) || (email === 'admin@library.com' ? 'admin' : 'user');
      const authUser: User = { ...user, role };
      
      setUser(authUser);
      // Trigger custom event to notify UserContext
      window.dispatchEvent(new Event('auth-change'));
      
      // Small delay to ensure UserContext updates before navigation
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { user } = await userService.signUp(name, email, password);
      const role: UserRole = (user.role as UserRole) || 'user';
      const authUser: User = { ...user, role };
      
      setUser(authUser);
      // Trigger custom event to notify UserContext
      window.dispatchEvent(new Event('auth-change'));
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await userService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
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