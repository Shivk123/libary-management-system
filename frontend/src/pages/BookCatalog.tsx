import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tilt } from '@/components/ui/tilt';
import { Star, Edit } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import type { Book } from '@/data/books';

export default function BookCatalog() {
  const { books, loading, error, updateBook } = useBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm<Book>();

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

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditing(true);
    Object.keys(book).forEach((key) => {
      setValue(key as keyof Book, book[key as keyof Book]);
    });
  };

  const onSubmit = async (data: Book) => {
    if (!selectedBook) return;
    
    try {
      await updateBook(selectedBook.id, data);
      setIsEditing(false);
      setSelectedBook(null);
      reset();
    } catch (err) {
      console.error('Failed to update book:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setIsEditing(false);
    reset();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          Book Catalog Management
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Manage and edit book information in the library catalog
        </p>
      </div>

      {loading && <div>Loading books...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id}>
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
              <div
                style={{ borderRadius: '12px' }}
                className='flex max-w-[270px] flex-col overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow'
              >
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className='h-48 w-full object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h1 className='font-serif leading-snug text-card-foreground text-sm line-clamp-2 mb-2'>
                    {book.title}
                  </h1>
                  <p className='text-muted-foreground text-xs mb-2'>by {book.author}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(book.review)}</div>
                    <span className="text-xs">{book.review}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {book.count} available
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBook(book)}
                      className="flex-1 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditBook(book)}
                      className="flex-1 text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">
                  {isEditing ? 'Edit Book' : selectedBook.title}
                </DialogTitle>
              </DialogHeader>
              
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-base font-sans">Title</Label>
                        <Input
                          id="title"
                          {...register('title', { required: true })}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="author" className="text-base font-sans">Author</Label>
                        <Input
                          id="author"
                          {...register('author', { required: true })}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image" className="text-base font-sans">Image URL</Label>
                        <Input
                          id="image"
                          {...register('image', { required: true })}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="review" className="text-base font-sans">Rating (1-5)</Label>
                        <Input
                          id="review"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          {...register('review', { required: true, valueAsNumber: true })}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="count" className="text-base font-sans">Available Copies</Label>
                        <Input
                          id="count"
                          type="number"
                          min="0"
                          {...register('count', { required: true, valueAsNumber: true })}
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="summary" className="text-base font-sans">Summary</Label>
                        <Textarea
                          id="summary"
                          {...register('summary', { required: true })}
                          className="text-base min-h-32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="comment" className="text-base font-sans">Review/Comment</Label>
                        <Textarea
                          id="comment"
                          {...register('comment', { required: true })}
                          className="text-base min-h-32"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
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
                      <Button onClick={() => handleEditBook(selectedBook)} className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Book Details
                      </Button>
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}