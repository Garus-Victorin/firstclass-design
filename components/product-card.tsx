'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/data'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produit/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="outline" className="absolute bottom-3 left-3 bg-background/90">
            Plus que {product.stock} en stock
          </Badge>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatPrice(product.original_price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
