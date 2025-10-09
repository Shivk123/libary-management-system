import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '@/data/groups';
import { mockBorrowings } from '@/data/borrowings';
import PageHeader from '@/components/shared/PageHeader';
import SearchInput from '@/components/shared/SearchInput';
import DataTable from '@/components/tables/DataTable';

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

  const userColumns = [
    { key: 'name', header: 'Name', render: (user: any) => <span className="font-medium">{user.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'borrowings', header: 'Active Borrowings', render: (user: any) => getUserBorrowings(user.id) },
    { key: 'fines', header: 'Outstanding Fines', render: (user: any) => {
      const fines = getUserFines(user.id);
      return <span className={fines > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>${fines}</span>;
    }},
    { key: 'status', header: 'Status', render: (user: any) => {
      const fines = getUserFines(user.id);
      return <Badge variant={fines > 0 ? 'destructive' : 'default'}>
        {fines > 0 ? 'Has Fines' : 'Good Standing'}
      </Badge>;
    }},
    { key: 'actions', header: 'Actions', className: 'text-right', render: () => (
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
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
        actions={<SearchInput placeholder="Search users..." value={searchQuery} onChange={setSearchQuery} />}
      />
    </div>
  );
}