import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineServer, 
  HiOutlineUserGroup, 
  HiOutlineBriefcase, 
  HiOutlineShieldCheck,
  HiOutlineChartPie,
  HiOutlineRefresh,
  HiOutlineDotsVertical
} from 'react-icons/hi';
import axios from '../api/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    totalMembers: 0,
    systemStatus: 'Optimal'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // In a real app, these would be admin-only endpoints
        const res = await axios.get('/projects');
        setStats(prev => ({
          ...prev,
          totalProjects: res.data.length,
          activeTasks: res.data.reduce((acc, p) => acc + p.tasks.length, 0),
          totalMembers: 12, // Mocked
        }));
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen bg-main pt-24 pb-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-main flex items-center gap-3">
              <HiOutlineServer className="text-purple-600" />
              Admin Terminal
            </h1>
            <p className="text-muted mt-1">System-wide overview and management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <HiOutlineRefresh /> Refresh Logs
            </button>
            <button className="btn-primary flex items-center gap-2 shadow-purple-500/20 bg-purple-600 hover:bg-purple-700">
              <HiOutlineShieldCheck /> Security Audit
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Projects', value: stats.totalProjects, icon: HiOutlineBriefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Tasks', value: stats.activeTasks, icon: HiOutlineChartPie, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Team Members', value: stats.totalMembers, icon: HiOutlineUserGroup, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'System Health', value: stats.systemStatus, icon: HiOutlineShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          ].map((item, i) => (
            <div key={i} className="card p-6 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <item.icon className={`text-2xl ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="text-2xl font-bold text-main">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity / Logs */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="px-6 py-4 border-b border-main flex items-center justify-between">
              <h2 className="font-bold text-main">System Activity Logs</h2>
              <button className="text-muted hover:text-main"><HiOutlineDotsVertical /></button>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-alt/50 text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-6 py-3 font-semibold">User</th>
                    <th className="px-6 py-3 font-semibold">Action</th>
                    <th className="px-6 py-3 font-semibold">Time</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-main">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <tr key={i} className="hover:bg-alt/30 transition-colors text-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600 font-bold text-xs">
                            {['JD', 'AS', 'MK', 'LR', 'BT'][i]}
                          </div>
                          <span className="text-main font-medium">User_{i + 100}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">Created new project</td>
                      <td className="px-6 py-4 text-muted">{i * 5 + 2} mins ago</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">SUCCESS</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-main mb-4">Quick Management</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl hover:bg-alt text-sm text-main transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-600">
                    <HiOutlineUserGroup />
                  </div>
                  Invite New Member
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-alt text-sm text-main transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-600">
                    <HiOutlineServer />
                  </div>
                  System Config
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-alt text-sm text-main transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-600">
                    <HiOutlineShieldCheck />
                  </div>
                  Permissions Map
                </button>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-primary-600 to-purple-700 text-white border-none shadow-xl shadow-primary-600/20">
              <h3 className="font-bold text-lg mb-2">Admin Support</h3>
              <p className="text-white/80 text-sm mb-4">Need help managing your team's workspace? Contact our priority support.</p>
              <button className="w-full bg-white text-primary-600 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                Contact Enterprise Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
