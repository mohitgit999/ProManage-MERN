import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineViewGrid,
  HiOutlinePlus,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineInformationCircle,
  HiOutlineChartBar,
} from 'react-icons/hi';
import { MdOutlineTask } from 'react-icons/md';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAboutActive = location.pathname === '/about';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/5" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-105">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.3)] group-hover:shadow-primary-500/50 transition-all duration-300 border border-white/10">
              <MdOutlineTask className="text-white text-xl" />
            </div>
            <span className="font-extrabold text-2xl text-gradient tracking-tight">ProManage</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border-2 ${
                    isActive('/dashboard')
                      ? 'bg-primary-600 text-white border-primary-500 shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md'
                  }`}
                  style={!isActive('/dashboard') ? { background: 'var(--glass-bg)' } : {}}
                >
                  <HiOutlineViewGrid className="text-lg" />
                  Dashboard
                </Link>
                {user?.email?.toLowerCase() === 'searx@gmail.com' && (
                  <Link
                    to="/admin/analytics"
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border-2 ${
                      isActive('/admin/analytics')
                        ? 'bg-primary-600 text-white border-primary-500 shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] scale-105'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md'
                    }`}
                    style={!isActive('/admin/analytics') ? { background: 'var(--glass-bg)' } : {}}
                  >
                    <HiOutlineChartBar className="text-lg" />
                    Analytics
                  </Link>
                )}
                <Link
                  to="/about"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border-2 ${
                    isAboutActive
                      ? 'bg-primary-600 text-white border-primary-500 shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md'
                  }`}
                  style={!isAboutActive ? { background: 'var(--glass-bg)' } : {}}
                >
                  <HiOutlineInformationCircle className="text-lg" />
                  About Us
                </Link>
              </>
            ) : (
              <>
                <a
                  href="/#features"
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-all duration-300 border-2 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md"
                  style={{ background: 'var(--glass-bg)' }}
                >
                  Features
                </a>
                <Link
                  to="/about"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border-2 ${
                    isAboutActive
                      ? 'bg-primary-600 text-white border-primary-500 shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md'
                  }`}
                  style={!isAboutActive ? { background: 'var(--glass-bg)' } : {}}
                >
                  About Us
                </Link>
                <a
                  href="/#pricing"
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-all duration-300 border-2 border-white/50 hover:border-primary-400 hover:bg-white/10 backdrop-blur-md"
                  style={{ background: 'var(--glass-bg)' }}
                >
                  Pricing
                </a>
              </>
            )}
          </div>

          {/* User + Theme + Logout/Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-primary-500"
              style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}
            >
              {theme === 'light' ? <HiOutlineMoon className="text-xl" /> : <HiOutlineSun className="text-xl" />}
            </button>
            
            {user ? (
              <>
                <Link 
                  to="/settings" 
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all duration-300 hover:-translate-y-1 ${
                    isActive('/settings') 
                    ? 'bg-primary-500/10 border-primary-500/20 shadow-lg' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                  style={!isActive('/settings') ? { background: 'var(--glass-bg)', borderColor: 'var(--border-color)' } : {}}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium transition-colors" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-500/10"
                >
                  <HiOutlineLogout className="text-lg" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors px-3">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2.5 text-sm font-bold shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)]">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400">
              {theme === 'light' ? <HiOutlineMoon className="text-xl" /> : <HiOutlineSun className="text-xl" />}
            </button>
            <button className="text-gray-500 dark:text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t animate-fade-in" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" className="sidebar-link" onClick={() => setMenuOpen(false)}>
                  <HiOutlineViewGrid /> Dashboard
                </Link>
                <Link to="/about" className={`sidebar-link ${isAboutActive ? 'bg-primary-500/10 text-primary-600' : ''}`} onClick={() => setMenuOpen(false)}>
                  <HiOutlineInformationCircle /> About Us
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>
                    <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">{user.name.charAt(0)}</div>
                    <span>{user.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl">
                    <HiOutlineLogout /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="sidebar-link" onClick={() => setMenuOpen(false)}>Features</a>
                <Link to="/about" className="sidebar-link" onClick={() => setMenuOpen(false)}>About Us</Link>
                <a href="#pricing" className="sidebar-link" onClick={() => setMenuOpen(false)}>Pricing</a>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2 space-y-2">
                  <Link to="/login" className="sidebar-link" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn-primary w-full text-center py-3 block" onClick={() => setMenuOpen(false)}>Sign up</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
