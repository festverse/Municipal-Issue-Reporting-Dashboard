import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
      isActive
        ? 'text-blue-700 bg-blue-50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const isEngineerOrAdmin = user && (user.role === 'ENGINEER' || user.role === 'ADMIN');

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">

            <span className="text-lg font-bold text-slate-900">
              Civic Portal
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>Report Issue</NavLink>
            {isEngineerOrAdmin && (
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            )}
            {user && (
              <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-900 leading-none">{user.full_name || user.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden bg-white border-r border-slate-200 animate-slide-in-left p-6 flex flex-col shadow-xl">
            <Link to="/" className="flex items-center gap-2 mb-8" onClick={() => setMobileOpen(false)}>

              <span className="text-lg font-bold text-slate-900">
                Civic Portal
              </span>
            </Link>

            <div className="flex flex-col gap-1 flex-1">
              <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>Report Issue</NavLink>
              {isEngineerOrAdmin && (
                <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              )}
              {user && (
                <NavLink to="/analytics" className={linkClass} onClick={() => setMobileOpen(false)}>Analytics</NavLink>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                      {(user.full_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.full_name || user.email}</p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full text-sm text-slate-500 hover:text-rose-600 transition-colors py-2 rounded-lg hover:bg-rose-50 text-left px-3">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>Login</NavLink>
                  <NavLink to="/register" className="px-4 py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
