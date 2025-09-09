const Order = require('../Models/order');
const Product = require('../Models/product'); // You need the Product model to search for items
exports.cart = async (req, res) => {
    try {
        // 1. Get the user's ID from the 'protect' middleware
        const userId = req.user.id;

        // 2. Find all orders placed by this user to get the product IDs
        // We use .distinct() to get an array of unique product IDs
        const productIds = await Order.distinct('item', { buyer: userId });

        // 3. Check if the user has any ordered items
        if (!productIds || productIds.length === 0) {
            return res.status(200).json([]); // Return an empty array if cart is empty
        }

        // 4. Find all products in the Product collection whose _id is in our productIds array
        // We also use .populate() to fetch details about the product's owner (the farmer)
        const cartItems = await Product.find({
            '_id': { $in: productIds }
        }).populate('owner', 'name'); // Fetches the farmer's name

        // 5. Respond with the list of detailed product info
        res.status(200).json(cartItems);

    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: "Server error, could not retrieve cart." });
    }
};

