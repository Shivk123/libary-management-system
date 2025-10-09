import type { Feedback } from '@/types/feedback';

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    title: 'Excellent Classic Literature',
    comment: 'The Great Gatsby is a masterpiece that beautifully captures the essence of the Jazz Age. Fitzgerald\'s writing is both elegant and profound.',
    review: 5,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    userId: '2',
    bookId: '2',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    title: 'Powerful and Moving',
    comment: 'To Kill a Mockingbird addresses important social issues with grace. Harper Lee\'s storytelling is compelling and thought-provoking.',
    review: 5,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '3',
    userId: '3',
    bookId: '3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    title: 'Chilling and Relevant',
    comment: '1984 remains incredibly relevant today. Orwell\'s vision of surveillance and control is both frightening and fascinating.',
    review: 4,
    createdAt: new Date('2024-01-15')
  }
];