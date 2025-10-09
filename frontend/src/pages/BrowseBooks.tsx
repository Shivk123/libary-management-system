import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Users, Search } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useGroups } from '@/hooks/useGroups';
import { borrowingService } from '@/services/borrowingService';
import { userService } from '@/services/userService';
import type { Book } from '@/data/books';

export default function BrowseBooks() {
  const { books, loading, error } = useBooks();
  const { groups } = useGroups();
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
      const currentUser = userService.getCurrentUser();
      
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
    } catch (err) {
      console.error('Failed to borrow book:', err);
      alert('Failed to borrow book. Please try again.');
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

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading && <div>Loading books...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedBook(book)}
          >
            <CardHeader className="p-0">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-serif mb-2 line-clamp-2">
                {book.title}
              </CardTitle>
              <p className="text-base font-sans text-muted-foreground mb-2">
                by {book.author}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(book.review)}</div>
                <span className="text-sm font-sans">{book.review}</span>
              </div>
              <p className="text-sm font-sans text-muted-foreground">
                {book.count} available
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-2xl">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">
                  {selectedBook.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-2">Author</h3>
                    <p className="text-base font-sans">{selectedBook.author}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-2">Rating</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(selectedBook.review)}</div>
                      <span className="text-base font-sans">{selectedBook.review}/5</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-2">Available Copies</h3>
                    <p className="text-base font-sans">{selectedBook.count} copies</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium font-sans mb-2 block">
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
                        <label className="text-sm font-medium font-sans mb-2 block">
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
                      <div className="flex items-center gap-2">
                        <Badge variant={borrowingType === 'individual' ? 'default' : 'secondary'}>
                          {borrowingType === 'individual' ? '30 days limit' : '6 months limit'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Late returns incur fines. Missing books are charged even if returned later.
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={(borrowingType === 'group' && !selectedGroup) || borrowing || selectedBook.count === 0}
                      onClick={handleBorrowBook}
                    >
                      {borrowing ? 'Borrowing...' : selectedBook.count === 0 ? 'Out of Stock' : 'Borrow Book'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Summary</h3>
                  <p className="text-base font-sans leading-relaxed">{selectedBook.summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Review</h3>
                  <p className="text-base font-sans leading-relaxed">{selectedBook.comment}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}