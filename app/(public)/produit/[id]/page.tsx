"use client";

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Phone } from 'lucide-react'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FeaturedProducts } from '@/components/featured-products'
import { Reviews } from '@/components/reviews'
import type { Product, Review } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setError(null)
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !productData) {
        setError('Produit non trouvé')
        setLoading(false)
        return
      }

      setProduct(productData)

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData)
      }

      setLoading(false)
    }

    fetchProduct()
  }, [id])

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  
  const { addItem } = useCart()

  if (loading) {
    return <div className="py-8">Chargement...</div>
  }
  if (error || !product) {
    notFound()
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem(product, selectedSize, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const generateWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Bonjour ! Je suis intéressé(e) par ce produit:\n\n` +
      `*${product.name}*\n` +
      `Prix: ${formatPrice(product.original_price)}\n` +
      `Taille: ${selectedSize || 'Non sélectionnée'}\n` +
      `Quantité: ${quantity}\n\n` +
      `Pouvez-vous me donner plus d'informations ?`
    )
    return `https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, '225')}?text=${message}`
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link 
          href="/catalogue" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au catalogue
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-muted overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Produit
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mt-4">
                <span className="text-2xl font-bold">
                  {formatPrice(product.original_price)}
                </span>
              </div>

              <p className="text-muted-foreground mt-6 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mt-6">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    En stock ({product.stock} disponibles)
                  </p>
                ) : (
                  <p className="text-sm text-destructive">
                    Rupture de stock
                  </p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3">Taille</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-[44px] px-4 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-muted-foreground mt-2">
                  Veuillez sélectionner une taille
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Quantité</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10 border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize || product.stock === 0}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="flex-1"
              >
                <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Commander via WhatsApp
                </a>
              </Button>
            </div>

            {/* Delivery info */}
            <div className="mt-8 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Modes de livraison</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Livraison à domicile</li>
                <li>• Retrait en boutique gratuit</li>
                <li>• Paiement à la livraison</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <Reviews reviews={reviews} />

        {/* Related Products */}
        <div className="mt-16 lg:mt-24">
          <FeaturedProducts 
            title="Vous aimerez aussi"
            subtitle="Découvrez des produits similaires"
            limit={4}
          />
        </div>
      </div>
    </div>
  )
}
