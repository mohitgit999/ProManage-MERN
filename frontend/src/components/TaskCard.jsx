import { useState } from 'react';
import { format } from 'date-fns';
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const priorityConfig = {
  low: { label: 'Low', class: 'badge-low' },
  medium: { label: 'Medium', class: 'badge-medium' },
  high: { label: 'High', class: 'badge-high' },
  critical: { label: 'Critical', class: 'badge-critical' },
};

const statusColors = {
  tasks: 'bg-blue-600',
  issues: 'bg-orange-500',
  backlogs: 'bg-gray-700',
  errors: 'bg-red-600',
  done: 'bg-green-600',
};

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const completedItems = task.checklist?.filter((c) => c.completed).length || 0;
  const totalItems = task.checklist?.length || 0;

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/tasks/${task._id}`, { status: newStatus });
      onUpdate && onUpdate(data);
      toast.success('Task status updated!');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistToggle = async (index) => {
    const updatedChecklist = task.checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    try {
      const { data } = await axios.put(`/tasks/${task._id}`, { checklist: updatedChecklist });
      onUpdate && onUpdate(data);
    } catch {
      toast.error('Failed to update checklist');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/tasks/${task._id}`);
      onDelete && onDelete(task._id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="card p-4 hover:border-primary-500 transition-all duration-300 cursor-pointer group">
      {/* Status Bar */}
      <div className={`w-full h-0.5 rounded-full mb-3 ${statusColors[task.status] || 'bg-gray-700'}`} />

      <div onClick={() => setExpanded(!expanded)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-main group-hover:text-primary-600 transition-colors text-sm leading-snug pr-2">
            {task.title}
          </h4>
          <span className={`badge ${priority.class} shrink-0`}>{priority.label}</span>
        </div>

        {/* Description preview */}
        {task.description && (
          <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <HiOutlineCalendar />
              {format(new Date(task.dueDate), 'MMM dd')}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
          {task.assignedTo && (
            <span className="flex items-center gap-1">
              <HiOutlineUser />
              {task.assignedTo.name}
            </span>
          )}
          {totalItems > 0 && (
            <span className="flex items-center gap-1">
              <HiOutlineClipboardList />
              {completedItems}/{totalItems}
            </span>
          )}
        </div>

        {/* Checklist progress */}
        {totalItems > 0 && (
          <div className="mt-2 w-full bg-primary-500/10 rounded-full h-1">
            <div
              className="bg-primary-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems / totalItems) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-main pt-3 animate-fade-in">
          {/* Status change */}
          <div className="flex flex-wrap gap-2">
            {['tasks', 'issues', 'backlogs', 'errors', 'done'].map((s) => (
              <button
                key={s}
                disabled={loading || task.status === s}
                onClick={(e) => { e.stopPropagation(); handleStatusChange(s); }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  task.status === s
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'btn-secondary !py-1 !px-2.5 !text-xs'
                }`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Checklist */}
          {task.checklist?.length > 0 && (
            <div className="space-y-1.5">
              {task.checklist.map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm cursor-pointer group/item"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(i)}
                    className="accent-primary-500"
                  />
                  <span className={`${item.completed ? 'line-through text-muted' : 'text-main'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-alt text-muted px-2 py-0.5 rounded-full border border-main">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {(task.liveLink || task.githubLink || task.docLink) && (
            <div className="flex flex-col gap-2 pt-2 border-t border-main">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Resources</span>
              <div className="flex flex-wrap gap-2">
                {task.liveLink && (
                  <a href={task.liveLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded hover:bg-blue-500/20 transition-colors font-medium" onClick={(e) => e.stopPropagation()}>
                    🌍 Live Link
                  </a>
                )}
                {task.githubLink && (
                  <a href={task.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-500/10 text-gray-600 dark:text-gray-300 border border-gray-500/20 px-3 py-1.5 rounded hover:bg-gray-500/20 transition-colors font-medium" onClick={(e) => e.stopPropagation()}>
                    🐙 GitHub
                  </a>
                )}
                {task.docLink && (
                  <a href={task.docLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded hover:bg-purple-500/20 transition-colors font-medium" onClick={(e) => e.stopPropagation()}>
                    📄 Docs
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-main">
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10 font-medium"
            >
              <HiOutlineTrash /> Delete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
