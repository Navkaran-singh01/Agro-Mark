const { Server } = require("socket.io");
const Chat = require("../Models/chat");
const Farmer = require("../Models/farmer"); // your Farmer model
const User = require("../Models/user");     // your User model

const activeUsers = new Map();

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.CLIENT_URL, "http://localhost:5173"],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        socket.on("register", (userId) => {
            console.log(`User ${userId} registered with socket ${socket.id}`);
            activeUsers.set(userId, socket.id);
        });

        socket.on("chat message", async (msg) => {
    try {
        let receiverDoc;

        if (msg.receiverType === "Farmer") {
        receiverDoc = await Farmer.findById(msg.receiver);
        } else if (msg.receiverType === "User") {
        receiverDoc = await User.findById(msg.receiver);
        }

        if (!receiverDoc) {
        console.error("Receiver not found:", msg.receiver, msg.receiverType);
        return;
        }

        const newMessage = new Chat({
        sender: msg.sender,          // ObjectId
        senderModel: msg.senderType, // "User" or "Farmer"
        receiver: receiverDoc._id,   // ObjectId
        receiverModel: msg.receiverType,
        message: msg.message,
        });

        await newMessage.save();

        const senderSocketId = activeUsers.get(msg.sender.toString());
        const receiverSocketId = activeUsers.get(receiverDoc._id.toString());

        if (senderSocketId) io.to(senderSocketId).emit("chat message", newMessage);
        if (receiverSocketId) io.to(receiverSocketId).emit("chat message", newMessage);
    } catch (error) {
        console.error("Error saving message or broadcasting:", error);
    }
    });


        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            for (let [key, value] of activeUsers.entries()) {
                if (value === socket.id) {
                    activeUsers.delete(key);
                    break;
                }
            }
        });
    });

    return io;
};

module.exports = { setupSocket };
