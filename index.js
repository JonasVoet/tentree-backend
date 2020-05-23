require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://jonas7598:jomani123@tentree-products-nd9ul.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to Database Tentree"));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const productsRouter = require('./routes/products')
app.use('/products', productsRouter);

const categories = require('./routes/categories')
app.use('/categories', categories);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));