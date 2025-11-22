const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
    starred: {
        type: Boolean,
        default: false,
    },
    folder: {
        type: String,
        enum: ['inbox', 'sent', 'drafts', 'trash'],
        default: 'inbox',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Mail', MailSchema);
