import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Home } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  key: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  menuItems: MenuItem[];
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function DashboardLayout({
  children,
  title,
  menuItems,
  activeView,
  onViewChange
}: DashboardLayoutProps) {
  const { user, signOut } = useUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-serif font-bold">{title}</h2>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-base font-sans">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => onViewChange('dashboard')}
                      isActive={activeView === 'dashboard'}
                      className="text-base font-sans"
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => onViewChange(item.key)}
                        isActive={activeView === item.key}
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
          
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="text-base font-sans">
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
          </header>
          
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}