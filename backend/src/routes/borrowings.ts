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
    console.log('Borrowing request:', { bookId, borrowerId, type, groupId });
    
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
    
    // For group borrowing, validate that user is a member of the group
    if (type === 'group') {
      if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required for group borrowing' });
      }
      
      console.log('Checking group membership for user:', borrowerId, 'in group:', groupId);
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId: borrowerId
        }
      });
      
      console.log('Group member found:', !!groupMember);
      if (!groupMember) {
        return res.status(400).json({ error: 'You are not a member of this group' });
      }
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
        groupId: type === 'group' ? groupId : null,
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
    console.error('Borrowing error:', error);
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