const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const { cloudinaryConnect } = require('./config/cloudinary');
const fileUpload = require('express-fileupload'); // 1. IMPORT file-upload

app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(cookieParser());
app.use(express.json());

// 2. USE THE FILE UPLOAD MIDDLEWARE
// This must be configured to handle file uploads and make req.files and req.body available
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Connect to Cloudinary and DB
cloudinaryConnect();
db.connectDB();

// Routes
const router = require("./Router/auth");
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
