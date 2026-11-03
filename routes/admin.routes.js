const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const Product = require("../models/Product")

// add/create a product
router.get('/new', isSignedIn, (req, res)=>{
    res.render('orders/new-order.ejs')
})

router.post('/', isSignedIn, async (req, res)=>{
    const {name, description, price, category} = req.body
    const createdProduct = await Product.create({
        name,
        description,
        price,
        category: req.session.user._id
    })
    res.redirect('/orders')
})

module.exports = router;
