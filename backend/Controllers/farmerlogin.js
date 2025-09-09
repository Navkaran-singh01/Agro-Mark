const Farmer = require("../Models/farmer");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/lib");

exports.farmerlogin = async (req,res) => {
    try {
        const { email, password, name,accountType } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message:"credentials missing" });
        }

        const user = await Farmer.findOne({ email });
        if (!user) {
            return res.status(404).json({ message:"user doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message:"Invalid credentials" });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            accountType:accountType,
        };

        const token = generateToken(payload, res); // make sure this sets cookie or returns token
        if (!token) {
            return res.status(500).json({ message:"Error generating token" });
        }

        res.status(200).json({
            success: true,
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                accountType:accountType,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
