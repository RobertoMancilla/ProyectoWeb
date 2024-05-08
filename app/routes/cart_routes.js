const express = require('express');
const router = express.Router();

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
// Obtener el carrito de un usuario
router.get('/:userId', (req, res) => {
    Cart.findOne({ userId: req.params.userId })
        .populate('items.productId')  // Asumiendo que 'items.productoId' es una referencia a un modelo de Producto
        .then(cart => {
            if (cart) {
                res.status(200).json(cart);
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        })
        .catch(error => {
            console.error('Error al recuperar el carrito:', error);
            res.status(500).send('Error al recuperar el carrito');
        });
});


router.post('/remove/:productId/:size', async (req, res) => {
    const productId = req.params.productId;
    const size = req.params.size;

    const userId = req.body.userId; 

    try {
        // Encuentra el carrito del usuario
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send('Cart not found.');
        }
        const updatedItems = cart.items.filter(item => !(item.productId.toString() === productId && item.size === size));
        cart.items = updatedItems;
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        res.status(500).send('Failed to remove item from cart.');
    }
});

module.exports = router;
