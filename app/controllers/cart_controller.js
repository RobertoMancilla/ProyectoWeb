const Product = require('../data/products')
const Cart = require('../data/schema_cart')


// Obtener el carrito de un usuario
const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        // console.log("User ID:", userId);

        // Intenta obtener el carrito y poblalo con los detalles del producto
        let cart = await Cart.findOne({ usuarioId: userId })
                             .populate('items.productoId');  // Asegúrate de que la referencia es correcta y corresponde al nombre del modelo y del campo

        console.log("Cart items:", cart ? cart.items : "Cart not found");

        // Si no se encuentra el carrito, devuelve un carrito vacío
        if (!cart) {
            console.log("No cart found for this user, sending empty cart.");
            res.json({
                usuarioId: userId,
                items: [],
                total: 0
            });
        } else {
            res.json(cart);
        }
    } catch (error) {
        console.error("Error fetching the cart:", error);
        res.status(500).send({ error: 'Error fetching the cart: ' + error.message });
    }
};


// Eliminar un artículo del carrito
const removeItem = async (req, res) => {
    const { userId, productoId, size } = req.body;
    try {
        const cart = await Cart.findOne({ usuarioId: userId });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => !(item.productoId.toString() === productoId && item.size === size));
        cart.total = cart.items.reduce((acc, curr) => acc + (curr.cantidad * fetchProductPrice(curr.productoId)), 0); // Implement fetchProductPrice to fetch price
        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Error removing item from the cart: ' + error.message });
    }
};

// Exportando todas las funciones del controlador del carrito
module.exports = {getCart, addItem, removeItem
};
