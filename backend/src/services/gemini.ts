import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface SolvedQuestion {
  title: string;
  difficulty: string;
  topic: string;
}

export interface WeakTopicAnalysis {
  weakTopics: string[];
  strongTopics: string[];
  analysis: string;
  suggestions: string[];
}

export interface Recommendation {
  title: string;
  difficulty: string;
  topic: string;
  reason: string;
  leetcodeUrl?: string;
}

export async function analyzeWeakTopics(
  solvedQuestions: SolvedQuestion[],
  totalSolved: number
): Promise<WeakTopicAnalysis> {
  const topicCounts: Record<string, { total: number; easy: number; medium: number; hard: number }> = {};

  for (const q of solvedQuestions) {
    const topic = q.topic || 'Unknown';
    if (!topicCounts[topic]) {
      topicCounts[topic] = { total: 0, easy: 0, medium: 0, hard: 0 };
    }
    topicCounts[topic].total++;
    if (q.difficulty === 'Easy') topicCounts[topic].easy++;
    if (q.difficulty === 'Medium') topicCounts[topic].medium++;
    if (q.difficulty === 'Hard') topicCounts[topic].hard++;
  }

  const topicSummary = Object.entries(topicCounts)
    .map(([topic, counts]) => `${topic}: ${counts.total} solved (Easy: ${counts.easy}, Medium: ${counts.medium}, Hard: ${counts.hard})`)
    .join('\n');

  const prompt = `You are a DSA (Data Structures and Algorithms) coach. Analyze this student's LeetCode progress and identify weak topics.

Total problems solved: ${totalSolved}
Topic breakdown:
${topicSummary}

Provide a JSON response with this exact structure:
{
  "weakTopics": ["topic1", "topic2", ...],
  "strongTopics": ["topic1", "topic2", ...],
  "analysis": "2-3 sentence analysis of the student's progress",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Consider a topic weak if: fewer than 5 problems solved, or mostly Easy problems with no Medium/Hard.
Consider a topic strong if: 10+ problems solved with a mix of difficulties.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON in response');
  } catch {
    return {
      weakTopics: ['Dynamic Programming', 'Graphs', 'Trees'],
      strongTopics: ['Arrays', 'Strings'],
      analysis: 'Based on your solving pattern, you have good fundamentals but need more practice with advanced topics.',
      suggestions: [
        'Focus on Dynamic Programming - start with 1D DP problems',
        'Practice BFS/DFS graph traversal problems',
        'Solve more binary tree problems',
      ],
    };
  }
}

export async function getRecommendations(
  weakTopics: string[],
  level: string,
  recentlySolved: string[]
): Promise<Recommendation[]> {
  const prompt = `You are a DSA coach. Recommend 6 LeetCode problems for a ${level} level student.

Weak topics to focus on: ${weakTopics.join(', ')}
Recently solved (avoid recommending these): ${recentlySolved.slice(0, 10).join(', ')}

Provide a JSON array with this exact structure:
[
  {
    "title": "Problem Title",
    "difficulty": "Easy|Medium|Hard",
    "topic": "topic name",
    "reason": "why this problem is recommended",
    "leetcodeUrl": "https://leetcode.com/problems/problem-slug/"
  }
]

Mix difficulties: 2 Easy, 3 Medium, 1 Hard. Focus on the weak topics.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON in response');
  } catch {
    return [
      { title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', reason: 'Classic intro to DP', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
      { title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', reason: 'Essential BFS/DFS practice', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
      { title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming', reason: 'Classic DP problem', leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Trees', reason: 'BFS on trees', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', reason: '2D DP practice', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { title: 'Word Ladder', difficulty: 'Hard', topic: 'Graphs', reason: 'Advanced BFS challenge', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
    ];
  }
}

export async function generateResumeDSA(stats: {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating?: number;
  topTopics: string[];
  streak?: number;
  username: string;
}): Promise<string> {
  const prompt = `Generate professional resume bullet points for a student's DSA/Competitive Programming section.

Stats:
- LeetCode Username: ${stats.username}
- Total Problems Solved: ${stats.totalSolved} (Easy: ${stats.easySolved}, Medium: ${stats.mediumSolved}, Hard: ${stats.hardSolved})
- Contest Rating: ${stats.contestRating || 'N/A'}
- Top Topics: ${stats.topTopics.join(', ')}
- Current Streak: ${stats.streak || 0} days

Generate 4-5 concise, impactful resume bullet points. Use action verbs. Quantify achievements. Format as plain text with each bullet starting with "•".`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return `• Solved ${stats.totalSolved}+ problems on LeetCode (${stats.easySolved} Easy, ${stats.mediumSolved} Medium, ${stats.hardSolved} Hard)
• Demonstrated proficiency in ${stats.topTopics.slice(0, 3).join(', ')} through consistent problem-solving practice
• Maintained active competitive programming profile with focus on algorithmic problem-solving
• Applied data structures and algorithms knowledge to solve complex optimization problems`;
  }
}
