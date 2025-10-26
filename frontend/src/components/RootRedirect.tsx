import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function RootRedirect() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
}