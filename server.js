// Importar los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const router = require('./app/controllers/router');

const app = express();

// Configuración para servir archivos estáticos
app.use(express.static('app')); // Servir archivos estáticos desde la carpeta 'app'
app.use('/views', express.static('views')); // Servir archivos estáticos desde la carpeta 'views' bajo la ruta '/views'
app.use(router);

// Crear una instancia de la aplicación Express

// Conexión a la base de datos MongoDB
const mongoConnection = "mongodb+srv://admin:Ago21@myapp.niayuxp.mongodb.net/MyAppDB";
mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    productName: String,
    productId: String,
    price: Number,
    description: String,
    stock: Number,
    sizes: [String]
});

// Definir el modelo del producto
const Product = mongoose.model('productsProyect', productSchema);

// Middleware para analizar JSON en solicitudes POST
app.use(express.json());

// Ruta para manejar la solicitud POST de guardar un producto
app.post('/guardar-producto', (req, res) => {
    // Crear un nuevo producto utilizando los datos recibidos en la solicitud
    const newProduct = new Product(req.body);

    // Guardar el producto en la base de datos
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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});