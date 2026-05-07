import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import leetcodeRoutes from './routes/leetcode';
import aiRoutes from './routes/ai';
import trackerRoutes from './routes/tracker';
import contestRoutes from './routes/contests';
import githubRoutes from './routes/github';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
