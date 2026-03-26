'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart, addItem, setDiscount, discount, promoCode, finalTotal } = useCart()
  const [productsData, setProductsData] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [promoApplied, setPromoApplied] = useState<any>(null)
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    fetchProductsData()
  }, [items])

  const fetchProductsData = async () => {
    if (items.length === 0) {
      setLoading(false)
      return
    }

    const productIds = [...new Set(items.map(item => item.product.id))]
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (!error && data) {
      const productsMap = data.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {} as Record<string, Product>)
      setProductsData(productsMap)
    }
    
    setLoading(false)
  }

  const handleSizeChange = (productId: string, oldSize: string, newSize: string, quantity: number) => {
    const product = productsData[productId]
    if (!product) return

    removeItem(productId, oldSize)
    addItem(product, newSize, quantity)
  }

  const applyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setPromoError('Veuillez entrer un code promo')
      return
    }

    setPromoError('')
    
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', promoCodeInput.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      setPromoError('Code promo invalide')
      setPromoApplied(null)
      setDiscount(0, null)
      return
    }

    const today = new Date()
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)

    if (today < startDate || today > endDate) {
      setPromoError('Ce code promo a expiré')
      setPromoApplied(null)
      setDiscount(0, null)
      return
    }

    if (total < data.min_order) {
      setPromoError(`Commande minimum: ${formatPrice(data.min_order)}`)
      setPromoApplied(null)
      setDiscount(0, null)
      return
    }

    let calculatedDiscount = 0
    if (data.type === 'percentage') {
      calculatedDiscount = (total * data.value) / 100
    } else {
      calculatedDiscount = data.value
    }

    setPromoApplied(data)
    setDiscount(calculatedDiscount, data.code)
    setPromoError('')
  }

  const removePromoCode = () => {
    setPromoCodeInput('')
    setPromoApplied(null)
    setDiscount(0, null)
    setPromoError('')
  }

  if (items.length === 0) {
    return (
      <div className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Découvrez notre collection et ajoutez vos articles préférés.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/catalogue">
                Découvrir le catalogue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/catalogue" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Panier <span className="text-muted-foreground">({itemCount})</span>
            </h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearCart} 
              className="text-muted-foreground hover:text-destructive self-start sm:self-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => {
              const fullProduct = productsData[item.product.id] || item.product
              
              return (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link href={`/produit/${item.product.id}`} className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-32 h-40 sm:w-28 sm:h-36 lg:w-32 lg:h-40 bg-muted overflow-hidden rounded-md">
                      <Image
                        src={fullProduct.image}
                        alt={fullProduct.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 128px, 160px"
                      />
                      {fullProduct.stock <= 5 && fullProduct.stock > 0 && (
                        <Badge variant="outline" className="absolute top-2 right-2 bg-background/95 text-xs">
                          Stock: {fullProduct.stock}
                        </Badge>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
                      <Link 
                        href={`/produit/${item.product.id}`}
                        className="font-semibold text-base sm:text-lg hover:text-accent transition-colors line-clamp-2"
                      >
                        {fullProduct.name}
                      </Link>
                      
                      {fullProduct.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {fullProduct.description}
                        </p>
                      )}

                      {/* Size Selector */}
                      <div className="mt-3 sm:mt-4">
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                          Taille
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {fullProduct.sizes && fullProduct.sizes.length > 0 ? (
                            fullProduct.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(item.product.id, item.size, size, item.quantity)}
                                className={`px-4 py-2 text-sm font-medium rounded-md border-2 transition-all ${
                                  item.size === size
                                    ? 'border-orange-500 bg-orange-500 text-white'
                                    : 'border-border bg-background hover:border-orange-300 hover:bg-orange-50'
                                }`}
                              >
                                {size}
                              </button>
                            ))
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 text-sm font-medium rounded-md border-2 border-orange-500 bg-orange-500 text-white"
                            >
                              Unique
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-base sm:text-lg font-bold mt-3 sm:mt-4">
                        {formatPrice(Number(fullProduct.original_price) || 0)}
                        <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">
                          / unité
                        </span>
                      </p>
                    </div>

                    {/* Quantity Controls & Total */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-muted-foreground">Quantité:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="h-8 w-8 sm:h-9 sm:w-9 border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="h-8 w-8 sm:h-9 sm:w-9 border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={fullProduct.stock > 0 && item.quantity >= fullProduct.stock}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Sous-total</p>
                          <p className="text-lg sm:text-xl font-bold text-accent">
                            {formatPrice((Number(fullProduct.original_price) || 0) * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24 lg:top-32 bg-secondary/50 backdrop-blur-sm border border-border rounded-lg p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Résumé de la commande</h2>
              
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Articles ({itemCount})</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                {promoApplied && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({promoApplied.name})</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-green-600 font-medium">À définir</span>
                </div>
              </div>

              {/* Code Promo */}
              <div className="mt-4 pt-4 border-t border-border">
                <label className="text-sm font-medium mb-2 block">Code promo</label>
                {!promoApplied ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Entrez le code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button 
                      onClick={applyPromoCode}
                      variant="outline"
                      size="sm"
                      className="px-4"
                    >
                      Appliquer
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{promoApplied.code}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-green-600 hover:text-green-700 underline"
                    >
                      Retirer
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-red-600 mt-1">{promoError}</p>
                )}
              </div>

              <div className="border-t border-border mt-4 sm:mt-6 pt-4 sm:pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold">Total</span>
                  <div className="text-right">
                    {promoApplied && discount > 0 ? (
                      <>
                        <div className="text-sm text-red-600 line-through mb-1">
                          {formatPrice(total)}
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-green-600">
                          {formatPrice(finalTotal)}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Vous économisez {formatPrice(discount)}
                        </div>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-accent">{formatPrice(finalTotal)}</span>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                asChild 
                size="lg" 
                className="w-full mt-6 h-11 sm:h-12 text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                <Link href="/commande">
                  Passer la commande
                </Link>
              </Button>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  💳 Paiement à la livraison<br />
                  🏪 Retrait gratuit en boutique
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
