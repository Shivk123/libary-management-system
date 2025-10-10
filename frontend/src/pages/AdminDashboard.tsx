import { useState } from 'react';
import { Users, BookOpen, BarChart3, RotateCcw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHome from '@/components/layout/DashboardHome';
import BookCatalog from './BookCatalog';
import UserManagement from './UserManagement';
import Reports from './Reports';
import ReturnRequests from './ReturnRequests';

const menuItems = [
  { title: 'User Management', icon: Users, key: 'users' },
  { title: 'Book Catalog', icon: BookOpen, key: 'books' },
  { title: 'Return Requests', icon: RotateCcw, key: 'returns' },
  { title: 'Reports', icon: BarChart3, key: 'reports' },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Manage library users, view borrowing status, and handle fines',
      icon: Users,
      onClick: () => setActiveView('users')
    },
    {
      title: 'Book Catalog',
      description: 'Add, edit, and manage book inventory with detailed information',
      icon: BookOpen,
      onClick: () => setActiveView('books')
    },
    {
      title: 'Analytics & Reports',
      description: 'View library statistics, popular books, and financial reports',
      icon: BarChart3,
      onClick: () => setActiveView('reports')
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'books':
        return <BookCatalog />;
      case 'returns':
        return <ReturnRequests />;
      case 'reports':
        return <Reports />;
      case 'dashboard':
        return (
          <DashboardHome
            title="Welcome, Administrator"
            description="Manage users, books, and system settings. Monitor library operations and generate comprehensive reports."
            cards={dashboardCards}
          />
        );

      default:
        return (
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">Coming Soon</h2>
              <p className="text-lg text-muted-foreground">This feature is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      title="Admin Panel"
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {renderContent()}
    </DashboardLayout>
  );
}