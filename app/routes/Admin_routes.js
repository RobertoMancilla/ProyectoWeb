const express = require('express');
const router = express.Router();
const Product = require('../controllers/products'); 


router.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body); 
        const productoGuardado = await nuevoProducto.save(); 
        res.status(201).json(productoGuardado); 
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});


router.get('/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).json(productos); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


router.put('/productos/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const productoActualizado = await Product.findByIdAndUpdate(id, req.body, { new: true }); 
        res.status(200).json(productoActualizado); 
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});


router.delete('/productos/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await Product.findByIdAndDelete(id); 
        res.status(200).json({ message: 'Producto eliminado correctamente' }); 
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;