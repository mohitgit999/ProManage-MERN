import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdOutlineTask } from 'react-icons/md';
import { HiOutlineArrowRight, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you might pass this email to the register page
      navigate('/register', { state: { email } });
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-main">
      {/* --- Stunning CSS Background (Theme Aware Orbs) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 dark:bg-primary-600/20 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[150px] animate-float-delayed" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[100px] animate-float" />
        
        {/* Subtle grid pattern overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      {/* --- Minimalist Navigation --- */}
      <nav className="relative z-20 px-4 py-4 md:px-12 md:py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-shadow">
            <MdOutlineTask className="text-white text-base sm:text-lg" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-main tracking-tight">ProManage</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-main transition-colors">Features</a>
          <a href="#about" className="hover:text-main transition-colors">About</a>
          <a href="#pricing" className="hover:text-main transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-alt/50 border border-main text-main hover:bg-alt transition-all duration-300 mr-2"
            title="Toggle theme"
          >
            {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>

          {user ? (
            <Link to="/dashboard" className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 flex items-center gap-2">
              Dashboard <HiOutlineArrowRight className="hidden xs:block" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login" className="text-xs sm:text-sm font-medium text-muted hover:text-main transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pb-20">
        <div className="animate-slide-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 dark:text-primary-300 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-primary-500/20 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            ProManage 2.0 is now live
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-main tracking-tight mb-6 leading-[1.2] sm:leading-tight">
            Manage your projects <br className="hidden sm:block"/>
            <span className="text-gradient">with elegance.</span>
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            The beautifully simple, distraction-free project management tool designed for modern teams who appreciate great design.
          </p>

          <Link 
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-primary-500/20 animate-fade-in group"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Get Started <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Minimalist Features Section --- */}
        <div id="features" className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 px-4 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {[
            {
              title: "Insightful Statistics",
              desc: "Get a high-level view of your productivity with automated project statistics and status tracking.",
              icon: "📈"
            },
            {
              title: "Custom Workflows",
              desc: "Specialized columns for Tasks, Issues, Backlogs, and Errors to streamline your team's productivity.",
              icon: "📋"
            },
            {
              title: "Resource Integration",
              desc: "Attach Live URLs, GitHub repositories, and Documentation directly to your projects and tasks.",
              icon: "🔗"
            },
            {
              title: "Project Categories",
              desc: "Organize your workspace with unique color-coding, priority levels, and due-date tracking.",
              icon: "🎨"
            },
            {
              title: "Secure Accounts",
              desc: "Robust user authentication powered by JWT to keep your sensitive project data private and secure.",
              icon: "🛡️"
            },
            {
              title: "Real-time Dashboard",
              desc: "A powerful, responsive overview of all your active and completed projects at a single glance.",
              icon: "📊"
            }
          ].map((feature, i) => (
            <div key={i} className="card p-8 group hover:scale-[1.02] hover:bg-alt/50 transition-all duration-500 flex flex-col items-center text-center">
              <div className="text-4xl mb-6 bg-alt w-16 h-16 flex items-center justify-center rounded-2xl border border-main group-hover:border-primary-500/50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-main mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-40 py-12 border-t border-main text-center w-full">
          <p className="text-muted text-sm">
            &copy; {new Date().getFullYear()} ProManage. Built with ❤️ for developers.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
