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
import { useState } from 'react';

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

const ProjectCard = ({ project, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const priority = priorityConfig[project.priority] || priorityConfig.medium;
  const status = statusConfig[project.status] || statusConfig.active;

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

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-primary-500/10 transition-colors"
          >
            <HiOutlineDotsVertical />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-alt border border-main rounded-xl shadow-xl z-10 w-40 animate-fade-in" style={{ backgroundColor: 'var(--bg-alt)', borderColor: 'var(--border-color)' }}>
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

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${priority.class}`}>{priority.label}</span>
        <span className={`badge ${status.class}`}>{status.label}</span>
      </div>

      {/* Links */}
      {(project.liveLink || project.githubLink || project.docLink) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4 pt-4 border-t border-main">
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors flex-1 min-w-[80px] text-center font-bold" onClick={(e) => e.stopPropagation()}>
              🌍 Live
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs bg-gray-500/10 text-gray-600 dark:text-gray-300 border border-gray-500/20 px-3 py-1.5 rounded-lg hover:bg-gray-500/20 transition-colors flex-1 min-w-[80px] text-center font-bold" onClick={(e) => e.stopPropagation()}>
              🐙 GitHub
            </a>
          )}
          {project.docLink && (
            <a href={project.docLink} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-colors flex-1 min-w-[80px] text-center font-bold" onClick={(e) => e.stopPropagation()}>
              📄 Docs
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          {project.dueDate && (
            <span className="flex items-center gap-1">
              <HiOutlineCalendar />
              {format(new Date(project.dueDate), 'MMM dd')}
            </span>
          )}
          {project.members?.length > 0 && (
            <span className="flex items-center gap-1">
              <HiOutlineUsers />
              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
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
