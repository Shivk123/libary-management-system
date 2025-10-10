export type BorrowingType = 'individual' | 'group';

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  members: {
    id: string;
    userId: string;
    groupId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
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