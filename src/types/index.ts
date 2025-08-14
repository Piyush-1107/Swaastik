export interface User {
  _id?: string;
  email: string;
  name: string;
  hashedPassword?: string;
  addresses: Address[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'rings' | 'earrings' | 'necklaces' | 'bangles';
  images: string[];
  specifications: ProductSpecifications;
  stock: number;
  featured: boolean;
  reviews: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductSpecifications {
  metal: string;
  purity: string;
  weight: string;
  stones: string[];
  hallmarked: boolean;
}

export interface Review {
  _id?: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface Order {
  _id?: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
