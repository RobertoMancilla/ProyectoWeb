const User = require('../data/schema_users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        // Error general si alguno de los campos está vacío
        return res.status(400).send({
            authError: "Email and password must be provided."
        });
    }

    try {
        const userData = await User.findByEmail(email);
        console.log("Login attempt for ", userData);

        if (!userData) {
            // Error específico si no se encuentra el usuario por el email
            return res.status(404).send({
                authError: "Account with given email not found."
            });
        }

        // Comprobar si la contraseña coincide
        const isMatch = bcrypt.compareSync(password, userData.password);
        if (!isMatch) {
            // Error específico si la contraseña no coincide
            return res.status(401).send({
                authError: "Incorrect password."
            });
        }

        // Crear JWT token si la autenticación es exitosa
        const sToken = jwt.sign({ email: userData.email, id: userData._id }, "keySecret", {
            expiresIn: 18000
        });
        res.send({ sToken });

    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).send({
            authError: "An error occurred during the login process."
        });
    }
}

async function registerUser(req, res) {
    const { email, password, name, surname } = req.body;

    // Verificar si alguno de los campos requeridos está vacío
    if (!name) {
        return res.status(400).send({ error: "No name field or it's empty" });
    }
    if (!email) {
        return res.status(400).send({ error: "No email field or it's empty" });
    }
    if (!password) {
        return res.status(400).send({ error: "No password field or it's empty" });
    }
    if (!surname) {
        return res.status(400).send({ error: "No surname field or it's empty" });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ error: "User already exists with the given email" });
        }

        // Crear el usuario con la información proporcionada
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            name: name,
            surname: surname
        });

        // Guardar el usuario en la base de datos
        await newUser.save();
        console.log("Registered user: ", newUser);
        res.status(201).send({ msg: "User created correctly" });
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).send({ error: "Something bad happened :(. User not created: " + error.message });
    }
}


module.exports = {loginUser, registerUser};