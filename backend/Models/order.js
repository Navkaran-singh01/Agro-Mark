const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
}, { timestamps: true }); // Timestamps are useful for tracking when orders are created

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
