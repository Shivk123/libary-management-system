import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold tracking-tight">
                Admin Panel
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
          <Card>
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-serif font-bold tracking-tight">
                Administrator Dashboard
              </CardTitle>
              <CardDescription className="text-lg font-sans leading-relaxed max-w-2xl mx-auto">
                Manage users, books, and system settings. Monitor library operations and generate reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    Add, edit, and manage library users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Book Catalog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    Manage book inventory and catalog
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    Generate system and usage reports
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}