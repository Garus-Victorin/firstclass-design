import { Star } from 'lucide-react'
import type { Review } from '@/lib/types'

interface ReviewsProps {
  reviews: Review[]
}

export function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) return null

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  return (
    <div className="mt-16 lg:mt-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          ⭐ Avis Clients
        </h2>
        <p className="text-muted-foreground mt-2">
          {reviews.length} avis • Note moyenne: {averageRating.toFixed(1)}/5
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-secondary p-6 rounded-lg">
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
            <p className="text-sm leading-relaxed mb-3">{review.comment}</p>
            <p className="text-xs text-muted-foreground">– {review.customer_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
