const express = require('express');
const { auth } = require('../middleware/auth');
const Activity = require('../models/Activity');

const router = express.Router();

// @route   GET api/activities
// @desc    Get activities
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let activities;
    if (req.user.role === 'admin') {
      activities = await Activity.find()
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('user', 'name')
        .sort({ createdAt: -1 });
    } else {
      activities = await Activity.find({ user: req.user.id })
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('user', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/activities
// @desc    Create a new activity
// @access  Private
router.post('/', auth, async (req, res) => {
  const { type, description, lead, contact, metadata } = req.body;

  try {
    const newActivity = new Activity({
      type,
      description,
      lead,
      contact,
      user: req.user.id,
      metadata,
    });

    const activity = await newActivity.save();
    await activity.populate(['lead', 'contact', 'user']);
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/activities/:id
// @desc    Get activities for a lead or contact
// @access  Private
router.get('/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const query = type === 'lead' ? { lead: id } : { contact: id };

    const activities = await Activity.find(query)
      .populate('lead', 'name')
      .populate('contact', 'name')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
