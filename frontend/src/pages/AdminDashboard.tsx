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
import { Users, BookOpen, BarChart3, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { title: 'User Management', icon: Users, url: '#' },
  { title: 'Book Catalog', icon: BookOpen, url: '#' },
  { title: 'Reports', icon: BarChart3, url: '#' },
  { title: 'Settings', icon: Settings, url: '#' },
];

export default function AdminDashboard() {
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
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="text-base font-sans">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
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
                <Card className="hover:shadow-lg transition-shadow">
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
                <Card className="hover:shadow-lg transition-shadow">
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
                <Card className="hover:shadow-lg transition-shadow">
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
        </main>
      </div>
    </SidebarProvider>
  );
}