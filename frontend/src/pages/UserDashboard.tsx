import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Search, BookOpen, Clock, Bookmark, User, LogOut } from 'lucide-react';
import BrowseBooks from './BrowseBooks';
import { useState } from 'react';

const menuItems = [
  { title: 'Browse Books', icon: Search, key: 'browse' },
  { title: 'My Borrowings', icon: BookOpen, key: 'borrowings' },
  { title: 'Reservations', icon: Bookmark, key: 'reservations' },
  { title: 'History', icon: Clock, key: 'history' },
  { title: 'Profile', icon: User, key: 'profile' },
];

export default function UserDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'browse':
        return <BrowseBooks />;
      default:
        return (
          <div className="p-6">
            <Card>
              <CardHeader className="text-center space-y-6">
                <CardTitle className="text-5xl font-serif font-bold tracking-tight">
                  Welcome to Your Library
                </CardTitle>
                <CardDescription className="text-xl font-sans leading-relaxed max-w-3xl mx-auto">
                  Browse our extensive collection, manage your borrowings, and discover new titles tailored to your interests.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('browse')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <Search className="h-7 w-7" />
                      Browse Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      Search and discover thousands of books in our digital catalog
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('borrowings')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <BookOpen className="h-7 w-7" />
                      My Borrowings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      View and manage your current and past book borrowings
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('reservations')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <Bookmark className="h-7 w-7" />
                      Reservations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      Reserve books and manage your waiting list preferences
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-2xl font-serif font-bold px-4 py-2">
              My Library
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-sans">Library Services</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveView('dashboard')}
                      className="text-base font-sans"
                    >
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => setActiveView(item.key)}
                        className="text-base font-sans"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/signin" className="text-base font-sans">
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="border-b p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-3xl font-serif font-bold tracking-tight">
                My Library Dashboard
              </h1>
            </div>
          </header>
          
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}