const mongoose = require('../data/bd_connection');
const Product = require('../data/model');

// Obtener todos los productos
async function getProducts() {
    try {
        const products = await Product.find({});
        return products;
    } catch (err) {
        console.error('Error retrieving products:', err);
        throw err; // Para manejo externo
    }
}

// Obtener un producto por su UUID
async function getProductById(uuid) {
    try {
      const productUuid = await Product.findOne({ uuid: uuid });
      if (!productUuid) {
        throw new Error("No se encontró ningún producto con ese UUID");
      }

      return productUuid;

    } catch (err) {
      console.error('Error retrieving product by id:', err);
      throw err;
    }
}

// Buscar productos por categoría o título
async function findProduct(query, sortOrder = 'asc') {
  try {

    let [category, title] = query.split(':').map(str => str.trim());
    let filter = {};

    if (category && title) {
      filter = { category: category, title: { $regex: title, $options: 'i' } };
    } else if (category) {
      filter = { category: category };
    } else if (title) {
      filter = { title: { $regex: title, $options: 'i' } };
    }

    let sortOption = sortOrder === 'asc' ? { pricePerUnit: 1 } : { pricePerUnit: -1 };
    const products = await Product.find(filter).sort(sortOption);
    return products;

  } catch (err) {

    console.error("Error al buscar productos:", err);
    throw err;

  }
}

exports.getProducts = getProducts;
exports.getProductById = getProductById;
