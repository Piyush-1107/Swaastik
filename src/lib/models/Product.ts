import mongoose, { Schema, models } from 'mongoose';
import { Product, ProductSpecifications, Review } from '@/types';

const reviewSchema = new Schema<Review>({
  userId: { type: String, required: true },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { type: String, required: true }
}, {
  timestamps: true
});

const specificationsSchema = new Schema<ProductSpecifications>({
  metal: { type: String, required: true },
  purity: { type: String, required: true },
  weight: { type: String, required: true },
  stones: [{ type: String }],
  hallmarked: { type: Boolean, default: true }
});

const productSchema = new Schema<Product>({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: {
    type: String,
    required: true,
    enum: ['rings', 'earrings', 'necklaces', 'bangles']
  },
  images: [{ 
    type: String, 
    required: true 
  }],
  specifications: {
    type: specificationsSchema,
    required: true
  },
  stock: { 
    type: Number, 
    default: 1,
    min: 0 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const ProductModel = models.Product || mongoose.model<Product>('Product', productSchema);
