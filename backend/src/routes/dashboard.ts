import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get admin dashboard data with fine breakdown
router.get('/admin', async (req, res) => {
  try {
    // Get all borrowings with fines
    const borrowingsWithFines = await prisma.borrowing.findMany({
      where: {
        OR: [
          { fine: { gt: 0 } },
          { damageFee: { gt: 0 } }
        ]
      },
      include: {
        book: true,
        borrower: true
      }
    });

    // Calculate fine breakdown totals
    let totalActiveFines = 0;
    let totalDamageFees = 0;
    let totalLateFees = 0;
    let totalMissingBookFees = 0;
    
    const fineBreakdownDetails = borrowingsWithFines.map(borrowing => {
      let breakdown = [];
      try {
        breakdown = borrowing.fineBreakdown ? JSON.parse(borrowing.fineBreakdown) : [];
      } catch (e) {
        breakdown = [];
      }

      // Calculate totals from breakdown
      breakdown.forEach((item: any) => {
        if (item.label.includes('Late fee')) {
          totalLateFees += item.amount;
        } else if (item.label.includes('Missing book') || item.label.includes('Lost')) {
          totalMissingBookFees += item.amount;
        } else if (item.label.includes('damage')) {
          totalDamageFees += item.amount;
        }
      });

      totalActiveFines += borrowing.fine || 0;

      return {
        borrowingId: borrowing.id,
        bookTitle: borrowing.book.title,
        borrowerName: borrowing.borrower.name,
        totalFine: borrowing.fine || 0,
        damageFee: borrowing.damageFee || 0,
        breakdown,
        status: borrowing.status
      };
    });

    // Get summary statistics
    const totalBooks = await prisma.book.count();
    const totalUsers = await prisma.user.count({ where: { role: 'user' } });
    const activeBorrowings = await prisma.borrowing.count({ where: { status: 'active' } });
    const pendingReturns = await prisma.borrowing.count({ where: { status: 'return_requested' } });

    const dashboardData = {
      summary: {
        totalBooks,
        totalUsers,
        activeBorrowings,
        pendingReturns
      },
      fineBreakdown: {
        totalActiveFines,
        totalDamageFees,
        totalLateFees,
        totalMissingBookFees,
        details: fineBreakdownDetails
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;