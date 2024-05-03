const express = require('express');
const path = require('node:path');
const router = require('./app/controllers/router');
const connectToDatabase = require('./app/data/bd_connection');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'app/public')));

app.set('views', path.join(__dirname, 'app/views'));

//middleware
app.use(router);

connectToDatabase();

app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});


// // let mongoConnection = "mongodb+srv://admin:Tieso25@myapp.gt6xwtb.mongodb.net/MyAppDB"
// mongoose.connect(mongoConnection);