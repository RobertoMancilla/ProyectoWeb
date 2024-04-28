const express = require('express');
const router = express.Router();
const Product = require('../controllers/products.js'); 

router.use(express.json());

router.post('/guardar-producto', (req, res) => {
    console.log("post");
    const newProduct = new Product(req.body);   
    console.log("body:", req.body);

    newProduct.save()
        .then(productoGuardado => {
            console.log("Producto guardado con éxito:", productoGuardado);
            res.status(200).send('Producto guardado correctamente.');
        })
        .catch(error => {
            console.error("Error al guardar el producto:", error);
            res.status(500).send('Error al guardar el producto.');
        });
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

module.exports = router;