const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imageUrl2: {
        type: String,
        required: true
    },
    imageUrl3: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    gender: [String],
    sizes: [String]
});


productSchema.statics.findById =  async function(id) {
    const product = await this.findOne({
        _id: {$eq:id}
    })
    return product;
  };

const Product = mongoose.model('products', productSchema);
// const Product = mongoose.model('productsProyects', productSchema);

module.exports = Product;