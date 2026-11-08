const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in")
const Product = require("../models/Product")
const Category = require("../models/Category")

const isAdmin = require("../middleware/is-admin")
const upload = require("../middleware/upload")
const resizeImage = require("../middleware/resize-image")

router.use(isSignedIn, isAdmin)

// add/create a product
router.get('/new', async (req, res)=>{
    const categories = await Category.find()
    res.render('products/new-product.ejs', {categories: categories})
})

router.post('/', upload.single('image'), resizeImage, async (req, res)=>{
    const {name, description, price, category} = req.body
    const createdProduct = await Product.create({
        name,
        description,
        price,
        category,
        image: req.file ? "/uploads/" + req.file.filename : undefined
    })
    res.redirect('/products')
})

// read/see all the products
router.get('/', async (req, res)=>{
    const allProducts = await Product.find().populate('category')
    res.render('products/index.ejs', {products: allProducts})
})

router.get('/:productId', async (req, res)=>{
    const foundProduct = await Product.findById(req.params.productId).populate('category')
    console.log(foundProduct)
    res.render('products/product-details.ejs', {product: foundProduct})
})

// update product
router.get('/:productId/edit', async (req, res)=>{
    const foundProduct = await Product.findById(req.params.productId)
    const categories = await Category.find()

    res.render('products/edit-product.ejs', {product: foundProduct, categories})
})

router.put('/:productsId', upload.single('image'), resizeImage, async (req, res)=>{
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    }
    if(req.file){
        updatedProduct.image = "/uploads/" + req.file.filename
    }
    
    await Product.findByIdAndUpdate(req.params.productsId, updatedProduct)
    res.redirect('/products')
})

// delete product
router.delete('/:productId', async (req, res)=>{
    const foundProduct = await Product.findById(req.params.productId)
    await Product.findByIdAndDelete(req.params.productId)
    res.redirect('/products')
})
module.exports = router;
