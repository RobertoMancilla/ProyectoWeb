const express = require('express');
const path = require('path');

const productRouter = require('../routes/products_routes.js');
const adminProductRouter = require('../routes/Admin_routes.js');
const authenticate = require('../middleware/tokens.js');

const auth = require('../controllers/auth-controllers.js')


const router = express.Router();

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/home.html')));
router.get('/home', (req, res) => res.sendFile(path.join(__dirname, "../views/home.html")));
router.get('/shopping_cart', (req, res) => res.sendFile(path.join(__dirname, "../views/shopping_cart.html")));
router.get('/one_product', (req, res) => res.sendFile(path.join(__dirname, '../views/one_product.html')));

//products
router.use('/api', productRouter);

//sign up
router.post('/signup', auth.registerUser);
//log in
router.post('/login', auth.loginUser);

//
router.use('/admin', adminProductRouter);
router.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../views/admin.html')));

module.exports = router;
