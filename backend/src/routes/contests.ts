import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/contests
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contests = await prisma.contestEntry.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// POST /api/contests
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contestName = String(req.body.contestName || '');
    const rank = req.body.rank ? parseInt(String(req.body.rank)) : undefined;
    const rating = req.body.rating ? parseFloat(String(req.body.rating)) : undefined;
    const ratingChange = req.body.ratingChange ? parseFloat(String(req.body.ratingChange)) : undefined;
    const date = String(req.body.date || '');
    const platform = String(req.body.platform || 'LeetCode');

    if (!contestName || !date) {
      res.status(400).json({ error: 'Contest name and date are required' });
      return;
    }

    const contest = await prisma.contestEntry.create({
      data: {
        userId: req.userId!,
        contestName,
        rank,
        rating,
        ratingChange,
        date: new Date(date),
        platform,
      },
    });

    res.status(201).json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add contest' });
  }
});

// PUT /api/contests/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contestName = req.body.contestName ? String(req.body.contestName) : undefined;
    const rank = req.body.rank ? parseInt(String(req.body.rank)) : undefined;
    const rating = req.body.rating ? parseFloat(String(req.body.rating)) : undefined;
    const ratingChange = req.body.ratingChange ? parseFloat(String(req.body.ratingChange)) : undefined;
    const date = req.body.date ? new Date(String(req.body.date)) : undefined;
    const platform = req.body.platform ? String(req.body.platform) : undefined;

    const existing = await prisma.contestEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Contest not found' });
      return;
    }

    const updated = await prisma.contestEntry.update({
      where: { id },
      data: { contestName, rank, rating, ratingChange, date, platform },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contest' });
  }
});

// DELETE /api/contests/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.contestEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Contest not found' });
      return;
    }

    await prisma.contestEntry.delete({ where: { id } });
    res.json({ message: 'Contest deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contest' });
  }
});

// GET /api/contests/rating-history
router.get('/rating-history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contests = await prisma.contestEntry.findMany({
      where: { userId: req.userId, rating: { not: null } },
      orderBy: { date: 'asc' },
      select: { contestName: true, rating: true, ratingChange: true, date: true, rank: true },
    });

    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rating history' });
  }
});

export default router;
