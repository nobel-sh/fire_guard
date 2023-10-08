const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    numbers_to_sms : {
        type: [String],
        required: true,
        default: []
    },
    description: {
        type: String,
        required: false
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
