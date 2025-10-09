import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all borrowings
router.get('/', async (req, res) => {
  try {
    const borrowings = await prisma.borrowing.findMany({
      include: {
        book: true,
        borrower: true,
        group: true
      }
    });
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowings' });
  }
});

// Create new borrowing
router.post('/', async (req, res) => {
  try {
    const { bookId, borrowerId, type, groupId } = req.body;
    
    // Check if user already has this book borrowed
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        borrowerId,
        status: { in: ['active', 'overdue'] }
      }
    });
    
    if (existingBorrowing) {
      return res.status(400).json({ error: 'You have already borrowed this book' });
    }
    
    // Calculate due date (30 days for individual, 6 months for group)
    const dueDate = new Date();
    if (type === 'individual') {
      dueDate.setDate(dueDate.getDate() + 30);
    } else {
      dueDate.setMonth(dueDate.getMonth() + 6);
    }

    const borrowing = await prisma.borrowing.create({
      data: {
        bookId,
        borrowerId,
        type,
        groupId,
        dueDate
      },
      include: {
        book: true,
        borrower: true,
        group: true
      }
    });

    // Update book count
    await prisma.book.update({
      where: { id: bookId },
      data: { count: { decrement: 1 } }
    });

    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create borrowing' });
  }
});

// Return book
router.put('/:id/return', async (req, res) => {
  try {
    const borrowing = await prisma.borrowing.update({
      where: { id: req.params.id },
      data: {
        returnedAt: new Date(),
        status: 'returned'
      },
      include: {
        book: true,
        borrower: true,
        group: true
      }
    });

    // Update book count
    await prisma.book.update({
      where: { id: borrowing.bookId },
      data: { count: { increment: 1 } }
    });

    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// Get borrowings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const borrowings = await prisma.borrowing.findMany({
      where: { borrowerId: req.params.userId },
      include: {
        book: true,
        group: true
      }
    });
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user borrowings' });
  }
});

export default router;