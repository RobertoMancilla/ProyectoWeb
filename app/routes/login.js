const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../data/schema_model_users'); 

const router = express.Router();

router.use(express.json());

const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    next();
};

router.post('/login', validateLoginInput, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'el_tieso', { expiresIn: '1d' });
        res.json({ message: 'Logged in successfully', token }); // Devuelve el token en la respuesta
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/validate-token', (req, res) => {
    const { token } = req.body;  // Asumir que el token viene en el cuerpo de la solicitud
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'el_tieso', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.json({ message: 'Token is valid', userId: decoded.id });
    });
});

module.exports = router;
