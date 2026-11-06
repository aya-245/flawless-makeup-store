const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const Product = require("../models/Product")


// shop page
router.get('/shop', async (req, res)=>{
    const allProducts = await Product.find().populate('category')
    res.render('orders/shop.ejs', {products: allProducts})
})



module.exports = router;
