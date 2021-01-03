const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required.'],
        unique: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Owner is required.'],
        ref: 'User'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Message'
    }
});

module.exports = mongoose.model('Room', RoomSchema);