import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold tracking-tight">
                Library Management System
              </h1>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign out</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="h-96">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-serif font-bold tracking-tight">
                Welcome to your Dashboard
              </CardTitle>
              <CardDescription className="text-lg font-sans leading-relaxed max-w-2xl mx-auto">
                Manage your library resources, track borrowings, and oversee your collection from this central hub.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <p className="text-base font-sans text-muted-foreground leading-relaxed">
                  Your dashboard content will appear here once you start using the system.
                </p>
                <p className="text-sm font-sans text-muted-foreground">
                  Get started by exploring the navigation menu above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}