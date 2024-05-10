const express = require('express');
const router = express.Router();

const Cart = require('../data/schema_cart');
const Product = require('../data/products');


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

// Actualizar la talla y/o la cantidad de un producto en el carrito
router.post('/update-item/:productId', async (req, res) => {
    const { productId } = req.params;
    const { userId, newSize, newQuantity, currentSize } = req.body;

    try {
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send('Cart not found.');
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === currentSize);

        if (itemIndex > -1) {
            const productDetails = await Product.findById(productId);

            if (newSize) {
                cart.items[itemIndex].size = newSize;
            }

            // Solo actualizamos la cantidad si `newQuantity` es un número válido y no supera el stock
            if (newQuantity !== null && newQuantity <= productDetails.stock) {
                cart.items[itemIndex].quantity = newQuantity;
            } else if (newQuantity !== null) {  // Error específico para la cantidad excediendo el stock
                return res.status(400).send(`Cannot exceed stock quantity of ${productDetails.stock}.`);
            }

            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } else {
            res.status(404).send('Product with specified size not found in cart.');
        }
    } catch (error) {
        console.error('Failed to update item in cart:', error);
        res.status(500).send('Failed to update item in cart.');
    }
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
