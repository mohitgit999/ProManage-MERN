const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, color, members } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Project title is required');
  }

  const project = await Project.create({
    title,
    description,
    owner: req.user._id,
    members: members || [],
    dueDate,
    priority: priority || 'medium',
    color: color || '#6366f1',
  });

  await project.populate('owner', 'name email avatar');
  await project.populate('members', 'name email avatar');

  res.status(201).json(project);
});

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(projects);
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access
  const isOwner = project.owner._id.toString() === req.user._id.toString();
  const isMember = project.members.some(
    (m) => m._id.toString() === req.user._id.toString()
  );

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner only)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the project owner can update this project');
  }

  const { title, description, dueDate, priority, color, status, members } =
    req.body;

  project.title = title || project.title;
  project.description = description !== undefined ? description : project.description;
  project.dueDate = dueDate !== undefined ? dueDate : project.dueDate;
  project.priority = priority || project.priority;
  project.color = color || project.color;
  project.status = status || project.status;
  project.members = members !== undefined ? members : project.members;

  const updated = await project.save();
  await updated.populate('owner', 'name email avatar');
  await updated.populate('members', 'name email avatar');

  res.json(updated);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the project owner can delete this project');
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ project: req.params.id });
  await project.deleteOne();

  res.json({ message: 'Project deleted successfully' });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
