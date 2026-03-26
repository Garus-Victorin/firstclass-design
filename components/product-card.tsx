'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Utiliser original_price comme prix principal
  const productPrice = Number(product.original_price) || Number(product.price) || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAdding(true)
    
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Unique'
    addItem(product, defaultSize, 1)
    
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div className="group relative flex flex-col h-full">
      <Link href={`/produit/${product.id}`} className="flex-1">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-background/95 backdrop-blur-sm text-xs">
              Plus que {product.stock}
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs sm:text-sm">Rupture de stock</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 flex-shrink-0">
        <Link href={`/produit/${product.id}`}>
          <h3 className="text-sm sm:text-base font-medium group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base sm:text-lg font-bold text-foreground">
            {formatPrice(productPrice)}
          </span>
          
          <Button
            size="sm"
            className="w-full sm:w-auto gap-1.5 h-9 sm:h-8 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs sm:text-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
          >
            <ShoppingCart className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="whitespace-nowrap">{isAdding ? 'Ajouté !' : 'Ajouter au panier'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
