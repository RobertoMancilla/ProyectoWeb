const express = require('express');
const bodyParser = require('body-parser');

const data_handler = require('../controllers/data_handler');

const router = express.Router();

router.use(bodyParser.json());

router.get('/', (req, res) => {
    try {
        arr = data_handler.getProducts();
        res.json(arr);
    } catch (error) {
        console.error("Error al obtener los productos:", error.message);
        res.status(404).send("Ocurrió un error al obtener los productos");
    }
});

module.exports = router;
