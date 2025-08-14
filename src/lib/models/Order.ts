import mongoose, { Schema, models } from 'mongoose';
import { Order, OrderItem, ShippingAddress } from '@/types';

const orderItemSchema = new Schema<OrderItem>({
  productId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1,
    default: 1 
  },
  image: { 
    type: String, 
    required: true 
  }
});

const shippingAddressSchema = new Schema<ShippingAddress>({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderSchema = new Schema<Order>({
  userId: { 
    type: String, 
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: [orderItemSchema],
  subtotal: { 
    type: Number, 
    required: true,
    min: 0 
  },
  tax: { 
    type: Number, 
    required: true,
    min: 0 
  },
  total: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  paymentId: { type: String },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  trackingNumber: { type: String }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `SG${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

export const OrderModel = models.Order || mongoose.model<Order>('Order', orderSchema);
