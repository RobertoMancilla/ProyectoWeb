const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // ObjectId
        ref: 'users',  // Referencia al modelo de usuarios
        required: true
    },
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);  

module.exports = Wishlist;