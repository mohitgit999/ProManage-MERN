import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineShieldCheck } from 'react-icons/hi';
import mohitAvatar from '/mohit_avatar_1777224438036.png';
import yuktiAvatar from '/yukti_avatar_1777224453742.png';

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-main transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Hero Section --- */}
        <div className="text-center mb-20 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-main tracking-tight mb-6 leading-tight">
            The Story Behind <span className="text-gradient">ProManage</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            We built ProManage to bridge the gap between complex management tools and the simplicity developers crave. 
            Our mission is to help teams build better products without the clutter.
          </p>
        </div>

        {/* --- How it Works --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            {
              title: "Plan with Clarity",
              desc: "Break down complex projects into manageable tasks and issues with our intuitive Kanban system.",
              icon: <HiOutlineLightBulb className="text-blue-500" />,
              bg: "bg-blue-500/10"
            },
            {
              title: "Fast Execution",
              desc: "Optimized for speed. Every interaction is designed to get you from 'Backlog' to 'Done' faster.",
              icon: <HiOutlineLightningBolt className="text-amber-500" />,
              bg: "bg-amber-500/10"
            },
            {
              title: "Built-in Quality",
              desc: "Track errors and issues directly within your project board to ensure every release is stable.",
              icon: <HiOutlineSparkles className="text-purple-500" />,
              bg: "bg-purple-500/10"
            },
            {
              title: "Secure Workspace",
              desc: "Your data is protected with industry-standard encryption, keeping your intellectual property safe.",
              icon: <HiOutlineShieldCheck className="text-green-500" />,
              bg: "bg-green-500/10"
            }
          ].map((item, i) => (
            <div key={i} className="card p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center text-2xl mb-6 border border-main`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-main mb-3">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- Meet the Founders --- */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-main text-center mb-16">Meet the Visionaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Founder Card */}
            <div className="card group overflow-hidden relative p-8 flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-purple-600" />
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={mohitAvatar} 
                  alt="Mohit Kumar" 
                  className="w-32 h-32 rounded-3xl object-cover relative border-4 border-white dark:border-gray-800 shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-main mb-1">Mohit Kumar</h3>
              <p className="text-primary-600 font-bold text-sm mb-4">Founder & Lead Architect</p>
              <p className="text-muted text-sm leading-relaxed mb-6">
                A full-stack visionary dedicated to creating tools that make developers' lives easier through clean code and stunning UI.
              </p>
              <div className="flex gap-4">
                <span className="badge badge-in-progress">Founder</span>
                <span className="badge badge-done">Tech Lead</span>
              </div>
            </div>

            {/* Co-Founder Card */}
            <div className="card group overflow-hidden relative p-8 flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600 to-primary-500" />
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={yuktiAvatar} 
                  alt="Yukti Kumari" 
                  className="w-32 h-32 rounded-3xl object-cover relative border-4 border-white dark:border-gray-800 shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-main mb-1">Yukti Kumari</h3>
              <p className="text-purple-600 font-bold text-sm mb-4">Co-Founder & Design Strategist</p>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Passionate about user experience and data-driven design, ensuring ProManage remains intuitive and elegant.
              </p>
              <div className="flex gap-4">
                <span className="badge badge-medium">Co-Founder</span>
                <span className="badge badge-low">Product Designer</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Join the Journey --- */}
        <div className="card p-12 text-center bg-gradient-to-br from-primary-600/5 to-purple-600/5 border-primary-500/10">
          <h2 className="text-2xl font-bold text-main mb-4">Ready to start your journey?</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">Join thousands of developers who are already managing their projects with elegance.</p>
          <a href="/register" className="btn-primary px-10 py-4 text-lg">Get Started Today</a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
