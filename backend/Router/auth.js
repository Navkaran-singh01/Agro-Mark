const express = require('express');
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
module.exports = router;
