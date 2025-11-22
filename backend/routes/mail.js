const express = require('express');
const router = express.Router();
const Mail = require('../models/Mail');
const { auth } = require('../middleware/auth');

// @route   GET /api/mail/inbox
// @desc    Get inbox emails
// @access  Private
router.get('/inbox', auth, async (req, res) => {
    try {
        const emails = await Mail.find({
            to: req.user.email,
            folder: 'inbox',
        }).sort({ timestamp: -1 });
        res.json(emails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/mail/sent
// @desc    Get sent emails
// @access  Private
router.get('/sent', auth, async (req, res) => {
    try {
        const emails = await Mail.find({
            from: req.user.email,
            folder: 'sent',
        }).sort({ timestamp: -1 });
        res.json(emails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/mail/starred
// @desc    Get starred emails
// @access  Private
router.get('/starred', auth, async (req, res) => {
    try {
        const emails = await Mail.find({
            $or: [{ to: req.user.email }, { from: req.user.email }],
            starred: true,
        }).sort({ timestamp: -1 });
        res.json(emails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/mail/:id
// @desc    Get single email
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const email = await Mail.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ msg: 'Email not found' });
        }
        res.json(email);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/mail/send
// @desc    Send new email
// @access  Private
router.post('/send', auth, async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        // Create email in sent folder for sender
        const sentMail = new Mail({
            from: req.user.email,
            to,
            subject,
            body,
            folder: 'sent',
            userId: req.user.id,
        });
        await sentMail.save();

        // Create email in inbox folder for recipient (if recipient is in system)
        const User = require('../models/User');
        const recipient = await User.findOne({ email: to });

        if (recipient) {
            const inboxMail = new Mail({
                from: req.user.email,
                to,
                subject,
                body,
                folder: 'inbox',
                userId: recipient._id,
            });
            await inboxMail.save();
        }

        res.json(sentMail);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/mail/:id/read
// @desc    Mark email as read/unread
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
    try {
        const email = await Mail.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ msg: 'Email not found' });
        }
        email.read = !email.read;
        await email.save();
        res.json(email);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/mail/:id/star
// @desc    Toggle star on email
// @access  Private
router.put('/:id/star', auth, async (req, res) => {
    try {
        const email = await Mail.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ msg: 'Email not found' });
        }
        email.starred = !email.starred;
        await email.save();
        res.json(email);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/mail/:id
// @desc    Delete email (move to trash)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const email = await Mail.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ msg: 'Email not found' });
        }

        if (email.folder === 'trash') {
            // Permanently delete if already in trash
            await Mail.findByIdAndDelete(req.params.id);
        } else {
            // Move to trash
            email.folder = 'trash';
            await email.save();
        }

        res.json({ msg: 'Email deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
