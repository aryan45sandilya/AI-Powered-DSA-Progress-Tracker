import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';
import { DSA_SHEETS } from '../data/dsaSheets';
import { DSASheet, DSASheetQuestion } from '../types';

type CompletedMap = Record<string, boolean>;

export default function DSASheets() {
  const [completed, setCompleted] = useState<CompletedMap>(() => {
    try {
      return JSON.parse(localStorage.getItem('dsa-sheet-progress') || '{}');
    } catch {
      return {};
    }
  });
  const [expandedSheet, setExpandedSheet] = useState<string>(DSA_SHEETS[0].id);
  const [filterTopic, setFilterTopic] = useState('');

  useEffect(() => {
    localStorage.setItem('dsa-sheet-progress', JSON.stringify(completed));
  }, [completed]);

  const toggle = (questionId: string) => {
    setCompleted((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const getProgress = (sheet: DSASheet) => {
    const done = sheet.questions.filter((q) => completed[q.id]).length;
    return { done, total: sheet.questions.length, pct: Math.round((done / sheet.questions.length) * 100) };
  };

  const getTopics = (sheet: DSASheet) => {
    return [...new Set(sheet.questions.map((q) => q.topic))].sort();
  };

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100">DSA Sheets</h1>
        <p className="text-slate-400 mt-1 text-sm">Follow curated problem sets and track your progress</p>
      </div>

      <div className="space-y-4">
        {DSA_SHEETS.map((sheet) => {
          const { done, total, pct } = getProgress(sheet);
          const isExpanded = expandedSheet === sheet.id;
          const topics = getTopics(sheet);
          const filteredQuestions = filterTopic && isExpanded
            ? sheet.questions.filter((q) => q.topic === filterTopic)
            : sheet.questions;

          return (
            <div key={sheet.id} className="card p-0 overflow-hidden">
              {/* Sheet Header */}
              <button
                onClick={() => setExpandedSheet(isExpanded ? '' : sheet.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-dark-700/30 transition-colors"
              >
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-1">
                    <h2 className="font-semibold text-slate-100 text-lg">{sheet.name}</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{sheet.description}</p>
                    <p className="text-slate-500 text-xs mt-1">by {sheet.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-100">{done}<span className="text-slate-500 text-base font-normal">/{total}</span></div>
                    <div className="text-xs text-slate-500">{pct}% complete</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="#22c55e" strokeWidth="3"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-400">{pct}%</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </button>

              {/* Progress Bar */}
              <div className="h-1 bg-dark-700">
                <div className="h-1 bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>

              {/* Questions */}
              {isExpanded && (
                <div className="p-6 pt-4">
                  {/* Topic filter */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    <button
                      onClick={() => setFilterTopic('')}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${!filterTopic ? 'bg-brand-500 text-white' : 'bg-dark-700 text-slate-400 hover:bg-dark-600'}`}
                    >
                      All
                    </button>
                    {topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterTopic(t === filterTopic ? '' : t)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${filterTopic === t ? 'bg-brand-500 text-white' : 'bg-dark-700 text-slate-400 hover:bg-dark-600'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {filteredQuestions.map((q: DSASheetQuestion) => (
                      <div
                        key={q.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${completed[q.id] ? 'bg-brand-500/5 border border-brand-500/20' : 'hover:bg-dark-700/50'}`}
                      >
                        <button onClick={() => toggle(q.id)} className="flex-shrink-0">
                          {completed[q.id]
                            ? <CheckCircle2 size={20} className="text-brand-500" />
                            : <Circle size={20} className="text-slate-600 hover:text-slate-400" />
                          }
                        </button>
                        <span className="text-slate-500 text-xs w-6 text-right">{q.order}.</span>
                        <span className={`flex-1 text-sm ${completed[q.id] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                          {q.title}
                        </span>
                        <span className="text-xs bg-dark-700 text-slate-400 px-2 py-0.5 rounded-full hidden sm:block">{q.topic}</span>
                        <DifficultyBadge difficulty={q.difficulty} />
                        {q.leetcodeLink && (
                          <a href={q.leetcodeLink} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-400 flex-shrink-0">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
