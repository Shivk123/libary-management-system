import { api } from '@/lib/api';
import type { Book } from '@/data/books';

export const booksService = {
  async getBooks(): Promise<Book[]> {
    const response = await api.get('/books');
    return response.data;
  },

  async getBook(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const response = await api.post('/books', book);
    return response.data;
  },
};