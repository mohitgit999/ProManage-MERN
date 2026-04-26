import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineCheck, HiOutlineCamera } from 'react-icons/hi';

const Settings = () => {
  const { user, setUser } = useAuth();

  if (!user) return null; // Prevent crash if user is not yet loaded
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updateData = { name: form.name, email: form.email };
      if (form.password) updateData.password = form.password;

      const { data } = await axios.put('/users/profile', updateData);
      
      // Update local storage and context
      const userData = JSON.parse(localStorage.getItem('userInfo'));
      const updatedData = { ...userData, name: data.name, email: data.email };
      localStorage.setItem('userInfo', JSON.stringify(updatedData));
      setUser(updatedData);

      toast.success('Profile updated successfully! ✨');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 bg-main">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-main mb-8 animate-slide-up">Account Settings</h1>
        
        <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border border-main group-hover:scale-105 transition-transform duration-500">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-alt border border-main rounded-xl text-primary-500 hover:text-primary-400 transition-colors shadow-lg">
                <HiOutlineCamera className="text-lg" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-main mt-4">{user?.name}</h2>
            <p className="text-muted text-sm">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-12"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2 pl-1">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-12"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-main">
              <p className="text-sm font-semibold text-main mb-4">Change Password (optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-12"
                    placeholder="New password"
                  />
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="input-field pl-12"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl shadow-xl hover:shadow-primary-500/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                ) : (
                  <>
                    <HiOutlineCheck className="text-xl" />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
