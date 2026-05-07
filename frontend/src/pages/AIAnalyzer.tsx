import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Brain, Zap, AlertTriangle, CheckCircle, Lightbulb, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import DifficultyBadge from '../components/DifficultyBadge';
import { WeakTopicAnalysis, Recommendation } from '../types';
import toast from 'react-hot-toast';

export default function AIAnalyzer() {
  const [analysis, setAnalysis] = useState<WeakTopicAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [level, setLevel] = useState('intermediate');

  const analyzeMutation = useMutation({
    mutationFn: () => api.post('/ai/analyze').then((r) => r.data),
    onSuccess: (data: WeakTopicAnalysis) => {
      setAnalysis(data);
      toast.success('Analysis complete!');
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      toast.error(err?.response?.data?.error || 'Analysis failed. Make sure you have logged some problems first.');
    },
  });

  const recommendMutation = useMutation({
    mutationFn: () =>
      api.post('/ai/recommendations', {
        weakTopics: analysis?.weakTopics || [],
        level,
      }).then((r) => r.data),
    onSuccess: (data: Recommendation[]) => {
      setRecommendations(data);
      toast.success('Recommendations ready!');
    },
    onError: () => toast.error('Failed to get recommendations'),
  });

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Brain size={24} className="text-purple-400" /> AI Analyzer
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Powered by Google Gemini — analyzes your solving patterns to find weak spots</p>
      </div>

      {/* Analyze Button */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain size={24} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-100 mb-1">Weak Topic Analysis</h2>
            <p className="text-slate-400 text-sm mb-4">
              AI will analyze all your logged problems and identify topics where you need more practice.
            </p>
            <button
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {analyzeMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain size={16} /> Analyze My Progress
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card border-purple-500/20 bg-purple-500/5">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-relaxed">{analysis.analysis}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Topics */}
            <div className="card">
              <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-400" /> Weak Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.weakTopics.map((topic) => (
                  <span key={topic} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm px-3 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
                {analysis.weakTopics.length === 0 && (
                  <p className="text-slate-500 text-sm">No weak topics identified 🎉</p>
                )}
              </div>
            </div>

            {/* Strong Topics */}
            <div className="card">
              <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Strong Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.strongTopics.map((topic) => (
                  <span key={topic} className="bg-green-500/10 text-green-400 border border-green-500/20 text-sm px-3 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
                {analysis.strongTopics.length === 0 && (
                  <p className="text-slate-500 text-sm">Keep solving to build strengths!</p>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="card">
            <h3 className="font-semibold text-slate-200 mb-3">AI Suggestions</h3>
            <ul className="space-y-2">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Get Recommendations */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Zap size={16} className="text-orange-400" /> Personalized Recommendations
              </h3>
              <div className="flex items-center gap-3">
                <select
                  className="input w-auto text-sm py-1.5"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button
                  onClick={() => recommendMutation.mutate()}
                  disabled={recommendMutation.isPending}
                  className="btn-primary flex items-center gap-2 text-sm py-1.5"
                >
                  {recommendMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Get Recommendations
                </button>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="bg-dark-700 rounded-xl p-4 hover:bg-dark-600 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-slate-200 text-sm">{rec.title}</h4>
                      <DifficultyBadge difficulty={rec.difficulty} />
                    </div>
                    <span className="text-xs bg-dark-600 text-slate-400 px-2 py-0.5 rounded-full">{rec.topic}</span>
                    <p className="text-xs text-slate-500 mt-2">{rec.reason}</p>
                    {rec.leetcodeUrl && (
                      <a
                        href={rec.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 text-xs hover:text-brand-300 mt-2 inline-block"
                      >
                        Solve on LeetCode →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!analysis && !analyzeMutation.isPending && (
        <div className="card text-center py-16">
          <Brain size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-400 font-medium mb-2">No analysis yet</h3>
          <p className="text-slate-500 text-sm">Click "Analyze My Progress" to get AI-powered insights</p>
        </div>
      )}
    </div>
  );
}
