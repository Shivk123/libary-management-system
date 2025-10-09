import { useState } from 'react';
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHome from '@/components/layout/DashboardHome';
import BookCatalog from './BookCatalog';
import BorrowersTable from '@/components/userTable';
import LibraryPage from '@/components/adminTableData';

const menuItems = [
  { title: 'User Management', icon: Users, key: 'users' },
  { title: 'Book Catalog', icon: BookOpen, key: 'books' },
  { title: 'Reports', icon: BarChart3, key: 'reports' },
  { title: 'Settings', icon: Settings, key: 'settings' },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Add, edit, and manage library users and their permissions',
      icon: Users,
      onClick: () => setActiveView('users')
    },
    {
      title: 'Book Catalog',
      description: 'Manage book inventory, catalog, and availability status',
      icon: BookOpen,
      onClick: () => setActiveView('books')
    },
    {
      title: 'Analytics & Reports',
      description: 'Generate detailed system and usage analytics reports',
      icon: BarChart3,
      onClick: () => setActiveView('reports')
    },
    {
      title: 'Settings',
      description: 'A',
      icon: BarChart3,
      onClick: () => setActiveView('settings')
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'books':
        return <BookCatalog />;
      case 'users':
        return <BorrowersTable />;
      case 'reports':
        return < LibraryPage />;
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