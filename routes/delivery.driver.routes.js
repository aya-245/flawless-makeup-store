const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const isDriver = require ("../middleware/is-driver")
const Order = require ("../models/Order")

router.use(isSignedIn, isDriver)

// driver dashboard
router.get('/', async (req, res)=>{
    const currentOrder = await Order.findOne({
        driver: req.session.user._id,
        isDelivered: false
    }).populate('user', 'username phoneNumber streetAddress').populate('items.product')

    const deliveredCount = await Order.countDocuments({
        driver: req.session.user._id,
        isDelivered: true
    })

    const pendingCount = await Order.countDocuments({
        driver: null,
        isDelivered: false
    })

    res.render('delivery/dashboard.ejs', {currentOrder, deliveredCount, pendingCount})
})

// earliest order that is nor delivered and hasnt been assigned a driver
router.post('/next', async (req, res)=>{
    const currentOrder = await Order.findOne({
        driver: req.session.user._id,
        isDelivered: false
    })
    // have to deliver the current order before taking another one
    if(currentOrder){
        return res.redirect('/delivery')
    }

    await Order.findOneAndUpdate(
        {
            driver: null, 
            isDelivered: false
        },
        {
            driver: req.session.user._id
        },
        {
            sort: {createdAt: 1}
        }
    )
    res.redirect('/delivery')
})

// mark order as delivered
router.put('/:orderId', async (req, res)=>{
    await Order.findOneAndUpdate(
        {
            _id: req.params.orderId,
            driver: req.session.user._id
        },
        {
            isDelivered: true
        }
    )
    res.redirect('/delivery')
})

module.exports = router