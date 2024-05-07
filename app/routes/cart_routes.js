const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart_controller');  
const Cart = require('../data/schema_cart');


// Añadir un producto al carrito
router.post('/add-item', (req, res) => {
    console.log("post");
    // Find a cart for the user
    Cart.findOne({ userId: req.body.userId })
        .then(cart => {
            if (cart) {
                console.log("existing cart for the user...updating...");
                const productId = req.body.items[0].productId;
                const size = req.body.items[0].size;
                // console.log("products id:", productId);

                // If a cart exists, update it
                let itemIndex = cart.items.findIndex(item => item.productId.equals(productId) && item.size === size);
                console.log("item index:", itemIndex);
                if (itemIndex > -1) {
                    //same item
                    cart.items[itemIndex].quantity += 1;
                } else {
                    //new product
                    cart.items.push(...req.body.items);
                }
            } else {
                console.log("not existing cart...creating...");
                cart = new Cart({
                    userId: req.body.userId,
                    items: req.body.items
                });
            }
            // console.log("\n\nbody:", req.body);
            // console.log("body items:", req.body.items);
            // console.log("\n\ncart:", cart);

            // Save the cart
            return cart.save();
        })
        .then(productoGuardado => {
            console.log("\nCart guardado con éxito:", productoGuardado);
            res.status(200).send('Cart guardado correctamente.');
        })
        .catch(error => {
            console.error("Error al guardar el cart:", error);
            res.status(500).send('Error al guardar el cart.');
        });
});


// Obtener el carrito de un usuario
router.get('/:userId', (req, res) => {
   
});

// Eliminar un producto del carrito
router.post('/remove', cartController.removeItem);

module.exports = router;
