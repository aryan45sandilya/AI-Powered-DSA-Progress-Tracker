import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { analyzeWeakTopics, getRecommendations, generateResumeDSA } from '../services/gemini';

const router = Router();
const prisma = new PrismaClient();

// POST /api/ai/analyze
router.post('/analyze', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const solvedQuestions = await prisma.solvedQuestion.findMany({
      where: { userId: req.userId },
      select: { title: true, difficulty: true, topic: true },
    });

    if (solvedQuestions.length === 0) {
      res.status(400).json({ error: 'No solved questions found. Add some questions first.' });
      return;
    }

    const analysis = await analyzeWeakTopics(solvedQuestions, solvedQuestions.length);
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze topics' });
  }
});

// POST /api/ai/recommendations
router.post('/recommendations', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weakTopics, level } = req.body;

    const recentlySolved = await prisma.solvedQuestion.findMany({
      where: { userId: req.userId },
      select: { title: true },
      orderBy: { solvedAt: 'desc' },
      take: 20,
    });

    const recommendations = await getRecommendations(
      weakTopics || [],
      level || 'intermediate',
      recentlySolved.map((q) => q.title)
    );

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST /api/ai/resume
router.post('/resume', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { leetcodeStats, contestRating } = req.body;

    const solvedQuestions = await prisma.solvedQuestion.findMany({
      where: { userId: req.userId },
      select: { topic: true, difficulty: true },
    });

    // Count topics
    const topicCounts: Record<string, number> = {};
    for (const q of solvedQuestions) {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    }
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { username: true, leetcodeUsername: true },
    });

    const resumeText = await generateResumeDSA({
      totalSolved: leetcodeStats?.totalSolved || solvedQuestions.length,
      easySolved: leetcodeStats?.easySolved || solvedQuestions.filter((q) => q.difficulty === 'Easy').length,
      mediumSolved: leetcodeStats?.mediumSolved || solvedQuestions.filter((q) => q.difficulty === 'Medium').length,
      hardSolved: leetcodeStats?.hardSolved || solvedQuestions.filter((q) => q.difficulty === 'Hard').length,
      contestRating,
      topTopics: topTopics.length > 0 ? topTopics : ['Arrays', 'Strings', 'Dynamic Programming'],
      username: user?.leetcodeUsername || user?.username || 'user',
    });

    res.json({ resumeText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate resume section' });
  }
});

export default router;
