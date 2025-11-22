const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, admin } = require('../middleware/auth');
const Customer = require('../models/Customer');

const router = express.Router();

// @route   GET api/customers
// @desc    Get all customers (admin) or user's customers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let customers;
    if (req.user.role === 'admin') {
      customers = await Customer.find().sort({ date: -1 });
    } else {
      customers = await Customer.find({ user: req.user.id }).sort({ date: -1 });
    }
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/customers
// @desc    Create a customer
// @access  Private
router.post('/', [
  auth,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, company } = req.body;

  try {
    const newCustomer = new Customer({
      name,
      email,
      phone,
      company,
      user: req.user.id,
    });

    const customer = await newCustomer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/customers/:id
// @desc    Update a customer
// @access  Private
router.put('/:id', [
  auth,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
  ],
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, company } = req.body;

  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    // Check user
    if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email, phone, company } },
      { new: true }
    );

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/customers/:id
// @desc    Delete a customer
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    // Check user
    if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Customer.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Customer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
