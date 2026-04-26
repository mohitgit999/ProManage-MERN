const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: Check project membership
const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some((m) => m.toString() === userId.toString());
  return isOwner || isMember ? project : null;
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate, checklist, tags } =
    req.body;

  if (!title || !project) {
    res.status(400);
    throw new Error('Task title and project are required');
  }

  const accessible = await checkProjectAccess(project, req.user._id);
  if (!accessible) {
    res.status(403);
    throw new Error('Not authorized to add tasks to this project');
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate,
    checklist: checklist || [],
    tags: tags || [],
    liveLink: req.body.liveLink || '',
    githubLink: req.body.githubLink || '',
    docLink: req.body.docLink || '',
  });

  // Smart Sync: If task is "done" and has a link, update the project
  if (task.status === 'done' && (task.liveLink || task.githubLink || task.docLink)) {
    await Project.findByIdAndUpdate(project, {
      liveLink: task.liveLink || undefined,
      githubLink: task.githubLink || undefined,
      docLink: task.docLink || undefined,
    });
  }

  await task.populate('assignedTo', 'name email avatar');
  await task.populate('createdBy', 'name email avatar');

  res.status(201).json(task);
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=:projectId
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { project, status, priority } = req.query;

  if (!project) {
    res.status(400);
    throw new Error('Project ID is required');
  }

  const accessible = await checkProjectAccess(project, req.user._id);
  if (!accessible) {
    res.status(403);
    throw new Error('Not authorized to view tasks for this project');
  }

  const filter = { project };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(tasks);
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('project', 'title owner members');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const accessible = await checkProjectAccess(task.project._id, req.user._id);
  if (!accessible) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const accessible = await checkProjectAccess(task.project, req.user._id);
  if (!accessible) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { title, description, assignedTo, status, priority, dueDate, checklist, tags } =
    req.body;

  task.title = title || task.title;
  task.description = description !== undefined ? description : task.description;
  task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
  task.status = status || task.status;
  task.priority = priority || task.priority;
  task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
  task.checklist = checklist !== undefined ? checklist : task.checklist;
  task.tags = tags !== undefined ? tags : task.tags;
  task.liveLink = req.body.liveLink !== undefined ? req.body.liveLink : task.liveLink;
  task.githubLink = req.body.githubLink !== undefined ? req.body.githubLink : task.githubLink;
  task.docLink = req.body.docLink !== undefined ? req.body.docLink : task.docLink;

  const updated = await task.save();

  // Smart Sync: If task is "done" and has a link, update the project
  if (updated.status === 'done' && (updated.liveLink || updated.githubLink || updated.docLink)) {
    await Project.findByIdAndUpdate(updated.project, {
      liveLink: updated.liveLink || undefined,
      githubLink: updated.githubLink || undefined,
      docLink: updated.docLink || undefined,
    });
  }
  await updated.populate('assignedTo', 'name email avatar');
  await updated.populate('createdBy', 'name email avatar');

  res.json(updated);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const accessible = await checkProjectAccess(task.project, req.user._id);
  if (!accessible) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted successfully' });
});

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
