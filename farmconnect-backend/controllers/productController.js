const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const { processImage, generateThumbnail, getImageMetadata } = require('../utils/imageProcessor');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category, unit, location, isOrganic, isAvailable, farmerId, farmerName } = req.body;
    
    let imageUrl = '';
    let thumbnailUrl = '';
    
    // Handle file upload with processing
    if (req.file) {
      try {
        // Process and optimize the uploaded image
        const processedImagePath = await processImage(req.file.path, {
          width: 800,
          height: 600,
          quality: 80
        });

        // Generate thumbnail
        const thumbnailPath = await generateThumbnail(processedImagePath, {
          width: 200,
          height: 200,
          quality: 70
        });

        // Create URLs for the processed images
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const processedFilename = path.basename(processedImagePath);
        const thumbnailFilename = path.basename(thumbnailPath);
        
        imageUrl = `${baseUrl}/uploads/${processedFilename}`;
        thumbnailUrl = `${baseUrl}/uploads/${thumbnailFilename}`;

        // Get image metadata
        const metadata = await getImageMetadata(processedImagePath);
        console.log('Image metadata:', metadata);

      } catch (processingError) {
        console.error('Image processing error:', processingError);
        // Fallback to original file if processing fails
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
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
      thumbnailUrl,
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
      try {
        // Delete old images if they exist
        if (product.imageUrl) {
          const oldImagePath = product.imageUrl.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
          const fullOldPath = path.join(__dirname, '../uploads', oldImagePath);
          if (fs.existsSync(fullOldPath)) {
            fs.unlinkSync(fullOldPath);
          }
        }
        if (product.thumbnailUrl) {
          const oldThumbPath = product.thumbnailUrl.replace(`${req.protocol}://${req.get('host')}/uploads/`, '');
          const fullOldThumbPath = path.join(__dirname, '../uploads', oldThumbPath);
          if (fs.existsSync(fullOldThumbPath)) {
            fs.unlinkSync(fullOldThumbPath);
          }
        }

        // Process new image
        const processedImagePath = await processImage(req.file.path, {
          width: 800,
          height: 600,
          quality: 80
        });

        // Generate new thumbnail
        const thumbnailPath = await generateThumbnail(processedImagePath, {
          width: 200,
          height: 200,
          quality: 70
        });

        // Create new image URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const processedFilename = path.basename(processedImagePath);
        const thumbnailFilename = path.basename(thumbnailPath);
        
        updates.imageUrl = `${baseUrl}/uploads/${processedFilename}`;
        updates.thumbnailUrl = `${baseUrl}/uploads/${thumbnailFilename}`;

      } catch (processingError) {
        console.error('Image processing error:', processingError);
        // Fallback to original file if processing fails
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        updates.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
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