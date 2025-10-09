import { type Group } from '@/types/borrowing';

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Book Club Enthusiasts',
    description: 'A group for passionate readers who love discussing literature',
    createdBy: '1',
    members: ['1', '2', '3', '4'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Study Group - Computer Science',
    description: 'CS students collaborating on technical books and research',
    createdBy: '2',
    members: ['2', '5', '6'],
    createdAt: new Date('2024-02-01')
  }
];

export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com' },
  { id: '6', name: 'Lisa Davis', email: 'lisa@example.com' }
];