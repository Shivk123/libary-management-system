import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '@/data/groups';
import { mockBorrowings } from '@/data/borrowings';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserBorrowings = (userId: string) => {
    return mockBorrowings.filter(b => b.borrowerId === userId && b.status === 'active').length;
  };

  const getUserFines = (userId: string) => {
    return mockBorrowings
      .filter(b => b.borrowerId === userId)
      .reduce((sum, b) => sum + (b.fine || 0), 0);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          User Management
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Manage library users and their accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-serif">All Users</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-sans">Name</TableHead>
                <TableHead className="text-base font-sans">Email</TableHead>
                <TableHead className="text-base font-sans">Active Borrowings</TableHead>
                <TableHead className="text-base font-sans">Outstanding Fines</TableHead>
                <TableHead className="text-base font-sans">Status</TableHead>
                <TableHead className="text-right text-base font-sans">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const activeBorrowings = getUserBorrowings(user.id);
                const fines = getUserFines(user.id);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-base">{user.name}</TableCell>
                    <TableCell className="text-base">{user.email}</TableCell>
                    <TableCell className="text-base">{activeBorrowings}</TableCell>
                    <TableCell className="text-base">
                      <span className={fines > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        ${fines}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={fines > 0 ? 'destructive' : 'default'}>
                        {fines > 0 ? 'Has Fines' : 'Good Standing'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}