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
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'active' | 'returned' | 'overdue' | 'missing';
  fine?: number;
  book?: {
    id: string;
    title: string;
    author: string;
    image: string;
    price: number;
  };
  group?: {
    id: string;
    name: string;
  };
}