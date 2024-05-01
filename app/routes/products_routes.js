const express = require('express');
const bodyParser = require('body-parser');

const data_handler = require('../controllers/data_handler');

const router = express.Router();

router.use(bodyParser.json());

router.get('/', async (req, res) => { // Haz la función manejadora asincrónica
    try {
        let arr = await data_handler.getProducts(); // Espera a que se complete la obtención de productos
        res.json(arr); // Envía los productos como respuesta JSON
    } catch (error) {
        console.error("Error al obtener los productos:", error.message);
        res.status(404).send("Ocurrió un error al obtener los productos");
    }
});

module.exports = router;
