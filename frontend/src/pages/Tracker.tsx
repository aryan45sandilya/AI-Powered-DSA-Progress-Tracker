import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, ExternalLink, X, Filter } from 'lucide-react';
import api from '../api/axios';
import DifficultyBadge from '../components/DifficultyBadge';
import { SolvedQuestion, TOPICS } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface AddForm {
  title: string;
  difficulty: string;
  topic: string;
  url: string;
  notes: string;
  timeTaken: string;
}

const defaultForm: AddForm = { title: '', difficulty: 'Medium', topic: 'Arrays', url: '', notes: '', timeTaken: '' };

export default function Tracker() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AddForm>(defaultForm);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['questions', search, filterDiff, filterTopic, page],
    queryFn: () =>
      api.get('/tracker/questions', {
        params: { search, difficulty: filterDiff, topic: filterTopic, page, limit: 15 },
      }).then((r) => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: AddForm) => api.post('/tracker/questions', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['questions'] });
      qc.invalidateQueries({ queryKey: ['tracker-stats'] });
      toast.success('Problem logged!');
      setShowModal(false);
      setForm(defaultForm);
    },
    onError: () => toast.error('Failed to add problem'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tracker/questions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['questions'] });
      qc.invalidateQueries({ queryKey: ['tracker-stats'] });
      toast.success('Removed');
    },
  });

  const questions: SolvedQuestion[] = data?.questions || [];
  const total: number = data?.total || 0;
  const totalPages = Math.ceil(total / 15);

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100">Problem Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">{total} problems logged</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} /> Log Problem
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-40">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="input w-auto text-sm"
          value={filterDiff}
          onChange={(e) => { setFilterDiff(e.target.value); setPage(1); }}
        >
          <option value="">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select
          className="input w-auto text-sm hidden sm:block"
          value={filterTopic}
          onChange={(e) => { setFilterTopic(e.target.value); setPage(1); }}
        >
          <option value="">All Topics</option>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
        {(filterDiff || filterTopic || search) && (
          <button
            onClick={() => { setSearch(''); setFilterDiff(''); setFilterTopic(''); setPage(1); }}
            className="btn-ghost flex items-center gap-1 text-sm"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700 bg-dark-700/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Problem</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Topic</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Solved</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-dark-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <Filter size={32} className="mx-auto mb-2 opacity-30" />
                    No problems found. Log your first one!
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium text-sm">{q.title}</span>
                        {q.url && (
                          <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-400">
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      {q.notes && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{q.notes}</p>}
                    </td>
                    <td className="px-4 py-3"><DifficultyBadge difficulty={q.difficulty} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-dark-700 text-slate-300 px-2 py-0.5 rounded-full">{q.topic}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {q.timeTaken ? `${q.timeTaken}m` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {format(new Date(q.solvedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteMutation.mutate(q.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-700">
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-1 px-3 disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm py-1 px-3 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-100">Log a Problem</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); addMutation.mutate(form); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Problem Title *</label>
                <input className="input" placeholder="Two Sum" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Difficulty *</label>
                  <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Topic *</label>
                  <select className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">LeetCode URL</label>
                <input className="input" placeholder="https://leetcode.com/problems/..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Time Taken (minutes)</label>
                <input type="number" className="input" placeholder="30" value={form.timeTaken} onChange={(e) => setForm({ ...form, timeTaken: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
                <textarea className="input resize-none" rows={2} placeholder="Key insight, approach used..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={addMutation.isPending} className="btn-primary flex-1">
                  {addMutation.isPending ? 'Saving...' : 'Log Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
