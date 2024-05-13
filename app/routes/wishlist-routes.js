const express = require('express');
const router = express.Router();

const Wishlist = require('../data/schema_wishlist');

router.post('/add-item', async (req, res) => {
    try {
        const { userId, productId, selectedSize } = req.body;
        console.log("req body in wishlist routes:", req.body);

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
                // Agregar nuevo producto a la wishlist con la talla seleccionada
                wishlist.items.push({ productId: productId, size: selectedSize });
                await wishlist.save();
                console.log("Product added to wishlist successfully:", wishlist);
                res.status(200).send('Product added to wishlist successfully.');
            }
        } else {
            // Crear una nueva wishlist si no existe
            wishlist = new Wishlist({
                userId: userId,
                items: [{ productId: productId, size: selectedSize }]  // Agregar producto y talla como un solo objeto
            });
            await wishlist.save();
            console.log("Wishlist created successfully:", wishlist);
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


router.post('/update-size/:productId', async (req, res) => {
    const { userId, newSize } = req.body;
    const { productId } = req.params;

    console.log("req body:", req.body);
    console.log("product id:", productId);

    try {
        let wishlist = await Wishlist.findOne({ userId: userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found.' });
        }

        let itemIndex = wishlist.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            wishlist.items[itemIndex].size = newSize;
            await wishlist.save();
            console.log("Wishlist size updated successfully:", wishlist);
            res.status(200).json({ message: 'Wishlist size updated successfully.' });
        } else {
            res.status(404).json({ message: 'Product not found in wishlist.' });
        }
    } catch (error) {
        console.error('Failed to update size in wishlist:', error);
        res.status(500).json({ message: 'Failed to update size in wishlist.', error: error.toString() });
    }
});



router.post('/remove/:productId', async (req, res) => {
    const { userId } = req.body; 
    const { productId } = req.params;

    try {
        // Encuentra la wishlist del usuario
        let wishlist = await Wishlist.findOne({ userId: userId });
        if (!wishlist) {
            return res.status(404).send('Wishlist not found.');
        }

        const updatedItems = wishlist.items.filter(item => !item.productId.equals(productId)); // Usar .equals para comparación de ObjectIds
        wishlist.items = updatedItems;
        const updatedWishlist = await wishlist.save();

        res.status(200).json(updatedWishlist);
    } catch (error) {
        console.error('Failed to remove item from wishlist:', error);
        res.status(500).send('Failed to remove item from wishlist.');
    }
});


module.exports = router;

