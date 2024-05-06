const express = require('express');
const path = require('node:path');
const router = require('./app/controllers/router');
const { connectToDatabaseRobert, connectToDatabaseSebas } = require('./app/data/bd_connection');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'app/public')));

app.set('views', path.join(__dirname, 'app/views'));

//
app.use(express.json());

//middleware
app.use(router);

// connectToDatabaseSebas();
connectToDatabaseRobert();

app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});

