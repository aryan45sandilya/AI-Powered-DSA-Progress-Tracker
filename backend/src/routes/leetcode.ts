import { Router, Response } from 'express';
import axios from 'axios';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com';

// GET /api/leetcode/stats/:username
router.get('/stats/:username', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const [profileRes, solvedRes] = await Promise.allSettled([
      axios.get(`${LEETCODE_API}/${username}`, { timeout: 10000 }),
      axios.get(`${LEETCODE_API}/${username}/solved`, { timeout: 10000 }),
    ]);

    const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
    const solved = solvedRes.status === 'fulfilled' ? solvedRes.value.data : null;

    if (!profile && !solved) {
      res.status(404).json({ error: 'LeetCode user not found or API unavailable' });
      return;
    }

    res.json({ profile, solved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch LeetCode stats' });
  }
});

// GET /api/leetcode/contest/:username
router.get('/contest/:username', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const response = await axios.get(`${LEETCODE_API}/${username}/contest`, { timeout: 10000 });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contest data' });
  }
});

// GET /api/leetcode/badges/:username
router.get('/badges/:username', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const response = await axios.get(`${LEETCODE_API}/${username}/badges`, { timeout: 10000 });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// GET /api/leetcode/submission/:username
router.get('/submission/:username', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const response = await axios.get(`${LEETCODE_API}/${username}/submission`, { timeout: 10000 });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
