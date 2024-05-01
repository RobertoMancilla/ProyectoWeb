const express = require('express');
const router = express.Router();
const Product = require('../data/schema'); 

router.use(express.json());

router.get('/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).json(productos); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/delete/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId });

        if (!product) {
            return res.status(404).send('No se encontró ningún producto con ese ID.');
        }

        await product.deleteOne();
        res.status(200).send('Producto eliminado correctamente.');
    } catch (error) {
        console.error('Error al eliminar el producto2:', error);
        res.status(500).send('Error al eliminar el producto6.');
    }
});

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

router.post('/actualizar-producto', async (req, res) => {
    try {
        const updatedProductData = req.body;
        const productId = updatedProductData.productId;

        console.log("Valor de la categoría recibido:", updatedProductData.category);

        const product = await Product.findOne({ productId: productId });

        if (!product) {
            return res.status(404).send('No se encontró ningún producto con ese ID.');
        }
        product.productName = updatedProductData.productName;
        product.imageUrl = updatedProductData.imageUrl;
        product.price = updatedProductData.price;
        product.description = updatedProductData.description;
        product.stock = updatedProductData.stock;
        product.category = updatedProductData.category;
        product.sizes = updatedProductData.sizes;

        await product.save();
        res.status(200).send('Producto actualizado correctamente.');
    } catch (error) {
        console.error('Error al actualizar el producto2:', error);
        res.status(500).send('Error al actualizar el producto3.');
    }
});

module.exports = router;