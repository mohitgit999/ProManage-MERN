import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const ADMIN_EMAIL = 'SEARX@gmail.com';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="card p-6 flex items-center gap-5 group hover:scale-[1.02] transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-extrabold text-main">{value?.toLocaleString() ?? '—'}</p>
      <p className="text-sm font-medium text-muted">{label}</p>
      {sub && <p className="text-xs text-primary-500 font-semibold mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/analytics/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-main">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted font-medium">Loading analytics...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-main">
      <div className="card p-10 text-center max-w-sm">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    </div>
  );

  const maxDaily = Math.max(...(stats?.dailyVisits?.map(d => d.count) || [1]));

  return (
    <div className="min-h-screen bg-main pt-20 pb-16 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-3 py-1.5 rounded-full text-xs font-bold border border-primary-500/20 mb-4">
              🔒 Admin Panel
            </div>
            <h1 className="text-4xl font-extrabold text-main tracking-tight">
              Website <span className="text-gradient">Analytics</span>
            </h1>
            <p className="text-muted mt-2">Managing ProManage traffic and users</p>
          </div>
          <button onClick={fetchStats} className="btn-primary text-sm px-6 py-2.5 self-start">
            🔄 Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Visitors" value={stats?.total} icon="👥" color="bg-primary-500/20" sub="All time" />
          <StatCard label="Registered Users" value={stats?.totalUsers} icon="👤" color="bg-orange-500/20" sub="Total signups" />
          <StatCard label="Visitors Today" value={stats?.today} icon="📅" color="bg-blue-500/20" sub="Last 24h" />
          <StatCard label="This Week" value={stats?.week} icon="📈" color="bg-green-500/20" sub="Last 7d" />
        </div>

        {/* Registered Users Table */}
        <div className="card p-6 mb-10 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-main">Registered Users</h3>
            <span className="text-xs font-bold bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full border border-primary-500/20">
              {stats?.usersList?.length || 0} Total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="py-3 px-4 text-muted font-semibold">Name</th>
                  <th className="py-3 px-4 text-muted font-semibold">Email</th>
                  <th className="py-3 px-4 text-muted font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.usersList?.map((u, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-main font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted font-medium">{u.email}</td>
                    <td className="py-4 px-4 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-main mb-6">Daily Visitors</h3>
            <div className="flex items-end gap-3 h-40">
              {stats?.dailyVisits?.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-purple-500"
                    style={{ height: `${Math.max(8, (d.count / maxDaily) * 100)}%` }}
                  />
                  <span className="text-[10px] text-muted">{d._id?.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-main mb-6">Device Usage</h3>
            <div className="space-y-4">
              {stats?.byDevice?.map((d, i) => {
                const pct = stats.total > 0 ? Math.round((d.count / stats.total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1 text-main font-medium">
                      <span>{d._id}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="h-2 rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-main mb-6">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 text-muted">Page</th>
                  <th className="py-3 px-4 text-muted">Browser</th>
                  <th className="py-3 px-4 text-muted">Source</th>
                  <th className="py-3 px-4 text-muted">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentVisits?.map((v, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 px-4 text-main font-mono">{v.page}</td>
                    <td className="py-3 px-4 text-muted">{v.browser}</td>
                    <td className="py-3 px-4 text-muted">{v.referrer}</td>
                    <td className="py-3 px-4 text-muted">{new Date(v.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
