import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { useBorrowings } from '@/hooks/useBorrowings';

export default function History() {
  const { borrowings, loading, error } = useBorrowings();
  const historyBorrowings = borrowings.filter(b => b.status === 'returned' || b.status === 'missing');

  const getStatusBadge = (borrowing: any) => {
    switch (borrowing.status) {
      case 'returned':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Returned</Badge>;
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="secondary">{borrowing.status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          Borrowing History
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          View your past book borrowings and returns
        </p>
      </div>

      {loading && <div>Loading history...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="space-y-4">
        {historyBorrowings.map((borrowing) => {
          const book = borrowing.book;
          const group = borrowing.group;
          
          if (!book) return null;

          return (
            <Card key={borrowing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-serif font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(borrowing.status)}
                        {getStatusBadge(borrowing)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-medium font-sans">Type</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {borrowing.type === 'individual' ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <Users className="h-3 w-3" />
                          )}
                          <span>{borrowing.type === 'individual' ? 'Individual' : 'Group'}</span>
                        </div>
                      </div>
                      
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
                        <p className="font-medium font-sans">Returned</p>
                        <p className="text-muted-foreground">
                          {borrowing.returnedAt ? new Date(borrowing.returnedAt).toLocaleDateString() : 'Not returned'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium font-sans">Fine</p>
                        <p className={`font-medium ${borrowing.fine ? 'text-red-600' : 'text-green-600'}`}>
                          {borrowing.fine ? `₹${borrowing.fine}` : '₹0'}
                        </p>
                      </div>
                    </div>
                    
                    {borrowing.type === 'group' && group && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Group: {group.name}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {historyBorrowings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold mb-2">No History Yet</h3>
              <p className="text-muted-foreground">
                Your borrowing history will appear here once you start borrowing books.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}