import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold tracking-tight">
                My Library
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
                Welcome to Your Library
              </CardTitle>
              <CardDescription className="text-lg font-sans leading-relaxed max-w-2xl mx-auto">
                Browse books, manage your borrowings, and discover new titles in our collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Browse Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    Search and discover books in our catalog
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">My Borrowings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    View your current and past borrowings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-sans text-muted-foreground">
                    Manage your book reservations
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