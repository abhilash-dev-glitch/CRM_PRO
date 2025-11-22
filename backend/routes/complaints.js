const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

const router = express.Router();

// @route   GET api/complaints
// @desc    Get all complaints for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ date: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', [
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('priority', 'Priority must be low, medium, high, or urgent').isIn(['low', 'medium', 'high', 'urgent']),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, priority } = req.body;

  try {
    const newComplaint = new Complaint({
      title,
      description,
      priority,
      user: req.user.id,
    });

    const complaint = await newComplaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/complaints/:id
// @desc    Get a specific complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Check if user owns the complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/complaints/:id
// @desc    Update a complaint
// @access  Private
router.put('/:id', [
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('priority', 'Priority must be low, medium, high, or urgent').isIn(['low', 'medium', 'high', 'urgent']),
    body('status', 'Status must be open, in-progress, resolved, or closed').isIn(['open', 'in-progress', 'resolved', 'closed']),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, priority, status } = req.body;

  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Check if user owns the complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, priority, status, updatedAt: Date.now() } },
      { new: true }
    );

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/complaints/:id
// @desc    Delete a complaint
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Check if user owns the complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Complaint.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Complaint removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
