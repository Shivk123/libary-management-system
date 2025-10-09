export type BorrowingType = 'individual' | 'group';

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
}

export interface Borrowing {
  id: string;
  bookId: string;
  borrowerId: string;
  type: BorrowingType;
  groupId?: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  status: 'active' | 'returned' | 'overdue' | 'missing';
  fine?: number;
}