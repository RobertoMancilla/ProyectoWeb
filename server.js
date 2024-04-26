const express = require('express');
const mongoose = require('mongoose');
const router = require('./app/controllers/router');

const app = express();

app.use(express.static('app'));
app.use('/views', express.static('views'));
app.use(router);

const mongoConnection = "mongodb+srv://admin:Ago21@myapp.niayuxp.mongodb.net/MyAppDB";
mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
    productName: String,
    productId: String,
    price: Number,
    description: String,
    stock: Number,
    sizes: [String]
});

const Product = mongoose.model('productsProyect', productSchema);

app.use(express.json());

app.post('/guardar-producto', (req, res) => {
    const newProduct = new Product(req.body);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});