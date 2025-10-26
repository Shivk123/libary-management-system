import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RootRedirect } from './components/RootRedirect';
import { AuthRedirect } from './components/AuthRedirect';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <UserProvider>
        <LibraryProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/signin" element={<AuthRedirect><SignIn /></AuthRedirect>} />
              <Route path="/signup" element={<AuthRedirect><SignUp /></AuthRedirect>} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
        </LibraryProvider>
      </UserProvider>
    </Router>
  );
}

export default App
