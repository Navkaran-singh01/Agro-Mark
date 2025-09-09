const Farmer = require("../Models/farmer");

exports.farmerinfo = async (req, res) => {
  try {
    // The 'protect' middleware adds the user's ID to req.user
    const farmerId = req.user.id;

    // Find the farmer by their ID and select only the required fields
    const farmer = await Farmer.findById(farmerId).select('username email address phone');

    // If no farmer is found with that ID, return a 404 error
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // If the farmer is found, return their information
    res.status(200).json({
      success: true,
      farmer: farmer,
    });

  } catch (error) {
    console.error("Error fetching farmer info:", error);
    res.status(500).json({ message: 'Server error' });
  }
};