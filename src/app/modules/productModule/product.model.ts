import mongoose from 'mongoose';
import { CURRENCY_ENUM } from '../../../enums/currency';

const productSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
  isFeatured: { type: Boolean, default: false },
  price: { type: Number, required: true },
  currency: { type: String, default: CURRENCY_ENUM.USD },
  quantity: { type: Number, required: true },
  size: { type: [String], enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
  images: { type: [String], required: true },
  colors: { type: [String], required: true },
}, {
  timestamps: true,
});

const Product = mongoose.model('product', productSchema);

export default Product;
