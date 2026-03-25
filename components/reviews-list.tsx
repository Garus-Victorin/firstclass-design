"use client";

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/lib/types'

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) setReviews(data)
  }

  if (reviews.length === 0) return null

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
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
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>
          <p className="text-sm leading-relaxed mb-3">&ldquo;{review.comment}&rdquo;</p>
          <p className="text-xs font-medium text-orange-600">– {review.customer_name}</p>
        </div>
      ))}
    </div>
  )
}
