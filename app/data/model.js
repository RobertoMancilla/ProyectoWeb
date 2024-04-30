const mongoose = require('mongoose');
const productsSchema = require('./schema');

const ProductsModel = mongoose.model('products', productsSchema);

module.exports = ProductsModel;