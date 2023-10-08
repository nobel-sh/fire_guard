const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location',
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    cause: {
        type: String,
        required: true,
        default: 'unknown'
    },
    damage: {
        type: String,
        required: true,
        default: 'unknown'
    },
    status: {
        type: String,
        enum: ['active', 'unverified', 'non-detected', 'resolved'],
        default: 'active'
    }
});

module.exports = mongoose.model('Incident', incidentSchema);
