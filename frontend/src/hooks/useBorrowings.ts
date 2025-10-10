import { useState, useEffect } from 'react';
import { borrowingService } from '@/services/borrowingService';
import { userService } from '@/services/userService';
import type { Borrowing } from '@/types/borrowing';

export function useBorrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const currentUser = await userService.getCurrentUser();
      const data = await borrowingService.getUserBorrowings(currentUser.id);
      setBorrowings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  return { borrowings, loading, error, refetch: fetchBorrowings };
}