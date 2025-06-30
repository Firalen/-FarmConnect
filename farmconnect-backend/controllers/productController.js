const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category, unit, location, isOrganic, isAvailable, farmerId, farmerName } = req.body;
    
    let imageUrl = '';
    
    // Handle file upload
    if (req.file) {
      // Create the full URL for the uploaded image
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Prepare product data
    const productData = {
      title,
      description,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      category,
      unit: unit || 'kg',
      location,
      isOrganic: isOrganic === 'true' || isOrganic === true,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      imageUrl,
      farmerName: farmerName || req.user.name,
      postedBy: req.user._id,
    };

    // Only add farmerId if it's provided and valid
    if (farmerId && farmerId !== req.user._id.toString()) {
      productData.farmerId = farmerId;
    } else {
      productData.farmerId = req.user._id;
    }

    console.log('Creating product with data:', productData);

    const product = await Product.create(productData);
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('postedBy', 'name email role');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('postedBy', 'name email role');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Allow if admin or owner
    if (product.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = req.body;
    // Handle file upload for updates
    if (req.file) {
      // Delete old image if it exists
      if (product.imageUrl) {
        const oldImagePath = product.imageUrl.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
        const fullOldPath = path.join(__dirname, '../uploads', oldImagePath);
        if (fs.existsSync(fullOldPath)) {
          fs.unlinkSync(fullOldPath);
        }
      }
      // Create new image URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updates.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }
    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Allow if admin or owner
    if (product.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Delete associated image file
    if (product.imageUrl) {
      const imagePath = product.imageUrl.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
      const fullImagePath = path.join(__dirname, '../uploads', imagePath);
      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath);
      }
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 