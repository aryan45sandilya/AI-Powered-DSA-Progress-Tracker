import { useQuery } from '@tanstack/react-query';
import { CheckSquare, Flame, Trophy, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import StreakBadge from '../components/StreakBadge';
import DifficultyBadge from '../components/DifficultyBadge';
import { TrackerStats } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<TrackerStats>({
    queryKey: ['tracker-stats'],
    queryFn: () => api.get('/tracker/stats').then((r) => r.data),
  });

  const difficultyData = stats?.byDifficulty.map((d) => ({
    name: d.difficulty,
    value: d._count,
  })) || [];

  const easy = stats?.byDifficulty.find((d) => d.difficulty === 'Easy')?._count || 0;
  const medium = stats?.byDifficulty.find((d) => d.difficulty === 'Medium')?._count || 0;
  const hard = stats?.byDifficulty.find((d) => d.difficulty === 'Hard')?._count || 0;

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-700 rounded w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-dark-700 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here's your DSA progress overview</p>
        </div>
        {stats && stats.streak > 0 && <StreakBadge streak={stats.streak} size="lg" />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatsCard title="Total Solved" value={stats?.total || 0} icon={CheckSquare} color="green" subtitle="All time" />
        <StatsCard title="Easy" value={easy} icon={TrendingUp} color="green" subtitle="Problems" />
        <StatsCard title="Medium" value={medium} icon={TrendingUp} color="yellow" subtitle="Problems" />
        <StatsCard title="Hard" value={hard} icon={TrendingUp} color="red" subtitle="Problems" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Difficulty Pie */}
        <div className="card">
          <h2 className="font-semibold text-slate-200 mb-4">Difficulty Breakdown</h2>
          {difficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {difficultyData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              No data yet. Start solving!
            </div>
          )}
          <div className="flex justify-center gap-4 mt-2">
            {['Easy', 'Medium', 'Hard'].map((d, i) => (
              <div key={d} className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Top Topics */}
        <div className="card">
          <h2 className="font-semibold text-slate-200 mb-4">Top Topics</h2>
          <div className="space-y-3">
            {stats?.byTopic.slice(0, 6).map(({ topic, _count }) => {
              const pct = stats.total > 0 ? Math.round((_count / stats.total) * 100) : 0;
              return (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{topic}</span>
                    <span className="text-slate-500">{_count}</span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full">
                    <div className="h-1.5 bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!stats?.byTopic || stats.byTopic.length === 0) && (
              <p className="text-slate-500 text-sm">No topics yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200">Recent Activity</h2>
            <Link to="/tracker" className="text-brand-400 text-xs hover:text-brand-300 flex items-center gap-1">
              View all <ExternalLink size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentActivity.map((q) => (
              <div key={q.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{q.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DifficultyBadge difficulty={q.difficulty || ''} />
                    <span className="text-xs text-slate-600">
                      {q.solvedAt ? formatDistanceToNow(new Date(q.solvedAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-slate-500 text-sm">No activity yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/tracker', icon: CheckSquare, label: 'Log a Problem', color: 'text-green-400' },
            { to: '/sheets', icon: Trophy, label: 'DSA Sheets', color: 'text-blue-400' },
            { to: '/ai', icon: Flame, label: 'AI Analysis', color: 'text-purple-400' },
            { to: '/heatmap', icon: Clock, label: 'View Heatmap', color: 'text-orange-400' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
              <Icon size={18} className={color} />
              <span className="text-sm text-slate-300">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
