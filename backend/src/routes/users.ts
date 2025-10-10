import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Simple password check (in production, use proper hashing)
    const validPassword = (
      (email === 'admin@library.com' && password === 'admin123') ||
      (email === 'john@example.com' && password === 'john123') ||
      (email === 'jane@example.com' && password === 'jane123') ||
      (email === 'mike@example.com' && password === 'mike123') ||
      (email === 'sarah@example.com' && password === 'sarah123') ||
      (email === 'tom@example.com' && password === 'tom123') ||
      (email === 'lisa@example.com' && password === 'lisa123')
    );
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ user, token: 'mock-jwt-token' });
  } catch (error) {
    res.status(500).json({ error: 'Sign in failed' });
  }
});

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = await prisma.user.create({
      data: { name, email, password, role: 'user' }
    });
    
    res.status(201).json({ user, token: 'mock-jwt-token' });
  } catch (error) {
    res.status(500).json({ error: 'Sign up failed' });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        groupMembers: {
          include: { group: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        borrowings: { include: { book: true } },
        groupMembers: { include: { group: true } }
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user borrowings with fine breakdown
router.get('/:id/borrowings', async (req, res) => {
  try {
    const borrowings = await prisma.borrowing.findMany({
      where: { borrowerId: req.params.id },
      include: {
        book: true,
        group: true
      },
      orderBy: { borrowedAt: 'desc' }
    });

    const borrowingsWithBreakdown = borrowings.map(borrowing => {
      let fineBreakdown = [];
      try {
        fineBreakdown = borrowing.fineBreakdown ? JSON.parse(borrowing.fineBreakdown) : [];
      } catch (e) {
        fineBreakdown = [];
      }

      return {
        ...borrowing,
        fineBreakdownDetails: fineBreakdown
      };
    });

    res.json(borrowingsWithBreakdown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user borrowings' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    // Check if user has active borrowings
    const activeBorrowings = await prisma.borrowing.count({
      where: { 
        borrowerId: req.params.id,
        status: { in: ['active', 'overdue'] }
      }
    });
    
    if (activeBorrowings > 0) {
      return res.status(400).json({ error: 'Cannot delete user with active borrowings' });
    }
    
    // Delete related records first
    await prisma.groupMember.deleteMany({
      where: { userId: req.params.id }
    });
    
    await prisma.borrowing.deleteMany({
      where: { borrowerId: req.params.id }
    });
    
    await prisma.group.deleteMany({
      where: { createdBy: req.params.id }
    });
    
    // Now delete the user
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;