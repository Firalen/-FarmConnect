const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Process and optimize uploaded image
const processImage = async (filePath, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    const filename = path.basename(filePath, path.extname(filePath));
    const outputPath = path.join(path.dirname(filePath), `${filename}-processed.${format}`);

    // Process image with Sharp
    await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);

    // Remove original file
    fs.unlinkSync(filePath);

    return outputPath;
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

// Generate thumbnail
const generateThumbnail = async (filePath, options = {}) => {
  const {
    width = 200,
    height = 200,
    quality = 70,
    format = 'jpeg'
  } = options;

  try {
    const filename = path.basename(filePath, path.extname(filePath));
    const thumbnailPath = path.join(path.dirname(filePath), `${filename}-thumb.${format}`);

    await sharp(filePath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw error;
  }
};

// Validate image file
const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  return true;
};

// Get image metadata
const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return null;
  }
};

module.exports = {
  processImage,
  generateThumbnail,
  validateImage,
  getImageMetadata
}; 