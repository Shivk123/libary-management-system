import { useState } from 'react';
import { Search, BookOpen, Clock, User, Users, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHome from '@/components/layout/DashboardHome';
import BrowseBooks from './BrowseBooks';
import Groups from './Groups';
import MyBorrowings from './MyBorrowings';
import History from './History';
import Profile from './Profile';
import Feedback from './Feedback';

const menuItems = [
  { title: 'Browse Books', icon: Search, key: 'browse' },
  { title: 'My Groups', icon: Users, key: 'groups' },
  { title: 'My Borrowings', icon: BookOpen, key: 'borrowings' },
  { title: 'Feedback', icon: MessageSquare, key: 'feedback' },
  { title: 'History', icon: Clock, key: 'history' },
  { title: 'Profile', icon: User, key: 'profile' },
];

export default function UserDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const dashboardCards = [
    {
      title: 'Browse Books',
      description: 'Search and discover thousands of books in our digital catalog',
      icon: Search,
      onClick: () => setActiveView('browse')
    },
    {
      title: 'My Groups',
      description: 'Create and manage borrowing groups for extended loan periods',
      icon: Users,
      onClick: () => setActiveView('groups')
    },
    {
      title: 'My Borrowings',
      description: 'View and manage your current book borrowings and due dates',
      icon: BookOpen,
      onClick: () => setActiveView('borrowings')
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'browse':
        return <BrowseBooks />;
      case 'groups':
        return <Groups />;
      case 'borrowings':
        return <MyBorrowings />;
      case 'feedback':
        return <Feedback />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'dashboard':
        return (
          <DashboardHome
            title="Welcome to Your Library"
            description="Browse our extensive collection, manage your borrowings, and discover new titles tailored to your interests."
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
      title="My Library"
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {renderContent()}
    </DashboardLayout>
  );
}