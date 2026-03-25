'use client'

import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  filter?: 'new' | 'promo' | 'all'
  limit?: number
}

export function FeaturedProducts({
  title = 'Produits Populaires',
  subtitle = 'Découvrez nos pièces les plus demandées',
  filter = 'all',
  limit = 8
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [filter, limit])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(limit || 8)

    if (error) {
      console.error('Erreur featured products:', error)
      setProducts([])
    } else {
      // Mélanger aléatoirement les produits
      const shuffled = (data || []).sort(() => Math.random() - 0.5)
      setProducts(shuffled.slice(0, limit || 8))
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement produits...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          {/* Bouton Voir tout le catalogue comme dernier élément de la grille */}
          <Link 
            href="/catalogue"
            className="aspect-[3/4] border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <div className="text-center">
              <ArrowRight className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="font-semibold text-foreground group-hover:text-accent transition-colors">Voir tout</p>
              <p className="text-sm text-muted-foreground mt-1">le catalogue</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

