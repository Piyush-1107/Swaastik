import mongoose, { Schema, models } from 'mongoose';
import { User, Address } from '@/types';

const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new Schema<User>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  hashedPassword: { 
    type: String, 
    required: function() {
      return !this.email.includes('@google'); // Not required for OAuth users
    }
  },
  addresses: [addressSchema]
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });

export const UserModel = models.User || mongoose.model<User>('User', userSchema);
