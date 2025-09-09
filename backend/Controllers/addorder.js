const Order = require('../Models/order');
exports.placeOrder = async (req, res) => {
    try {
        // The user's ID is attached to the request by the 'protect' middleware
        const userId = req.user.id;
        // The product's ID is sent in the request body
        const { productId } = req.body;

        // Basic validation
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required to place an order." });
        }
        const newOrder = new Order({
            buyer: userId,
            item: productId
        });

        // Save the new order to the database
        await newOrder.save();

        // Respond with a success message and the created order details
        res.status(201).json({
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: "Server error, could not place order." });
    }
};
