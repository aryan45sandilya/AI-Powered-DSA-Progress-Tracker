import { Link } from 'react-router-dom';
import {
  Brain, Trophy, Activity, Github, FileText,
  CheckSquare, BookOpen, Flame, ArrowRight, Code2, Zap, Target
} from 'lucide-react';

const features = [
  { icon: CheckSquare, title: 'Question Tracker', desc: 'Log every solved problem with difficulty, topic, notes, and time taken.', color: 'text-green-400 bg-green-500/10' },
  { icon: BookOpen, title: 'DSA Sheets', desc: 'Follow curated sheets like Striver A2Z and track your progress.', color: 'text-blue-400 bg-blue-500/10' },
  { icon: Trophy, title: 'Contest Tracker', desc: 'Record contest rankings and visualize your rating progression over time.', color: 'text-yellow-400 bg-yellow-500/10' },
  { icon: Brain, title: 'AI Weak Topic Analyzer', desc: 'Gemini AI analyzes your solving patterns and pinpoints weak areas.', color: 'text-purple-400 bg-purple-500/10' },
  { icon: Zap, title: 'Smart Recommendations', desc: 'Get personalized problem recommendations based on your weak topics.', color: 'text-orange-400 bg-orange-500/10' },
  { icon: Flame, title: 'Streak System', desc: 'Build daily solving habits with streak tracking and visual rewards.', color: 'text-red-400 bg-red-500/10' },
  { icon: Github, title: 'GitHub Analyzer', desc: 'Analyze your GitHub profile to surface DSA repos and language stats.', color: 'text-slate-400 bg-slate-500/10' },
  { icon: FileText, title: 'Resume Generator', desc: 'AI generates polished DSA bullet points for your resume instantly.', color: 'text-teal-400 bg-teal-500/10' },
  { icon: Activity, title: 'Activity Heatmap', desc: 'GitHub-style heatmap showing your year-round solving consistency.', color: 'text-indigo-400 bg-indigo-500/10' },
];

const stats = [
  { value: '2000+', label: 'Problems Tracked' },
  { value: '50+', label: 'DSA Topics' },
  { value: 'AI', label: 'Powered Analysis' },
  { value: '∞', label: 'Streak Potential' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-dark-700 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 bg-dark-900/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg">DSA Tracker</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="btn-ghost text-sm px-3 py-1.5">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm px-3 py-1.5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full mb-5">
          <Brain size={13} />
          <span>AI-Powered DSA Progress Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
          Track. Analyze.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
            Improve.
          </span>
        </h1>
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 px-2">
          The smartest way for students to track LeetCode progress, identify weak topics with AI, and land their dream job.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">
            Sign in
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 border border-dark-700 rounded-2xl p-5 sm:p-8 bg-dark-800">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-brand-400">{value}</div>
              <div className="text-slate-500 text-xs sm:text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need to crack interviews</h2>
          <p className="text-slate-400 text-sm sm:text-base">Built specifically for students preparing for tech interviews.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card hover:border-dark-600 transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-700 py-20 text-center">
        <Target size={40} className="text-brand-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Ready to level up?</h2>
        <p className="text-slate-400 mb-8">Join thousands of students tracking their DSA journey.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
          Create free account <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="border-t border-dark-700 py-6 text-center text-slate-600 text-sm">
        © 2025 DSA Tracker. Built for students, by students.
      </footer>
    </div>
  );
}
