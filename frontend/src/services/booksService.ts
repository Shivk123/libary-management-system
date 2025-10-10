import { api } from '@/lib/api';
import type { Book } from '@/data/books';

let booksCache: Book[] | null = null;
let booksPromise: Promise<Book[]> | null = null;

export const booksService = {
  async getBooks(): Promise<Book[]> {
    if (booksCache) {
      return booksCache;
    }

    if (booksPromise) {
      return booksPromise;
    }

    booksPromise = (async () => {
      try {
        const response = await api.get('/books');
        booksCache = response.data;
        return response.data;
      } finally {
        booksPromise = null;
      }
    })();

    return booksPromise;
  },

  async getBook(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const response = await api.put(`/books/${id}`, book);
    booksCache = null;
    return response.data;
  },

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const response = await api.post('/books', book);
    booksCache = null;
    return response.data;
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
    booksCache = null;
  },
};