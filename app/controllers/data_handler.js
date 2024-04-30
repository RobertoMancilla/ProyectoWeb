const mongoose = require('../data/bd_connection');
const ProductsModel = require('../data/model');

async function getProducts() {
    try {
        const products = await ProductsModel.find({});
        console.log(products);
        return products;
    } catch (err) {
      console.error('Error retrieving products:', err);
    }
}

exports.getProducts = getProducts;