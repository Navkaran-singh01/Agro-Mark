const Product=require('../Models/product');
const Farmer = require('../Models/farmer');

exports.getAllProducts = async (req, res) => {
    try {
        // Use .populate() to fetch the 'owner' details from the 'Farmer' model
        const products = await Product.find({}).populate('owner', 'username');
        res.status(200).json(products);
    } catch (error) {
        console.log('error in fetching products', error);
        res.status(500).json({ message: "server error, could not retrieve products" });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm) {
            return res.status(400).json({ message: "Please provide a 'searchTerm' in the request body." });
        }

        const regex = new RegExp(searchTerm, 'i');

        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
            // Use .populate() here as well
        }).populate('owner', 'username');

        res.status(200).json(products);

    } catch (error) {
        console.error('Error during product search:', error);
        res.status(500).json({ message: "Server error, could not perform search." });
    }
};
exports.productbyfarmer = async (req, res) => {
    // Correctly get the username from the request's query parameters,
    // as the front-end sends it in the URL for a GET request.
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: "Username query parameter is required." });
    }
    
    try {
        // Find the farmer by their username
        const farmer = await Farmer.findOne({ username });
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found." });
        }

        // Find all products owned by this farmer, and populate the owner field
        const products = await Product.find({ owner: farmer._id }).populate('owner', 'username');

        res.status(200).json(products);
    } catch (error) {
        console.error('Error in fetching farmer products by username:', error);
        res.status(500).json({ message: "Server error, could not retrieve products." });
    }
};
