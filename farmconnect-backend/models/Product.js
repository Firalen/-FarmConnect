const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  location: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  isOrganic: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmerName: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Product', productSchema); 