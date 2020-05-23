const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    productText: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    productData: {
        type: Date,
        required: true,
        default: Date.now
    },
    productImage: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
});

module.exports = mongoose.model("Products", ProductsSchema)