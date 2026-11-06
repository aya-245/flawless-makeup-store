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

// see the cart
router.get('/cart', isSignedIn, async (req, res)=>{
    const foundCart = await Cart.findOne({
        user: req.session.user._id
    }).populate('items.product')
    const items = foundCart ? foundCart.items : []
    let total = 0
    for (const item of items) { // adds up the price of everything in the cart
        total += item.product.price * item.quantity
    }
    res.render('orders/cart.ejs', {items, total})
})

module.exports = router;
