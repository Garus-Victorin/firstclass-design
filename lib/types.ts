export interface Product {
  id: string
  name: string
  slug?: string
  price: number
  original_price: number
  description?: string
  image: string
  sizes: string[]
  stock: number
  is_new?: boolean
  is_promo?: boolean
  category_ids: string[]
  categories?: {
    name: string
    slug: string
  } | null
  created_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

export interface Category {
  id: string
  lebele: string
  slug?: string
  description?: string
  image?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryMethod: 'livraison' | 'retrait'
  customerInfo: {
    name: string
    phone: string
    address?: string
    email: string
  }
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: Date
}

export interface User {
  id: string
  email: string
  phone?: string
  full_name?: string
  role: 'admin' | 'customer'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  is_active: boolean
  created_at: string
}
