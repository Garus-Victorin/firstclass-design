'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import type { Product, Category as CategoryType } from '@/lib/types'
// import type { SupabaseProduct } from './page'

import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const priceRanges = [
  { min: 0, max: 100000, label: 'Moins de 100 000 FCFA' },
  { min: 100000, max: 200000, label: '100 000 - 200 000 FCFA' },
  { min: 200000, max: 300000, label: '200 000 - 300 000 FCFA' },
  { min: 300000, max: Infinity, label: 'Plus de 300 000 FCFA' },
]

interface SupabaseProduct extends Product {
  categories: {
    name: string
    slug: string
  } | null
}


export default function CataloguePage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [sortBy, setSortBy] = useState('featured')
const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategories([category])
    }
  }, [searchParams])

  const fetchData = async () => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
    
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
    
    setProducts(productsData || [])
    setCategories(categoriesData || [])
    setLoading(false)
  }

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const productPrice = Number(product.original_price) || 0
      
      if (selectedCategories.length > 0) {
        const hasCategory = product.category_ids?.some(catId => 
          selectedCategories.includes(catId)
        )
        if (!hasCategory) return false
      }
      
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false
      }
      
      return true
    })

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (Number(a.original_price) || 0) - (Number(b.original_price) || 0))
        break
      case 'price-desc':
        filtered.sort((a, b) => (Number(b.original_price) || 0) - (Number(a.original_price) || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [products, selectedCategories, priceRange, sortBy])

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 500000])
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 500000

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                {category.lebele}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Prix</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={500000}
            step={10000}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div>
        <h3 className="font-semibold mb-3">Options</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Aucune option disponible</p>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Effacer les filtres
        </Button>
      )}
    </div>
  )

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Catalogue
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                  {hasActiveFilters && (
                    <span className="ml-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Mis en avant</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h2 className="font-semibold text-lg mb-6">Filtres</h2>
              <FiltersContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Aucun produit ne correspond à vos critères.
                </p>
                <Button variant="link" onClick={clearFilters} className="mt-4">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
