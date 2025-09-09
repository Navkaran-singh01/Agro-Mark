const Product = require('../Models/product');
const cloudinary = require('cloudinary').v2;

// --- Helper Function to Upload File to Cloudinary ---
// This function uploads a file to a specified folder in your Cloudinary account.
async function uploadFile(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"; // Automatically detect the file type (image, video, etc.)
    
    // The tempFilePath is provided by the express-fileupload middleware
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


// --- Controller to Create a New Product ---
// This controller now assumes an authentication middleware runs before it.
exports.createProduct = async (req, res) => {
    try {
        // 1. Destructure product details from the request body
        const { name, description, price ,category} = req.body;
        
        // 2. Get the uploaded file from the request
        const file = req.files?.postFile; // Using optional chaining for safety

        // 3. Validate that all required fields are present
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'Name, description, and price are required fields.' });
        }
        if (!file) {
            return res.status(400).json({ message: 'A product image is required.' });
        }

        // 4. Get the owner's ID from req.user, which is populated by an auth middleware.
        const ownerId = req.user?.id; // Using optional chaining for safety
        
        if (!ownerId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated. Could not find user ID.' 
            });
        }

        // 5. Upload the file to a "Products" folder on Cloudinary
        const uploadedImage = await uploadFile(file, "Products");

        // 6. Create a new product document with the data
        const newProduct = new Product({
            name,
            description,
            category,
            price,
            picture: uploadedImage.secure_url, // Use the secure URL from the Cloudinary response
            owner:ownerId // Add the owner's ID to the owner array, as per your schema
        });

        // 7. Save the new product to the database
        const savedProduct = await newProduct.save();

        // 8. Send a success response with the created product data
        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            product: savedProduct,
        });

    } catch (error) {
        console.error("Error in creating product:", error);
        return res.status(500).json({ message: 'Internal server error while creating the product.' });
    }
};
exports.getProducts = async (req, res) => {
 try {
        // 1. Get the owner's ID from req.user, populated by the 'protect' middleware.
        const ownerId = req.user?.id;
        // 2. Validate that the owner ID is present.
        if (!ownerId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated. Could not find user ID.' 
            });
        }

        // 3. Find all products in the database where the 'owner' array contains the ownerId.
        const products = await Product.find({ owner: ownerId });

        // 4. Check if any products were found.
        if (!products || products.length === 0) {
            // It's not an error if a user has no products, so we send a success response with an empty array.
            return res.status(200).json({
                success: true,
                message: 'No products found for this user.',
                products: [], // Return an empty array
            });
        }

        // 5. Send a success response with the retrieved products.
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully!',
            products: products,
        });

    } catch (error) {
        console.error("Error in fetching products:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching products.'
        });
    }
};