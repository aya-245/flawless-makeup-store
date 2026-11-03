const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const Product = require("../models/Product")
const Category = require("../models/Category")

// add/create a product
router.get('/new', isSignedIn, async (req, res)=>{
    const categories = await Category.find()
    console.log(categories)
    res.render('products/new-product.ejs', {categories: categories})
})

router.post('/', isSignedIn, async (req, res)=>{
    const {name, description, price, category} = req.body
    const createdProduct = await Product.create({
        name,
        description,
        price,
        category
    })
    res.redirect('/products')
})

// read/see all the products
router.get('/', async (req, res)=>{
    const allProducts = await Product.find().populate('category')
    res.render('products/index.ejs', {products: allProducts})
})

router.get('/:productId', isSignedIn, async (req, res)=>{
    const foundProduct = await Product.findById(req.params.productId).populate('category')
    console.log(foundProduct)
    res.render('products/product-details.ejs', {product: foundProduct})
})

// delete product
router.delete('/:productId', isSignedIn, async (req, res)=>{
    const foundProduct = await Product.findById(req.params.productId)
    await Product.findByIdAndDelete(req.params.productId)
    res.redirect('/products')
})
module.exports = router;
