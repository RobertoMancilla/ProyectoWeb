const express = require('express');
const router = express.Router();
const Product = require('../data/products.js'); 

router.use(express.json());

// Ruta para obtener todos los productos en HOME.html
router.get('/productosAPI', async (req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).json(productos); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta para obtener los detalles de un producto por su ID para One_product
router.get('/oneProducto/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const producto = await Product.findOne({ productId: productId }); // Buscar por productId en lugar de _id
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del producto' });
    }
});

module.exports = router;