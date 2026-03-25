'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types'

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('lebele')

    if (error) {
      console.error('Erreur categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="py-16 lg:py-24 bg-background">
      <div className="text-center mb-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement catégories...</p>
      </div>
    </div>
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Nos Catégories
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explorez notre sélection soigneusement choisie pour chaque style et occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogue?category=${category.id}`}
              className="group relative aspect-[3/4] overflow-hidden bg-muted"
            >
              <Image
                src={'/placeholder.jpg'}
                alt={category.lebele}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-primary-foreground">
                  {category.lebele}
                </h3>
                <span className="inline-flex items-center text-sm text-primary-foreground/80 mt-2 group-hover:text-accent transition-colors">
                  Découvrir
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

