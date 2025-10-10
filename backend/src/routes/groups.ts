import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: true,
        members: { include: { user: true } }
      }
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: req.params.id },
      include: {
        creator: true,
        members: { include: { user: true } },
        borrowings: { include: { book: true } }
      }
    });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Create new group
router.post('/', async (req, res) => {
  try {
    const { members, ...groupData } = req.body;
    const group = await prisma.group.create({
      data: {
        ...groupData,
        members: {
          create: members?.map((userId: string) => ({ userId })) || []
        }
      },
      include: {
        creator: true,
        members: { include: { user: true } }
      }
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get groups for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('Fetching groups for user:', req.params.userId);
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: req.params.userId
          }
        }
      },
      include: {
        creator: true,
        members: { include: { user: true } }
      }
    });
    console.log('Found groups:', groups.length);
    res.json(groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});

// Add member to group
router.post('/:id/members', async (req, res) => {
  try {
    const { userId } = req.body;
    const member = await prisma.groupMember.create({
      data: {
        groupId: req.params.id,
        userId
      },
      include: { user: true }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Debug endpoint to check database state
router.get('/debug/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const groups = await prisma.group.findMany({
      include: {
        creator: true,
        members: { include: { user: true } }
      }
    });
    res.json({ users, groups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch debug data' });
  }
});

export default router;