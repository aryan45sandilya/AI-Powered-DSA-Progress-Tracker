import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/tracker/questions
router.get('/questions', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topic = req.query.topic as string | undefined;
    const difficulty = req.query.difficulty as string | undefined;
    const search = req.query.search as string | undefined;
    const page = req.query.page as string || '1';
    const limit = req.query.limit as string || '20';

    const where: Record<string, unknown> = { userId: req.userId };
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      prisma.solvedQuestion.findMany({
        where,
        orderBy: { solvedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.solvedQuestion.count({ where }),
    ]);

    res.json({ questions, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST /api/tracker/questions
router.post('/questions', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, difficulty, topic, leetcodeId, url, notes, timeTaken, solvedAt } = req.body;

    if (!title || !difficulty || !topic) {
      res.status(400).json({ error: 'Title, difficulty, and topic are required' });
      return;
    }

    const question = await prisma.solvedQuestion.create({
      data: {
        userId: req.userId!,
        title,
        difficulty,
        topic,
        leetcodeId: leetcodeId ? parseInt(leetcodeId) : undefined,
        url,
        notes,
        timeTaken: timeTaken ? parseInt(timeTaken) : undefined,
        solvedAt: solvedAt ? new Date(solvedAt) : new Date(),
      },
    });

    // Update streak
    await updateStreak(req.userId!);

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// PUT /api/tracker/questions/:id
router.put('/questions/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, difficulty, topic, url, notes, timeTaken } = req.body;

    const existing = await prisma.solvedQuestion.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const updated = await prisma.solvedQuestion.update({
      where: { id },
      data: { title, difficulty, topic, url, notes, timeTaken },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE /api/tracker/questions/:id
router.delete('/questions/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.solvedQuestion.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    await prisma.solvedQuestion.delete({ where: { id } });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// GET /api/tracker/stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, byDifficulty, byTopic, recentActivity] = await Promise.all([
      prisma.solvedQuestion.count({ where: { userId: req.userId } }),
      prisma.solvedQuestion.groupBy({
        by: ['difficulty'],
        where: { userId: req.userId },
        _count: true,
      }),
      prisma.solvedQuestion.groupBy({
        by: ['topic'],
        where: { userId: req.userId },
        _count: true,
        orderBy: { _count: { topic: 'desc' } },
        take: 10,
      }),
      prisma.solvedQuestion.findMany({
        where: { userId: req.userId },
        orderBy: { solvedAt: 'desc' },
        take: 10,
        select: { id: true, title: true, difficulty: true, topic: true, solvedAt: true },
      }),
    ]);

    const streak = await getCurrentStreak(req.userId!);

    res.json({ total, byDifficulty, byTopic, recentActivity, streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/tracker/heatmap
router.get('/heatmap', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const questions = await prisma.solvedQuestion.findMany({
      where: {
        userId: req.userId,
        solvedAt: { gte: oneYearAgo },
      },
      select: { solvedAt: true },
    });

    // Group by date
    const heatmapData: Record<string, number> = {};
    for (const q of questions) {
      const date = q.solvedAt.toISOString().split('T')[0];
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    }

    res.json(heatmapData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

async function updateStreak(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.streak.upsert({
    where: { userId_date: { userId, date: today } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, count: 1 },
  });
}

async function getCurrentStreak(userId: string): Promise<number> {
  const streaks = await prisma.streak.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 365,
  });

  if (streaks.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < streaks.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const streakDate = new Date(streaks[i].date);
    streakDate.setHours(0, 0, 0, 0);

    if (expected.getTime() === streakDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default router;
