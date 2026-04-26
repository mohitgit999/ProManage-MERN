import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineChartBar,
} from 'react-icons/hi';
import { MdOutlineFolder } from 'react-icons/md';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects');
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await axios.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    owned: projects.filter((p) => p.owner?._id === user?._id).length,
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-main">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
              <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-muted text-sm mt-1">Here's an overview of your projects</p>
          </div>
          <Link to="/projects/new" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <HiOutlinePlus className="text-lg" />
            New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: stats.total, icon: <MdOutlineFolder />, color: 'text-primary-400' },
            { label: 'Active', value: stats.active, icon: <HiOutlineChartBar />, color: 'text-green-500 dark:text-green-400' },
            { label: 'Completed', value: stats.completed, icon: <HiOutlineViewGrid />, color: 'text-blue-500 dark:text-blue-400' },
            { label: 'Owned by Me', value: stats.owned, icon: <HiOutlineViewList />, color: 'text-purple-500 dark:text-purple-400' },
          ].map((stat, i) => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-main">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="search-projects"
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {['all', 'active', 'completed', 'archived'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 capitalize border ${
                    filter === f
                      ? 'bg-primary-500 text-white border-primary-400 shadow-lg'
                      : 'btn-secondary'
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="btn-secondary !p-2 rounded-xl"
                title="Toggle view"
              >
                {view === 'grid' ? <HiOutlineViewList size={20} /> : <HiOutlineViewGrid size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-primary-500/10 rounded w-3/4" />
                    <div className="h-3 bg-primary-500/10 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-primary-500/10 rounded mb-3" />
                <div className="h-3 bg-primary-500/10 rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-primary-500/10 rounded-full w-16" />
                  <div className="h-5 bg-primary-500/10 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-primary-500/5 rounded-2xl flex items-center justify-center mb-4 border border-primary-500/10">
              <MdOutlineFolder className="text-4xl text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-main mb-2">
              {search ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted text-sm mb-6">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <Link to="/projects/new" className="btn-primary flex items-center gap-2">
                <HiOutlinePlus /> Create Project
              </Link>
            )}
          </div>
        ) : (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
