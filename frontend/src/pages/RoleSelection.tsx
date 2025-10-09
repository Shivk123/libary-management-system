import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg font-sans text-muted-foreground leading-relaxed">
            Select how you'd like to access the library management system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl font-serif font-bold">
                Administrator
              </CardTitle>
              <CardDescription className="text-base font-sans leading-relaxed">
                Full system access to manage users, books, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm font-sans text-muted-foreground space-y-2">
                <li>• Manage user accounts</li>
                <li>• Add and edit books</li>
                <li>• Generate reports</li>
                <li>• System configuration</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/admin/dashboard">Continue as Admin</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl font-serif font-bold">
                Library User
              </CardTitle>
              <CardDescription className="text-base font-sans leading-relaxed">
                Browse books, manage borrowings, and access your library account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm font-sans text-muted-foreground space-y-2">
                <li>• Browse book catalog</li>
                <li>• Borrow and return books</li>
                <li>• View borrowing history</li>
                <li>• Make reservations</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/user/dashboard">Continue as User</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm font-sans text-muted-foreground">
            Need to sign out?{' '}
            <Link to="/signin" className="text-primary hover:underline">
              Return to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}