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

// Request return
router.post('/:id/request-return', async (req, res) => {
  try {
    const borrowing = await prisma.borrowing.update({
      where: { id: req.params.id },
      data: {
        status: 'return_requested',
        returnRequestedAt: new Date()
      },
      include: {
        book: true,
        borrower: true
      }
    });
    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request return' });
  }
});

// Get return requests
router.get('/return-requests', async (req, res) => {
  try {
    const requests = await prisma.borrowing.findMany({
      where: { status: 'return_requested' },
      include: {
        book: true,
        borrower: true
      },
      orderBy: { returnRequestedAt: 'asc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch return requests' });
  }
});

// Approve return
router.post('/:id/approve-return', async (req, res) => {
  try {
    const { damageType, fine } = req.body;
    
    // Get borrowing with book details to calculate breakdown
    const existingBorrowing = await prisma.borrowing.findUnique({
      where: { id: req.params.id },
      include: { book: true }
    });
    
    if (!existingBorrowing) {
      return res.status(404).json({ error: 'Borrowing not found' });
    }
    
    // Calculate fine breakdown
    const borrowedDate = new Date(existingBorrowing.borrowedAt);
    const dueDate = new Date(borrowedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const daysLate = Math.max(0, Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const breakdown = [];
    
    if (damageType === 'lost') {
      breakdown.push({ label: 'Lost/Missing book (200%)', amount: existingBorrowing.book.price * 2 });
      if (daysLate > 0) {
        breakdown.push({ label: `Late fee (${daysLate} days × ₹50)`, amount: daysLate * 50 });
      }
    } else {
      if (daysLate > 0) {
        breakdown.push({ label: 'Missing book fee (200%)', amount: existingBorrowing.book.price * 2 });
        breakdown.push({ label: `Late fee (${daysLate} days × ₹50)`, amount: daysLate * 50 });
      }
      if (damageType === 'small') {
        breakdown.push({ label: 'Small damage (10%)', amount: existingBorrowing.book.price * 0.1 });
      } else if (damageType === 'large') {
        breakdown.push({ label: 'Large damage (50%)', amount: existingBorrowing.book.price * 0.5 });
      }
    }
    
    const borrowing = await prisma.borrowing.update({
      where: { id: req.params.id },
      data: {
        status: 'return_approved',
        returnApprovedAt: new Date(),
        damageType,
        damageFee: fine,
        fine,
        fineBreakdown: JSON.stringify(breakdown)
      },
      include: {
        book: true,
        borrower: true
      }
    });
    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve return' });
  }
});

// Reject return
router.post('/:id/reject-return', async (req, res) => {
  try {
    const borrowing = await prisma.borrowing.update({
      where: { id: req.params.id },
      data: {
        status: 'active',
        returnRequestedAt: null
      },
      include: {
        book: true,
        borrower: true
      }
    });
    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject return' });
  }
});

// Pay fine
router.post('/:id/pay-fine', async (req, res) => {
  try {
    // Get current borrowing to store original fine amount
    const currentBorrowing = await prisma.borrowing.findUnique({
      where: { id: req.params.id }
    });
    
    const borrowing = await prisma.borrowing.update({
      where: { id: req.params.id },
      data: {
        damageFee: currentBorrowing?.fine || 0, // Store original fine as damage fee for history
        fine: 0,
        status: 'returned',
        returnedAt: new Date()
      },
      include: {
        book: true,
        borrower: true
      }
    });

    // Update book count
    await prisma.book.update({
      where: { id: borrowing.bookId },
      data: { count: { increment: 1 } }
    });

    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process fine payment' });
  }
});

export default router;