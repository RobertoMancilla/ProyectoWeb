//mongo
const mongoose = require('mongoose');
// const mongoConnection = "mongodb+srv://admin:Ago21@myapp.niayuxp.mongodb.net/MyAppDB";
const mongoConnection = "mongodb+srv://admin:Tieso25@myapp.gt6xwtb.mongodb.net/MyAppDB"

function connectToDatabase() {
    mongoose.connect(mongoConnection)
      .then(() => console.log('Conexión a MongoDB exitosa'))
      .catch(err => console.error('Error conectando a MongoDB:', err));
}

module.exports = connectToDatabase;