const express = require('express');
const Chat = require("../Models/chat");
const Farmer = require("../Models/farmer");
const User = require("../Models/user");
const { signup } = require("../Controllers/signup");
const { protect } = require("../Middleware/protect");
const {login}=require("../Controllers/login");
const { farmersignup } = require('../Controllers/farmersignup');
const router = express.Router();
const{farmerlogin}=require("../Controllers/farmerlogin");
const {createProduct, getProducts}=require('../Controllers/productinfo');
const {farmerinfo}= require('../Controllers/farmerinfo');
const {getAllProducts, productbyfarmer}=require('../Controllers/getproduct');
const {searchProducts} = require('../Controllers/getproduct');
const {placeOrder}=require('../Controllers/addorder');
const {cart} = require('../Controllers/cart');3
router.post('/signup', signup);
router.post('/farmersignup',farmersignup);
router.post('/farmerlogin',farmerlogin)
router.post('/login',login);
router.get('/checkAuth', protect, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user });
})
router.post('/createproduct',protect,createProduct);
router.get('/getProduct',protect,getProducts);
router.post('/getfarmer',protect,farmerinfo);
router.get('/getAllProducts',protect,getAllProducts);
router.post('/searchProduct',protect,searchProducts);
router.post('/addproduct',protect,placeOrder);
router.get('/cart',protect,cart);
router.get('/productbyfarmer',protect,productbyfarmer);
router.get("/chat/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 }); // oldest first

    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

router.get("/resolve-user", async (req, res) => {
  try {
    const { username, type } = req.query;
    let doc;

    if (type === "Farmer") {
      doc = await Farmer.findOne({ username });
    } else {
      doc = await User.findOne({ username });
    }

    if (!doc) return res.status(404).json({ message: "User not found" });
    res.json({ id: doc._id });
  } catch (err) {
    res.status(500).json({ message: "Error resolving user" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find all chats where user is sender or receiver
    const chats = await Chat.find({
      $or: [{ sender: id }, { receiver: id }],
    }).populate("sender receiver", "username accountType");

    // Extract unique conversation partners
    const conversationsMap = new Map();
    chats.forEach((chat) => {
      const other =
        chat.sender._id.toString() === id
          ? chat.receiver
          : chat.sender;

      if (!conversationsMap.has(other._id.toString())) {
        conversationsMap.set(other._id.toString(), {
          id: other._id,
          username: other.username,
          type: chat.sender._id.toString() === id ? chat.receiverModel : chat.senderModel,
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});
module.exports = router;
