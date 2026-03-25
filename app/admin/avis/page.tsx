"use client";

import { useState, useEffect } from 'react'
import { Star, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Review } from '@/lib/types'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setReviews(data)
    setLoading(false)
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    await supabase
      .from('reviews')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    
    fetchReviews()
  }

  async function deleteReview(id: string) {
    if (!confirm('Supprimer cet avis ?')) return
    
    await supabase.from('reviews').delete().eq('id', id)
    fetchReviews()
  }

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion des Avis</h1>
        <p className="text-muted-foreground mt-2">
          {reviews.length} avis au total
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card border rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{review.customer_name}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant={review.is_active ? 'default' : 'secondary'}>
                    {review.is_active ? 'Actif' : 'En attente'}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(review.id, review.is_active)}
                >
                  {review.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteReview(review.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
