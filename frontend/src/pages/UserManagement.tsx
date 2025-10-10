import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Edit, Plus, IndianRupee } from 'lucide-react';
import { userService } from '@/services/userService';
import PageHeader from '@/components/shared/PageHeader';
import SearchInput from '@/components/shared/SearchInput';
import DataTable from '@/components/tables/DataTable';

interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, data);
      } else {
        await userService.createUser(data);
      }
      await fetchUsers();
      setIsCreateOpen(false);
      setEditingUser(null);
      reset();
    } catch (err) {
      console.error('Failed to save user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsCreateOpen(true);
  };



  const handleCreateNew = () => {
    setEditingUser(null);
    reset({ name: '', email: '', phone: '', address: '' });
    setIsCreateOpen(true);
  };

  const userColumns = [
    { key: 'name', header: 'Name', render: (user: any) => <span className="font-medium">{user.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (user: any) => user.phone || '-' },
    { key: 'role', header: 'Role', render: (user: any) => (
      <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
        {user.role || 'user'}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', className: 'text-right', render: (user: any) => (
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    )}
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="User Management"
        description="Manage library users and their accounts"
      />

      <DataTable
        title="All Users"
        data={filteredUsers}
        columns={userColumns}
        loading={loading}
        actions={
          <div className="flex gap-2">
            <SearchInput placeholder="Search users..." value={searchQuery} onChange={setSearchQuery} />
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register('phone', {
                        pattern: {
                          value: /^[+]?[0-9\s-()]{10,15}$/,
                          message: 'Invalid phone number format'
                        }
                      })}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register('address', {
                        minLength: { value: 10, message: 'Address must be at least 10 characters' }
                      })}
                      placeholder="Enter address"
                    />
                    {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={Object.keys(errors).length > 0}>
                      {editingUser ? 'Update' : 'Create'} User
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
    </div>
  );
}