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
    lebele: string
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
  description?: string
  created_at?: string
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
  nom: string
  prenom: string
  email: string
  mot_de_passe: string
  date_creation: string
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  is_active: boolean
  created_at: string
}
