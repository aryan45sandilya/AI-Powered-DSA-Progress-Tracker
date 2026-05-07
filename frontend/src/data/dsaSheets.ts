import { DSASheet } from '../types';

export const DSA_SHEETS: DSASheet[] = [
  {
    id: 'top-150',
    name: 'Top 150 Interview Questions',
    description: 'The most frequently asked problems in FAANG interviews, curated for maximum coverage.',
    author: 'DSA Tracker',
    totalCount: 30,
    questions: [
      // Arrays
      { id: 'q1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/two-sum/', completed: false, order: 1 },
      { id: 'q2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', completed: false, order: 2 },
      { id: 'q3', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/contains-duplicate/', completed: false, order: 3 },
      { id: 'q4', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/product-of-array-except-self/', completed: false, order: 4 },
      { id: 'q5', title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/', completed: false, order: 5 },
      // Strings
      { id: 'q6', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', leetcodeLink: 'https://leetcode.com/problems/valid-anagram/', completed: false, order: 6 },
      { id: 'q7', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/', completed: false, order: 7 },
      { id: 'q8', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', completed: false, order: 8 },
      { id: 'q9', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Strings', leetcodeLink: 'https://leetcode.com/problems/group-anagrams/', completed: false, order: 9 },
      { id: 'q10', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', leetcodeLink: 'https://leetcode.com/problems/longest-palindromic-substring/', completed: false, order: 10 },
      // Trees
      { id: 'q11', title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Trees', leetcodeLink: 'https://leetcode.com/problems/invert-binary-tree/', completed: false, order: 11 },
      { id: 'q12', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Trees', leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', completed: false, order: 12 },
      { id: 'q13', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Trees', leetcodeLink: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', completed: false, order: 13 },
      { id: 'q14', title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'Trees', leetcodeLink: 'https://leetcode.com/problems/validate-binary-search-tree/', completed: false, order: 14 },
      { id: 'q15', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'Trees', leetcodeLink: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', completed: false, order: 15 },
      // Dynamic Programming
      { id: 'q16', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/', completed: false, order: 16 },
      { id: 'q17', title: 'House Robber', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeLink: 'https://leetcode.com/problems/house-robber/', completed: false, order: 17 },
      { id: 'q18', title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeLink: 'https://leetcode.com/problems/coin-change/', completed: false, order: 18 },
      { id: 'q19', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeLink: 'https://leetcode.com/problems/longest-common-subsequence/', completed: false, order: 19 },
      { id: 'q20', title: 'Word Break', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeLink: 'https://leetcode.com/problems/word-break/', completed: false, order: 20 },
      // Graphs
      { id: 'q21', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', leetcodeLink: 'https://leetcode.com/problems/number-of-islands/', completed: false, order: 21 },
      { id: 'q22', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graphs', leetcodeLink: 'https://leetcode.com/problems/clone-graph/', completed: false, order: 22 },
      { id: 'q23', title: 'Course Schedule', difficulty: 'Medium', topic: 'Graphs', leetcodeLink: 'https://leetcode.com/problems/course-schedule/', completed: false, order: 23 },
      { id: 'q24', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Graphs', leetcodeLink: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', completed: false, order: 24 },
      // Binary Search
      { id: 'q25', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', leetcodeLink: 'https://leetcode.com/problems/binary-search/', completed: false, order: 25 },
      { id: 'q26', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', leetcodeLink: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', completed: false, order: 26 },
      // Linked List
      { id: 'q27', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/', completed: false, order: 27 },
      { id: 'q28', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/', completed: false, order: 28 },
      { id: 'q29', title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/', completed: false, order: 29 },
      { id: 'q30', title: 'LRU Cache', difficulty: 'Medium', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/lru-cache/', completed: false, order: 30 },
    ],
  },
  {
    id: 'striver-sde',
    name: "Striver's SDE Sheet",
    description: 'Top 191 coding interview questions by Striver (TakeUForward). Industry standard prep sheet.',
    author: 'Striver',
    totalCount: 10,
    questions: [
      { id: 'sq1', title: 'Sort an array of 0s, 1s and 2s', difficulty: 'Easy', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/sort-colors/', completed: false, order: 1 },
      { id: 'sq2', title: 'Find the duplicate in an array', difficulty: 'Medium', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/find-the-duplicate-number/', completed: false, order: 2 },
      { id: 'sq3', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/merge-intervals/', completed: false, order: 3 },
      { id: 'sq4', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/next-permutation/', completed: false, order: 4 },
      { id: 'sq5', title: 'Reverse Pairs', difficulty: 'Hard', topic: 'Arrays', leetcodeLink: 'https://leetcode.com/problems/reverse-pairs/', completed: false, order: 5 },
      { id: 'sq6', title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/add-two-numbers/', completed: false, order: 6 },
      { id: 'sq7', title: 'Flatten a Linked List', difficulty: 'Medium', topic: 'Linked List', leetcodeLink: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/', completed: false, order: 7 },
      { id: 'sq8', title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', leetcodeLink: 'https://leetcode.com/problems/n-queens/', completed: false, order: 8 },
      { id: 'sq9', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', leetcodeLink: 'https://leetcode.com/problems/sudoku-solver/', completed: false, order: 9 },
      { id: 'sq10', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', leetcodeLink: 'https://leetcode.com/problems/trapping-rain-water/', completed: false, order: 10 },
    ],
  },
];
