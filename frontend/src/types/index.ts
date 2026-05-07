export interface User {
  id: string;
  email: string;
  username: string;
  leetcodeUsername?: string;
  githubUsername?: string;
  createdAt: string;
}

export interface SolvedQuestion {
  id: string;
  userId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  leetcodeId?: number;
  url?: string;
  notes?: string;
  timeTaken?: number;
  solvedAt: string;
  createdAt: string;
}

export interface ContestEntry {
  id: string;
  userId: string;
  contestName: string;
  rank?: number;
  rating?: number;
  ratingChange?: number;
  date: string;
  platform: string;
}

export interface TrackerStats {
  total: number;
  byDifficulty: { difficulty: string; _count: number }[];
  byTopic: { topic: string; _count: number }[];
  recentActivity: Partial<SolvedQuestion>[];
  streak: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate?: number;
  ranking?: number;
  contributionPoints?: number;
  reputation?: number;
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

export interface GitHubAnalysis {
  profile: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
  };
  stats: {
    totalRepos: number;
    dsaRepos: number;
    totalStars: number;
    topLanguages: { lang: string; count: number }[];
  };
  dsaRepos: {
    name: string;
    description: string;
    url: string;
    stars: number;
    language: string;
    updatedAt: string;
  }[];
}

export interface DSASheetQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  leetcodeLink?: string;
  completed: boolean;
  order: number;
}

export interface DSASheet {
  id: string;
  name: string;
  description: string;
  author: string;
  totalCount: number;
  questions: DSASheetQuestion[];
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
  'Dynamic Programming', 'Backtracking', 'Binary Search',
  'Stack', 'Queue', 'Heap', 'Hashing', 'Two Pointers',
  'Sliding Window', 'Greedy', 'Math', 'Bit Manipulation',
  'Trie', 'Segment Tree', 'Union Find', 'Other',
] as const;
