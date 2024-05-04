const express = require('express');
const mongoose = require('mongoose');
const router = require('./app/controllers/router');

const app = express();

app.use(express.static('app'));
app.use('/views', express.static('views'));
app.use(router);

const mongoConnection = "mongodb+srv://admin:Ago21@myapp.niayuxp.mongodb.net/MyAppDB";
mongoose.connect(mongoConnection);

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});