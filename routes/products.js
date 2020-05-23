const express = require('../node_modules/express');
const router = express.Router();

const Product = require('../models/product');
const Categories = require('../models/category');

const multer = require('multer');



// Images in database
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Getting all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

// Getting one
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
});

// Creating one
router.post('/', upload.single('productImage'), async (req, res) => {
    console.log(req.body);
    const product = new Product({
        title: req.body.title,
        productText: req.body.productText,
        price: req.body.price,
        productImage: req.file !== undefined ? req.file.path : undefined,
        category: req.body.category
    })

    try {
        const newProduct = await product.save();
        const category = await Categories.findById(req.body.category).populate("products");
        if (category) {
            category.products.push(newProduct);
            category.save();
            newProduct.category = category;
            res.status(201).json(newProduct)
        } else {
            throw `Category with id: ${req.body.category} does not exist.`;
        } 
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Updating One
router.patch('/:id', upload.single('productImage'), getProduct, async (req, res,) => {
    if (req.body.title != null) {
        res.product.title = req.body.title
    }
    if (req.body.productText != null) {
        res.product.productText = req.body.productText
    }
    if (req.body.price != null) {
        res.product.price = req.body.price
    }
    res.product.productImage = req.file.path
    try {
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

// Deleting one
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove();
        res.json({message: 'Deleted Product'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Search
router.get('/search/:searchWord', async (req, res) => {
    let searchWord = req.params.searchWord;

    try {
        const products = await Product.find({
            $or: [
                { "ProductText": { "$regex": searchWord, "$options": "i" } },
                { "price": { "$regex": searchWord, "$options": "i" } },
                { "title": { "$regex": searchWord, "$options": "i" } }
            ]
        })
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.product = product
    next();
}

module.exports = router;
