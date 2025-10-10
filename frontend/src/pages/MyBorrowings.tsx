import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Users, AlertTriangle, CheckCircle, IndianRupee, CreditCard } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { borrowingService } from '@/services/borrowingService';
import { calculateFine } from '@/utils/fineCalculator';
import { useState } from 'react';

export default function MyBorrowings() {
  const { borrowings, loading, error, refreshData } = useLibrary();
  const [returning, setReturning] = useState<string | null>(null);
  const [payingFine, setPayingFine] = useState<string | null>(null);
  const activeBorrowings = borrowings.filter(b => 
    b.status === 'active' || 
    b.status === 'overdue' || 
    b.status === 'return_requested' || 
    b.status === 'return_approved'
  );
  const borrowingHistory = borrowings.filter(b => b.status === 'returned');

  const handleReturnBook = async (borrowingId: string) => {
    setReturning(borrowingId);
    try {
      await borrowingService.requestReturn(borrowingId);
      await refreshData();
      alert('Return request submitted successfully. Admin will review and process your request.');
    } catch (err) {
      console.error('Failed to request return:', err);
      alert('Failed to submit return request. Please try again.');
    } finally {
      setReturning(null);
    }
  };

  const handlePayFine = async (borrowingId: string) => {
    setPayingFine(borrowingId);
    try {
      // Process payment and clear fine
      await borrowingService.payFine(borrowingId);
      alert('Fine payment completed successfully!');
      await refreshData();
    } catch (err) {
      console.error('Failed to process payment:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setPayingFine(null);
    }
  };



  const getStatusBadge = (borrowing: any) => {
    switch (borrowing.status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'return_requested':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Return Requested</Badge>;
      case 'return_approved':
        return <Badge variant="outline" className="border-green-500 text-green-600">Return Approved</Badge>;
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

      {loading.borrowings && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border rounded">
                <Skeleton className="w-12 h-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
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
                              {borrowing.type === 'individual' ? 'Individual' : (group?.name || 'Group')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(borrowing.borrowedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(borrowing.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(borrowing)}
                            {borrowing.status === 'return_requested' && borrowing.returnRequestedAt && (
                              <p className="text-xs text-blue-600">
                                Requested on {new Date(borrowing.returnRequestedAt).toLocaleDateString()}
                              </p>
                            )}
                            {borrowing.status === 'return_approved' && (
                              <p className="text-xs text-green-600">
                                Approved - Pay fine: ₹{borrowing.fine || 0}
                              </p>
                            )}
                            {(borrowing.status === 'active' || borrowing.status === 'overdue') && (
                              <p className={`text-xs ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className={`font-medium ${(borrowing.fine || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {borrowing.fine || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {borrowing.status === 'return_approved' && (borrowing.fine || 0) > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Pay
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Fine Payment Details</DialogTitle>
                                  <DialogDescription>
                                    Review and pay your fine for the returned book.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Book: {borrowing.book?.title}</h4>
                                    <p className="text-sm text-muted-foreground">by {borrowing.book?.author}</p>
                                  </div>
                                  
                                  <div className="p-4 bg-muted rounded border">
                                    <div className="flex justify-between font-bold text-lg">
                                      <span>Total Fine:</span>
                                      <span className="text-red-600">₹{borrowing.fine}</span>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    onClick={() => handlePayFine(borrowing.id)} 
                                    disabled={payingFine === borrowing.id}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                  >
                                    {payingFine === borrowing.id ? 'Processing Payment...' : `Pay ₹${borrowing.fine} Now`}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : borrowing.status === 'return_approved' ? (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              No Fine Due
                            </Badge>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleReturnBook(borrowing.id)}
                              disabled={returning === borrowing.id || (borrowing.status as any) === 'return_requested' || (borrowing.status as any) === 'return_approved'}
                            >
                              {returning === borrowing.id ? 'Requesting...' : 
                               (borrowing.status as any) === 'return_requested' ? 'Requested' : 'Request Return'}
                            </Button>
                          )}
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
                              {borrowing.type === 'individual' ? 'Individual' : (group?.name || 'Group')}
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
                            <span className={`font-medium ${(borrowing.damageFee || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {borrowing.damageFee || 0}
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