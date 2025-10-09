import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, AlertTriangle, CheckCircle, IndianRupee } from 'lucide-react';
import { useBorrowings } from '@/hooks/useBorrowings';
import { borrowingService } from '@/services/borrowingService';
import { calculateFine } from '@/utils/fineCalculator';
import { useState } from 'react';

export default function MyBorrowings() {
  const { borrowings, loading, error, refetch } = useBorrowings();
  const [returning, setReturning] = useState<string | null>(null);
  const activeBorrowings = borrowings.filter(b => b.status === 'active' || b.status === 'overdue');

  const handleReturnBook = async (borrowingId: string) => {
    setReturning(borrowingId);
    try {
      await borrowingService.returnBook(borrowingId);
      await refetch(); // Refresh the borrowings list
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
          Manage your current book borrowings
        </p>
      </div>

      {loading && <div>Loading borrowings...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="space-y-6">
        {activeBorrowings.map((borrowing) => {
          const book = borrowing.book;
          const group = borrowing.group;
          const daysRemaining = getDaysRemaining(borrowing.dueDate);
          const fineDetails = getFineDetails(borrowing);
          
          if (!book) return null;

          return (
            <Card key={borrowing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <CardTitle className="text-xl font-serif mb-2">
                        {book.title}
                      </CardTitle>
                      <p className="text-base font-sans text-muted-foreground mb-2">
                        by {book.author}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        {borrowing.type === 'individual' ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                        <span className="text-sm font-sans">
                          {borrowing.type === 'individual' ? 'Individual' : `Group: ${group?.name}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(borrowing)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium font-sans">Borrowed</p>
                    <p className="text-muted-foreground">
                      {new Date(borrowing.borrowedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium font-sans">Due Date</p>
                    <p className="text-muted-foreground">
                      {new Date(borrowing.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium font-sans">Days Remaining</p>
                    <p className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium font-sans">Fine</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <p className={`font-medium ${fineDetails.totalFine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {fineDetails.totalFine}
                      </p>
                    </div>
                  </div>
                </div>
                
                {daysRemaining < 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Book is overdue!</p>
                        <p>Late Fee: ₹{fineDetails.lateFee} | Missing Fee: ₹{fineDetails.missingFee}</p>
                        <p>Total Fine: ₹{fineDetails.totalFine}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" disabled>
                    Extend Loan
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleReturnBook(borrowing.id)}
                    disabled={returning === borrowing.id}
                  >
                    {returning === borrowing.id ? 'Returning...' : 'Return Book'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {activeBorrowings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold mb-2">No Active Borrowings</h3>
              <p className="text-muted-foreground">
                You don't have any books currently borrowed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}