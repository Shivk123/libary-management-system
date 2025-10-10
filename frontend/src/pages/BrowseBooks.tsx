import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tilt } from '@/components/ui/tilt';
import SearchInput from '@/components/shared/SearchInput';
import { Star, Clock, Users } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useUserGroups } from '@/hooks/useUserGroups';
import { useBorrowings } from '@/hooks/useBorrowings';
import { borrowingService } from '@/services/borrowingService';
import { userService } from '@/services/userService';
import type { Book } from '@/data/books';

export default function BrowseBooks() {
  const { books, loading, error } = useBooks();
  const { groups } = useUserGroups();
  const { borrowings } = useBorrowings();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowingType, setBorrowingType] = useState<'individual' | 'group'>('individual');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [borrowing, setBorrowing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = useMemo(() => {
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const isBookAlreadyBorrowed = (bookId: string) => {
    return borrowings.some(b => b.bookId === bookId && (b.status === 'active' || b.status === 'overdue'));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleBorrowBook = async () => {
    if (!selectedBook) return;
    
    setBorrowing(true);
    try {
      const currentUser = await userService.getCurrentUser();
      
      await borrowingService.borrowBook({
        bookId: selectedBook.id,
        borrowerId: currentUser.id,
        type: borrowingType,
        groupId: borrowingType === 'group' ? selectedGroup : undefined,
      });
      
      // Close dialog and reset state
      setSelectedBook(null);
      setBorrowingType('individual');
      setSelectedGroup('');
      
      alert('Book borrowed successfully!');
    } catch (err: any) {
      console.error('Failed to borrow book:', err);
      const errorMessage = err.response?.data?.error || 'Failed to borrow book. Please try again.';
      alert(errorMessage);
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          Browse Books
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Discover our extensive collection of books
        </p>
      </div>

      <div className="mb-6 flex justify-center">
        <SearchInput
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {loading && <div>Loading books...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} onClick={() => setSelectedBook(book)}>
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
              <div
                style={{ borderRadius: '12px' }}
                className='flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 cursor-pointer hover:shadow-lg transition-shadow'
              >
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className='h-48 w-full object-cover'
                  />
                  {isBookAlreadyBorrowed(book.id) && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      Borrowed
                    </Badge>
                  )}
                </div>
                <div className='p-2'>
                  <h1 className='font-mono leading-snug text-zinc-950 dark:text-zinc-50 text-sm line-clamp-2'>
                    {book.title}
                  </h1>
                  <p className='text-zinc-700 dark:text-zinc-400 text-xs mb-2'>by {book.author}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(book.review)}</div>
                      <span className="text-xs ml-1">{book.review}</span>
                    </div>
                    <span className="text-xs text-zinc-700 dark:text-zinc-400">
                      {book.count} available
                    </span>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-serif pr-8">
                  {selectedBook.title}
                </DialogTitle>
                <DialogDescription>
                  Book details and borrowing options
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex justify-center">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-64 h-80 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Author</h3>
                    <p className="text-sm">{selectedBook.author}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Rating</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(selectedBook.review)}</div>
                      <span className="text-sm">{selectedBook.review}/5</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Available</h3>
                    <p className="text-sm">{selectedBook.count} copies</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Borrowing Method
                      </label>
                      <Select value={borrowingType} onValueChange={(value: 'individual' | 'group') => setBorrowingType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Individual (30 days)
                            </div>
                          </SelectItem>
                          <SelectItem value="group">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Group (6 months)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {borrowingType === 'group' && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Select Group
                        </label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Badge variant={borrowingType === 'individual' ? 'default' : 'secondary'} className="text-xs">
                        {borrowingType === 'individual' ? '30 days limit' : '6 months limit'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Late returns incur fines. Missing books are charged.
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={(borrowingType === 'group' && !selectedGroup) || borrowing || selectedBook.count === 0 || isBookAlreadyBorrowed(selectedBook.id)}
                      onClick={handleBorrowBook}
                    >
                      {borrowing ? 'Borrowing...' : 
                       selectedBook.count === 0 ? 'Out of Stock' : 
                       isBookAlreadyBorrowed(selectedBook.id) ? 'Already Borrowed' : 
                       'Borrow Book'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Summary</h3>
                  <p className="text-sm leading-relaxed">{selectedBook.summary}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Review</h3>
                  <p className="text-sm leading-relaxed">{selectedBook.comment}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}