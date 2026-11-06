const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const Product = require("../models/Product")

const isCustomer = require("../middleware/is-customer")


// shop page
router.get('/shop', async (req, res)=>{
    const allProducts = await Product.find().populate('category')
    res.render('orders/shop.ejs', {products: allProducts})
})

// see the cart
router.get('/cart', isSignedIn, isCustomer, async (req, res)=>{
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

// add product to the cart
router.post('/cart/add/:productId', isSignedIn, isCustomer, async (req, res)=>{
    let foundCart = await Cart.findOne({
        user: req.session.user._id
    })
    if(!foundCart){
        foundCart = await Cart.create({
            user: req.session.user._id,
            items: []
        })
    }
    // is the product already in the cart?
    const existingItem = foundCart.items.find(i => i.product.equals(req.params.productId))
    if(existingItem){
        existingItem.quantity++
    }
    else {
        foundCart.items.push({
            product: req.params.productId,
            quantity: 1
        })
    }
    await foundCart.save()
    res.redirect('/orders/cart')
})

//update quantity in the cart
router.put('/cart/:productId', isSignedIn, isCustomer, async (req, res)=>{
    const quantity = parseInt(req.body.quantity) // turns the html to integer
    const foundCart = await Cart.findOne({
        user: req.session.user._id
    })
    const existingItem = foundCart.items.find(i => i.product.equals(req.params.productId))

    if(existingItem && quantity > 0){
        existingItem.quantity = quantity
        await foundCart.save()
    }
    res.redirect('/orders/cart')
})

// remove product from the cart
router.delete('/cart/:productId', isSignedIn, isCustomer, async (req, res)=>{
    await Cart.updateOne(
        {
            user: req.session.user._id
        },
        {
            $pull: {
                items: {
                    product: req.params.productId
                }
            }
        }

    )
    res.redirect('/orders/cart')
})

// checkout (create an order)
router.post('/', isSignedIn, isCustomer, async (req, res)=>{
    const foundCart = await Cart.findOne({
        user: req.session.user._id
    }).populate('items.product')
    if(!foundCart || !foundCart.items.length){
        return res.redirect('/orders/cart')
    }

    const items = foundCart.items.map(i=>({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
    }))

    let total = 0
    for (const item of items) {
    total += item.price * item.quantity
    }

    const createdOrder = await Order.create({
        orderNumber: Date.now(), // creats a number that represents the number of millieseconds since 1/1/1970
        user: req.session.user._id,
        items,
        total
    })
    foundCart.items = []
    await foundCart.save() // saves it into the DB
    res.redirect('/orders/' + createdOrder._id)
})

// read all my orders
router.get('/', isSignedIn, isCustomer, async (req, res)=>{
    const allOrders = await Order.find({
        user: req.session.user._id
    })
    res.render('orders/index.ejs', {orders: allOrders})
})

// read one order
router.get('/:orderId', isSignedIn, isCustomer, async (req, res)=>{
    const foundOrder = await Order.findOne({
        _id: req.params.orderId, 
        user: req.session.user._id
    }).populate('items.product')
    res.render('orders/order-details.ejs', {order: foundOrder})
})

module.exports = router;
