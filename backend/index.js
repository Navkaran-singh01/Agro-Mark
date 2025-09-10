const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const { setupSocket } = require('./config/socket');
const PORT = process.env.PORT || 5000;
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const { cloudinaryConnect } = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

// Create a single Express app and HTTP server instance
const app = express();
const server = http.createServer(app);

// Attach Socket.IO to the single server instance
const io = setupSocket(server);

app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(cookieParser());
app.use(express.json());

// Use the file upload middleware
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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { io, app, server };
