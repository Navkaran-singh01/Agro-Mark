const User = require("../Models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/lib");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, number,accountType} = req.body;

    // ✅ Validate input
    if (!name || !email || !password || !number) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check for existing user (username, email, or phone)
    const existingUser = await User.findOne({
      $or: [{ username: name }, { email }, { phone: number }],
    });

    if (existingUser) {
      let conflictField = "";
      if (existingUser.username === name) conflictField = "username";
      else if (existingUser.email === email) conflictField = "email";
      else if (existingUser.phone === number) conflictField = "phone";

      return res.status(400).json({
        success: false,
        message: `${conflictField} already exists`,
      });
    }

    // ✅ Hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      username: name,
      email,
      password: hash,
      phone: number,
    });

    // ✅ Generate token
    const token = generateToken(
      { id: newUser._id, username: newUser.username, email: newUser.email,accountType:"Consumer"},
      res
    );

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Error generating token",
      });
    }

    // ✅ Success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        accountType:"Consumer",
      },
    });
  } catch (err) {
    // ✅ Handle MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
