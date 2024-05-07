const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
        // producto ID crear function
        productId: {
            type: mongoose.Schema.Types.ObjectId,  // ObjectId
            ref: 'products',  
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String,
            required: true
        }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // ObjectId
        ref: 'users',  // Referencia al modelo de usuarios
        required: true
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model('carts', cartSchema);  

module.exports = Cart;





