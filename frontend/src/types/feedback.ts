export interface Feedback {
  id: string;
  userId: string;
  bookId: string;
  image: string;
  title: string;
  comment: string;
  review: number;
  createdAt: Date;
}