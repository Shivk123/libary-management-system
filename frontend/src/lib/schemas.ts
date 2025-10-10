import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  summary: z.string(),
  comment: z.string(),
  review: z.number().min(0).max(5),
  count: z.number().min(0),
  image: z.string().url(),
  price: z.number().min(0),
});

export const GroupMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  groupId: z.string(),
  user: UserSchema,
});

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
  creator: UserSchema,
  members: z.array(GroupMemberSchema),
});

export const BorrowingSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  borrowerId: z.string(),
  type: z.enum(['individual', 'group']),
  groupId: z.string().optional(),
  borrowedAt: z.string(),
  dueDate: z.string(),
  returnedAt: z.string().optional(),
  returnRequestedAt: z.string().optional(),
  returnApprovedAt: z.string().optional(),
  status: z.enum(['active', 'returned', 'overdue', 'missing', 'return_requested', 'return_approved']),
  fine: z.number().optional(),
  damageType: z.string().optional(),
  damageFee: z.number().optional(),
  fineBreakdownDetails: z.array(z.object({ label: z.string(), amount: z.number() })).optional(),
  book: BookSchema.optional(),
  group: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Book = z.infer<typeof BookSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Borrowing = z.infer<typeof BorrowingSchema>;