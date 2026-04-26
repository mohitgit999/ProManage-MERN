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

  if (!user) return null;

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
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                isActive('/dashboard')
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300 border-primary-500/20 shadow-lg shadow-primary-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-main hover:bg-primary-500/5 shadow-sm'
              }`}
            >
              <HiOutlineViewGrid className="text-lg" />
              Dashboard
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                isAboutActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300 border-primary-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 border-main hover:bg-primary-500/5 shadow-sm'
              }`}
            >
              <HiOutlineInformationCircle className="text-lg" />
              About Us
            </Link>
          </div>

          {/* User + Theme + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-primary-500"
              style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <HiOutlineMoon className="text-xl" /> : <HiOutlineSun className="text-xl" />}
            </button>
            
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
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400"
            >
              {theme === 'light' ? <HiOutlineMoon className="text-xl" /> : <HiOutlineSun className="text-xl" />}
            </button>
            <button
              className="text-gray-500 dark:text-gray-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t animate-fade-in" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/dashboard"
              className="sidebar-link"
              onClick={() => setMenuOpen(false)}
            >
              <HiOutlineViewGrid /> Dashboard
            </Link>
            <Link
              to="/about"
              className={`sidebar-link ${isAboutActive ? 'bg-primary-500/10 text-primary-600' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <HiOutlineInformationCircle /> About Us
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineUser />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl"
              >
                <HiOutlineLogout /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
