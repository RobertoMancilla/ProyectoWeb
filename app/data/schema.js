const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: () => mongoose.Types.ObjectId(), // Auto-generate UUID
        validate: {
            validator: () => false, // Always fail validation to mimic the setter behavior
            message: 'Product uuids are auto-generated'
        }
    },
    title: {
        type: String,
        required: [true, 'El título no debe de ser un str vacío :/'],
        trim: true // Automatically trim the string
    },
    description: {
        type: String,
        required: [true, 'La descripción no debe de ser un str vacío :/'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen no debe ser un str vacío :/'],
        trim: true
    },
    unit: {
        type: String,
        required: [true, 'La unidad no debe de ser un str vacío :/'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock debe ser un número positivo :/'],
        min: [0, 'El stock debe ser un número positivo :/']
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'El precio debe ser un número positivo :/'],
        min: [0, 'El precio debe ser un número positivo :/']
    },
    category: {
        type: String,
        required: [true, 'La categoría no debe ser un str vacío :/'],
        trim: true
    }
});

module.exports = ProductSchema;
