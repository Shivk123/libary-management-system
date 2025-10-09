import type { Borrowing } from '@/types/borrowing';

export const mockBorrowings: Borrowing[] = [
  {
    id: '1',
    bookId: '1',
    borrowerId: '1',
    type: 'individual',
    borrowedAt: new Date('2024-01-15'),
    dueDate: new Date('2024-02-14'),
    status: 'active'
  },
  {
    id: '2',
    bookId: '3',
    borrowerId: '1',
    type: 'group',
    groupId: '1',
    borrowedAt: new Date('2024-01-10'),
    dueDate: new Date('2024-07-10'),
    status: 'active'
  },
  {
    id: '3',
    bookId: '2',
    borrowerId: '1',
    type: 'individual',
    borrowedAt: new Date('2023-12-01'),
    dueDate: new Date('2023-12-31'),
    returnedAt: new Date('2023-12-28'),
    status: 'returned'
  },
  {
    id: '4',
    bookId: '4',
    borrowerId: '1',
    type: 'individual',
    borrowedAt: new Date('2023-11-15'),
    dueDate: new Date('2023-12-15'),
    status: 'overdue',
    fine: 25
  }
];