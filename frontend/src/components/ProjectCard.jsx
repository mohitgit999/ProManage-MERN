import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineChevronRight,
  HiOutlineDotsVertical,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import { MdOutlineFolder } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';

const priorityConfig = {
  low: { label: 'Low', class: 'badge-low' },
  medium: { label: 'Medium', class: 'badge-medium' },
  high: { label: 'High', class: 'badge-high' },
  critical: { label: 'Critical', class: 'badge-critical' },
};

const statusConfig = {
  active: { label: 'Active', class: 'badge-in-progress' },
  completed: { label: 'Completed', class: 'badge-done' },
  archived: { label: 'Archived', class: 'badge-backlog' },
};

const ProjectCard = ({ project, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const statusMenuRef = useRef(null);
  
  const priority = priorityConfig[project.priority] || priorityConfig.medium;
  const status = statusConfig[project.status] || statusConfig.active;

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (onUpdate && !isUpdating) {
      setIsUpdating(true);
      await onUpdate(project._id, { status: newStatus });
      setIsUpdating(false);
      setShowStatusMenu(false);
    }
  };

  return (
    <div
      className="card p-5 hover:border-primary-500 transition-all duration-300 group relative"
      style={{ borderLeft: `3px solid ${project.color || '#6366f1'}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
            style={{ backgroundColor: project.color + '22', color: project.color }}
          >
            <MdOutlineFolder />
          </div>
          <div>
            <h3 className="font-semibold text-main group-hover:text-primary-600 transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-muted">
              by {project.owner?.name || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-primary-500/10 transition-colors"
          >
            <HiOutlineDotsVertical />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-alt border border-main rounded-xl shadow-xl z-30 w-40 animate-fade-in" style={{ backgroundColor: 'var(--bg-alt)', borderColor: 'var(--border-color)' }}>
              <Link
                to={`/projects/${project._id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-main hover:bg-primary-500/10 rounded-t-xl transition-colors"
                onClick={() => setShowMenu(false)}
              >
                View Project
              </Link>
              {onDelete && (
                <button
                  onClick={() => { onDelete(project._id); setShowMenu(false); }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-b-xl transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-muted mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Badges & Clickable Status Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${priority.class}`}>{priority.label}</span>
        
        <div className="relative" ref={statusMenuRef}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
            }}
            className={`badge ${status.class} cursor-pointer hover:ring-2 ring-primary-500/50 transition-all flex items-center gap-1 active:scale-95`}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : status.label}
          </button>
          
          {showStatusMenu && (
            <div className="absolute left-0 top-full mt-1 z-40 bg-alt border border-main rounded-lg shadow-2xl min-w-[130px] overflow-hidden animate-slide-up" style={{ backgroundColor: 'var(--bg-alt)', borderColor: 'var(--border-color)' }}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-primary-500/10 transition-colors ${project.status === key ? 'text-primary-500 bg-primary-500/5' : 'text-main'}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted pt-4 border-t border-main">
        <div className="flex items-center gap-3">
          {project.liveLink && (
            <a
              href={project.liveLink.startsWith('http') ? project.liveLink : `https://${project.liveLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:scale-105 font-bold transition-all px-3 py-1.5 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              🚀 Visit Site
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${project._id}`}
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:opacity-80 font-bold transition-all"
          >
            Open <HiOutlineChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
