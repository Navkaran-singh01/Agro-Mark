const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (payload, res) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Attach token to cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,   // set true if using HTTPS
      sameSite: 'strict'
    });

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;  // let controller handle the error
  }
};
