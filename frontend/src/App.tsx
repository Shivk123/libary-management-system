import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { LibraryProvider } from './contexts/LibraryContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <LibraryProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
            </Routes>
          </LibraryProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
