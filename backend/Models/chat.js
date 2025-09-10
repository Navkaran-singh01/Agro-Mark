const mongoose = require('mongoose');

const chat = new mongoose.Schema({
    // Store the sender's ID, which could be a User or a Farmer
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel', // A dynamic reference to either User or Farmer
    },
    // The model name for the sender
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Farmer'], // Limits the options
    },
    // The receiver of the message
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel',
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Farmer'],
    },
    // The actual message content
    message: {
        type: String, // Changed to a single string
        required: true,
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chat);
module.exports = Chat;