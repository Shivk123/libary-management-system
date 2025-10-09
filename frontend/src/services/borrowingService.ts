import { api } from '@/lib/api';
import type { Borrowing } from '@/types/borrowing';

interface BorrowBookRequest {
  bookId: string;
  borrowerId: string;
  type: 'individual' | 'group';
  groupId?: string;
}

export const borrowingService = {
  async borrowBook(request: BorrowBookRequest): Promise<Borrowing> {
    const response = await api.post('/borrowings', request);
    return response.data;
  },

  async getUserBorrowings(userId: string): Promise<Borrowing[]> {
    const response = await api.get(`/borrowings/user/${userId}`);
    return response.data;
  },

  async returnBook(borrowingId: string): Promise<Borrowing> {
    const response = await api.put(`/borrowings/${borrowingId}/return`);
    return response.data;
  },
};