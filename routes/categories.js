const express = require('../node_modules/express');
const router = express.Router();
const Categories = require('../models/category');

// Getting all
router.get('/', async (req, res) => {
    const categories = await Categories.find().populate("products");
    res.send(categories);
});

// POST ONE
router.post('/', async (req, res) => {
    const category = new Categories(req.body);

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error})
    }
});

// Get ONE Category
router.get('/:id', getCategory, (req, res) => {
    res.json(res.category)
});

async function getCategory(req, res, next) {
    let category
    try {
        category = await Categories.findById(req.params.id).populate("products");
        if (category == null) {
            return res.status(404).json({message: 'Cannot find category by ID'})

        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.category = category
    next()
}

module.exports = router;