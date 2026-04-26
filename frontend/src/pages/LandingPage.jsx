import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdOutlineTask } from 'react-icons/md';
import { HiOutlineArrowRight } from 'react-icons/hi';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <nav className="relative z-10 px-6 py-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-shadow">
            <MdOutlineTask className="text-white text-lg" />
          </div>
          <span className="font-bold text-xl text-main tracking-wide">ProManage</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-main transition-colors">Features</a>
          <a href="#about" className="hover:text-main transition-colors">About</a>
          <a href="#pricing" className="hover:text-main transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-sm px-6 py-2 flex items-center gap-2">
              Go to Dashboard <HiOutlineArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted hover:text-main transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm px-6 py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pb-20">
        <div className="animate-slide-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-md mb-8 text-xs font-medium text-primary-600 dark:text-primary-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            ProManage 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-main tracking-tight mb-6 leading-tight">
            Manage your projects <br/>
            <span className="text-gradient">with elegance.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
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
