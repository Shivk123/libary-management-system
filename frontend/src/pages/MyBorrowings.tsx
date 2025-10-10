import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, AlertTriangle, CheckCircle, IndianRupee } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { borrowingService } from '@/services/borrowingService';
import { calculateFine } from '@/utils/fineCalculator';
import { useState } from 'react';

export default function MyBorrowings() {
  const { borrowings, loading, error, refreshData } = useLibrary();
  const [returning, setReturning] = useState<string | null>(null);
  const activeBorrowings = borrowings.filter(b => b.status === 'active' || b.status === 'overdue');
  const borrowingHistory = borrowings.filter(b => b.status === 'returned');

  const handleReturnBook = async (borrowingId: string) => {
    setReturning(borrowingId);
    try {
      await borrowingService.returnBook(borrowingId);
      await refreshData();
    } catch (err) {
      console.error('Failed to return book:', err);
      alert('Failed to return book. Please try again.');
    } finally {
      setReturning(null);
    }
  };

  const getStatusBadge = (borrowing: any) => {
    switch (borrowing.status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'returned':
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge variant="secondary">{borrowing.status}</Badge>;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFineDetails = (borrowing: any) => {
    if (!borrowing.book) return { totalFine: 0, daysLate: 0 };
    return calculateFine(new Date(borrowing.dueDate), null, borrowing.book.price, 0);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          My Borrowings
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Manage your current borrowings and view your borrowing history
        </p>
      </div>

      {loading.borrowings && <div>Loading borrowings...</div>}
      {error && <div>Error: {error}</div>}
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Borrowings ({activeBorrowings.length})</TabsTrigger>
          <TabsTrigger value="history">Borrowing History ({borrowingHistory.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBorrowings.map((borrowing) => {
                    const book = borrowing.book;
                    const group = borrowing.group;
                    const daysRemaining = getDaysRemaining(borrowing.dueDate);
                    const fineDetails = getFineDetails(borrowing);
                    
                    if (!book) return null;

                    return (
                      <TableRow key={borrowing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-sm text-muted-foreground">by {book.author}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {borrowing.type === 'individual' ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Users className="h-4 w-4" />
                            )}
                            <span className="text-sm">
                              {borrowing.type === 'individual' ? 'Individual' : group?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(borrowing.borrowedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(borrowing.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(borrowing)}
                            <p className={`text-xs ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className={`font-medium ${fineDetails.totalFine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {fineDetails.totalFine}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm"
                            onClick={() => handleReturnBook(borrowing.id)}
                            disabled={returning === borrowing.id}
                          >
                            {returning === borrowing.id ? 'Returning...' : 'Return'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {activeBorrowings.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">No Active Borrowings</h3>
                  <p className="text-muted-foreground">
                    You don't have any books currently borrowed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowingHistory.map((borrowing) => {
                    const book = borrowing.book;
                    const group = borrowing.group;
                    
                    if (!book) return null;

                    return (
                      <TableRow key={borrowing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-sm text-muted-foreground">by {book.author}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {borrowing.type === 'individual' ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Users className="h-4 w-4" />
                            )}
                            <span className="text-sm">
                              {borrowing.type === 'individual' ? 'Individual' : group?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(borrowing.borrowedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {borrowing.returnedAt ? new Date(borrowing.returnedAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(borrowing)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className="font-medium">
                              {borrowing.fine || 0}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {borrowingHistory.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">No Borrowing History</h3>
                  <p className="text-muted-foreground">
                    You haven't returned any books yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}