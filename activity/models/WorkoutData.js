const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // name is required
    },
    duration: {
        type: Number,
        required: true, // duration is required (e.g., in minutes)
    },
    dateAdded: {
        type: Date,
        default: Date.now, // Automatically sets the date when the document is created
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending'], // Possible values for status
        default: 'active', // Default status is 'active'
    }
});

module.exports = mongoose.model('WorkoutData', workoutSchema);
