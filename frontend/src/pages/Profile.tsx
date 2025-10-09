import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X, BookOpen, Users, Clock, IndianRupee } from 'lucide-react';
import { useBorrowings } from '@/hooks/useBorrowings';
import { useGroups } from '@/hooks/useGroups';
import { userService } from '@/services/userService';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Profile() {
  const currentUser = userService.getCurrentUser();
  const { borrowings } = useBorrowings();
  const { groups } = useGroups();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: '+91 98765 43210',
      address: '123 Library St, Mumbai, MH 400001'
    }
  });

  const activeBorrowings = borrowings.filter(b => b.status === 'active' || b.status === 'overdue').length;
  const totalBorrowings = borrowings.length;
  const userGroups = groups.length;
  const totalFines = borrowings.reduce((sum, b) => sum + (b.fine || 0), 0);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await userService.updateUser(currentUser.id, {
        name: data.name,
        email: data.email
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          My Profile
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Manage your account information and view your library statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-serif">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSubmit(onSubmit)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-serif font-semibold">{currentUser.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    Library Member
                  </Badge>
                </div>
              </div>

              <Separator />

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-sans">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      disabled={!isEditing}
                      className="text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-sans">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      disabled={!isEditing}
                      className="text-base"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-base font-sans">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      disabled={!isEditing}
                      className="text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-base font-sans">Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      disabled={!isEditing}
                      className="text-base"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Library Statistics</CardTitle>
              <CardDescription>Your borrowing activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-sans">Active Borrowings</span>
                </div>
                <span className="text-lg font-semibold">{activeBorrowings}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-sans">Total Borrowed</span>
                </div>
                <span className="text-lg font-semibold">{totalBorrowings}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-sans">Groups Joined</span>
                </div>
                <span className="text-lg font-semibold">{userGroups}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-sans font-medium">Outstanding Fines</span>
                </div>
                <span className={`text-lg font-semibold ${totalFines > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{totalFines}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans">Account Type</span>
                <Badge variant="default">Active Member</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans">Member Since</span>
                <span className="text-sm text-muted-foreground">January 2024</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans">Borrowing Limit</span>
                <span className="text-sm text-muted-foreground">5 books</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}