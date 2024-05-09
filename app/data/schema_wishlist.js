const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,  // ObjectId
        ref: 'products',  
        required: true
    }
});


const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // ObjectId
        ref: 'users',  // Referencia al modelo de usuarios
        required: true
    }, 
    items: [wishlistItemSchema]
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);  

module.exports = Wishlist;