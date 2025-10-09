export interface Book {
  id: string;
  image: string;
  title: string;
  author: string;
  summary: string;
  comment: string;
  review: number;
  count: number;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    summary: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    comment: 'A masterpiece of American literature that captures the essence of the 1920s.',
    review: 4.5,
    count: 12
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    summary: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    comment: 'An essential read that addresses important social issues with grace and power.',
    review: 4.8,
    count: 8
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    title: '1984',
    author: 'George Orwell',
    summary: 'A dystopian novel about totalitarianism and surveillance in a future society.',
    comment: 'A chilling and prophetic vision of a world under constant surveillance.',
    review: 4.7,
    count: 15
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    summary: 'A romantic novel about manners, upbringing, morality, and marriage in Georgian England.',
    comment: 'Witty and romantic, a timeless story of love overcoming social barriers.',
    review: 4.6,
    count: 10
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    summary: 'A coming-of-age story following teenager Holden Caulfield in New York City.',
    comment: 'A controversial yet influential novel about teenage rebellion and alienation.',
    review: 4.2,
    count: 6
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
    title: 'Lord of the Flies',
    author: 'William Golding',
    summary: 'A group of British boys stranded on an uninhabited island and their disastrous attempt to govern themselves.',
    comment: 'A powerful allegory about human nature and the thin veneer of civilization.',
    review: 4.3,
    count: 9
  }
];