import { Link, useNavigate } from 'react-router-dom';
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
import { Users, BookOpen, BarChart3, Settings, LogOut } from 'lucide-react';
import BookCatalog from './BookCatalog';
import { useState } from 'react';

const menuItems = [
  { title: 'User Management', icon: Users, key: 'users' },
  { title: 'Book Catalog', icon: BookOpen, key: 'books' },
  { title: 'Reports', icon: BarChart3, key: 'reports' },
  { title: 'Settings', icon: Settings, key: 'settings' },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'books':
        return <BookCatalog />;
      default:
        return (
          <div className="p-6">
            <Card>
              <CardHeader className="text-center space-y-6">
                <CardTitle className="text-5xl font-serif font-bold tracking-tight">
                  Welcome, Administrator
                </CardTitle>
                <CardDescription className="text-xl font-sans leading-relaxed max-w-3xl mx-auto">
                  Manage users, books, and system settings. Monitor library operations and generate comprehensive reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('users')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <Users className="h-7 w-7" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      Add, edit, and manage library users and their permissions
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('books')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <BookOpen className="h-7 w-7" />
                      Book Catalog
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      Manage book inventory, catalog, and availability status
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('reports')}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <BarChart3 className="h-7 w-7" />
                      Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                      Generate detailed system and usage analytics reports
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
              Admin Panel
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-sans">Management</SidebarGroupLabel>
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
                Administrator Dashboard
              </h1>
            </div>
          </header>
          
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}