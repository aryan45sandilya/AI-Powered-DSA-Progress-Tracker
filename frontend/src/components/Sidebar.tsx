import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, BookOpen, Trophy,
  Brain, Github, FileText, Activity, LogOut, Code2, User, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracker', icon: CheckSquare, label: 'Tracker' },
  { to: '/sheets', icon: BookOpen, label: 'DSA Sheets' },
  { to: '/contests', icon: Trophy, label: 'Contests' },
  { to: '/ai', icon: Brain, label: 'AI Analyzer' },
  { to: '/github', icon: Github, label: 'GitHub' },
  { to: '/resume', icon: FileText, label: 'Resume' },
  { to: '/heatmap', icon: Activity, label: 'Heatmap' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-100">DSA Tracker</span>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-200 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-dark-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-800 border-b border-dark-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <Code2 size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-100">DSA Tracker</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-slate-400 hover:text-slate-200 p-1"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-dark-800 border-r border-dark-700 z-50 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-dark-800 border-r border-dark-700 flex-col h-screen sticky top-0 flex-shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
