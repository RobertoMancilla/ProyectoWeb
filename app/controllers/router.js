const express = require('express');
const path = require('path');

const productRouter = require('../routes/products_routes.js');
const adminProductRouter = require('../routes/Admin_routes.js');
const cartRouter = require('../routes/cart_routes.js');

const auth = require('../controllers/auth-controllers.js')


const stripe = require("stripe")("sk_test_51PDGq1LzpsDqoDSLDAFIC4RBAR54OWFDDnRZZxWO3Ui4y2LWJYwUZ3hUM3Htm5bF0FmsTaQvPOSeeerWQquVGAZ300o5Ylf8MO")

const router = express.Router();

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/home.html')));
router.get('/home', (req, res) => res.sendFile(path.join(__dirname, "../views/home.html")));
router.get('/shopping_cart', (req, res) => res.sendFile(path.join(__dirname, "../views/shopping_cart.html")));
router.get('/one_product', (req, res) => res.sendFile(path.join(__dirname, '../views/one_product.html')));
router.get('/success', (req, res) => res.sendFile(path.join(__dirname, '../views/success.html')));
router.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, '../views/cancel.html')));

//products
router.use('/api', productRouter);

//cart
router.use('/cart', cartRouter);

//sign up
router.post('/signup', auth.registerUser);
//log in
router.post('/login', auth.loginUser);
//log in
router.post('/checkout', async (req, res) => {
    console.log(req.body);

    try {
        // Asumimos que 'items' es un array de arrays como se envía desde el front-end
        const line_items = req.body.items.map(item => {
            const [id, details] = item;
            console.log("este es el item: ",item)
            return {
                price_data: {
                    currency: "mxn",
                    product_data: {
                        name: details.name,
                    },
                    unit_amount: details.priceInCents,
                },
                quantity: details.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: line_items,
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        res.json({ url: session.url});
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

//
router.use('/admin', adminProductRouter);
router.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../views/admin.html')));

module.exports = router;
