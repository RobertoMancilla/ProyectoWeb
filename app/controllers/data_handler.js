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
      const product = await Product.findOne({ uuid: uuid });
      if (!product) {
        throw new Error("No se encontró ningún producto con ese UUID");
      }
      return product;

    } catch (err) {
      console.error('Error retrieving product by id:', err);
      throw err;
    }
}

// Crear un nuevo producto
async function createProduct(productData) {
  // verificar que se hayan pasado todos los campos
  if (!productData.uuid || !productData.title || !productData.description || !productData.imageUrl || !productData.unit || productData.stock == null || productData.pricePerUnit == null) {
    console.error("El producto debe tener todos los campos requeridos.");
    throw new Error("Todos los campos requeridos deben estar presentes.");
  }
  //verificar que se proporcione 
  if (productData.stock < 0) {
    console.error("El stock del producto debe ser un número positivo.");
    throw new Error("El stock debe ser un número positivo.");
  }
  if (productData.pricePerUnit <= 0) {
    console.error("El precio por unidad del producto debe ser mayor que cero.");
    throw new Error("El precio por unidad debe ser mayor que cero.");
  }
  try {
      const product = new Product(productData);
      await product.save();
      console.log("Producto creado con éxito.");
      return product;
  } catch (err) {
      console.error("Error al crear el producto:", err);
      throw err;
  }
}

// Actualizar un producto existente
async function updateProduct(uuid, updateData) {
    try {
        const product = await Product.findOneAndUpdate({ uuid: uuid }, updateData, { new: true });
        if (!product) {
            throw new Error("No se encontró ningún producto con ese UUID");
        }
        return product;
    } catch (err) {
        console.error("Error al actualizar el producto:", err);
        throw err;
    }
}

// Eliminar un producto
async function deleteProduct(uuid) {
    try {
        const result = await Product.findOneAndDelete({ uuid: uuid });
        if (!result) {
            throw new Error("No se encontró ningún producto con ese UUID");
        }
        console.log("Producto eliminado correctamente.");
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
        throw err;
    }
}

// Buscar productos por categoría o título
async function findProduct(query) {
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
        const products = await Product.find(filter);
        return products;
    } catch (err) {
        console.error("Error al buscar productos:", err);
        throw err;
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    findProduct
};


exports.getProducts = getProducts;