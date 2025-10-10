import { api } from '@/lib/api';
import type { Borrowing } from '@/types/borrowing';

interface BorrowBookRequest {
  bookId: string;
  borrowerId: string;
  type: 'individual' | 'group';
  groupId?: string;
}

let userBorrowingsCache: { [userId: string]: Borrowing[] } = {};
let userBorrowingsPromises: { [userId: string]: Promise<Borrowing[]> } = {};

export const borrowingService = {
  async borrowBook(request: BorrowBookRequest): Promise<Borrowing> {
    console.log('Borrowing request:', request);
    try {
      const response = await api.post('/borrowings', request);
      console.log('Borrowing response:', response.data);
      userBorrowingsCache = {};
      return response.data;
    } catch (error) {
      console.error('Borrowing error:', error);
      throw error;
    }
  },

  async getUserBorrowings(userId: string): Promise<Borrowing[]> {
    if (userBorrowingsCache[userId]) {
      return userBorrowingsCache[userId];
    }

    if (userBorrowingsPromises[userId]) {
      return userBorrowingsPromises[userId];
    }

    userBorrowingsPromises[userId] = (async () => {
      try {
        const response = await api.get(`/users/${userId}/borrowings`);
        userBorrowingsCache[userId] = response.data;
        return response.data;
      } finally {
        delete userBorrowingsPromises[userId];
      }
    })();

    return userBorrowingsPromises[userId];
  },

  async returnBook(borrowingId: string): Promise<Borrowing> {
    const response = await api.put(`/borrowings/${borrowingId}/return`);
    userBorrowingsCache = {};
    return response.data;
  },

  async requestReturn(borrowingId: string): Promise<void> {
    await api.post(`/borrowings/${borrowingId}/request-return`);
    userBorrowingsCache = {};
  },

  async getReturnRequests(): Promise<any[]> {
    const response = await api.get('/borrowings/return-requests');
    return response.data;
  },

  async approveReturn(borrowingId: string, data: { damageType: string; fine: number }): Promise<void> {
    await api.post(`/borrowings/${borrowingId}/approve-return`, data);
  },

  async rejectReturn(borrowingId: string): Promise<void> {
    await api.post(`/borrowings/${borrowingId}/reject-return`);
  },

  async payFine(borrowingId: string): Promise<void> {
    await api.post(`/borrowings/${borrowingId}/pay-fine`);
    userBorrowingsCache = {};
  },
};