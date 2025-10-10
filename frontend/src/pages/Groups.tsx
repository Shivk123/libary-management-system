import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus } from 'lucide-react';
import { useUserGroups } from '@/hooks/useUserGroups';
import { userService } from '@/services/userService';
import { groupsService } from '@/services/groupsService';
import { useUser } from '@/contexts/UserContext';
import type { Group } from '@/types/borrowing';

interface GroupFormData {
  name: string;
  description: string;
}

export default function Groups() {
  const { groups, loading, error, refetch } = useUserGroups();
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { register, handleSubmit, reset } = useForm<GroupFormData>();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await userService.getUsers();
        // Filter out admin users and current user from member selection
        setUsers(allUsers.filter(u => u.role !== 'admin' && u.id !== currentUser?.id));
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    if (isCreateOpen) {
      fetchUsers();
    }
  }, [isCreateOpen, currentUser]);

  const onSubmit = async (data: GroupFormData) => {
    if (!currentUser) return;
    
    try {
      setCreating(true);
      await groupsService.createGroup({
        name: data.name,
        description: data.description,
        createdBy: currentUser.id,
        members: [...selectedMembers, currentUser.id]
      });
      setIsCreateOpen(false);
      reset();
      setSelectedMembers([]);
      await refetch(); // Refresh to show new group
    } catch (err) {
      console.error('Failed to create group:', err);
      alert('Failed to create group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : prev.length < 5 ? [...prev, userId] : prev
    );
  };

  const getMemberNames = (members: any[]) => {
    return members.map(member => member.user?.name || 'Unknown').filter(Boolean);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
            My Groups
          </h1>
          <p className="text-xl font-sans text-muted-foreground">
            Create and manage borrowing groups (3-6 members)
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base font-sans">Group Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: true })}
                    placeholder="Enter group name"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-base font-sans">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description', { required: true })}
                    placeholder="Describe your group's purpose"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label className="text-base font-sans">
                    Select Members ({selectedMembers.length}/5)
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Groups need 3-6 members total (including you)
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 border rounded-lg">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={user.id}
                          checked={selectedMembers.includes(user.id)}
                          onCheckedChange={() => toggleMember(user.id)}
                          disabled={!selectedMembers.includes(user.id) && selectedMembers.length >= 5}
                        />
                        <Label htmlFor={user.id} className="text-sm">
                          {user.name} ({user.email})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={creating || selectedMembers.length < 2 || selectedMembers.length > 5}
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <div>Loading groups...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-serif flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
              </CardTitle>
              <CardDescription className="text-base font-sans">
                {group.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-sans font-medium mb-2">
                  Members ({group.members?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {getMemberNames(group.members || []).map((name, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Created {new Date(group.createdAt).toLocaleDateString()}
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="text-xs">
                  Group Borrowing: 6 months limit
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}