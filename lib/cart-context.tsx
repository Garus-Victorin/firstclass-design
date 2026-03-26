'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { CartItem, Product } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  discount: number
  promoCode: string | null
  setDiscount: (discount: number, code: string | null) => void
  finalTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const CART_STORAGE_KEY = 'firstclass_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [discount, setDiscountState] = useState(0)
  const [promoCode, setPromoCode] = useState<string | null>(null)

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
    }
    setIsHydrated(true)
  }, [])

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error)
      }
    }
  }, [items, isHydrated])

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.size === size
      )
      
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }
      
      return [...prev, { product, size, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.size === size)
    ))
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size)
      return
    }
    
    setItems(prev => prev.map(item => 
      item.product.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    setDiscountState(0)
    setPromoCode(null)
    localStorage.removeItem(CART_STORAGE_KEY)
  }, [])

  const setDiscount = useCallback((newDiscount: number, code: string | null) => {
    setDiscountState(newDiscount)
    setPromoCode(code)
  }, [])

  const total = items.reduce(
    (sum, item) => sum + (Number(item.product.original_price) || Number(item.product.price) || 0) * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const finalTotal = total - discount

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      discount,
      promoCode,
      setDiscount,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
