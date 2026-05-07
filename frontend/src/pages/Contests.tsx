import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { ContestEntry } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ContestForm {
  contestName: string;
  rank: string;
  rating: string;
  ratingChange: string;
  date: string;
  platform: string;
}

const defaultForm: ContestForm = {
  contestName: '', rank: '', rating: '', ratingChange: '', date: new Date().toISOString().split('T')[0], platform: 'LeetCode',
};

export default function Contests() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ContestForm>(defaultForm);

  const { data: contests = [], isLoading } = useQuery<ContestEntry[]>({
    queryKey: ['contests'],
    queryFn: () => api.get('/contests').then((r) => r.data),
  });

  const { data: ratingHistory = [] } = useQuery({
    queryKey: ['rating-history'],
    queryFn: () => api.get('/contests/rating-history').then((r) => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: ContestForm) => api.post('/contests', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contests'] });
      qc.invalidateQueries({ queryKey: ['rating-history'] });
      toast.success('Contest added!');
      setShowModal(false);
      setForm(defaultForm);
    },
    onError: () => toast.error('Failed to add contest'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contests/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contests'] });
      qc.invalidateQueries({ queryKey: ['rating-history'] });
      toast.success('Removed');
    },
  });

  const chartData = ratingHistory.map((c: ContestEntry) => ({
    name: c.contestName.replace('LeetCode ', '').replace('Weekly Contest ', 'WC ').replace('Biweekly Contest ', 'BC '),
    rating: c.rating,
    date: format(new Date(c.date), 'MMM d'),
  }));

  const latestRating = contests.find((c) => c.rating)?.rating;
  const bestRank = contests.reduce((best, c) => (c.rank && (!best || c.rank < best) ? c.rank : best), 0 as number);

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100">Contest Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">Track your competitive programming journey</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} /> Add Contest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="card text-center">
          <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{contests.length}</div>
          <div className="text-slate-400 text-sm">Contests Participated</div>
        </div>
        <div className="card text-center">
          <TrendingUp size={24} className="text-brand-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{latestRating ? Math.round(latestRating) : '—'}</div>
          <div className="text-slate-400 text-sm">Current Rating</div>
        </div>
        <div className="card text-center">
          <Trophy size={24} className="text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{bestRank || '—'}</div>
          <div className="text-slate-400 text-sm">Best Rank</div>
        </div>
      </div>

      {/* Rating Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <h2 className="font-semibold text-slate-200 mb-4">Rating Progression</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line type="monotone" dataKey="rating" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Contest List */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-700">
          <h2 className="font-semibold text-slate-200">Contest History</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />)}
          </div>
        ) : contests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Trophy size={32} className="mx-auto mb-2 opacity-30" />
            No contests yet. Add your first one!
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {contests.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-dark-700/30 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{c.contestName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{format(new Date(c.date), 'MMM d, yyyy')} · {c.platform}</p>
                </div>
                {c.rank && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-200">#{c.rank}</div>
                    <div className="text-xs text-slate-500">Rank</div>
                  </div>
                )}
                {c.rating && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-200">{Math.round(c.rating)}</div>
                    <div className="text-xs text-slate-500">Rating</div>
                  </div>
                )}
                {c.ratingChange !== undefined && c.ratingChange !== null && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${c.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {c.ratingChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {c.ratingChange >= 0 ? '+' : ''}{Math.round(c.ratingChange)}
                  </div>
                )}
                <button onClick={() => deleteMutation.mutate(c.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-100">Add Contest</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(form); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Contest Name *</label>
                <input className="input" placeholder="LeetCode Weekly Contest 420" value={form.contestName} onChange={(e) => setForm({ ...form, contestName: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Platform</label>
                  <select className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                    <option>LeetCode</option>
                    <option>Codeforces</option>
                    <option>CodeChef</option>
                    <option>HackerRank</option>
                    <option>AtCoder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Date *</label>
                  <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Rank</label>
                  <input type="number" className="input" placeholder="1234" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Rating</label>
                  <input type="number" className="input" placeholder="1500" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Change</label>
                  <input type="number" className="input" placeholder="+25" value={form.ratingChange} onChange={(e) => setForm({ ...form, ratingChange: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={addMutation.isPending} className="btn-primary flex-1">
                  {addMutation.isPending ? 'Saving...' : 'Add Contest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
