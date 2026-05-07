import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Github, Search, Star, ExternalLink, Code2, Users, BookOpen } from 'lucide-react';
import api from '../api/axios';
import { GitHubAnalysis } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function GitHub() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.githubUsername || '');

  const analyzeMutation = useMutation({
    mutationFn: (uname: string) => api.get(`/github/analyze/${uname}`).then((r) => r.data),
    onSuccess: async () => {
      if (username !== user?.githubUsername) {
        await updateProfile({ githubUsername: username });
      }
      toast.success('GitHub profile analyzed!');
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      const msg = err?.response?.data?.error || 'GitHub user not found or API error';
      toast.error(msg);
    },
  });

  const data: GitHubAnalysis | undefined = analyzeMutation.data;

  const langColors: Record<string, string> = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-400',
    Python: 'bg-blue-500',
    Java: 'bg-orange-500',
    'C++': 'bg-pink-500',
    C: 'bg-gray-400',
    Go: 'bg-cyan-400',
    Rust: 'bg-orange-600',
    Ruby: 'bg-red-500',
    Swift: 'bg-orange-400',
  };

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Github size={24} /> GitHub Analyzer
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Analyze your GitHub profile to surface DSA repos and coding stats</p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input pl-9"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && username && analyzeMutation.mutate(username)}
            />
          </div>
          <button
            onClick={() => username && analyzeMutation.mutate(username)}
            disabled={!username || analyzeMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {analyzeMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="card">
            <div className="flex items-start gap-4">
              <img src={data.profile.avatar_url} alt={data.profile.login} className="w-16 h-16 rounded-full border-2 border-dark-600" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-100">{data.profile.name || data.profile.login}</h2>
                  <a href={data.profile.html_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-400">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">@{data.profile.login}</p>
                {data.profile.bio && <p className="text-slate-300 text-sm mt-1">{data.profile.bio}</p>}
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Users size={13} /> {data.profile.followers} followers</span>
                  <span className="flex items-center gap-1"><BookOpen size={13} /> {data.profile.public_repos} repos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-slate-100">{data.stats.totalRepos}</div>
              <div className="text-slate-400 text-sm">Total Repos</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-brand-400">{data.stats.dsaRepos}</div>
              <div className="text-slate-400 text-sm">DSA Repos</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-400">{data.stats.totalStars}</div>
              <div className="text-slate-400 text-sm">Total Stars</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-400">{data.stats.topLanguages[0]?.lang || '—'}</div>
              <div className="text-slate-400 text-sm">Top Language</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages */}
            <div className="card">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Code2 size={16} className="text-brand-400" /> Language Distribution
              </h3>
              <div className="space-y-3">
                {data.stats.topLanguages.map(({ lang, count }) => {
                  const pct = Math.round((count / data.stats.totalRepos) * 100);
                  return (
                    <div key={lang}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${langColors[lang] || 'bg-slate-500'}`} />
                          <span className="text-slate-300">{lang}</span>
                        </div>
                        <span className="text-slate-500">{count} repos ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full">
                        <div className={`h-1.5 rounded-full ${langColors[lang] || 'bg-slate-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DSA Repos */}
            <div className="card">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-purple-400" /> DSA Repositories
              </h3>
              {data.dsaRepos.length === 0 ? (
                <p className="text-slate-500 text-sm">No DSA-related repos found</p>
              ) : (
                <div className="space-y-3">
                  {data.dsaRepos.map((repo) => (
                    <div key={repo.name} className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 text-sm font-medium truncate block">
                          {repo.name}
                        </a>
                        {repo.description && <p className="text-xs text-slate-500 truncate">{repo.description}</p>}
                        {repo.language && <span className="text-xs text-slate-600">{repo.language}</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                        <Star size={12} /> {repo.stars}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!data && !analyzeMutation.isPending && (
        <div className="card text-center py-16">
          <Github size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-400 font-medium mb-2">Enter a GitHub username</h3>
          <p className="text-slate-500 text-sm">We'll analyze their repos and surface DSA-related projects</p>
        </div>
      )}
    </div>
  );
}
