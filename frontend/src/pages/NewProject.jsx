import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi';

const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#64748b',
];

const NewProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    color: '#6366f1',
    status: 'active',
    liveLink: '',
    githubLink: '',
    docLink: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/projects', {
        ...form,
        dueDate: form.dueDate || undefined,
      });
      toast.success('Project created! 🎉');
      navigate(`/projects/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-main">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted hover:text-main transition-colors mb-6 text-sm"
        >
          <HiOutlineArrowLeft /> Back to Dashboard
        </button>

        <div className="card p-8 animate-slide-up">
          {/* Preview header */}
          <div
            className="flex items-center gap-3 mb-6 p-4 rounded-xl"
            style={{ backgroundColor: form.color + '15', borderLeft: `3px solid ${form.color}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: form.color + '30', color: form.color }}
            >
              {form.title ? form.title.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <p className="font-semibold text-main">{form.title || 'Project Name'}</p>
              <p className="text-xs text-muted">{form.description || 'Project description...'}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-main mb-6">Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-main mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                required
                placeholder="e.g. Website Redesign"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-1.5">Description</label>
              <textarea
                id="project-description"
                rows={3}
                placeholder="What's this project about?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-main mb-1.5">Priority</label>
                <select
                  id="project-priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low" className="bg-alt">Low</option>
                  <option value="medium" className="bg-alt">Medium</option>
                  <option value="high" className="bg-alt">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-main mb-1.5">Status</label>
                <select
                  id="project-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field"
                >
                  <option value="active" className="bg-alt">Active</option>
                  <option value="completed" className="bg-alt">Completed</option>
                  <option value="archived" className="bg-alt">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-1.5">Due Date</label>
              <input
                id="project-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-main mb-2">Project Color</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className="w-8 h-8 rounded-xl transition-all duration-200 flex items-center justify-center"
                    style={{
                      backgroundColor: color,
                      transform: form.color === color ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: form.color === color ? `0 0 12px ${color}80` : 'none',
                    }}
                    title={color}
                  >
                    {form.color === color && <HiOutlineCheck className="text-white text-xs" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-main">
              <p className="text-sm font-medium text-muted mb-3">Links & Resources (Optional)</p>
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="Live Link (e.g., https://myapp.com)"
                  value={form.liveLink}
                  onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="GitHub Repository Link"
                  value={form.githubLink}
                  onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="Documentation Link"
                  value={form.docLink}
                  onChange={(e) => setForm({ ...form, docLink: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                id="create-project-submit"
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : <HiOutlineCheck />}
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
