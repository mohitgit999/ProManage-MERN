import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlinePlus,
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import { MdOutlineFolder, MdOutlineRocketLaunch } from 'react-icons/md';
import { VscGithub } from 'react-icons/vsc';
import { HiOutlineDocumentText } from 'react-icons/hi2';

const COLUMNS = [
  { key: 'tasks', label: 'Tasks', color: 'border-blue-600' },
  { key: 'issues', label: 'Issues', color: 'border-orange-500' },
  { key: 'backlogs', label: 'Backlogs', color: 'border-gray-600' },
  { key: 'errors', label: 'Errors', color: 'border-red-600' },
  { key: 'done', label: 'Done', color: 'border-green-600' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'tasks',
    dueDate: '',
    tags: '',
    liveLink: '',
    githubLink: '',
    docLink: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        axios.get(`/projects/${id}`),
        axios.get(`/tasks?project=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post('/tasks', {
        ...taskForm,
        project: id,
        tags: taskForm.tags ? taskForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        dueDate: taskForm.dueDate || undefined,
      });
      setTasks((prev) => [data, ...prev]);
      setTaskForm({ title: '', description: '', priority: 'medium', status: 'tasks', dueDate: '', tags: '', liveLink: '', githubLink: '', docLink: '' });
      setShowTaskForm(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskUpdate = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleTaskDelete = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t._id !== deletedId));
  };

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-main">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const isOwner = project.owner?._id === user?._id;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted hover:text-main transition-colors mb-4 text-sm"
          >
            <HiOutlineArrowLeft /> Back to Dashboard
          </button>

          <div className="card p-4 sm:p-6 animate-slide-up">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: project.color + '22', color: project.color }}
                >
                  <MdOutlineFolder />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-main truncate">{project.title}</h1>
                  {project.description && (
                    <p className="text-sm text-muted mt-0.5 line-clamp-1">{project.description}</p>
                  )}
                </div>
              </div>
 
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted">
                {project.dueDate && (
                  <span className="flex items-center gap-1.5 bg-alt px-3 py-2 rounded-xl border border-main">
                    <HiOutlineCalendar className="text-base" />
                    {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                  </span>
                )}
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20"
                >
                  <HiOutlinePlus className="text-lg" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Members row */}
            {project.members?.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-main">
                <span className="text-xs text-muted">Members:</span>
                {[project.owner, ...project.members].map((m, i) => (
                  <div
                    key={i}
                    title={m?.name}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-xs font-bold -ml-1 first:ml-0 border-2 border-main text-white"
                  >
                    {m?.name?.charAt(0)?.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card w-full max-w-md p-6 animate-slide-up bg-alt">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-main">Create New Task</h2>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-primary-500/10 transition-colors"
                >
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-main mb-1.5">Task Title *</label>
                  <input
                    id="task-title"
                    type="text"
                    required
                    placeholder="What needs to be done?"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="input-field"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-main mb-1.5">Description</label>
                  <textarea
                    id="task-description"
                    rows={3}
                    placeholder="Add more details..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-main mb-1.5">Priority</label>
                    <select
                      id="task-priority"
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low" className="bg-alt">Low</option>
                      <option value="medium" className="bg-alt">Medium</option>
                      <option value="high" className="bg-alt">High</option>
                      <option value="critical" className="bg-alt">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-main mb-1.5">Status</label>
                    <select
                      id="task-status"
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="input-field"
                    >
                      <option value="tasks" className="bg-alt">Tasks</option>
                      <option value="issues" className="bg-alt">Issues</option>
                      <option value="backlogs" className="bg-alt">Backlogs</option>
                      <option value="errors" className="bg-alt">Errors</option>
                      <option value="done" className="bg-alt">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-main mb-1.5">Due Date</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-main mb-1.5">
                    Tags <span className="text-muted font-normal">(comma-separated)</span>
                  </label>
                  <input
                    id="task-tags"
                    type="text"
                    placeholder="design, frontend, bug"
                    value={taskForm.tags}
                    onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="pt-2 border-t border-main">
                  <p className="text-xs font-medium text-muted mb-3">Links & Resources (Optional)</p>
                  <div className="space-y-3">
                    <input
                      type="url"
                      placeholder="Live Link (e.g., https://myapp.com)"
                      value={taskForm.liveLink}
                      onChange={(e) => setTaskForm({ ...taskForm, liveLink: e.target.value })}
                      className="input-field text-sm"
                    />
                    <input
                      type="url"
                      placeholder="GitHub Repository Link"
                      value={taskForm.githubLink}
                      onChange={(e) => setTaskForm({ ...taskForm, githubLink: e.target.value })}
                      className="input-field text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Documentation Link"
                      value={taskForm.docLink}
                      onChange={(e) => setTaskForm({ ...taskForm, docLink: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    id="create-task-submit"
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <HiOutlineCheck />
                    )}
                    {submitting ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = getColumnTasks(col.key);
            return (
              <div key={col.key} className="flex flex-col gap-3">
                {/* Column Header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-alt border-t-2 ${col.color} border-x border-b border-main`}>
                  <h3 className="font-semibold text-sm text-main">{col.label}</h3>
                  <span className="text-xs bg-primary-500/10 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full border border-primary-500/20">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2 min-h-[120px]">
                  {colTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-main rounded-xl p-6 text-center text-muted text-xs">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdate={handleTaskUpdate}
                        onDelete={handleTaskDelete}
                      />
                    ))
                  )}
                </div>

                {/* Quick add button */}
                <button
                  onClick={() => { setTaskForm((f) => ({ ...f, status: col.key })); setShowTaskForm(true); }}
                  className="flex items-center gap-2 text-xs text-muted hover:text-main transition-colors px-3 py-2 rounded-xl hover:bg-primary-500/10 border border-transparent hover:border-main"
                >
                  <HiOutlinePlus /> Add task
                </button>
              </div>
            );
          })}
        </div>

        {/* --- Project Launchpad (Bottom Card) --- */}
        {(project.liveLink || project.githubLink || project.docLink) && (
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="card p-8 border-2 border-primary-500/20 shadow-[0_0_40px_rgba(217,70,239,0.1)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-3 py-1.5 rounded-full text-xs font-bold border border-primary-500/20 mb-3">
                    <MdOutlineRocketLaunch className="text-sm" /> Project Launchpad
                  </div>
                  <h2 className="text-2xl font-bold text-main">Ready to see your work?</h2>
                  <p className="text-muted mt-1">Access your live site, code repository, and documentation below.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {project.liveLink && (
                    <a
                      href={project.liveLink.startsWith('http') ? project.liveLink : `https://${project.liveLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-primary-500/25 hover:scale-105 active:scale-95 transition-all group"
                    >
                      🚀 Launch Project
                      <HiOutlineExternalLink className="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink.startsWith('http') ? project.githubLink : `https://${project.githubLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-alt border-2 border-main hover:border-primary-500 text-main font-bold text-sm transition-all hover:bg-primary-500/5 group"
                    >
                      <VscGithub className="text-xl" />
                      View Code
                    </a>
                  )}
                  {project.docLink && (
                    <a
                      href={project.docLink.startsWith('http') ? project.docLink : `https://${project.docLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-alt border-2 border-main hover:border-blue-500 text-main font-bold text-sm transition-all hover:bg-blue-500/5 group"
                    >
                      <HiOutlineDocumentText className="text-xl" />
                      Docs
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
