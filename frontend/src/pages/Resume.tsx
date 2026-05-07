import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, Copy, Download, Sparkles, CheckCheck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Resume() {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [contestRating, setContestRating] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      // Optionally fetch LeetCode stats first
      let leetcodeStats = null;
      if (leetcodeUsername) {
        try {
          const res = await api.get(`/leetcode/stats/${leetcodeUsername}`);
          const solved = res.data.solved;
          if (solved) {
            leetcodeStats = {
              totalSolved: solved.solvedProblem || 0,
              easySolved: solved.easySolved || 0,
              mediumSolved: solved.mediumSolved || 0,
              hardSolved: solved.hardSolved || 0,
            };
          }
        } catch {
          // Continue without LeetCode stats
        }
      }

      const res = await api.post('/ai/resume', {
        leetcodeStats,
        contestRating: contestRating ? parseFloat(contestRating) : undefined,
      });
      return res.data.resumeText;
    },
    onSuccess: (text: string) => {
      setResumeText(text);
      toast.success('Resume section generated!');
    },
    onError: () => toast.error('Failed to generate resume section'),
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa-resume-section.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileText size={24} className="text-teal-400" /> Resume Generator
        </h1>
        <p className="text-slate-400 mt-1 text-sm">AI generates polished DSA bullet points for your resume</p>
      </div>

      {/* Input Card */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-200">Your Details (Optional)</h2>
        <p className="text-slate-400 text-sm">Provide your LeetCode username for more accurate stats. Otherwise we'll use your logged problems.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">LeetCode Username</label>
            <input
              className="input"
              placeholder="your_leetcode_username"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Contest Rating</label>
            <input
              type="number"
              className="input"
              placeholder="1500"
              value={contestRating}
              onChange={(e) => setContestRating(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="btn-primary flex items-center gap-2"
        >
          {generateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Generate Resume Section
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {resumeText && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-200">Generated Resume Section</h2>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 text-sm py-1.5">
                {copied ? <CheckCheck size={14} className="text-brand-400" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="btn-secondary flex items-center gap-2 text-sm py-1.5">
                <Download size={14} /> Download
              </button>
            </div>
          </div>

          <div className="bg-dark-700 rounded-xl p-5 border border-dark-600">
            <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{resumeText}</pre>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> Copy these bullet points into the "Skills" or "Projects" section of your resume. Customize the numbers and details to match your actual experience.
            </p>
          </div>
        </div>
      )}

      {!resumeText && !generateMutation.isPending && (
        <div className="card text-center py-16">
          <FileText size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-400 font-medium mb-2">Ready to generate</h3>
          <p className="text-slate-500 text-sm">Click the button above to create your DSA resume section</p>
        </div>
      )}
    </div>
  );
}
