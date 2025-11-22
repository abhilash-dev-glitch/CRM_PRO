const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Lead = require('../models/Lead');

const router = express.Router();

// @route   GET api/leads
// @desc    Get leads (all for admin, assigned/created for user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let leads;
    if (req.user.role === 'admin') {
      leads = await Lead.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({
        $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }]
      })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', [
  auth,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Valid email is required').isEmail(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, company, title, source, priority, value, expectedCloseDate, notes } = req.body;

  try {
    const newLead = new Lead({
      name,
      email,
      phone,
      company,
      title,
      source,
      priority,
      value,
      expectedCloseDate,
      notes,
      createdBy: req.user.id,
      assignedTo: req.user.id,
    });

    const lead = await newLead.save();
    await lead.populate(['assignedTo', 'createdBy']);
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/leads/:id
// @desc    Get a specific lead
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }

    // Check authorization
    if (lead.createdBy.toString() !== req.user.id && lead.assignedTo?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', [
  auth,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Valid email is required').isEmail(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, company, title, status, priority, source, value, expectedCloseDate, notes, assignedTo } = req.body;

  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }

    // Check authorization (owner or admin)
    if (lead.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updateData = {
      name,
      email,
      phone,
      company,
      title,
      status,
      priority,
      source,
      value,
      expectedCloseDate,
      notes,
      updatedAt: Date.now(),
    };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }

    // Check authorization (creator or admin)
    if (lead.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Lead.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
