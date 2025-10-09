import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Users, TrendingUp, AlertTriangle, Download, Settings, IndianRupee } from 'lucide-react';
import { mockBorrowings } from '@/data/borrowings';
import { mockBooks } from '@/data/books';
import { mockGroups, mockUsers } from '@/data/groups';
import type { FineSettings } from '@/types/fineSettings';

export default function Reports() {
  const [fineSettings, setFineSettings] = useState<FineSettings>({
    lateFeePenalty: 50,
    missingBookPercentage: 200,
    smallDamagePercentage: 10,
    largeDamagePercentage: 50
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FineSettings>({
    defaultValues: fineSettings
  });

  const totalBooks = mockBooks.length;
  const totalUsers = mockUsers.length;
  const activeBorrowings = mockBorrowings.filter(b => b.status === 'active').length;
  const overdueBorrowings = mockBorrowings.filter(b => b.status === 'overdue').length;
  const totalFines = mockBorrowings.reduce((sum, b) => sum + (b.fine || 0), 0);
  const totalGroups = mockGroups.length;

  const onSubmitSettings = (data: FineSettings) => {
    setFineSettings(data);
    setIsSettingsOpen(false);
  };

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
              Reports & Analytics
            </h1>
            <p className="text-xl font-sans text-muted-foreground">
              Library statistics and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
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
                <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-4">
                  <div>
                    <Label htmlFor="lateFeePenalty" className="text-base font-sans">Late Fee (per day)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lateFeePenalty"
                        type="number"
                        {...register('lateFeePenalty', { required: true, min: 0 })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="missingBookPercentage" className="text-base font-sans">Missing Book Fine (%)</Label>
                    <Input
                      id="missingBookPercentage"
                      type="number"
                      {...register('missingBookPercentage', { required: true, min: 0, max: 500 })}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smallDamagePercentage" className="text-base font-sans">Small Damage (%)</Label>
                    <Input
                      id="smallDamagePercentage"
                      type="number"
                      {...register('smallDamagePercentage', { required: true, min: 0, max: 100 })}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="largeDamagePercentage" className="text-base font-sans">Large Damage (%)</Label>
                    <Input
                      id="largeDamagePercentage"
                      type="number"
                      {...register('largeDamagePercentage', { required: true, min: 0, max: 100 })}
                      placeholder="50"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Save Settings</Button>
                    <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button size="lg">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Available in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Borrowings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBorrowings}</div>
            <p className="text-xs text-muted-foreground">
              Currently borrowed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueBorrowings}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Popular Books</CardTitle>
            <CardDescription>Most borrowed books this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Borrows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{book.borrowCount}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif">Recent Activity</CardTitle>
          <CardDescription>Latest borrowing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBorrowings.map((borrowing) => {
                const book = mockBooks.find(b => b.id === borrowing.bookId);
                const user = mockUsers.find(u => u.id === borrowing.borrowerId);
                
                return (
                  <TableRow key={borrowing.id}>
                    <TableCell className="font-medium">{book?.title}</TableCell>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>
                      <Badge variant={borrowing.type === 'individual' ? 'default' : 'secondary'}>
                        {borrowing.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{borrowing.borrowedAt.toLocaleDateString()}</TableCell>
                    <TableCell>{borrowing.dueDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        borrowing.status === 'active' ? 'default' :
                        borrowing.status === 'overdue' ? 'destructive' : 'secondary'
                      }>
                        {borrowing.status}
                      </Badge>
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