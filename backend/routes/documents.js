const express = require('express');
const { auth } = require('../middleware/auth');
const Document = require('../models/Document');

const router = express.Router();

// @route   GET api/documents
// @desc    Get documents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let documents;
    if (req.user.role === 'admin') {
      documents = await Document.find()
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      documents = await Document.find({ uploadedBy: req.user.id })
        .populate('lead', 'name')
        .populate('contact', 'name')
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/documents
// @desc    Create a document record (for file upload)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { filename, originalName, filePath, fileType, fileSize, category, lead, contact } = req.body;

  try {
    const newDocument = new Document({
      filename,
      originalName,
      filePath,
      fileType,
      fileSize,
      category,
      lead,
      contact,
      uploadedBy: req.user.id,
    });

    const document = await newDocument.save();
    await document.populate(['lead', 'contact', 'uploadedBy']);
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/documents/:id
// @desc    Get documents for a lead or contact
// @access  Private
router.get('/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const query = type === 'lead' ? { lead: id } : { contact: id };

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check authorization
    if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Document.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
