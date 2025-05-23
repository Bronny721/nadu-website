export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  isNew?: boolean
  origin?: string
  material?: string
  dimensions?: string
  weight?: string
  images?: string[] // 添加多張圖片支持
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  slug: string
}

export type UserRole = 'user' | 'admin' | 'store_owner';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}
