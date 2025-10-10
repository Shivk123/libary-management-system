import { useState, useEffect } from 'react';
import { booksService } from '@/services/booksService';
import type { Book } from '@/data/books';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await booksService.getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    try {
      const updated = await booksService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => book.id === id ? updated : book));
      return updated;
    } catch (err) {
      setError('Failed to update book');
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    updateBook,
    refreshBooks: fetchBooks,
    refetch: fetchBooks,
  };
}