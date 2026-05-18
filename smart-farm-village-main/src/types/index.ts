export interface User {
  id?: string;
  name: string;
  age?: number;
  address?: string;
  mobile?: string;
  username?: string;
  password?: string;
  gstNumber?: string;
  panCard?: string;
  bankAccount?: string;
  state?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  sellerId: string;
  quantity: number;
  sellerName?: string;
  sellerState?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  products: CartItem[];
  totalAmount: number;
  address: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

export type Language = 'en' | 'hi' | 'pa';

export interface LearningResource {
  id: string;
  title: string;
  content: string;
  type: 'documentation' | 'video';
  category: string;
  language: Language;
}