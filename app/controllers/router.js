const express = require('express');
const path = require('path');
//const productRouter = require('../routes/products');
const adminProductRouter = require('../routes/Admin_routes.js');

const router = express.Router();
router.use('/admin', adminProductRouter);
//router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../views/home.html')));
//router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname, '../views/home.html')));
//router.get('/shopping_cart', (req, res) => res.sendFile(path.resolve(__dirname, '../views/shopping_cart.html')));
router.get('/admin', (req, res) => res.sendFile(path.resolve(__dirname, '../views/admin.html')));
module.exports = router;
