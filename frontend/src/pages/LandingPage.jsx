import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdOutlineTask } from 'react-icons/md';
import { HiOutlineArrowRight, HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* --- Mobile Menu Drawer --- */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-main/95 backdrop-blur-xl animate-fade-in flex flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MdOutlineTask className="text-white" />
              </div>
              <span className="font-bold text-main">ProManage</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-main">
              <HiOutlineX size={28} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-2xl font-bold text-main">
            <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-primary-600 transition-colors">Features</a>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-primary-600 transition-colors">About Us</Link>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="hover:text-primary-600 transition-colors">Pricing</a>
            <div className="pt-8 flex flex-col items-center gap-4 w-full px-8">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-muted">Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center">Sign up</Link>
            </div>
          </div>
        </div>
      )}

      {/* --- Minimalist Navigation --- */}
      <nav className="relative z-20 px-4 py-4 md:px-12 md:py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-shadow">
            <MdOutlineTask className="text-white text-base sm:text-lg" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-main tracking-tight">ProManage</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-muted">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
          <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-alt/50 border border-main text-main hover:bg-alt transition-all duration-300"
            title="Toggle theme"
          >
            {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>

          <button 
            className="md:hidden p-2 text-main"
            onClick={() => setMenuOpen(true)}
          >
            <HiOutlineMenu size={24} />
          </button>

          {user ? (
            <Link to="/dashboard" className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 flex items-center gap-2">
              Dashboard <HiOutlineArrowRight className="hidden xs:block" />
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
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
            className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group shadow-xl animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Get Started <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Features Grid --- */}
        <div id="features" className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 px-4 animate-slide-up">
          {[
            { title: "Insightful Statistics", desc: "Get a high-level view of your productivity with automated project tracking.", icon: "📈" },
            { title: "Custom Workflows", desc: "Specialized columns for Tasks, Issues, and Backlogs to streamline your team.", icon: "📋" },
            { title: "Resource Integration", desc: "Attach Live URLs, GitHub repos, and Documentation directly to your projects.", icon: "🔗" },
            { title: "Project Categories", desc: "Organize your workspace with unique color-coding and priority levels.", icon: "🎨" },
            { title: "Secure Accounts", desc: "Robust user authentication powered by JWT to keep your data private.", icon: "🛡️" },
            { title: "Real-time Dashboard", desc: "A powerful, responsive overview of all your projects at a single glance.", icon: "📊" }
          ].map((feature, i) => (
            <div key={i} className="card p-8 group hover:scale-[1.02] transition-all duration-500 flex flex-col items-center text-center">
              <div className="text-4xl mb-6 bg-alt w-16 h-16 flex items-center justify-center rounded-2xl border border-main group-hover:border-primary-500/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-main mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* --- About Section --- */}
        <div id="about" className="max-w-6xl mx-auto mt-40 px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-main mb-6 tracking-tight">Built for modern teams.</h2>
          <p className="text-muted text-lg max-w-3xl mx-auto leading-relaxed mb-16">
            ProManage was created with one goal in mind: to remove the noise from project management. We believe that tools should be elegant, fast, and helpful, not complicated.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="card p-8 border-l-4 border-l-primary-500">
              <h4 className="text-xl font-bold text-main mb-4">Our Mission</h4>
              <p className="text-muted leading-relaxed">To provide developers and teams with a workspace that inspires productivity through beautiful design and seamless functionality.</p>
            </div>
            <div className="card p-8 border-l-4 border-l-purple-500">
              <h4 className="text-xl font-bold text-main mb-4">Our Vision</h4>
              <p className="text-muted leading-relaxed">A world where project management is no longer a chore, but an elegant experience that teams actually look forward to using every day.</p>
            </div>
          </div>
        </div>

        {/* --- Pricing Section --- */}
        <div id="pricing" className="max-w-6xl mx-auto mt-40 px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-main mb-6 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-muted text-lg mb-16">Everything you need to manage your projects, completely free for a limited time.</p>
          <div className="max-w-lg mx-auto">
            <div className="card p-10 border-2 border-primary-500 relative overflow-visible">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold text-main mb-2">Pro Plan</h3>
              <div className="text-5xl font-extrabold text-main mb-6">$0<span className="text-lg text-muted font-normal">/mo</span></div>
              <ul className="text-left space-y-4 mb-10">
                <li className="flex items-center gap-3 text-main"><span className="text-primary-500 text-xl">✓</span> Unlimited Projects</li>
                <li className="flex items-center gap-3 text-main"><span className="text-primary-500 text-xl">✓</span> All Premium Themes</li>
                <li className="flex items-center gap-3 text-main"><span className="text-primary-500 text-xl">✓</span> Team Collaboration</li>
                <li className="flex items-center gap-3 text-main"><span className="text-primary-500 text-xl">✓</span> Advanced Analytics</li>
              </ul>
              <Link to="/register" className="btn-primary w-full inline-block">Get Started Free</Link>
            </div>
          </div>
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
