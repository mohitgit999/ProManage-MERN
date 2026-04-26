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
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-3 py-1.5 rounded-full text-xs font-bold border border-primary-500/20 mb-4">
            🔒 Admin Only
          </div>
          <h1 className="text-4xl font-extrabold text-main tracking-tight">
            Website <span className="text-gradient">Analytics</span>
          </h1>
          <p className="text-muted mt-2">Real-time visitor traffic for ProManage</p>
          <button
            onClick={fetchStats}
            className="mt-4 btn-primary text-sm px-5 py-2"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Visitors" value={stats?.total} icon="👥" color="bg-primary-500/20" sub="All time" />
          <StatCard label="Today" value={stats?.today} icon="📅" color="bg-blue-500/20" sub="Last 24 hours" />
          <StatCard label="This Week" value={stats?.week} icon="📈" color="bg-green-500/20" sub="Last 7 days" />
          <StatCard label="This Month" value={stats?.month} icon="🗓️" color="bg-purple-500/20" sub="Last 30 days" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Daily Visits Bar Chart */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-main mb-6">Daily Visits (Last 7 Days)</h3>
            {stats?.dailyVisits?.length === 0 ? (
              <p className="text-muted text-sm">No data yet.</p>
            ) : (
              <div className="flex items-end gap-3 h-40">
                {stats?.dailyVisits?.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-primary-500">{d.count}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-purple-500 transition-all duration-700"
                      style={{ height: `${Math.max(8, (d.count / maxDaily) * 100)}%` }}
                    />
                    <span className="text-[10px] text-muted">{d._id?.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-main mb-6">Devices</h3>
            <div className="space-y-4">
              {stats?.byDevice?.map((d, i) => {
                const icons = { desktop: '🖥️', mobile: '📱', tablet: '📲' };
                const pct = stats.total > 0 ? Math.round((d.count / stats.total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-main">{icons[d._id] || '💻'} {d._id}</span>
                      <span className="text-muted">{d.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {(!stats?.byDevice || stats.byDevice.length === 0) && <p className="text-muted text-sm">No data yet.</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Browser Breakdown */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-main mb-6">Browsers</h3>
            <div className="space-y-3">
              {stats?.byBrowser?.map((b, i) => {
                const icons = { Chrome: '🌐', Firefox: '🦊', Safari: '🧭', Edge: '💠', IE: '🗑️', Other: '❓' };
                const pct = stats.total > 0 ? Math.round((b.count / stats.total) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl w-8">{icons[b._id] || '🌐'}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-main">{b._id}</span>
                        <span className="text-muted">{b.count}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-primary-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!stats?.byBrowser || stats.byBrowser.length === 0) && <p className="text-muted text-sm">No data yet.</p>}
            </div>
          </div>

          {/* Top Pages */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-main mb-6">Top Pages</h3>
            <div className="space-y-3">
              {stats?.byPage?.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm font-medium text-main font-mono">{p._id || '/'}</span>
                  <span className="text-sm font-bold text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full">{p.count}</span>
                </div>
              ))}
              {(!stats?.byPage || stats.byPage.length === 0) && <p className="text-muted text-sm">No data yet.</p>}
            </div>
          </div>
        </div>

        {/* Recent Visits Table */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-main mb-6">Recent Visitors</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-muted font-semibold">Page</th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">Device</th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">Browser</th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">Source</th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentVisits?.map((v, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-main font-mono text-xs">{v.page}</td>
                    <td className="py-3 px-4 text-main capitalize">{v.device}</td>
                    <td className="py-3 px-4 text-main">{v.browser}</td>
                    <td className="py-3 px-4 text-muted text-xs">{v.referrer}</td>
                    <td className="py-3 px-4 text-muted text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {(!stats?.recentVisits || stats.recentVisits.length === 0) && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted">No visits recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
