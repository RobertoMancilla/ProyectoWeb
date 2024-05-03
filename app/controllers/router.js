const express = require('express');
const path = require('path');

const productRouter = require('../routes/products_routes.js');
const adminProductRouter = require('../routes/Admin_routes.js');
const signupRouter = require('../routes/signup.js');
const loginRouter = require('../routes/login.js');


const router = express.Router();

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/home.html')));
router.get('/home', (req, res) => res.sendFile(path.join(__dirname, "../views/home.html")));
router.get('/shopping_cart', (req, res) => res.sendFile(path.join(__dirname, "../views/shopping_cart.html")));


//products
router.use('/products', productRouter);

//sign up
router.use('/signup', signupRouter);

//log in
router.use('/login', loginRouter);

//
router.use('/admin', adminProductRouter);
router.get('/admin', (req, res) => res.sendFile(path.resolve(__dirname, '/../views/admin.html')));

module.exports = router;
