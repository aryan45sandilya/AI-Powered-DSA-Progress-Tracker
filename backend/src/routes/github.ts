import { Router, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const DSA_KEYWORDS = [
  'leetcode', 'dsa', 'algorithms', 'data-structures', 'competitive', 'cp',
  'codeforces', 'hackerrank', 'coding', 'solution', 'problems', 'practice',
  'interview', 'prep', 'programming', 'code', 'challenge', 'contest',
  'array', 'tree', 'graph', 'dynamic', 'sorting', 'searching',
  'stack', 'queue', 'heap', 'binary', 'recursion', 'backtracking',
];

// GET /api/github/analyze/:username
router.get('/analyze/:username', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DSA-Tracker-App',
    };

    // Add GitHub token if available (increases rate limit from 60 to 5000/hour)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user profile first
    let profileData;
    try {
      const profileRes = await axios.get(`https://api.github.com/users/${username}`, {
        headers,
        timeout: 15000,
      });
      profileData = profileRes.data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error('GitHub API error:', axiosErr.response?.status, axiosErr.response?.data);
      if (axiosErr.response?.status === 404) {
        res.status(404).json({ error: `GitHub user "${username}" not found. Check the username spelling.` });
        return;
      }
      if (axiosErr.response?.status === 403 || axiosErr.response?.status === 429) {
        res.status(429).json({ error: 'GitHub API rate limit exceeded. Add a GitHub token in backend .env to fix this.' });
        return;
      }
      if (axiosErr.code === 'ECONNABORTED') {
        res.status(408).json({ error: 'GitHub API timeout. Try again.' });
        return;
      }
      res.status(500).json({ error: `GitHub API error: ${axiosErr.message}` });
      return;
    }

    // Fetch repos
    let repos = [];
    try {
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=public`,
        { headers, timeout: 15000 }
      );
      repos = reposRes.data;
    } catch {
      // Continue with empty repos if this fails
      repos = [];
    }

    // Analyze DSA repos
    const dsaRepos = repos.filter((repo: { name: string; description: string | null; topics: string[] }) => {
      const name = repo.name.toLowerCase();
      const desc = (repo.description || '').toLowerCase();
      const topics = (repo.topics || []).join(' ').toLowerCase();
      return DSA_KEYWORDS.some((kw) => name.includes(kw) || desc.includes(kw) || topics.includes(kw));
    });

    // Language stats
    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    }

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang, count]) => ({ lang, count }));

    const totalStars = repos.reduce(
      (sum: number, repo: { stargazers_count: number }) => sum + (repo.stargazers_count || 0),
      0
    );

    res.json({
      profile: {
        login: profileData.login,
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        public_repos: profileData.public_repos,
        followers: profileData.followers,
        following: profileData.following,
        html_url: profileData.html_url,
      },
      stats: {
        totalRepos: repos.length,
        dsaRepos: dsaRepos.length,
        totalStars,
        topLanguages,
      },
      dsaRepos: dsaRepos.slice(0, 10).map((repo: {
        name: string;
        description: string | null;
        html_url: string;
        stargazers_count: number;
        language: string | null;
        updated_at: string;
      }) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      })),
    });
  } catch (err) {
    console.error('GitHub analyze error:', err);
    res.status(500).json({ error: 'Failed to analyze GitHub profile. Please try again.' });
  }
});

export default router;
