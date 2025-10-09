import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Users, TrendingUp, AlertTriangle, Download, Settings, IndianRupee } from 'lucide-react';
import { mockBorrowings } from '@/data/borrowings';
import { mockBooks } from '@/data/books';
import { mockGroups, mockUsers } from '@/data/groups';
import type { FineSettings } from '@/types/fineSettings';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/tables/DataTable';
import FineSettingsForm from '@/components/forms/FineSettingsForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Reports() {
  const [fineSettings, setFineSettings] = useLocalStorage<FineSettings>('fineSettings', {
    lateFeePenalty: 50,
    missingBookPercentage: 200,
    smallDamagePercentage: 10,
    largeDamagePercentage: 50
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const totalBooks = mockBooks.length;
  const totalUsers = mockUsers.length;
  const activeBorrowings = mockBorrowings.filter(b => b.status === 'active').length;
  const overdueBorrowings = mockBorrowings.filter(b => b.status === 'overdue').length;
  const totalFines = mockBorrowings.reduce((sum, b) => sum + (b.fine || 0), 0);
  const totalGroups = mockGroups.length;

  const handleFineSettingsSubmit = (data: FineSettings) => {
    setFineSettings(data);
    setIsSettingsOpen(false);
  };

  const statsData = [
    { title: 'Total Books', value: totalBooks, description: 'Available in catalog', icon: BookOpen },
    { title: 'Active Users', value: totalUsers, description: 'Registered members', icon: Users },
    { title: 'Active Borrowings', value: activeBorrowings, description: 'Currently borrowed', icon: TrendingUp },
    { title: 'Overdue Items', value: overdueBorrowings, description: 'Need attention', icon: AlertTriangle, valueColor: 'text-red-600' }
  ];

  const popularBooks = mockBooks
    .map(book => ({
      ...book,
      borrowCount: mockBorrowings.filter(b => b.bookId === book.id).length
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  const recentBorrowings = mockBorrowings
    .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
    .slice(0, 10);

  const popularBooksColumns = [
    { key: 'title', header: 'Title', render: (book: any) => <span className="font-medium">{book.title}</span> },
    { key: 'author', header: 'Author' },
    { key: 'borrowCount', header: 'Borrows', className: 'text-right', render: (book: any) => <Badge variant="secondary">{book.borrowCount}</Badge> }
  ];

  const recentBorrowingsColumns = [
    { key: 'bookTitle', header: 'Book', render: (borrowing: any) => {
      const book = mockBooks.find(b => b.id === borrowing.bookId);
      return <span className="font-medium">{book?.title}</span>;
    }},
    { key: 'borrowerName', header: 'Borrower', render: (borrowing: any) => {
      const user = mockUsers.find(u => u.id === borrowing.borrowerId);
      return user?.name;
    }},
    { key: 'type', header: 'Type', render: (borrowing: any) => (
      <Badge variant={borrowing.type === 'individual' ? 'default' : 'secondary'}>
        {borrowing.type}
      </Badge>
    )},
    { key: 'borrowedAt', header: 'Date', render: (borrowing: any) => borrowing.borrowedAt.toLocaleDateString() },
    { key: 'dueDate', header: 'Due Date', render: (borrowing: any) => borrowing.dueDate.toLocaleDateString() },
    { key: 'status', header: 'Status', render: (borrowing: any) => (
      <Badge variant={
        borrowing.status === 'active' ? 'default' :
        borrowing.status === 'overdue' ? 'destructive' : 'secondary'
      }>
        {borrowing.status}
      </Badge>
    )}
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Reports & Analytics"
        description="Library statistics and performance metrics"
        actions={
          <>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Settings className="h-5 w-5 mr-2" />
                  Fine Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Fine Management</DialogTitle>
                </DialogHeader>
                <FineSettingsForm
                  defaultValues={fineSettings}
                  onSubmit={handleFineSettingsSubmit}
                  onCancel={() => setIsSettingsOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button size="lg">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Popular Books</CardTitle>
            <CardDescription>Most borrowed books this month</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              title=""
              data={popularBooks}
              columns={popularBooksColumns}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Fine System Overview</CardTitle>
            <CardDescription>Current fine settings and financial summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium font-sans">Late Fee (per day)</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-lg font-bold">{fineSettings.lateFeePenalty}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium font-sans">Missing Book Fine</p>
                <span className="text-lg font-bold">{fineSettings.missingBookPercentage}%</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium font-sans">Small Damage</p>
                <span className="text-lg font-bold">{fineSettings.smallDamagePercentage}%</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium font-sans">Large Damage</p>
                <span className="text-lg font-bold">{fineSettings.largeDamagePercentage}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-base font-sans">Total Outstanding Fines</span>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{totalFines}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-sans">Active Groups</span>
              <span className="text-2xl font-bold">{totalGroups}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-sans">Average Books per User</span>
              <span className="text-2xl font-bold">
                {(mockBorrowings.length / totalUsers).toFixed(1)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Recent Activity"
        data={recentBorrowings}
        columns={recentBorrowingsColumns}
      />
    </div>
  );
}