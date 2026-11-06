const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const isAdmin = require("../middleware/is-admin")
const Product = require("../models/Product")
const Order = require("../models/Order")

router.use(isSignedIn, isAdmin)

// admin dashboard
router.get('/', async (req, res)=>{
    const productCount = await Product.countDocuments()
    const orderCount = await Order.countDocuments()
    const pendingCount = await Order.countDocuments({
        isDelivered: false
    })
    const recentOrders = await Order.find().sort({createdAt: -1}).limit(5).populate('user') // finds the orders in descending order
    res.render('admin/dashboard.ejs', {productCount, orderCount, pendingCount, recentOrders})
})

// see all orders
router.get("/orders", async (req, res)=>{
    const allOrders = await Order.find()
    res.render('admin/orders.ejs', {order: allOrders})
})

// mark an order as delievered
router.put('/orders/:orderId', async (req, res)=>{
    await Order.findByIdAndUpdate(req.params.orderId, {isDelivered: true})
    res.redirect('/admin/orders')
})

module.exports = router