const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// @route   GET api/tasks
// @desc    Get tasks assigned to user or created by user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('lead', 'name email')
        .populate('contact', 'name email')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .sort({ dueDate: 1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('lead', 'name email')
        .populate('contact', 'name email')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .sort({ dueDate: 1 });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('type', 'Type must be call, meeting, demo, email, or other').isIn(['call', 'meeting', 'demo', 'email', 'other']),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, type, priority, dueDate, reminderDate, lead, contact, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      type,
      priority,
      dueDate,
      reminderDate,
      lead,
      contact,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
    });

    const task = await newTask.save();
    await task.populate(['lead', 'contact', 'assignedTo', 'createdBy']);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('lead', 'name email')
      .populate('contact', 'name email')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check authorization
    if (task.assignedTo._id.toString() !== req.user.id && task.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, type, status, priority, dueDate, reminderDate, lead, contact } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check authorization
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updateData = {
      title,
      description,
      type,
      status,
      priority,
      dueDate,
      reminderDate,
      lead,
      contact,
    };

    if (status === 'completed') {
      updateData.completedAt = Date.now();
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
      .populate('lead', 'name email')
      .populate('contact', 'name email')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
