//mongo
const mongoose = require('mongoose');

const mongoConnectionSebas = "mongodb+srv://admin:Ago21@myapp.niayuxp.mongodb.net/MyAppDB";
const mongoConnectionRobert = "mongodb+srv://admin:Tieso25@myapp.gt6xwtb.mongodb.net/MyAppDB"

function connectToDatabaseRobert() {
    mongoose.connect(mongoConnectionRobert)
      .then(() => console.log('Conexión a MongoDB exitosa'))
      .catch(err => console.error('Error conectando a MongoDB:', err));
}

function connectToDatabaseSebas() {
  mongoose.connect(mongoConnectionSebas)
      .then(() => console.log('Conexión a MongoDB exitosa'))
      .catch(err => console.error('Error conectando a MongoDB:', err));
}

module.exports = { connectToDatabaseRobert, connectToDatabaseSebas };