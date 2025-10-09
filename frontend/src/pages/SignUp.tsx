import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-serif font-bold tracking-tight">
            Join our library
          </CardTitle>
          <CardDescription className="text-base font-sans leading-relaxed">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium font-sans">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="font-sans"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium font-sans">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="font-sans"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium font-sans">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                className="font-sans"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm font-sans text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="font-medium text-primary hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}