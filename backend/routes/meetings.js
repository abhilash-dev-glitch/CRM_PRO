const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Meeting = require('../models/Meeting');

const router = express.Router();

// @route   GET api/meetings
// @desc    Get meetings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let meetings;
    if (req.user.role === 'admin') {
      meetings = await Meeting.find()
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('attendees', 'name email')
        .populate('createdBy', 'name')
        .sort({ startTime: 1 });
    } else {
      meetings = await Meeting.find({
        $or: [{ createdBy: req.user.id }, { attendees: req.user.id }]
      })
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('attendees', 'name email')
        .populate('createdBy', 'name')
        .sort({ startTime: 1 });
    }
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/meetings
// @desc    Create a new meeting
// @access  Private
router.post('/', [
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('startTime', 'Start time is required').isISO8601(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startTime, endTime, location, type, lead, contact, attendees, notes } = req.body;

  try {
    const newMeeting = new Meeting({
      title,
      description,
      startTime,
      endTime,
      location,
      type,
      lead,
      contact,
      attendees: attendees || [req.user.id],
      notes,
      createdBy: req.user.id,
    });

    const meeting = await newMeeting.save();
    await meeting.populate(['lead', 'contact', 'attendees', 'createdBy']);
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/meetings/:id
// @desc    Get a specific meeting
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('lead', 'name')
      .populate('contact', 'name')
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');

    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/meetings/:id
// @desc    Update a meeting
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, startTime, endTime, location, type, lead, contact, attendees, notes } = req.body;

  try {
    let meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }

    // Check authorization
    if (meeting.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          startTime,
          endTime,
          location,
          type,
          lead,
          contact,
          attendees,
          notes,
          updatedAt: Date.now(),
        }
      },
      { new: true }
    )
      .populate('lead', 'name')
      .populate('contact', 'name')
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/meetings/:id
// @desc    Delete a meeting
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }

    // Check authorization
    if (meeting.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Meeting.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Meeting removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
