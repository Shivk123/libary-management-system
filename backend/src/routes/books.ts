import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id }
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Create new book
router.post('/', async (req, res) => {
  try {
    const book = await prisma.book.create({
      data: req.body
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

export default router;