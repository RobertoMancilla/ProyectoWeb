const express = require('express');
const router = express.Router();

const Wishlist = require('../data/schema_wishlist');

router.post('/add-item', async (req, res) => {
    try {
        // Extraer userID y productID de la petición
        const { userId, productId } = req.body;
        console.log("req body:", req.body);

        // Buscar una wishlist existente para el usuario
        let wishlist = await Wishlist.findOne({ userId: userId });

        if (wishlist) {
            // Comprobar si el producto ya está en la wishlist
            let itemIndex = wishlist.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                // El producto ya está en la wishlist
                console.log("This article is already in your wishlist");
                res.status(409).send("This article is already in your wishlist");
            } else {
                // Agregar nuevo producto a la wishlist
                wishlist.items.push({ productId: productId });
                await wishlist.save();
                // console.log("Wishlist updated successfully:", wishlist);
                res.status(200).send('Product added to wishlist successfully.');
            }
        } else {
            // Crear una nueva wishlist si no existe
            wishlist = new Wishlist({
                userId: userId,
                items: [{ productId: productId }]
            });
            await wishlist.save();
            // console.log("Wishlist created successfully:", wishlist);
            res.status(201).send('Wishlist created and product added.');
        }
    } catch (error) {
        console.error("Error managing the wishlist:", error);
        res.status(500).send('Error managing the wishlist.');
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId })
                                      .populate('items.productId');
        if (!wishlist) {
            return res.status(404).send('Wishlist not found');
        }
        // console.log("wishlist in back:", wishlist);
        res.json(wishlist);
    } catch (error) {
        console.error('Error retrieving wishlist:', error);
        res.status(500).send('Error retrieving wishlist');
    }
});


module.exports = router;

