const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const {id, title, description, price, category } = req.body;
  if (!title || !description || !price || !category) {
      res.status(400).json({ error: 'Missing required attributes: title, description, price, category' });
      return;
  }
  const newProduct = {
      id,
      title,
      description,
      price,
      category
  };
  dataHandler.createProduct(newProduct);
  res.status(201).json({ message: `Product "${title}" created successfully` });
});

router.put('/:id', (req, res) => {
  const productId = req.params.id;
  const { title, description, price, category } = req.body;
  const existingProduct = dataHandler.getProductById(productId);
  if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
  }

  if (!title || !description || !price || !category) {
      res.status(400).json({ error: 'Missing required attributes: title, description, price, category' });
      return;
  }

  existingProduct.title = title;
  existingProduct.description = description;
  existingProduct.price = price;
  existingProduct.category = category;

  dataHandler.updateProduct(productId, existingProduct);

  res.status(200).json({ message: `Product "${existingProduct.title}" updated successfully` });
});

router.delete('/:id', (req, res) => {
  const productId = req.params.id;

  const existingProduct = dataHandler.getProductById(productId);
  if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
  }

  dataHandler.deleteProduct(productId);

  res.status(200).json({ message: `Product "${existingProduct.title}" deleted successfully` });
});

module.exports = router;