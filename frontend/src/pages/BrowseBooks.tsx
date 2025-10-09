import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Users } from 'lucide-react';
import { mockBooks, type Book } from '@/data/books';
import { mockGroups } from '@/data/groups';

export default function BrowseBooks() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowingType, setBorrowingType] = useState<'individual' | 'group'>('individual');
  const [selectedGroup, setSelectedGroup] = useState<string>('');

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockBooks.map((book) => (
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
                            {mockGroups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} ({group.members.length} members)
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
                      disabled={borrowingType === 'group' && !selectedGroup}
                    >
                      Borrow Book
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