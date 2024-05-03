const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('../data/schema_model_users');  

const router = express.Router();

router.use(bodyParser.json());
router.use(cookieParser());

// Middleware para validar los datos del usuario
const validateUserInput = (req, res, next) => {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required xd' });
    }
    next();
};

// Función para generar el token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'el_tieso', { expiresIn: '1d' });
};

router.post('/', validateUserInput, async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash del password antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);
    // Guardamos el usuario en la bd
    const user = new User({ name, surname, email, password: hashedPassword });
    const savedUser = await user.save();

    // Generar el token JWT
    const token = generateToken(savedUser);
    res.cookie('token', token, { httpOnly: true, maxAge: 86400000 }); //1 day
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
