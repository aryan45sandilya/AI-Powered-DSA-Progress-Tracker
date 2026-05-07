import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export default function Navbar({ onMenuToggle, showMenuButton = false }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors lg:hidden"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LT</span>
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">LeetTrack</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-500/20 border border-accent-500/30 rounded-full flex items-center justify-center">
                    <span className="text-accent-400 font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-dark-300 text-sm font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-1.5 px-3">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
